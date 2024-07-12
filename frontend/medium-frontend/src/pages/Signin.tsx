import { Quote } from "../components/Quote"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "../components/Button"
import { Header } from "../components/Header"
import { InputBox1 } from "../components/Input.tsx"
import { Subheading } from "../components/Subheading"
import { SignInType } from "@johnwick002992/common-medium-app"
import ErrorDisplay from "./error.tsx"
import { LoadingSpinner } from "./LoadingSpinner.tsx"



export const Signin=()=>{
   
    const [errMessages,setErrorMessages]=useState<string[] | string>([]);
    const [Loading,setLoading]=useState(false);
    const navigate = useNavigate();

   
    async function handleClick() {
        setLoading(true)
        try {
            const response = await axios.post("http://localhost:8787/api/v1/signin",data)
        
            if (response.status !== 200) {
                // Handle non-200 status codes as errors
               
               setErrorMessages(response.data.message)
              } else {
                // Handle successful response
               const token:string=response.data.token;
               console.log(token)
               localStorage.setItem("token",token)
               navigate("/blog")


              }
        } catch (error:any) {
            if (error.response) {
                // Server responded with a status code outside the 2xx range
                const errorMessage = error.response.data.message;
        
                if (Array.isArray(errorMessage)) {
                  // Log each error message if it's an array
                 const arrayErrmsg= errorMessage.map((er) => {
                    return er.message || er;
                  });
                 setErrorMessages(arrayErrmsg)
                } else {
                  // Log the error message directly if it's not an array
                  setErrorMessages(errorMessage)
                }
              }  else {
                // Something happened while setting up the request
                setErrorMessages(error.message)
              }
            }
            finally{
                setLoading(false)
            }
    }
    const[data,setData]=useState<SignInType>({
        email:"",
        password:""
    })
    return <div>
        <div className="grid grid-cols-2">
            <div>
            <div className=" h-screen flex justify-center items-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center h-max px-4 p-2">
            <Header label={"Sign In"}></Header>
            <Subheading label={"Do not have an account?"} buttonText="Sign Up" to="/signup"></Subheading>
            
           
            
            <InputBox1 onChange={(e)=>{
                setData(c => ({
                    ...c,
                    email:e.target.value
                }))
            }} placeholder={"name@example.com"} label={"Email"}></InputBox1>
            <InputBox1 onChange={(e)=>{
               setData(c => ({
                ...c,
                password:e.target.value
            }))
            }} placeholder={"123456"} label={"Password"}></InputBox1>
            <div className="pt-4">
                <Button onClick={handleClick} label={"Sign In"}></Button>
            </div>
            
            <div className="pt-6">
                {errMessages.length>0 && <ErrorDisplay messages={errMessages}></ErrorDisplay>}
                {Loading && <LoadingSpinner></LoadingSpinner>}
            </div>
            
            </div>
        </div>
            </div>
            </div>
            <div>
                <Quote></Quote>
            </div>
            
        </div>
        
    </div>
}