import { Next,Context } from "hono"

import {z} from "zod"
import { PrismaClient } from '@prisma/client/edge' 
import { withAccelerate } from '@prisma/extension-accelerate' 
import { Jwt } from "hono/utils/jwt"
import { NONCE } from "hono/secure-headers"
import { SignUpSchema,SignInSchema,updatePostSchema,createPostSchema } from "@johnwick002992/common-medium-app"


export async function isSignUpValid(c:Context,next:Next){
try {
    const body: {
  
        email: string;
        name: string;
        password: string;
      } = await c.req.json();
    const response = SignUpSchema.safeParse(body)
    console.log(response)
    if(response.success){
      await next()
           
       
 
    console.log("hi");
      
    }
   else{ return c.json({
        message:response.error
    })}
  
} catch (error:any) {
    c.json({
        message:error.errors
    })
}
}
export async function isSignInValid(c:Context,next:Next){
try {
    const body: {
  
        email: string;
      
        password: string;
      } = await c.req.json();
    const response = SignInSchema.safeParse(body)
    
    if(response.success){
      await next()
           
       
 
   
      
    }
   else{ return c.json({
        message:response.error
    })}
  
} catch (error:any) {
    c.json({
        message:error.errors
    })
}
}
export async function isCreatePostValid(c:Context,next:Next){
try {
    interface Post{
        title:string,
        content:string,
        tags:string
    }
    const body: Post = await c.req.json();
    const response = createPostSchema.safeParse(body)
    
    if(response.success){
      await next()
           
       
 
   
      
    }
   else{ return c.json({
        message:response.error + " Invalid Body schema"
    })}
  
} catch (error:any) {
    c.json({
        message:error
    })
}
}
export async function isUpdatePostValid(c:Context,next:Next){
try {
    interface Post{
        id:string,
        authorId:string
        title:string,
        content:string,
        tags:string
    }
    const body: Post = await c.req.json();
    const response = updatePostSchema.safeParse(body)
    
    if(response.success){
      await next()
           
       
 
   
      
    }
   else{ return c.json({
        message:response.error + " Invalid Body schema"
    })}
  
} catch (error:any) {
    c.json({
        message:error
    })
}
}

export async function isUserExists (c:Context,next:Next){
    
    
try {
    const prisma = new PrismaClient({ datasourceUrl:c.env.DATABASE_URL  }).$extends(withAccelerate())
   
    const body: {
  
        email: string;
        name: string;
        password: string;
      }= await c.req.json();
    const existingUser = await prisma.user.findUnique({
        where:{
            email:body.email
        }
    })
   
    if (existingUser) {
        // User exists, send a response and do not call next()
        return c.json({
            message: "User already exists"
        });
    } else {
        // User does not exist, proceed to the next middleware
        await next();
    }
        
      
} catch (error:any) {
    c.json({
        message:"Error in finding unique user"+error.message
    })
}
}


export const authMiddleware = async(c:Context,next:Next)=>{
try {
    const jwt1 = c.req.header('Authorization');
    if(!jwt1){
        c.status(401);
		return c.json({ error: "unauthorized" });
    }
    const token = jwt1.split(" ")[1];
    const payload = await Jwt.verify(token,c.env.JWT_SECRET);
    if (!payload) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
    c.set("userId",payload.id);
    await next()
} catch (error:any) {
    return c.json({
        message: "Unauthorized"+" "+error
    })
}
}