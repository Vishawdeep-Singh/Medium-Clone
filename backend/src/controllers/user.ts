import { Next, Context } from "hono"

import { z } from "zod"
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Jwt } from "hono/utils/jwt"


export const Getuser=async (c:Context)=>{
try {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())
    let userId = await c.get("userId");
    let user = await prisma.user.findUnique({
        where:{
            id:userId,
        },
       select:{
        id:true,
        email:true,
        name:true,
        posts:{
            include:{
                author:true
            }
        },
        savedPosts:{
            include:{
                author:true
            }
        },
        
       },

       
    })
    return c.json(user,200)
} catch (error:any) {
    return c.json({
        message: "Error in finding info about user" + " " + error.message
    })
}
}
export const Getanyuser=async (c:Context)=>{
try {
    interface Props{
        userId:string
    }
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())
    const {userId}:Props=await c.req.json()
    let user = await prisma.user.findUnique({
        where:{
            id:userId,
        },
       select:{
        id:true,
        email:true,
        name:true,
        posts:{
            include:{
                author:true
            }
        },
        savedPosts:{
            include:{
                author:true
            }
        },
        
       },

       
    })
    return c.json(user,200)
} catch (error:any) {
    return c.json({
        message: "Error in finding info about any user" + " " + error.message
    })
}
}