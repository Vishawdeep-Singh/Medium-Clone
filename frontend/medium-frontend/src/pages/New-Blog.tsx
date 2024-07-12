import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPostType } from "@johnwick002992/common-medium-app";
import { LoadingSpinner } from "./LoadingSpinner";

export const NewBlog = () => {
  const [dropdown,SetDropdown]=useState(false)
  const navigate= useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(false);
  
  
  const [blogData,setBlogData]=useState<createPostType>({
    title:"",
    content:"",
    tags:""
  })
  
  const [user,SetUser]=useState({
      email:" ",
      name:" "

  })

  const fetchUser = async()=>{
      try {
          const token:string | null = localStorage.getItem("token");
          if(!token){
              throw new Error("Token Not Found")
          }
  
          const headers = {
              'authorization': `Bearer ${token}`,
              'Content-Type': 'application/json', // Optional: Set other headers if needed
            };
            const response = await axios.get('http://localhost:8787/api/v1/user', { headers });
  
            if (response.status === 200) {
              SetUser(response.data); // Assuming response.data is an array of posts
              setIsLoading(false)
              
            } else {
              throw new Error(`Failed to fetch posts: ${response.statusText}`);
              setIsLoading(false)
            }
          } catch (error:any) {
            console.error('Error fetching posts:', error.message);
            setIsLoading(false)
            
          }
  }
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
          
          setIsLoading2(false)
          navigate("/blog")
       
        } else {
          throw new Error(`Failed to createPosts: ${response.statusText}`);
          
        }
      } catch (error:any) {
        console.error('Error creating posts:', error.response.data.message);
        setIsLoading2(false)
        
      }
  }
  useEffect(()=>{
      fetchUser()
  },[])
  

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
  return (
    <div className="flex flex-col items-center">

        {/* APp bar */}
      <div className="flex   border-solid border-black h-[57px]  items-center w-[70%] m-auto pt-16">
        <div className="flex items-center mr-[40rem]">
          <div className="text-black font-body text-6xl font-extrabold ml-3 antialiased hover:subpixel-antialiased">
            Thought
          </div>
        </div>

        <div className="flex items-center w-[20%] space-x-7">
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
        {dropdown && <div  className="z-50 font-medium text-black absolute top-5  right-[-1rem] my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg border-2 border-black shadow-md dark:bg-gray-700 dark:divide-gray-600 transition-opacity duration-300 ease-in-out ">
        <div className="px-4 py-3">
            
        {isLoading ? (
    <span>Loading...</span>
  ) : (
    <>
      <span className="block text-sm text-gray-900 dark:text-white">{user.name}</span>
      <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{user.email}</span>
    </>
  )}
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

    <div className="w-[70%] mt-48 pl-28">
    <textarea onChange={(e)=>{
              setBlogData(c => ({
                ...c,
                title:e.target.value
              }))
            }} rows={1} onInput={handleInput}
  placeholder="Title"
  className=" focus:border-l-2 focus:border-gray-600 focus:outline-none text-gray-900 text-5xl  block p-2.5 resize-none w-[90%] font-body"
  required
 
/>

        <textarea onChange={(e)=>{
              setBlogData(c => ({
                ...c,
                content:e.target.value
              }))
            }}  id="editor" rows={1} onInput={handleInput} className=" focus:outline-none focus:border-l-2 focus:border-gray-600 mt-16 w-[90%]   text-gray-900   block p-2.5 resize-none  font-body text-2xl"
        placeholder="Tell Us your story ..." required />

            <input onChange={(e)=>{
              setBlogData(c => ({
                ...c,
                tags:e.target.value
              }))
            }} type="text" placeholder="Tags..." className=" focus:border-l-2 focus:border-gray-600  w-[65%] h-10 focus:outline-none block font-body text-2xl p-3 mt-32"/>
    </div>



    </div>
  );
};
