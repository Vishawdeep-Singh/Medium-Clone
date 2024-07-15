import { Hono } from "hono";
import { authMiddleware, isCreatePostValid, isPostSaved, isUpdatePostValid } from "../middlewares/middlewares123";
import { CommentPost, createBlog, getBlog, getPosts, getTagPosts, getTags, like, savePost, UpdateBlog } from "../controllers/blog";
import { createFollow, FollowData, UnFollow } from "../controllers/follow";

const blogRoutes = new Hono<{
    Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
    }
  }>()


blogRoutes.post('/',authMiddleware, isCreatePostValid ,createBlog);
blogRoutes.put('/',authMiddleware, isUpdatePostValid ,UpdateBlog);

blogRoutes.get('/',authMiddleware,getPosts);
blogRoutes.post("/:id/like",authMiddleware,like);
blogRoutes.post("/:id/comment",authMiddleware,CommentPost);
blogRoutes.post('/save',authMiddleware,isPostSaved,savePost);
blogRoutes.post('/tag',authMiddleware,getTagPosts)
blogRoutes.get('/tags',authMiddleware,getTags); 
blogRoutes.get('/:id',authMiddleware,getBlog);// always put get request with params lower



blogRoutes.post("/follow/create",authMiddleware,createFollow);
blogRoutes.post("/follow/delete",authMiddleware,UnFollow);
blogRoutes.get("/follow/data",authMiddleware,FollowData)


export default blogRoutes