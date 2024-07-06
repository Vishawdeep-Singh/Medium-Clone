import { z } from "zod";
export declare const SignUpSchema: z.ZodObject<{
    email: z.ZodString;
    name: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    password: string;
}, {
    email: string;
    name: string;
    password: string;
}>;
export type SignUpType = z.infer<typeof SignUpSchema>;
export declare const SignInSchema: z.ZodObject<Pick<{
    email: z.ZodString;
    name: z.ZodString;
    password: z.ZodString;
}, "email" | "password">, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type SignInType = z.infer<typeof SignInSchema>;
export declare const createPostSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    tags: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    tags: string;
}, {
    title: string;
    content: string;
    tags: string;
}>;
export type createPostType = z.infer<typeof createPostSchema>;
export declare const updatePostSchema: z.ZodObject<{
    id: z.ZodString;
    authorId: z.ZodString;
    title: z.ZodString;
    content: z.ZodString;
    tags: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    tags: string;
    id: string;
    authorId: string;
}, {
    title: string;
    content: string;
    tags: string;
    id: string;
    authorId: string;
}>;
export type UpdatePostType = z.infer<typeof updatePostSchema>;
