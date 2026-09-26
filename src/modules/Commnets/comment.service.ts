import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateCommnet, IUpdateComment } from "./comment.interface";

const createComment = async (authorId: string, payload: ICreateCommnet) => {
    const {content, postId} = payload;
    console.log(authorId, content, postId);

    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    });

    if(!post){
        throw new Error("Post Not Found");
    }
    const result = await prisma.comment.create({
        data: {
            content,
            authorId,
            postId,
        }
    });
    return result;
}

const getAllComments = async () => {
    const result = await prisma.comment.findMany({
        include: {
            author: {
                omit: {
                    password: true
                }
            },
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    return result;
};

const getCommentsByPostId = async (postId: string) => {
    const result = await prisma.comment.findMany({
        where: {
            postId,
            status: CommentStatus.APPROVED
        },
        include: {
            author: {
                omit: {
                    password: true
                }
            },
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    return result;
};

const getCommentsByAuthorId = async (authorId: string) => {
    const result = await prisma.comment.findMany({
        where: {
            authorId: authorId
        },
        orderBy: {createdAt: "desc"},
        include: {
            author: {
                omit: {
                    password: true
                }
            }
        }
    });
    return result;
};

const updateCommentbyCommentId = async (commentId: string, authorId: string, payload: IUpdateComment) => {
    const comment = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId
        },
    });

    if(comment.authorId !== authorId){
        throw new Error("You are not the owner of this comment!");
    }

    const update = await prisma.comment.update({
        where: {
            id: commentId
        },
        data: payload,
        include: {
            author: {
                omit: {
                    password: true
                }
            },
        }
    });
    return update;
    
}

const deleteComment = async (commentId: string, authorId: string, isAdmin: boolean) => {
    const comment = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId
        },
    });

    if(!isAdmin && comment.authorId !== authorId){
        throw new Error("You are not the owner of this comment!");
    }

    await prisma.comment.delete({
        where: {
            id: commentId
        },
    });
    return null;
}

const updateCommentStatus = async (commentId: string, status: CommentStatus) => {
    const result = await prisma.comment.update({
        where: {
            id: commentId
        },
        data: {
            status
        },
        include: {
            author: {
                omit: {
                    password: true
                }
            },
        }
    });
    return result;
}

export const commentService = {
    createComment,
    getAllComments,
    getCommentsByPostId,
    getCommentsByAuthorId,
    updateCommentbyCommentId,
    deleteComment,
    updateCommentStatus
}