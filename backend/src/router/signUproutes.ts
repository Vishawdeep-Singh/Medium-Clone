
import { Hono,Context } from 'hono'
import { isSignInValid, isSignUpValid, isUserExists } from '../middlewares/middlewares123';
import {z} from "zod"
import { SignIn, SignUp } from '../controllers/signUp';


 export const signUproutes=new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>();

signUproutes.post('/signup', isSignUpValid,isUserExists, SignUp);
signUproutes.post("/signin",isSignInValid,SignIn)

  // signUproutes.post('/signin')



