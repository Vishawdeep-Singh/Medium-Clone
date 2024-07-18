import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPostType } from "@johnwick002992/common-medium-app";
import { LoadingSpinner } from "./LoadingSpinner";
import { SetterOrUpdater, useRecoilState, useRecoilStateLoadable, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { PostsAtom, UserAtom } from "../states/atoms";
import ErrorDisplay from "./error";
interface Post1 {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  date: string;
  likes: number;
  author: Author;
  tags: Tag1[];
  comments: any[]; 
  savers: any[];
}
interface Tag1 {
  id: number;
  tag: string;
}

interface Tag {
  id: number;
  tag: string;
  post:Post[]
  
}
interface post{
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  date: string;
  likes: number;
  author: Author
}

interface Author {
  id: string;
  email: string;
  name: string;
  password: string; 
}

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  date: string;
  likes: number;
  author: Author;
  tags: Tag[];
  comments: any[]; 
  savers: any[];
}
interface Fills {
  [key: string]: string;
}
interface Users{
      
  id:string,
  email:string,
  name:string,
  followedBy:[],
  following:[]


}
export const NewBlog = () => {
  const setAllPosts  = useSetRecoilState(PostsAtom)
  const [dropdown,SetDropdown]=useState(false)
  const navigate= useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(false);
  
  const [error, setError] = useState<string[]>([]);
  const addError = (errorMessage: string) => {
      setError(prevErrors => [...prevErrors, errorMessage]);
    };
  const [blogData,setBlogData]=useState<createPostType>({
    title:"",
    content:"",
    tags:""
  })
  
  const user = useRecoilValue(UserAtom);

  
  async function createBlog(){
    try {
      setIsLoading2(true)
      const token:string | null = localStorage.getItem("token");
      if(!token){
          throw new Error("Token Not Found")
      }

      const headers = {
          'authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // Optional: Set other headers if needed
        };
        const response = await axios.post('http://localhost:8787/api/v1/blog', blogData,{ headers });
       
        if (response.status === 200) {
          setAllPosts( (prev:Post[]) => [...prev,response.data])
          setIsLoading2(false)
          navigate("/blog")
       
        } else {
          throw new Error(`Failed to createPosts: ${response.statusText}`);
          
        }
      } catch (error:any) {
        if(error.response){
          addError(`Failed to create post :  ${error.response.data.message}`)
        }
        else{
          addError(`Error creating posts:  ${error.message}`)
        }
        console.error('Error creating posts:', error.response.data.message);
        setIsLoading2(false)
        
      }
  }
  
  

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      };

      if (isLoading2){
        return <div>
          <LoadingSpinner></LoadingSpinner>
        </div>
      }

      if(error.length>0){
        return <div>
          <ErrorDisplay messages={error}></ErrorDisplay>
        </div>
        
      }
  return (
    <div className="flex flex-col items-center w-screen">

        {/* APp bar */}
      <div className="flex   border-solid border-black h-[57px]  items-center w-full md:w-[70%] m-auto pt-16">
        <div className="flex items-center mr-[6rem] md:mr-[40rem]">
          <div
          onClick={()=>{
            navigate("/blog")
          }} className="text-black font-body text-3xl md:text-6xl font-extrabold ml-3 antialiased hover:subpixel-antialiased">
            Thought
          </div>
        </div>

        <div className="flex items-center md:w-[20%] space-x-7">
          <button onClick={createBlog} className="bg-green-600 text-white rounded-full px-3 py-2 text-xs">
            Publish
          </button>

          <div className="Profile flex-shrink-0 relative flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button onClick={()=>{
              SetDropdown((prev)=> !prev)
            }} type="button" className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4  focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded={dropdown ? "true" : "false"} data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
        <span className="sr-only">Open user menu</span>
        <img className="w-8 h-8 rounded-full" src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/1510c2139933299.62399ca03fe5c.png" alt="user photo"/>
      </button>
        {dropdown && <div  className="z-50 font-medium text-black absolute top-5 right-[-0.5rem] md:right-[-1rem] my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg border-2 border-black shadow-md dark:bg-gray-700 dark:divide-gray-600 transition-opacity duration-300 ease-in-out ">
        <div className="px-4 py-3">
            
     
   
      <span className="block text-sm text-gray-900 dark:text-white">{user.name}</span>
      <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{user.email}</span>
   
  
        </div>
        <ul className="py-2" aria-labelledby="user-menu-button">
          <li>
            <a href="#" className="block px-4 py-2 text-sm  hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Profile</a>
          </li>
          <li>
            <a onClick={(e)=>{
                e.preventDefault();
                localStorage.removeItem("token");
                navigate("/signin")
            }} href="" className="block px-4 py-2 text-sm  hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign Out</a>
          </li>
          
        </ul>
      </div> }    
      
            </div>
        </div>
      </div>


    {/* Form */}

    <div className="md:w-[70%] w-full mt-24 md:mt-48 pl-10 md:pl-28">
    <textarea onChange={(e)=>{
              setBlogData(c => ({
                ...c,
                title:e.target.value
              }))
            }} rows={1} onInput={handleInput}
  placeholder="Title"
  className=" focus:border-l-2 focus:border-gray-600 focus:outline-none text-gray-900 md:text-5xl text-3xl  block p-2.5 resize-none w-[90%] font-body"
  required
 
/>

        <textarea onChange={(e)=>{
              setBlogData(c => ({
                ...c,
                content:e.target.value
              }))
            }}  id="editor" rows={1} onInput={handleInput} className=" focus:outline-none focus:border-l-2 focus:border-gray-600 mt-16 w-[90%]   text-gray-900   block p-2.5 resize-none  font-body text-xl md:text-2xl"
        placeholder="Tell Us your story ..." required />

            <input onChange={(e)=>{
              setBlogData(c => ({
                ...c,
                tags:e.target.value
              }))
            }} type="text" placeholder="Tags..." className=" focus:border-l-2 focus:border-gray-600  md:w-[65%] h-10 focus:outline-none block font-body text-xl md:text-2xl p-3 mt-32"/>
    </div>



    </div>
  );
};
