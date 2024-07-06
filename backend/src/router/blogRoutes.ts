import { Hono } from "hono";
import { authMiddleware, isCreatePostValid, isUpdatePostValid } from "../middlewares/middlewares123";
import { createBlog, getBlog, UpdateBlog } from "../controllers/blog";

const blogRoutes = new Hono<{
    Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
    }
  }>()

blogRoutes.post('/',authMiddleware, isCreatePostValid ,createBlog);
blogRoutes.put('/',authMiddleware, isUpdatePostValid ,UpdateBlog);
blogRoutes.get('/:id',authMiddleware,getBlog)

export default blogRoutes