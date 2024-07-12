import { useParams } from "react-router-dom"
import { Appbar } from "../components/Appbar"
import { useEffect, useState } from "react";
import axios from "axios";
import { LoadingSpinner } from "./LoadingSpinner";




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
      
    const defaultPost: Post = { id: '', title: '', content: '', published: false, authorId: '', date: '', likes: 0, author: { id: '', email: '', name: '', password: '' }, tags: [], comments: [], savers: [] };
    const { postId1 } = useParams();
    let postId:string = ""
    if(postId1 !== undefined){
        postId=postId1
    }
    const [post, setPost] = useState<Post>(defaultPost);
    const [error, setError] = useState<string | null>(null);
    const [user,SetUser]=useState({
        id:"",
        email:" ",
        name:" ",
        savedPosts:[]

    })
    const [isLoading, setIsLoading] = useState(true);
    const [para, SetPara] = useState<string[]>([]);
    const [likes, SetLikes] = useState(0);
    const [animate, setAnimate] = useState(false);
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
           const response = await axios.post('http://localhost:8787/api/v1/blog/save',{postId}, { headers });
     
           if(response.status===200){
             
             console.log("Post saved")
           }
           else {
             throw new Error(`Failed save post: ${response.statusText}`);
           }
     } catch (error:any) {
         console.error('Error in saving post:', error.message);
           
     }
     }
     



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
                const savePostsIds = response.data.savedPosts;
                const fillobj =  savePostsIds.map((post:{
                    id:string
                })=>{
                  return post.id
                });
                let fills:Fills ={}
                fillobj.forEach((id: string)=>{
                    fills[id] = "black"
                  })
                  localStorage.setItem("fills",JSON.stringify(fills))
                
              } else {
                throw new Error(`Failed to fetch posts: ${response.statusText}`);
                setIsLoading(false)
              }
            } catch (error:any) {
              console.error('Error fetching posts:', error.message);
              setIsLoading(false)
              
            }
    }



    async function fetchPost() {
        try {
            const token: string | null = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token Not Found")
            }

            const headers = {
                'authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', // Optional: Set other headers if needed
            };
            const response = await axios.get(`http://localhost:8787/api/v1/blog/${postId}`, { headers });
            console.log(response)
            if (response.status === 200) {
                setPost(response.data);
                const paragraphs = response.data.content.split("\n");
                SetPara(paragraphs);
                SetLikes(response.data.likes)
               
                setError(null);
            } else {
                throw new Error(`Failed to fetch post: ${response.statusText}`);
            }
        } catch (error: any) {
            console.error('Error fetching posts:', error.message);
           
            setError('Failed to fetch post. Please try again later.');
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

            const response = await axios.post(`http://localhost:8787/api/v1/blog/${postId}/like`, {}, { headers });

            if (response.status === 200) {
                setAnimate(false)
                


            } else {
                throw new Error(`Failed to like post: ${response.statusText}`);
            }
        } catch (error: any) {
            SetLikes(prevLikes => prevLikes - 1);
            console.error('Error liking posts:', error.message);


        }
    }

    useEffect(() => {
        fetchPost()
    }, [postId])

    useEffect(()=>{
        fetchUser()
    },[])

    useEffect(() => {
        const fetchData = async () => {
          try {
            await Promise.all([fetchUser(), fetchPost()]);
          } catch (error) {
            console.error("Error fetching data:", error);
          } finally {
            setIsLoading(false); // Set loading to false after data fetching
          }
        };
        fetchData();
      }, []);
    const formatDate = (dateString: string): string => {
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

        <div className="w-[50%] m-auto pt-32">
            <div className="text-5xl font-extrabold">
                {post?.title}
            </div>

            <img className="mt-[5rem]" src="https://images.unsplash.com/photo-1620030537215-9ef4d9c0d3ab?q=80&w=2875&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />



            <div className="flex px-7 py-3 justify-between border-y-[1px] items-center my-12">

                {/* LEft icons */}
                <div className="flex items-center space-x-10">
                    <div className="text-sm font-light">
                        {formatDate(post?.date)}
                    </div>
                    <div className="flex  space-x-3">
                        <svg onClick={likePost} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 cursor-pointer ${animate ? 'animate-likeJump' : ''}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                        </svg>

                        <div>
                            {likes}
                        </div>

                    </div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                        </svg>

                    </div>
                </div>

                {/* Right icons */}

                <div className="flex items-center space-x-9">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill={fills[postId] || "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer" onClick={()=>{
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




            <div className="space-y-16 font-source-serif font-regular text-gray-600 text-xl">
                {para.map((paras, index) => {
                    return <p key={index}>{paras}</p>
                })}
            </div>
        </div>
    </div>
}