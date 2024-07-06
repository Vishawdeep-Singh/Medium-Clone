import { Next,Context } from "hono"

import {z} from "zod"
import { PrismaClient } from '@prisma/client/edge' 
import { withAccelerate } from '@prisma/extension-accelerate' 
import { Jwt } from "hono/utils/jwt"


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
let userId = c.get("userId");
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
    return c.json(createdPost)
} catch (error) {
    return c.json({
        message:"Error in creating post" + error
    })
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
            author:{
                select:{
                    id:true,
                    email:true,
                    name:true
                }
            },
            tags:true
        }
    })
    return c.json(getPost)
} catch (error) {
    return c.json({
        message:"Error in getting post" + error
    })
}
}