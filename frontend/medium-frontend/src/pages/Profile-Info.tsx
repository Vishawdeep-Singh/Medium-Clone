import { useNavigate, useParams } from "react-router-dom"
import { Appbar } from "../components/Appbar"
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { LoadingSpinner } from "./LoadingSpinner";
import { useRecoilStateLoadable } from "recoil";
import { UserAtom } from "../states/atoms";
import ErrorDisplay from "./error";
import { GridLoader } from "react-spinners";

class User{
       
    id: string;
    email: string;
    name?: string;
    following: Set<User>;
    followedBy: Set<User>;

    constructor(id: string, email: string, name?: string) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.following = new Set();
        this.followedBy = new Set();
      }

     async follow(user:User){
       try {
        if(!this.following.has(user)){
            this.following.add(user);
            user.followedBy.add(this)
        }
        const token:string | null = localStorage.getItem("token");
            if(!token){
                throw new Error("Token Not Found")
            }
    
            const headers = {
                'authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', // Optional: Set other headers if needed
              };
        const response = await axios.post('http://localhost:8787/api/v1/blog/follow/create',{
            followedById:this.id,
            followingId:user.id
        }, { headers });
        if(response.status!==200){
            this.following.delete(user);
            user.followedBy.delete(this)
        }
       } catch (error:any) {
        this.following.delete(user);
        user.followedBy.delete(this)
        console.error('Error in creating follow', error.message);
      
       }
      }
     async unfollow(user:User){
        try{
        if(this.following.has(user)){
            this.following.delete(user);
            user.followedBy.delete(this)
        }
        const token:string | null = localStorage.getItem("token");
            if(!token){
                throw new Error("Token Not Found")
            }
    
            const headers = {
                'authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', // Optional: Set other headers if needed
              };
        const response = await axios.post('http://localhost:8787/api/v1/blog/follow/delete',{
            followedById:this.id,
            followingId:user.id
        }, { headers });
        if(response.status!==200){
            this.following.add(user);
            user.followedBy.add(this)
        }
       } catch (error:any) {
        this.following.add(user);
        user.followedBy.add(this)
        console.error('Error in deleting follow', error.message);
       
       }
      }
}

class SociaGraph{
    users:Map<string,User>

    constructor(){
        this.users=new Map()
    }

    async  getuserFromDataBase(){
        try {
            const token:string | null = localStorage.getItem("token");
            if(!token){
                throw new Error("Token Not Found")
            }
    
            const headers = {
                'authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', // Optional: Set other headers if needed
              };
              const response = await axios.get('http://localhost:8787/api/v1/blog/follow/data', { headers });
              console.log(response.data);
              let users;
              if(response.status===200){
                users =  response.data;
              }
              else {
                throw new Error(`Failed to fetch data for follow: ${response.statusText}`);
              }
               
                users.forEach((user:any)=>{
                    const newUser = new User(user.id, user.email, user.name || undefined );
                    this.users.set(user.id,newUser)
                })
    
                users.forEach((user:any)=>{
                    const newUser = this.users.get(user.id);
    
                    user.followedBy.forEach((follow:any)=>{
                        const followingUser = this.users.get(follow.followingId);
                        if(followingUser){
                            newUser?.following.add(followingUser)  // in database data stored in reverse thats why we did that
                        }
                    })
    
                    user.following.forEach((followedBy:any)=>{
                        const followedByuser = this.users.get(followedBy.followedById);
                        if(followedByuser){
                            newUser?.followedBy.add(followedByuser)
                        }
                    })
                }) 
        } catch (error:any) {
            console.error('Error in fetching data for follow:', error);
           
        }
        
    }
  
getUser(userId: string): User | undefined {
return this.users.get(userId);
}
async follow(userId: string, targetUserId: string) {
const user = this.getUser(userId);
const targetUser = this.getUser(targetUserId);
if (user && targetUser) {
  await user.follow(targetUser);
}
}
async unfollow(userId: string, targetUserId: string) {
const user = this.getUser(userId);
const targetUser = this.getUser(targetUserId);
if (user && targetUser) {
  await user.unfollow(targetUser);
}
}
}







export const ProfileInfo = () => {
    const { userId1 } = useParams();
    let userId:string = ""
    if(userId1 !== undefined){
       userId=userId1
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
        post:Post1[]
        
      }
      interface User1{
        id:string;
        email:string,
        name:string,
       savedPosts:post[]
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
      
      const [error, setError] = useState<string[]>([]);

const addError = (errorMessage: string) => {
  setError(prevErrors => [...prevErrors, errorMessage]);
};
    const [posts,SetPosts] = useState<Post[]>([]);
    const[allPosts,setAllPosts]=useState<Post1[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [savedPosts,setSavedPosts]=useState<Post[]>([]);
    const [whichPosts,setWhichPosts]=useState("your")
    const navigate = useNavigate();
    const [whoseInfo,setWhoseInfo]=useState("user");
    const [ownerUser,SetOwnerUser]=useState({
        id:"",
        email:" ",
        name:" ",
        posts:[],
        savedPosts:[]

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
            SetOwnerUser(Loadableuser.contents); // Set user data from Recoil state
            break;
          case 'hasError':
           addError(`Error loading user:, ${Loadableuser.contents.message}`);
            setIsLoading(false);
            break;
          default:
            break;
        }
      }, [Loadableuser]);
      
    
    

    const [socialGraphData, setSocialGraphData] = useState<Map<string, User>>(new Map());
    const graphRef = useRef<SociaGraph | null>(null);
    const [followingStatus, setFollowingStatus] = useState<Map<string, boolean>>(new Map());
    const [user, SetUser] = useState({
        id: "",
        email: " ",
        name: " ",
        savedPosts: [],
        posts:[]

    })

    useEffect(()=>{
        const fetch=async()=>{ 
         setIsLoading(true)
        
         if (!graphRef.current) {
             graphRef.current = new SociaGraph();
             console.log(graphRef.current)
             await graphRef.current.getuserFromDataBase().then(()=>{
                 setSocialGraphData(new Map(graphRef.current!.users))
                 const initialFollowStatus = new Map<string, boolean>();
         graphRef.current!.users.forEach((user) => {
           user.following.forEach((followingUsers:User) => {
             initialFollowStatus.set(followingUsers.id, true);
           })
         });
         setFollowingStatus(initialFollowStatus);
             })
             let followedBY= graphRef.current.getUser(userId)?.followedBy;
             setFollowers(followedBY?.size)
             setIsLoading(false)
           }
         }
         fetch()
     },[])
 
 
     const onFollow=(targetId:string,ownerId:string,)=>{
         graphRef.current?.follow(ownerId,targetId);
         console.log(socialGraphData)
         setSocialGraphData(new Map(graphRef.current!.users));
         setFollowingStatus(new Map(followingStatus).set(targetId, true));
         
     }
     const onUnFollow=(targetId:string,ownerId:string,)=>{
         graphRef.current?.follow(ownerId,targetId)
         setSocialGraphData(new Map(graphRef.current!.users));
         setFollowingStatus(new Map(followingStatus).set(targetId, false));
     }

  

    
useEffect(()=>{
    if(userId===ownerUser.id){
        
            fetchUser1()
        
    }
    else{
      
            fetchUser()
      
    }
},[ownerUser,userId])
    
    let isFollowing= followingStatus.get(userId)
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
            if(error.response){
                
                addError(`Failed to fetch userInfo: ${error.response.data.message}`)
            }
            else{
                console.error('Error fetching userInfo:', error.message);
                addError(`Failed to fetch userInfo ${error.message}`)
            }
          
            setIsLoading(false)

        }
    }
    const fetchUser1 = async () => {
        try {
            
            if (user) {
                 // Assuming response.data is an array of posts
                SetPosts(ownerUser.posts);
                
                setSavedPosts(ownerUser.savedPosts)
                setIsLoading(false);
                setWhoseInfo("owner")


            } else {
                throw new Error(`Failed to fetch userInfo`);
                setIsLoading(false)
            }
        } catch (error: any) {
            addError(`Failed to execute fetchUser1 ${error.message}`)
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

      


const[followers,setFollowers]=useState<number|undefined>()


    
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
      if( error.length>0){
        return <div>
            {error.length>0 && <ErrorDisplay messages={error}></ErrorDisplay>}
    
        </div>
      }
      


    return <div>
        <Appbar></Appbar>

        <div>

        <div className="flex md:hidden flex-col mt-10 items-center   space-y-5">
                        <div className="bg-black h-20 w-20 rounded-full">
                        <img className="rounded-full" src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/1510c2139933299.62399ca03fe5c.png" alt="user photo"/>
                        </div>
                        <div className="text-xl">
                           {user.name}
                        </div>
                        <div className="text-[#6B6B6B]">
                           {followers} Followers
                        </div>
                      {whoseInfo==="user" && <div className="w-full flex justify-center">
{  isFollowing ? (
 <button  onClick={()=>{
    onUnFollow(ownerUser.id,userId)
 }} className="px-3 rounded-xl border-[1px] w-[40%] hover:bg-black hover:text-white border-black  font-light py-1 " >
          Following
 </button>
    ) : (
        <button onClick={()=>{
            onFollow(ownerUser.id,userId)
         }} className="px-3 rounded-xl border-[1px] w-[40%]  hover:bg-black hover:text-white border-black font-light py-1 " >
          Follow
        </button>
    )}
                        </div> }  
                        
                    </div>




            <div className="md:grid md:grid-cols-10 h-lvh md:overflow-hidden">
                <div className="md:col-span-7 overflow-y-auto">
                    {/* Left side */}
                    <div className="md:px-20 mt-10 px-4">

                        <div className="font-bold text-4xl px-20 mt-10 hidden md:block">
                            {user.name}
                        </div>

                        <div className="grid md:grid-rows  md:px-20 mt-10 overflow-y-auto">
                            <div className="flex md:mx-[30px] mb-10 justify-between text-md font-light">
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
                    return <div key={post.id} className="h-[19rem] overflow-y-auto mx-4 md:mx-[30px] border-y-[1px] border-[#F2F2F2] pt-10 space-y-2" >


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
                            <div className="md:text-2xl text-lg font-extrabold w-[90%]">
                                {post.title}
                            </div>
                            <div className=" h-14 md:h-16 md:text-md text-sm font-medium text-gray-500 w-[90%] pt-4  text-ellipsis overflow-hidden">
                                {post.content}

                            </div>...
                        </div>
                        {/* image */}
                        <div >
                            <img src="https://images.unsplash.com/photo-1620030537215-9ef4d9c0d3ab?q=80&w=2875&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="md:h-32 md:w-48 h-16 w-24 pr-2 " alt="Placeholder" />

                        </div>


                    </div>


                    {/* Footer  buttons */}
                    <div className="flex px-3 md:px-7 pt-5 justify-between">

                        {/* LEft icons */}
                        <div className="flex items-center space-x-7 md:space-x-10 cursor-pointer" onClick={() => handleClick(post.id)}>
                            <div className="text-xs md:text-sm font-light">
                                { formatDate(post.date)}
                            </div>
                            <div className="flex space-x-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                </svg>
                              <div className="text-sm md:text-lg">
                              {post.likes}
                              
                                                
                                </div> 
                                

                            </div>
                            <div className="flex space-x-3" >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="lightgray" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                                </svg>
                                <div className="text-sm md:text-lg">
                                {post.comments.length}
                                </div>

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
                     return <div key={post.id} className="h-[19rem] overflow-y-auto mx-4 md:mx-[30px] border-y-[1px] border-[#F2F2F2] pt-10 space-y-2" >


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
                             <div className="md:text-2xl text-lg font-extrabold w-[90%]">
                                 {post.title}
                             </div>
                             <div className=" h-14 md:h-16 md:text-md text-sm font-medium text-gray-500 w-[90%] pt-4  text-ellipsis overflow-hidden">
                                 {post.content}
 
                             </div>...
                         </div>
                         {/* image */}
                         <div >
                             <img src="https://images.unsplash.com/photo-1620030537215-9ef4d9c0d3ab?q=80&w=2875&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="md:h-32 md:w-48 h-16 w-24 pr-2 " alt="Placeholder" />
 
                         </div>
 
 
                     </div>
 
 
                     {/* Footer  buttons */}
                     <div className="flex px-3 md:px-7 pt-5 justify-between">
 
                         {/* LEft icons */}
                         <div className="flex items-center space-x-7 md:space-x-10 cursor-pointer" onClick={() => handleClick(post.id)}>
                             <div className="text-xs md:text-sm font-light">
                                 { formatDate(post.date)}
                             </div>
                             <div className="flex space-x-3">
                                 <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-6">
                                     <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                 </svg>
                               <div className="text-sm md:text-lg">
                               {post.likes}
                               
                                                 
                                 </div> 
                                 
 
                             </div>
                             <div className="flex space-x-3" >
                                 <svg xmlns="http://www.w3.org/2000/svg" fill="lightgray" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-6">
                                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                                 </svg>
                                 <div className="text-sm md:text-lg">
                                 {post.comments.length}
                                 </div>
 
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
                <div className="border-l border-slate-200 hidden md:block md:col-span-3 overflow-y-auto">

                    <div className="flex flex-col mt-36 pl-14 space-y-5">
                        <div className="bg-black h-20 w-20 rounded-full">
                        <img className="rounded-full" src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/1510c2139933299.62399ca03fe5c.png" alt="user photo"/>
                        </div>
                        <div>
                           {user.name}
                        </div>
                        <div className="text-[#6B6B6B]">
                           {followers} Followers
                        </div>
                        {isFollowing ? (
 <button  onClick={()=>{
    onUnFollow(ownerUser.id,userId)
 }} className="px-3 rounded-xl border-[1px] w-[40%] hover:bg-black hover:text-white border-black mr-5 font-light py-1 " >
          Following
 </button>
    ) : (
        <button onClick={()=>{
            onFollow(ownerUser.id,userId)
         }} className="px-3 rounded-xl border-[1px] w-[40%]  hover:bg-black hover:text-white border-black mr-5 font-light py-1 " >
          Follow
        </button>
    )}
                    </div>
                </div>
            </div>




        </div>
    </div>


}