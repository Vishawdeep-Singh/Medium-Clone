import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { GrayButton } from "./GrayButton"
import { ProfileCompo } from "./Who_TO_Follow"
import axios from "axios";
import { LoadingSpinner } from "../pages/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { Appbar } from "./Appbar";
import { useRecoilState, useRecoilStateLoadable, useRecoilValueLoadable } from "recoil";
import { followingStatusAtom, PostsAtom, TagsAtom, UserAtom } from "../states/atoms";
import ClipLoader from "react-spinners/ClipLoader";
import { PropagateLoader, PulseLoader, ScaleLoader } from "react-spinners";
import { Sidebar } from "./Sidebar";
import { Posts } from "./Posts";
import { usePosts, useUsers, useTags } from "../hooks/Hooks";
import ErrorDisplay from "../pages/error";


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
        }
       
       } catch (error:any) {
        this.following.delete(user);
        user.followedBy.delete(this)
        console.error('Error in creating follow', error.response.data.message);
      
       }
      }
     async unfollow(user:User){
        try{
        if(this.following.has(user)){
            this.following.delete(user);
            user.followedBy.delete(this)
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
        }
       
       } catch (error:any) {
        this.following.add(user);
        user.followedBy.add(this)
        console.error('Error in deleting follow', error.response.data.message);
       
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
  
export const Dashboard = () => {

  
      
  
    const [socialGraphData, setSocialGraphData] = useState<Map<string, User>>(new Map());
    const graphRef = useRef<SociaGraph | null>(null);
    const [followingStatus, setFollowingStatus] = useRecoilState(followingStatusAtom) ;
    const[followingPosts,setFollowingPosts]=useState<Post1[]>([])
    const [isLoading, setIsLoading] = useState(true);
const {posts,isLoading:postsLoading,error:postsError}=usePosts();
const {users,isLoading:usersLoading,error:usersError}=useUsers();
const {tags,isLoading:tagsLoading,error:tagsError}=useTags();
const [user,SetUser]=useState({
  id: "",
  email: "",
  name: "",
  savedPosts: []
})

const [Loadableuser,LoadableSetUser]=useRecoilStateLoadable(UserAtom);
const [error, setError] = useState<string[]>([]);

const addError = (errorMessage: string) => {
  setError(prevErrors => [...prevErrors, errorMessage]);
};

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

const [forYouPosts,setForYouPosts]=useState(true)

const [isSpinner, setIsSpinner] = useState(false);

const [fills,setFills]=useState<Fills>(()=>{
    const savedFills= localStorage.getItem("fills");
    return savedFills? JSON.parse(savedFills) : {}
});






    const fetchFollwingUser = async (followingUserId:string) => {
        
        try {
           
            console.log(followingUserId)
            const token: string | null = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token Not Found")
            }

            const headers = {
                'authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', // Optional: Set other headers if needed
            };
            
            const response = await axios.post('http://localhost:8787/api/v1/anyUser', {
                userId:followingUserId}, { headers });
            
            console.log(response)
            if (response.status === 200) {
                const newPosts:Post1[]=response.data.posts
                
                setFollowingPosts(prevPosts => [...prevPosts, ...newPosts])
                
                setIsLoading(false);


            } else {
                throw new Error(`Failed to fetch userInfo: ${response.statusText}`);
                setIsLoading(false)
            }
        } catch (error: any) {
          if(error.response){
            addError(`Error fetching user info: ${error.response.data.message}`);
          }
          else{
            addError(`Error fetching user info: ${error.message}`);
          }
          
            console.error('Error fetching userInfo:', error.message);
            setIsLoading(false)

        }
    }
   
    useEffect(()=>{
       const fetch=async()=>{ 
        setIsLoading(true)
       
        if (!graphRef.current) {
            graphRef.current = new SociaGraph();
            console.log(graphRef.current)
            await graphRef.current.getuserFromDataBase().then(()=>{
                console.log(graphRef.current?.users)
                setSocialGraphData(new Map(graphRef.current!.users))
        //         const initialFollowStatus = new Map<string, boolean>();
        //         graphRef.current?.getUser(user.id)
        // graphRef.current!.users.forEach((user) => {
        //     initialFollowStatus.set(user.id, false);
        //   user.following.forEach((followingUsers:User) => {
        //     initialFollowStatus.set(followingUsers.id, true);
        //     console.log(initialFollowStatus)
        //   })
        // });
        // setFollowingStatus(initialFollowStatus);
            })
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

  




































    
    
    
    

    
   

  
    const navigate = useNavigate();

    const formatDate =  (dateString: string): string => {
        const dateObj = new Date(dateString);
        const year = dateObj.getFullYear();
        const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() returns 0-based index
        const day = ('0' + dateObj.getDate()).slice(-2);
        return `${day}-${month}-${year}`;
      };



const SetSomePropertiesDueToUser = async()=>{
    try {
        setIsLoading(true)
        

          if (user) {
             // Assuming response.data is an array of posts
           const loggedInuser= socialGraphData.get(user.id);
           const initialFollowStatus = new Map<string, boolean>();
           socialGraphData.forEach((user) => {
            // Initialize the follow status for each user to false
            initialFollowStatus.set(user.id, false);
        });
           
         loggedInuser?.following.forEach((followingUsers:User) => {
            initialFollowStatus.set(followingUsers.id, true);
          })
          setFollowingStatus(initialFollowStatus);
            
            const savePostsIds = user.savedPosts;
            const fillobj =  savePostsIds.map((post:any)=>{
              return post.id
            });
            let fills:Fills ={}
            fillobj.forEach((id: string)=>{
                fills[id] = "black"
              })
              
              localStorage.setItem("fills",JSON.stringify(fills))
              setFills(fills)
              setIsLoading(false)
            
          } else {
            throw new Error(`Failed to fetch userInfo:`);
            setIsLoading(false)
          }
        } catch (error:any) {
          console.error('Error fetching and setting some properties from it userInfo:', error.message);
          addError(`Error fetching and setting properties: ${error.message}`);
          setIsLoading(false)
          
        }
}







useEffect(() => {
  
       SetSomePropertiesDueToUser()
      
  }, [user,socialGraphData,setFollowingStatus]);


 

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
  if(error.response){
    addError(`Error saving post: ${error.response.data.message}`);
  }
  else{
    addError(`Error saving post: ${error.message}`);
  }
    console.error('Error in saving post:', error.message);
   
      
}
}
 
const GotouserInfo = (userId:string)=>{
navigate(`/userInfo/${userId}`)
}


function handleClick(postId:string){
    navigate(`/blog-info/${postId}`);
}


const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  let [color, setColor] = useState("#000000");
  

if (isLoading) {
    console.log(isLoading)
    return <div className="flex justify-center items-center h-lvh">
       <PropagateLoader
color={"#000000"}
loading={true}

size={30}
aria-label="Loading Spinner"
data-testid="loader"


/>
        </div>
  }

  if(postsError || tagsError ||usersError || error.length>0){
    return <div>
        {error.length>0 && <ErrorDisplay messages={error}></ErrorDisplay>}
{postsError && <ErrorDisplay messages={postsError}></ErrorDisplay>}
{tagsError && <ErrorDisplay messages={tagsError}></ErrorDisplay>}
{usersError && <ErrorDisplay messages={usersError}></ErrorDisplay>}
    </div>
  }
  


console.log(postsError)
    return <div>
     
 <Appbar></Appbar>


<div>
        <div className=" relative md:grid md:grid-cols-10 h-lvh md:overflow-hidden">
        <div className=" md:col-span-7 overflow-y-auto">
            <div className="flex h-20">

            </div>
            <div className="grid md:grid-rows  md:px-20 mt-10 overflow-y-auto">
                <div className="flex mx-[30px] mb-10 justify-between text-sm md:text-md font-light">
                    <div onClick={()=>{
                        setForYouPosts(true)
                    }}  className={`  hover:text-black cursor-pointer ${forYouPosts ? 'font-bold text-lg md:text-xl text-black' : ''}`}>
                        For You
                    </div>
                    <div onClick={async ()=>{
                        setForYouPosts(false)
                        setFollowingPosts([])
                        setIsSpinner(true)
                        if(graphRef.current){

                            const followingUser= graphRef.current.getUser(user.id)?.following
                            if (followingUser) {
                                for (const following of followingUser) {
                                    console.log(following);
                                                             
                                    await fetchFollwingUser(following.id);
                                  
                                    
                                }
                                setIsSpinner(false)
                            }
                           
                            }
                            console.log(followingPosts)
                    }} className={` hover:text-black cursor-pointer ${forYouPosts ? '' : 'font-bold text-black text-lg md:text-xl'}`}>
                        Following
                    </div>
                </div>
               
                    {postsLoading&& <div className="flex items-center mt-48 justify-center">
                        <PulseLoader
        color={color}
        loading={postsLoading}
        
        size={40}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
                        
                        </div>}
                {posts && !isSpinner && forYouPosts && posts.map((post,index)=>{
                   return <Posts
                    key={post.id}
                    post={post}
                    handleClick={handleClick}
                    GotouserInfo={GotouserInfo}
                    savePost={savePost}
                    fills={fills}
                    formatDate={formatDate}
                  />
                })}


{isSpinner&& <div className="flex items-center mt-48 justify-center">
                        <PulseLoader
        color={color}
        loading={isSpinner}
        
        size={40}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
                        
                        </div>}

                {followingPosts.length>0 && !forYouPosts && followingPosts.map((post,index)=>{
                   return <Posts
                   key={post.id}
                   post={post}
                   handleClick={handleClick}
                   GotouserInfo={GotouserInfo}
                   savePost={savePost}
                   fills={fills}
                   formatDate={formatDate}
                 />
                })}
                




            </div>

        </div>



        {/* Sidebar */}
        <Sidebar tags={tags} tagsLoading={tagsLoading} users={users} user={user} followingStatus={followingStatus} onFollow={onFollow} onUnFollow={onUnFollow} color={color}  />
    </div>
    </div>
    </div>
}

interface SidebarProps {
    tags:Tag[];
    tagsLoading:boolean;
    users:Users[];
    user:any;
    followingStatus:Map<string,boolean>;
    onFollow:(targetId: string, ownerId: string) => void;
    onUnFollow:(targetId: string, ownerId: string) => void;
    color:string

}
