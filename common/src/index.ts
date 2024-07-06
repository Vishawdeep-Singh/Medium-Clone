import {z} from "zod"


export const SignUpSchema = z.object({
    email: z.string().email({message:"Invalid email address format"}),
    name:z.string().min(3,{message:"Name must be atlest 3 characters long"}),
    password:z.string().min(6,{message:"Password must be of atleat 6 "})
})
export type SignUpType = z.infer<typeof SignUpSchema>;
export const SignInSchema= SignUpSchema.pick({
    email:true,
    password:true
})
export type SignInType = z.infer<typeof SignInSchema>;

export const createPostSchema =z.object({
    title:z.string().min(3,{message:"Invalid title format or title is required"}),
    content: z.string().min(3,{message:"Invalid content format or content is required"}),
    tags:z.string().min(3,{message:"Invalid tags format or tags are required"})
})
export type createPostType = z.infer<typeof createPostSchema>;

export const updatePostSchema=z.object({
    id:z.string().uuid({ message: "Invalid UUID" }),
    authorId:z.string().uuid({ message: "Invalid UUID" }),
    title:z.string().min(3,{message:"Invalid title format or title is required"}),
    content: z.string().min(3,{message:"Invalid content format or content is required"}),
    tags:z.string().min(3,{message:"Invalid tags format or tags are required"})
})
export type UpdatePostType = z.infer<typeof updatePostSchema>;

