
import { Hono,Context } from 'hono'
import { authMiddleware, isSignInValid, isSignUpValid, isUserExists } from '../middlewares/middlewares123';
import {z} from "zod"
import { SignIn, SignUp } from '../controllers/signUp';
import { sign } from 'hono/jwt';
import { Getallusers, Getanyuser, Getuser, Getuser_followingPosts } from '../controllers/user';


 export const signUproutes=new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>();

signUproutes.post('/signup', isSignUpValid,isUserExists, SignUp);
signUproutes.post("/signin",isSignInValid,SignIn);
signUproutes.get("/user",authMiddleware,Getuser);
signUproutes.get("/user/following/posts",authMiddleware,Getuser_followingPosts);
signUproutes.post("/anyUser",authMiddleware,Getanyuser);
signUproutes.get("/users",authMiddleware,Getallusers)

  // signUproutes.post('/signin')



