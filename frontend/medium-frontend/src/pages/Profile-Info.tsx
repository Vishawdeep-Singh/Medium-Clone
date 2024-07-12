import { useNavigate, useParams } from "react-router-dom"
import { Appbar } from "../components/Appbar"
import { useEffect, useState } from "react";
import axios from "axios";
import { LoadingSpinner } from "./LoadingSpinner";









export const ProfileInfo = () => {
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
      }
      
      interface Author {
        id: string;
        email: string;
        name: string;
        password: string; 
      }
    const [posts,SetPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const [savedPosts,setSavedPosts]=useState<Post[]>([]);
    const [whichPosts,setWhichPosts]=useState("your")
    const navigate = useNavigate();
    const [whoseInfo,setWhoseInfo]=useState("user");
    const [user, SetUser] = useState({
        id: "",
        email: " ",
        name: " ",
        savedPosts: []

    })
    const { userId1 } = useParams();
    let userId:string = ""
    if(userId1 !== undefined){
       userId=userId1
    }

    if(userId==="owner"){
        useEffect(() => {
            fetchUser1()
        }, [user.id])
    }
    else{
        useEffect(() => {
            fetchUser()
        }, [user.id]) 
    }

    const fetchUser = async () => {
        try {
            const token: string | null = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token Not Found")
            }

            const headers = {
                'authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', // Optional: Set other headers if needed
            };
            
            const response = await axios.post('http://localhost:8787/api/v1/anyUser', {userId}, { headers });
            
            console.log(response)
            if (response.status === 200) {
                SetUser(response.data); // Assuming response.data is an array of posts
                SetPosts(response.data.posts);
                setSavedPosts(response.data.savedPosts)
                setIsLoading(false);


            } else {
                throw new Error(`Failed to fetch userInfo: ${response.statusText}`);
                setIsLoading(false)
            }
        } catch (error: any) {
            console.error('Error fetching userInfo:', error.message);
            setIsLoading(false)

        }
    }
    const fetchUser1 = async () => {
        try {
            const token: string | null = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token Not Found")
            }

            const headers = {
                'authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', // Optional: Set other headers if needed
            };
            const response = await axios.get('http://localhost:8787/api/v1/user',{ headers });
            console.log(response)
            if (response.status === 200) {
                SetUser(response.data); // Assuming response.data is an array of posts
                SetPosts(response.data.posts);
                
                setSavedPosts(response.data.savedPosts)
                setIsLoading(false);
                setWhoseInfo("owner")


            } else {
                throw new Error(`Failed to fetch userInfo: ${response.statusText}`);
                setIsLoading(false)
            }
        } catch (error: any) {
            console.error('Error fetching userInfo:', error.message);
            setIsLoading(false)

        }
    }
    
    
    function handleClick(postId:string){
        navigate(`/blog-info/${postId}`);
    }
    const formatDate =  (dateString: string): string => {
        const dateObj = new Date(dateString);
        const year = dateObj.getFullYear();
        const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() returns 0-based index
        const day = ('0' + dateObj.getDate()).slice(-2);
        return `${day}-${month}-${year}`;
      };

      if (isLoading) {
        return <div className="absolute top-[20rem] left-[45rem]">
            <LoadingSpinner></LoadingSpinner>
            </div>
      }
    

    return <div>
        <Appbar {...user}></Appbar>

        <div>


            <div className="grid grid-cols-10 h-lvh overflow-hidden">
                <div className="col-span-7 overflow-y-auto">
                    {/* Left side */}
                    <div className="px-20 mt-10">

                        <div className="font-bold text-4xl px-20 mt-10">
                            {user.name}
                        </div>

                        <div className="grid grid-rows mt-20">
                            <div className="flex mx-[30px] mb-10 justify-between text-md font-light">
                                <div onClick={()=>{
                                    setWhichPosts("your")
                                }} className={whichPosts==="your" ? " hover:text-black font-extrabold cursor-pointer text-lg"      :" text-gray-700 hover:text-black cursor-pointer"}>
                                   Posts
                                </div>
                             {whoseInfo==="owner" && <div onClick={()=>{
                                    setWhichPosts("saved")
                                }} className={whichPosts==="saved" ? " cursor-pointer  hover:text-black font-extrabold text-lg"      :" cursor-pointer text-gray-700 hover:text-black"}>
                                    Saved Posts
                                </div> }   
                            </div>
                            
                        {/*  */}

                        {  whichPosts==="your" &&  posts && posts.map((post,index)=>{
                    return <div key={post.id} className="h-[19rem] mx-[30px] border-y-[1px] border-[#F2F2F2] pt-10 space-y-2" >


                    <div className="flex cursor-pointer"onClick={() => handleClick(post.id)} >
                        <div className="rounded-full h-5 w-5 bg-black flex-shrink-0">

                        </div>
                        <div className="text-sm font-light px-5">
                            {post.author.name}
                        </div>
                    </div>

                    {/* middele content */}
                    <div className="flex pt-3 cursor-pointer" onClick={() => handleClick(post.id)}>
                        {/* title and content */}
                        <div className="flex flex-col w-[80%]">
                            <div className="text-2xl font-extrabold w-[90%]">
                                {post.title}
                            </div>
                            <div className=" h-16 text-md font-medium text-gray-500 w-[90%] pt-4  text-ellipsis overflow-hidden">
                                {post.content}

                            </div>...
                        </div>
                        {/* image */}
                        <div >
                            <img src="https://images.unsplash.com/photo-1620030537215-9ef4d9c0d3ab?q=80&w=2875&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="h-32 w-48 " alt="Placeholder" />

                        </div>


                    </div>


                    {/* Footer  buttons */}
                    <div className="flex px-7 pt-5 justify-between">

                        {/* LEft icons */}
                        <div className="flex items-center space-x-10 cursor-pointer" onClick={() => handleClick(post.id)}>
                            <div className="text-sm font-light">
                                { formatDate(post.date)}
                            </div>
                            <div className="flex space-x-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                </svg>
                              <div>
                              {post.likes}
                              
                                                
                                </div> 
                                

                            </div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="lightgray" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                                </svg>

                            </div>
                        </div>

                        {/* Right icons */}


                    </div>



                </div>
                })}
                { whoseInfo==="owner" && whichPosts==="saved" && savedPosts.length===0 && <>
                <div className="font-extrabold text-4xl">
                    No Saved Posts
                </div>
                </>}
                        { whoseInfo==="owner" && whichPosts==="saved" &&  savedPosts.length>0 && savedPosts.map((post,index)=>{
                    return <div key={post.id} className="h-[19rem] mx-[30px] border-y-[1px] border-[#F2F2F2] pt-10 space-y-2" >


                    <div className="flex cursor-pointer"onClick={() => handleClick(post.id)} >
                        <div className="rounded-full h-5 w-5 bg-black flex-shrink-0">

                        </div>
                        <div className="text-sm font-light px-5">
                            {post.author.name}
                        </div>
                    </div>

                    {/* middele content */}
                    <div className="flex pt-3 cursor-pointer" onClick={() => handleClick(post.id)}>
                        {/* title and content */}
                        <div className="flex flex-col w-[80%]">
                            <div className="text-2xl font-extrabold w-[90%]">
                                {post.title}
                            </div>
                            <div className=" h-16 text-md font-medium text-gray-500 w-[90%] pt-4  text-ellipsis overflow-hidden">
                                {post.content}

                            </div>...
                        </div>
                        {/* image */}
                        <div >
                            <img src="https://images.unsplash.com/photo-1620030537215-9ef4d9c0d3ab?q=80&w=2875&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="h-32 w-48 " alt="Placeholder" />

                        </div>


                    </div>


                    {/* Footer  buttons */}
                    <div className="flex px-7 pt-5 justify-between">

                        {/* LEft icons */}
                        <div className="flex items-center space-x-10 cursor-pointer" onClick={() => handleClick(post.id)}>
                            <div className="text-sm font-light">
                                { formatDate(post.date)}
                            </div>
                            <div className="flex space-x-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                </svg>
                              <div>
                              {post.likes}
                              
                                                
                                </div> 
                                

                            </div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="lightgray" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                                </svg>

                            </div>
                        </div>

                        {/* Right icons */}


                    </div>



                </div>
                })}
                







                            {/*  */}



                        </div>


                    </div>


                </div>





                {/* Right content */}
                <div className="border-l border-slate-200  col-span-3 overflow-y-auto">

                    <div className="flex flex-col mt-36 pl-14 space-y-5">
                        <div className="bg-black h-20 w-20 rounded-full">
                        <img className="rounded-full" src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/1510c2139933299.62399ca03fe5c.png" alt="user photo"/>
                        </div>
                        <div>
                           {user.name}
                        </div>
                        <div className="text-[#6B6B6B]">
                            1 Follower
                        </div>
                    </div>
                </div>
            </div>




        </div>
    </div>


}