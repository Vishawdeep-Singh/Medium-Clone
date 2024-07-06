"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostSchema = exports.createPostSchema = exports.SignInSchema = exports.SignUpSchema = void 0;
const zod_1 = require("zod");
exports.SignUpSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email address format" }),
    name: zod_1.z.string().min(3, { message: "Name must be atlest 3 characters long" }),
    password: zod_1.z.string().min(6, { message: "Password must be of atleat 6 " })
});
exports.SignInSchema = exports.SignUpSchema.pick({
    email: true,
    password: true
});
exports.createPostSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, { message: "Invalid title format or title is required" }),
    content: zod_1.z.string().min(3, { message: "Invalid content format or content is required" }),
    tags: zod_1.z.string().min(3, { message: "Invalid tags format or tags are required" })
});
exports.updatePostSchema = zod_1.z.object({
    id: zod_1.z.string().uuid({ message: "Invalid UUID" }),
    authorId: zod_1.z.string().uuid({ message: "Invalid UUID" }),
    title: zod_1.z.string().min(3, { message: "Invalid title format or title is required" }),
    content: zod_1.z.string().min(3, { message: "Invalid content format or content is required" }),
    tags: zod_1.z.string().min(3, { message: "Invalid tags format or tags are required" })
});
