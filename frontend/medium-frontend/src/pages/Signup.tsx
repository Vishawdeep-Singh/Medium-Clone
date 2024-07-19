import { Quote } from "../components/Quote"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "../components/Button"
import { Header } from "../components/Header"
import { InputBox1 } from "../components/Input.tsx"
import { Subheading } from "../components/Subheading"
import { SignUpType } from "@johnwick002992/common-medium-app"
import axios from "axios"
import ErrorDisplay from "./error.tsx"


export const Signup=()=>{
    const [errorMessages, setErrorMessages] = useState<string | string[]>([]);
    async function sendRequest() {
        try {
            const response = await axios.post("https://backend.vishawdeepsingh29.workers.dev/api/v1/signup",data)
        
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
        }

        
    const[data,setData]=useState<SignUpType>({
email:"",
name:"",
password:""
    });
    const navigate = useNavigate();
    return <div >
        <div className=" md:grid md:grid-cols-2">
            <div>
            <div className=" h-screen flex justify-center items-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center h-max px-4 p-2">
            <Header label={"Sign Up"}></Header>
            <Subheading label={"Already have an account ?"} buttonText="Log In" to="/signin"></Subheading>
            
            <InputBox1 onChange={(e)=>{
             setData(c=>({
                ...c,
                name:e.target.value
             }))
            }} placeholder={"John"} label={" Name"}></InputBox1>
            
            <InputBox1 onChange={(e)=>{
                setData(c=>({
                    ...c,
                    email:e.target.value
                }))
            }} placeholder={"name@example.com"} label={"Email"}></InputBox1>
            <InputBox1 onChange={(e)=>{
                setData(c=>({
                    ...c,
                   password:e.target.value
                }))
            }} placeholder={"123456"} label={"Password"}></InputBox1>
            <div className="pt-4">
                <Button onClick={sendRequest} label={"Sign Up"}></Button>
            </div>
            <div className="pt-6">
                       {errorMessages.length > 0 && <ErrorDisplay messages={errorMessages} />}
            </div>
     
            
            </div>
        </div>
            </div>
            </div>
            <div className=" sr-only md:not-sr-only">
    
                <Quote></Quote>
            </div>
            
        </div>
        
    </div>
}