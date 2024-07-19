import {  useEffect, useRef, useState } from "react"



import { useNavigate } from "react-router-dom";

import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { PostsAtom, UserAtom } from "../states/atoms";
import { BounceLoader } from "react-spinners";



// interface SavedPost {
//   id: string;
// }
// interface UserProps {
//   id: string;
//   email: string;
//   name: string;
//   savedPosts: SavedPost[];
//   posts:Post[] // Adjust fields as per your schema
// }
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
interface Tag {
  id: number;
  tag: string;
  post:Post[]
  
}


interface Author {
  id: string;
  email: string;
  name: string;
  password: string; 
}

// interface AppbarProps {
//   posts: Post[];
//   user: User;
// }
// interface User{
//   id:string;
//   email:string,
//   name:string,
//  savedPosts:post[]
// }
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
export const Appbar = () => {
  const [isLoading,setIsLoading]=useState(false)
  const Loadableuser=useRecoilValueLoadable(UserAtom);
  const [user,SetUser]=useState({
    id: "",
    email: "",
    name: "",
    savedPosts: []
  })

  useEffect(() => {
    setIsLoading(true)
    // Check the state of loadableUser to determine UI state
    switch (Loadableuser.state) {
      case 'loading':
        setIsLoading(true);
        break;
      case 'hasValue':
        setIsLoading(false);
        SetUser(Loadableuser.contents); // Set user data from Recoil state
        break;
      case 'hasError':
        console.error('Error loading user:', Loadableuser.contents.message);
        setIsLoading(false);
        break;
      default:
        break;
    }
  }, [Loadableuser]);

  const posts:post[] = useRecoilValue(PostsAtom)
//  const posts:Post[] = useRecoilValue(PostsAtom)
    const dropdowndiv=useRef<HTMLDivElement>(null)
    const [dropdown,SetDropdown]=useState(false)
    const navigate= useNavigate();
    const [searchPosts,setsearchPosts]=useState<string>("");
    interface ContainsArray{
      title:string;
      id:string
    }
    const [containsArr,setContainsArr]=useState<ContainsArray[]>([]);
   
    const Gotouser=()=>{
      const userId:string = user.id;
      navigate(`/userInfo/${userId}`)
    }

    function searchPostsfunc(){
      try {
        interface Props1{
          title:string;
          id:string;
        }
      
        const PostNamesandId:Props1[] =  posts.map((post)=>{
          return {
            title:post.title,
            id:post.id
            }
          })
          
    const searchPostsLower = searchPosts.toLowerCase().replace(/\s+/g, '');
    const containsArr1 = PostNamesandId.filter(post => 
      post.title.toLowerCase().replace(/\s+/g, '').includes(searchPostsLower)
    );

    setContainsArr(containsArr1);
    console.log(containsArr1)
      } catch (error) {
        
      }
    }

    useEffect(()=>{
      searchPostsfunc()
    },[searchPosts])
    
const handleKey=(event:any)=>{
if(event.key==='Enter'){
navigate(`/search?q=${encodeURIComponent(searchPosts.trim())}`)
}
}
    
    {isLoading &&  <BounceLoader
      color={"#000000"}
      loading={isLoading}
      
      size={40}
      aria-label="Loading Spinner"
      data-testid="loader"
    /> }
    return <div className="flex-shrink-0 w-full   relative       md:w-[100%]">
      <div className="flex justify-between border-solid border-black h-[57px]  items-center">
        <div className="flex items-center">
        <div onClick={()=>{
          navigate("/blog")
        }} className=" cursor-pointer text-black font-body text-3xl font-extrabold ml-3 antialiased hover:subpixel-antialiased">
            Thought
        </div>
        <div className=" ml-4 rounded-2xl items-center hidden md:flex  bg-[#F9F9F9] py-2 px-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="md:size-5 size-4 text-black">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>

            <div className="ml-3 ">
                <input onChange={(e)=>{
                    setsearchPosts(e.target.value)
                }}  onKeyDown={handleKey} type="text" placeholder="Search" className="focus:outline-none rounded-lg placeholder-gray-500 bg-inherit placeholder:font-thin" />
            </div>
        </div>
        
        </div>

        <div className="flex relative items-center w-[50%] md:w-[20%] justify-around">
            <div onClick={()=>{
                navigate("/new-blog")
            }}  className=" cursor-pointer flex items-center text-slate-600 font-medium text-sm  hover:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className=" size-6 md:size-7">
                    
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    
                </svg>
                    <div className="mx-1 self-end" >
                        Write
                    </div>
                
            </div>

            <div className=" text-slate-600  hover:text-black ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className=" size-6 md:size-7">
  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
</svg>

            </div>



            <div className="   Profile relative flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button onClick={()=>{
              SetDropdown((prev)=> !prev)
            }} type="button" className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4  focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded={dropdown ? "true" : "false"} data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
        <span className="sr-only">Open user menu</span>
        <img className="w-8 h-8 rounded-full" src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/1510c2139933299.62399ca03fe5c.png" alt="user photo"/>
      </button>
        {dropdown && <div ref={dropdowndiv} className="z-50 font-medium text-black absolute top-5  right-[-0.5rem] md:right-[-1rem] my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg border-2 border-black shadow-md dark:bg-gray-700 dark:divide-gray-600 transition-opacity duration-300 ease-in-out ">
        <div className="px-4 py-3 ">
            
      
   
      <span className="block text-sm text-gray-900 dark:text-white">{user.name}</span>
      <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{user.email}</span>
   
        </div>
        <ul className="py-2" aria-labelledby="user-menu-button">
          <li>
            <a href="#" className="block px-4 py-2 text-sm  hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white" onClick={Gotouser}>Profile</a>
          </li>
          <li>
            <a onClick={(e)=>{
                e.preventDefault();
                localStorage.removeItem("token");
                localStorage.removeItem("fills")
                
                navigate("/signin")
            }} href="" className="block px-4 py-2 text-sm  hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign Out</a>
          </li>
          
        </ul>
      </div> }    
      
            </div>


        </div>


    </div>
    <input onChange={(e)=>{
                    setsearchPosts(e.target.value)
                }}  onKeyDown={handleKey} type="text" placeholder="Search" className="focus:outline-none rounded-lg ml-3 px-4 py-4 placeholder-black md:hidden bg-inherit relative placeholder:font-thin" />

    <div className="w-[100%] h-14 bg-gradient-to-r from-yellow-100 to-yellow-500">

    </div>

    <div className={` w-[50%] shadow-lg h-36 bg-white  select-none overflow-y-auto z-50 self-center left-[2rem] top-[7.5rem] md:left-[7rem] md:top-[3rem]   absolute p-4 ${setContainsArr.length>0 ? 'block':'hidden'} ${searchPosts.length>0 ? 'block':'hidden'} `}>
        
        {setContainsArr.length>0 && searchPosts.length>0 && containsArr.map((post)=>{
            return <div key={post.id} onClick={()=>{
                navigate(`/blog-info/${post.id}`)
            }}  className=" rounded-lg text-md p-3 hover:bg-black hover:text-white">
                {post.title}
            </div>
        })}
    </div>




        </div>
    
}