import { useParams } from "react-router-dom"
import { Appbar } from "../components/Appbar"
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { LoadingSpinner } from "./LoadingSpinner";
import { useRecoilStateLoadable } from "recoil";
import { UserAtom } from "../states/atoms";
import ErrorDisplay from "./error";
import { GridLoader } from "react-spinners";




export const BlogInfo = () => {
    interface Tag {
        id: number;
        tag: string;
    }

    interface Author {
        id: string;
        email: string;
        name: string;
        password: string; // Note: It's not recommended to store passwords in plaintext in real applications
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
        comments: any[]; // You can define a proper type for comments if needed
        savers: any[]; // You can define a proper type for savers if needed
    }
    interface Fills {
        [key: string]: string;
      }
      interface Comments{
        author:Author;
        authorId:string;
        content:string;
        id:string;
        postId:string
      }
      
    const defaultPost: Post = { id: '', title: '', content: '', published: false, authorId: '', date: '', likes: 0, author: { id: '', email: '', name: '', password: '' }, tags: [], comments: [], savers: [] };
    const { postId1 } = useParams();
    let postId:string = ""
    if(postId1 !== undefined){
        postId=postId1
    }
    const [post, setPost] = useState<Post>(defaultPost);

    const [user,SetUser]=useState({
        id: "",
        email: "",
        name: "",
        savedPosts: []
      })
      
      const [Loadableuser,LoadableSetUser]=useRecoilStateLoadable(UserAtom);
      useEffect(() => {
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
           addError(`Error loading user:, ${Loadableuser.contents.message}`);
            setIsLoading(false);
            break;
          default:
            break;
        }
      }, [Loadableuser]);
    const [isLoading, setIsLoading] = useState(true);
    const [para, SetPara] = useState<string[]>([]);
    const [likes, SetLikes] = useState(0);
    const [animate, setAnimate] = useState(false);
    const [commentValue,setCommentValue]=useState(false)
    const [commentContent,setCommentContent]=useState("")
    const [comments,setComments]=useState<Comments[]>([]);
    const responseButton =  useRef<HTMLButtonElement | null>(null)
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [commentPosted,setCommentPosted]=useState(false)
   
    const [error, setError] = useState<string[]>([]);
const addError = (errorMessage: string) => {
    setError(prevErrors => [...prevErrors, errorMessage]);
  };
    const [fills,setFills]=useState<Fills>(()=>{
        const savedFills= localStorage.getItem("fills");
        return savedFills? JSON.parse(savedFills) : {}
    });




    async function savePost(postId:string){
        setFills(prevFills =>{
         const newFills = {
             ...prevFills
             }
         if(newFills.hasOwnProperty(postId)){
             delete newFills[postId]
         }
         else{
             newFills[postId]="black"
         }
     
         localStorage.setItem("fills",JSON.stringify(newFills));
         return newFills
        })
     try {
         const token:string | null = localStorage.getItem("token");
         if(!token){
             throw new Error("Token Not Found")
         }
         const headers = {
             'authorization': `Bearer ${token}`,
             'Content-Type': 'application/json', // Optional: Set other headers if needed
           };
           const response = await axios.post('https://backend.vishawdeepsingh29.workers.dev/api/v1/blog/save',{postId}, { headers });
     
           if(response.status===200){
             
             console.log("Post saved")
           }
           else {
             throw new Error(`Failed save post: ${response.statusText}`);
           }
     } catch (error:any) {
        if(error.response){
            addError(`Error in saving post ${error.response.data.message}`)
        }
        else{
            console.error('Error in saving post:', error.message);
            addError(`Error in saving post:, ${error.message}`)
        }
        
           
     }
     }
     



     const SetSomePropertiesDueToUser = async () => {
        try {
          setIsLoading(true)
    
    
          if (user) {
            // Assuming response.data is an array of posts
    
    
            const savePostsIds = user.savedPosts;
            const fillobj = savePostsIds.map((post: any) => {
              return post.id
            });
            let fills: Fills = {}
            fillobj.forEach((id: string) => {
              fills[id] = "black"
            })
            localStorage.setItem("fills", JSON.stringify(fills))
            setIsLoading(false)
    
          } else {
            throw new Error(`Failed to fetch userInfo:`);
            setIsLoading(false)
          }
        } catch (error: any) {
          addError(`Error fetching and setting some properties from it userInfo:, ${error.message}`);
          setIsLoading(false)
    
        }
      }
    
    
    
    
    
    
    
      useEffect(() => {
    
        SetSomePropertiesDueToUser()
    
      }, [user]);



    async function fetchPost() {
        try {
            setIsLoading(true)
            const token: string | null = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token Not Found")
            }

            const headers = {
                'authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', // Optional: Set other headers if needed
            };
            const response = await axios.get(`https://backend.vishawdeepsingh29.workers.dev/api/v1/blog/${postId}`, { headers });
            console.log(response)
            if (response.status === 200) {
                setPost(response.data);
               
                const paragraphs = response.data.content.split("\n");
                SetPara(paragraphs);
                SetLikes(response.data.likes)
                setComments(response.data.comments)
                setIsLoading(false)
               
               
            } else {
                throw new Error(`Failed to fetch post: ${response.statusText}`);
            }
        } catch (error: any) {
            if(error.response){
                addError(`Failed to fecth post data ${error.response.data.message}`)
            }
            else{
                console.error('Error fetching posts:', error.message)
                addError(`Failed to fetch post data ${error.message}`)
            }
            console.error('Error fetching posts:', error.message);
           
          
            setIsLoading(false);
        }
    }

    async function likePost() {
        SetLikes(prevLikes => prevLikes + 1);
        setAnimate(true);
        

        try {
            const token: string | null = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token Not Found")
            }

            const headers = {
                'authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', // Optional: Set other headers if needed
            };

            const response = await axios.post(`https://backend.vishawdeepsingh29.workers.dev/api/v1/blog/${postId}/like`, {}, { headers });

            if (response.status === 200) {
                setAnimate(false)
                


            } else {
                throw new Error(`Failed to like post: ${response.statusText}`);
            }
        } catch (error: any) {
            SetLikes(prevLikes => prevLikes - 1);
            if(error.response){
                addError(`Failed to like the post  ${error.response.data.message}`)
            }
            else{
                console.error('Error liking posts:', error.message);
                addError(`Failed to like the post ${error.message}`)
            }
        


        }
    }

    useEffect(() => {
        fetchPost()
    }, [postId,commentPosted])


    useEffect(()=>{
        if(responseButton.current){
            if(!commentValue){
                responseButton.current.disabled=true
            }
            else{
                responseButton.current.disabled=false
            }
        }
        else{
            console.error("responseButton is null")
        }
        
    },[commentValue])

   
    const formatDate = (dateString: string): string => {
        const dateObj = new Date(dateString);
        const year = dateObj.getFullYear();
        const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() returns 0-based index
        const day = ('0' + dateObj.getDate()).slice(-2);
        return `${day}-${month}-${year}`;
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-lvh">
           <GridLoader
color={"#000000"}
loading={true}

size={30}
aria-label="Loading Spinner"
data-testid="loader"


/>
        </div>
    }

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = e.target;
        if(textarea.value.length>0){
            setCommentValue(true)
        }
        else if(textarea.value.length===0){
            setCommentValue(false)
        }
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      };

async function postComment (postId:string){
    try {
        const token: string | null = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token Not Found")
            }

            const headers = {
                'authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', // Optional: Set other headers if needed
            };

            const response = await axios.post(`https://backend.vishawdeepsingh29.workers.dev/api/v1/blog/${postId}/comment`, {
                commentContent:commentContent
            }, { headers });

            if (response.status === 200) {
                alert(response.data.message)
                setCommentPosted(true)


            } else {
                throw new Error(`Failed to comment post: ${response.statusText}`);
            }
    } catch (error:any) {
        if(error.response){
            console.error("Cannot save post"+error.message);
            addError(`Failed to comment on post ${error.response.data.message}`)
        }
        else{
            addError(`Failed to comment on post ${error.message}`)
        }
        
        
    }
}


if(error.length>0){
    return <div>
        {error.length>0 && <ErrorDisplay messages={error}></ErrorDisplay>}

    </div>
  }
    return <div className={`flex  items-center ${isSidebarVisible ? '   overflow-hidden' : ''}  flex-col h-[100vh] `}>
        <Appbar></Appbar>

        <div className={`md:w-[50%] w-[90%] m-auto pt-32 flex-shrink-0   z-10   ${isSidebarVisible ? '  opacity-60 overflow-hidden' : 'opacity-100 overflow-y-sroll'}`}>
            <div className="md:text-5xl text-2xl font-extrabold">
                {post?.title}
            </div>

            <img className="mt-[5rem] ml-20 md:ml-0  md:w-full w-[50%]" src="https://images.unsplash.com/photo-1620030537215-9ef4d9c0d3ab?q=80&w=2875&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />



            <div className="flex   md:px-7 px-3 py-3 justify-between border-y-[1px] items-center my-12">

                {/* LEft icons */}
                <div className="flex items-center space-x-10">
                    <div className="md:text-sm text-xs font-light">
                        {formatDate(post?.date)}
                    </div>
                    <div className="flex  space-x-3">
                        <svg onClick={likePost} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`md:size-6 size-5 cursor-pointer ${animate ? 'animate-likeJump' : ''}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                        </svg>

                        <div className="text-sm md:text-md">
                            {likes}
                        </div>

                    </div>
                    <div className=" flex  space-x-3">
                        <svg onClick={()=>{
                        setIsSidebarVisible(true)
                    }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="md:size-6 size-5 cursor-pointer z-20">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                        </svg>
                        <div className="text-sm md:text-md">
                            {post.comments.length}
                        </div>

                    </div>
                </div>

                {/* Right icons */}

                <div className="flex items-center md:space-x-9">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill={fills[postId] || "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="md:size-6 size-5 cursor-pointer" onClick={()=>{
                            savePost(postId)
                        }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>

                    </div>
                    <div>
                        <svg className="w-6 h-6 text-gray-800 font-extrabold dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 12h.01m6 0h.01m5.99 0h.01" />
                        </svg>

                    </div>

                </div>

            </div>




            <div className="space-y-16 font-source-serif font-regular text-gray-600 text-lg md:text-xl">
                {para.map((paras, index) => {
                    return <p key={index}>{paras}</p>
                })}
            </div>
        </div>

{/* sidebar */}

      <div  className={`z-40  h-lvh md:w-[25rem] w-full  border- flex flex-col  space-y-28  shadow-md shadow-black overflow-scroll fixed ease-in-out transition-all delay-100 duration-300    bg-white px-5 ${isSidebarVisible ? 'right-0':'right-[-25rem]'}`}>
                <div className="flex justify-between px-5 pt-10">
                   <div className="text-2xl font-mono font-bold">
                    Responses ({post.comments.length})
                   </div>
                   <div>
                    <button onClick={()=>{
                        setIsSidebarVisible(false)
                    }}>Close</button>
                   </div>
                </div>


                <div className=" min-h-52 bg-[	#fffff2] shadow-lg rounded-md  shadow-slate-400 flex  flex-col">
                    <div className="p-5 flex items-center  ">
                        <div className="h-10 w-10 rounded-full bg-black">

                        </div>
                        <div className="ml-5">
                           {user.name}
                        </div>
                        
                    </div>
                    <textarea onChange={(e)=>{
                        setCommentContent(e.target.value)
                    }} name=""  id=""  onInput={handleInput} value={commentContent} className="w-[90%] resize-none  block mx-4 overflow-hidden outline-none bg-inherit" rows={2}/>
                    <button onClick={()=>{
                       postComment(postId)
                    }} ref={responseButton} className={commentValue? "bg-green-700 rounded-lg px-1 py-1 w-[20%] text-white text-sm  self-end mt-8 mb-7   mr-5" : "bg-green-700 rounded-lg px-1 py-1 w-[20%] text-white text-sm  self-end mt-8 mb-7  opacity-55  mr-5"}>Respond</button>
                </div>

                
                <div className="grid grid-rows space-y-5 mt-0">
                <hr className="w-[100%]" />
                {comments.length===0 && <div>
                    No Responses
                    </div>}
                {comments.length>0 && comments.map((comment,index)=>{
                    let paras:string[]=comment.content.split("\n")
                    return <div key={comment.id} className="border-b-[1px] space-y-5 flex flex-col border-gray w-[100%]">
                    <div className="flex items-center">
                     <div className="h-10 w-10 rounded-full bg-black">

                        </div>
                        <div className="ml-5">
                           {comment.author.name}
                        </div>    
                    </div>

                    <div className="space-y-6 text-sm font-light pb-10">
                        {paras.map((para,index)=>{
                            return <p key={index}>{para}</p>
                        })}
                       
                    </div>
               
                </div>
                })}
                

                </div>
      </div>


    </div>
}