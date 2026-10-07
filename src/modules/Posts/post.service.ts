import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  ICreatePostPayload,
  IPostQuery,
  IUpdatePostPayload,
} from "./post.interface";

const createPost = async (payload: ICreatePostPayload, userId: string) => {

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      subscription: true
    }
  })

  if(payload.isPremium && user?.subscription?.status !== "ACTIVE"){
    throw new Error("ou cannot create premium content subscribe first!")
  }


  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });
  return result;
};

const getAllPosts = async (query: IPostQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page -1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const posts = await prisma.post.findMany({
    // searching with partial match

    // where: {
    //   title: {
    //     contains: "ronaldo",
    //     mode: "insensitive"
    //   },

    //   // not ideal for partial match
    //   // content: {
    //   //   contains: "Ronaldo"
    //   // }
    // },

    // where: {
    //   OR: [
    //     {
    //       title: {
    //         contains: "Ronaldo",
    //         mode: "insensitive"
    //       },
    //     },

    //     {
    //       content: {
    //         contains: "Ronaldo",
    //         mode: "insensitive"
    //       }
    //     }
    //   ]
    // },

    // combining serach and filtering
    // search uses OR operator and filtering uses AND operator

    // where: {
    //   // filtering and searching combined
    //   AND: [
    //     {
    //       // searching
    //       OR: [
    //         {
    //           title: {
    //             contains: "Ron",
    //             mode: "insensitive"
    //           }
    //         },
    //         {
    //           content: {
    //             contains: "Ron",
    //             mode: "insensitive"
    //           }
    //         }
    //       ]
    //     },
    //     {
    //       title: "Ronaldo Nazario"
    //     },
    //     {
    //       content: "Ronaldo"
    //     }
    //   ]
    // },

    // take: 1,
    // for first page skip is 0
    // skip: 1, //visiting page 2
    // skip: 13, // visiting page 3
    // skip: 3, // visiting page 4

    // dynamically
    where: {
      AND: [
        query.searchTerm
          ? {
              OR: [
                {
                  title: {
                    contains: query.searchTerm,
                    mode: "insensitive",
                  },
                },
                {
                  content: {
                    contains: query.searchTerm,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {},

        // title filtering
        query.title ? { title: query.title } : {},

        // content filtering
        query.content ? { content: query.content } : {},
      ],
    },


    take: limit,
    skip: skip,

    orderBy: {
      // sortBy : sortOrder
      [sortBy] : sortOrder
    },
    

    include: {
      author: true,
      comments: true,
    },
  });
  return posts;
};
const getPostById = async (postId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        view: {
          increment: 1,
        },
      },
    });
    // throw new Error("fake Error")
    const post = await tx.post.findFirstOrThrow({
      where: {
        id: postId,
        isPremium: false
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: {
          where: {
            status: CommentStatus.APPROVED,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  });

  return transactionResult;

  // await prisma.post.update({
  //   where: {
  //     id: postId,
  //   },
  //   data: {
  //     view: {
  //       increment: 1,
  //     },
  //   },
  // });

  // const post = await prisma.post.findUniqueOrThrow({
  //   where : {
  //     id: postId
  //   },
  //   include: {
  //     author: {
  //       omit: {
  //         password: true
  //       }
  //     },
  //     comments: {
  //       where: {
  //         status: CommentStatus.APPROVED
  //       },
  //       orderBy: {
  //         createdAt: "desc"
  //       }
  //     },
  //     _count: {
  //       select: {
  //         comments: true
  //       }
  //     }
  //   }
  // })
  // return post;
};
const getMyPosts = async (id: string) => {
  const myPost = await prisma.post.findMany({
    where: {
      authorId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return myPost;
};
const updatePost = async (
  postId: string,
  payload: IUpdatePostPayload,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You Are not the owner of this post.");
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return result;
};
const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findFirstOrThrow({
    where: {
      id: postId,
    },
  });
  if (!isAdmin && post.authorId != authorId) {
    throw new Error("You Are not the owner of this post.");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return null;
};
const getPostsStats = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    // const totalPosts = await tx.post.count();

    // const totalPublishedPost = await tx.post.count({
    //   where: {
    //     status: PostStatus.PUBLISHED
    //   }
    // });
    // const totalDraftPost = await tx.post.count({
    //   where: {
    //     status: PostStatus.DRAFT,
    //   },
    // });
    // const totalArchivedPost = await tx.post.count({
    //   where: {
    //     status: PostStatus.ARCHIVED,
    //   },
    // });

    // const totalComments = await tx.comment.count();

    // const totalApprovedComments = await tx.comment.count({
    //   where: {
    //     status: CommentStatus.APPROVED,
    //   },
    // });
    // const totalRejectedComments = await tx.comment.count({
    //   where: {
    //     status: CommentStatus.REJECT,
    //   },
    // });

    // // not a good approach

    // // const allPost = await tx.post.findMany();

    // // let totalPostViews = 0;

    // // allPost.forEach((post) => {
    // //   totalPostViews = totalPostViews + post.view;
    // // });

    // // We use database aggregation

    // const totalPostViewsAggregate = await tx.post.aggregate({
    //   _sum: {
    //     view: true
    //   }
    // });

    // let totalPostViews = totalPostViewsAggregate._sum.view;

    // return {
    // totalPosts,
    // totalPublishedPost,
    // totalApprovedComments,
    // totalDraftPost,
    // totalArchivedPost,
    // totalComments,
    // totalRejectedComments,
    // totalPostViews
    // }

    // ato gula querr aivabe likha uchit na
    //
    const [
      totalPosts,
      totalPublishedPost,
      totalDraftPost,
      totalArchivedPost,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalPostViews,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),

      await tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),

      await tx.post.count({
        where: {
          status: PostStatus.ARCHIVED,
        },
      }),

      await tx.comment.count(),

      await tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),

      await tx.comment.count({
        where: {
          status: CommentStatus.REJECT,
        },
      }),
      await tx.post.aggregate({
        _sum: {
          view: true,
        },
      }),
    ]);

    return {
      totalPublishedPost,
      totalPosts,
      totalDraftPost,
      totalArchivedPost,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalPostViews: totalPostViews._sum.view,
    };
  });
  return transactionResult;
};

export const postService = {
  createPost,
  getAllPosts,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsStats,
};
