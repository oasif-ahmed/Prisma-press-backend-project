import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";

const createPost = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });
  return result;
};
const getAllPosts = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      comments: true,
    },
  });
  return posts;
};
const getPostById = async (postId: string) => {
  

  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      view: {
        increment: 1,
      },
    },
  });

  const post = await prisma.post.findUniqueOrThrow({
    where : {
      id: postId
    },
    include: {
      author: {
        omit: {
          password: true
        }
      },
      comments: {
        where: {
          status: CommentStatus.APPROVED
        },
        orderBy: {
          createdAt: "desc"
        }
      },
      _count: {
        select: {
          comments: true
        }
      }
    }
  })
  return post;
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
const getPostsStats = () => {};

export const postService = {
  createPost,
  getAllPosts,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsStats,
};
