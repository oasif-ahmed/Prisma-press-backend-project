import { prisma } from "../../lib/prisma";
import { ICreateCommnet, IUpdateComment } from "./comment.interface";

const createComment = async (authorId: string, payload: ICreateCommnet) => {
    const {content, postId} = payload;
    console.log(authorId, content, postId);

    const result = await prisma.comment.create({
        data: {
            content,
            authorId,
            postId,
        }
    });
    return result;
}

const getCommentsByAuthorId = async (authorId: string) => {
    const result = await prisma.comment.findMany({
        where: {
            authorId: authorId
        },
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

export const commentService = {
    createComment,
    getCommentsByAuthorId,
    updateCommentbyCommentId
}