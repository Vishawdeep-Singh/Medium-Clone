import { Next,Context } from "hono"

import {z} from "zod"
import { PrismaClient } from '@prisma/client/edge' 
import { withAccelerate } from '@prisma/extension-accelerate' 
import { Jwt } from "hono/utils/jwt"
import { use } from "hono/jsx"



export const createFollow=async(c:Context)=>{
    try {
        interface Props{
            followedById:string;
                followingId:string;
        }
        const body:Props=await c.req.json()
        const prisma = new PrismaClient({ datasourceUrl:c.env.DATABASE_URL  }).$extends(withAccelerate());
      const response=  await prisma.follows.create({
            data:{
                followedById:body.followedById,
                followingId:body.followingId
            }
        })
        return c.json({
            message:"follow created"
        },200)
    } catch (error:any) {
        return c.json({
            message:"Error in follow create"+error.message
        },500)
    }
}
export const UnFollow=async(c:Context)=>{
    try {
        interface Props{
            followedById:string;
                followingId:string;
        }
        const body:Props=await c.req.json()
        const prisma = new PrismaClient({ datasourceUrl:c.env.DATABASE_URL  }).$extends(withAccelerate());
      const response=  await prisma.follows.delete({
            where:{
                followingId_followedById:{
                    
                        followedById:body.followedById,
                        followingId:body.followingId
                    
                }
            }
        })
        return c.json({
            message:"follow deleted"
        },200)
    } catch (error:any) {
        return c.json({
            message:"Error in follow delete"+error.message
        },500)
    }
}
export const FollowData=async(c:Context)=>{
    try {
       
        const prisma = new PrismaClient({ datasourceUrl:c.env.DATABASE_URL  }).$extends(withAccelerate());
      const response=  await prisma.user.findMany({
            select:{
                id:true,
                email:true,
                name:true,
                followedBy:true,
                following:true
               


            }
        })
       
        return c.json(response,200)
    } catch (error:any) {
        return c.json({
            message:"Error in fetching follow data"+error
        },500)
    }
}