import { Next,Context } from "hono"

import {z} from "zod"
import { PrismaClient } from '@prisma/client/edge' 
import { withAccelerate } from '@prisma/extension-accelerate' 
import { Jwt } from "hono/utils/jwt"
import { use } from "hono/jsx"


export const createBlog = async(c:Context)=>{
try {
    interface Post{
        title:string,
        content:string,
        tags:string
    }
    const body:Post= await c.req.json()
    const prisma = new PrismaClient({ datasourceUrl:c.env.DATABASE_URL  }).$extends(withAccelerate());
    let tagNames = body.tags.split(",").map((tag)=> tag.trim());
let userId = await c.get("userId");
console.log(userId)
    const createdPost =  await prisma.post.create({
        data:{
            title:body.title,
            content:body.content,
            authorId:userId,
            tags:{
                connectOrCreate: tagNames.map((tag)=>({
                    where:{
                        tag
                    },
                    create:{
                        tag
                    }
                }))
            }

        }
    })
    return c.json(createdPost,200)
} catch (error:any) {
    return c.json({
        message:"Error in creating post" + error.message
    },500)
}
}
export const UpdateBlog = async(c:Context)=>{
try {
    interface Post{
        id:string,
        authorId:string
        title:string,
        content:string,
        tags:string
    }
    const body:Post= await c.req.json()
    let tagNames = body.tags.split(",").map((tag)=> tag.trim())
    const prisma = new PrismaClient({ datasourceUrl:c.env.DATABASE_URL  }).$extends(withAccelerate());
let userId = c.get("userId");
    const updatedPost =  await prisma.post.update({
        where:{
            id:body.id,
            authorId:body.authorId

        },
        data:{
            title:body.title,
            content:body.content,
            tags: {
                connectOrCreate: tagNames.map((tag) => ({
                  where: { tag },
                  create: { tag },
                })),
              },
        },
        include:{
            tags:true
        }
    })
    return c.text("Post Updated")
} catch (error) {
    return c.json({
        message:"Error in updating post" + error
    })
}
}
export const getBlog = async(c:Context)=>{
try {
    let id= c.req.param('id')
    
    const prisma = new PrismaClient({ datasourceUrl:c.env.DATABASE_URL  }).$extends(withAccelerate());
let userId = c.get("userId");
    const getPost =  await prisma.post.findUnique({
        where:{
            id:id
        },
        include:{
            author:true,
            tags:true,
            comments:true,
            savers:true
        }
    })
    return c.json(getPost,200)
} catch (error) {
    return c.json({
        message:"Error in getting post" + error
    },500)
}
}


export const getPosts=async(c:Context)=>{
try {
    const prisma = new PrismaClient({ datasourceUrl:c.env.DATABASE_URL  }).$extends(withAccelerate());
    const posts =  await prisma.post.findMany({
        include:{
            author:true,
            tags:true,
            comments:true,
            savers:true
        }
    })
    return c.json(posts,200)
} catch (error:any) {
    return c.json({
        message: "Error in getting posts" + error.message
    },500)
}
}


export const like= async(c:Context)=>{
    try {
        let id= c.req.param('id');
        const prisma = new PrismaClient({ datasourceUrl:c.env.DATABASE_URL  }).$extends(withAccelerate());
        const increaseLike = await prisma.post.update({
            where:{
                id:id
            },
            data:{
                likes:{
                    increment:1
                }
            }
        })
        return c.json(increaseLike,200)
        
    } catch (error:any) {
         return c.json({
        message:"Error in liking post" + error.message
    },500)
    }
}
export const savePost= async(c:Context)=>{
    try {
        interface Props{
            postId:string
        }
        const body:Props =  await c.req.json();
        
        const {postId}=body;

        if (!postId) {
            return c.json({
                message: "Post ID is required"
            }, 400);
        }
        let userId = await c.get("userId");

        if(!userId){
            return c.json({
                message: "userId is required"
            }, 400);
        }
        const prisma = new PrismaClient({ datasourceUrl:c.env.DATABASE_URL  }).$extends(withAccelerate());
        const  savePost = await prisma.user.update({
            where:{
                id:userId
            },
            data:{
                savedPosts:{
                    connect:{
                        id:postId
                    }
                }
            }
        })
        
            return c.json({
            message: "Post saved successfully",
            savedPost: savePost
        },200);
        
        
      
        
    } catch (error:any) {
        console.error("Error saving post:", error);
        return c.json({
            message: "Failed to save post",
            error: error.message
        }, 500);
    }
}