import { Hono } from "hono";
import { authMiddleware, isCreatePostValid, isPostSaved, isUpdatePostValid } from "../middlewares/middlewares123";
import { createBlog, getBlog, getPosts, like, savePost, UpdateBlog } from "../controllers/blog";

const blogRoutes = new Hono<{
    Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
    }
  }>()

blogRoutes.post('/',authMiddleware, isCreatePostValid ,createBlog);
blogRoutes.put('/',authMiddleware, isUpdatePostValid ,UpdateBlog);
blogRoutes.get('/:id',authMiddleware,getBlog);
blogRoutes.get('/',authMiddleware,getPosts)
blogRoutes.post("/:id/like",authMiddleware,like);
blogRoutes.post('/save',authMiddleware,isPostSaved,savePost)

export default blogRoutes