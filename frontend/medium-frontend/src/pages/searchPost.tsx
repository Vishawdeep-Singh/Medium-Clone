import { useLocation, useNavigate } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { GrayButton } from "../components/GrayButton";
import { ProfileCompo } from "../components/Who_TO_Follow";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { Posts } from "../components/Posts";
import { Sidebar } from "../components/Sidebar";
import { useRecoilState, useRecoilStateLoadable } from "recoil";
import { useUsers, useTags, usePosts } from "../hooks/Hooks";
import { followingStatusAtom, UserAtom } from "../states/atoms";
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
      console.error('Error in creating follow', error.message);
    
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

export const SearchPosts = ()=>{
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get('q');

    
    const [socialGraphData, setSocialGraphData] = useState<Map<string, User>>(new Map());
    const graphRef = useRef<SociaGraph | null>(null);
    const [followingStatus, setFollowingStatus] = useRecoilState(followingStatusAtom);
    const[followingPosts,setFollowingPosts]=useState<Post1[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const [searchPosts,setsearchPosts]=useState<Post[]>([]);
    const [error, setError] = useState<string | null>(null);

    const {posts,isLoading:postsLoading,error:postsError}=usePosts();
    const {users,isLoading:usersLoading,error:usersError}=useUsers();
    const {tags,isLoading:tagsLoading,error:tagsError}=useTags();
    const [key,SetKey]=useState(0)
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
      console.error('Error loading user:', Loadableuser.contents.message);
      setIsLoading(false);
      break;
    default:
      break;
  }
}, [Loadableuser]);

 
    const [fills,setFills]=useState<Fills>(()=>{
        const savedFills= localStorage.getItem("fills");
        return savedFills? JSON.parse(savedFills) : {}
    });
  
   
    function searchPostsfunc(){
        try {
          interface Props1{
            title:string;
            id:string;
          }
        
          if(searchTerm){
            const searchPostsLower = searchTerm.toLowerCase().replace(/\s+/g, '');
            const containsArr1 =posts!.filter(post => 
                post.title.toLowerCase().replace(/\s+/g, '').includes(searchPostsLower)
              );
              setsearchPosts(containsArr1)
              console.log(containsArr1)
          }
            
   
      
  
     
        } catch (error) {
          
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
     },[graphRef.current])
 
 
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
           console.log(initialFollowStatus)
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
               setIsLoading(false)
             
           } else {
             throw new Error(`Failed to fetch userInfo:`);
             setIsLoading(false)
           }
         } catch (error:any) {
           console.error('Error fetching and setting some properties from it userInfo:', error.message);
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
     console.error('Error in saving post:', error.message);
       
 }
 }
  
 const GotouserInfo = (userId:string)=>{
 navigate(`/userInfo/${userId}`)
 }
 
 
 function handleClick(postId:string){
     navigate(`/blog-info/${postId}`);
 }
 





useEffect(()=>{
    searchPostsfunc()
  },[searchTerm,posts])

useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Set loading to false after data fetching
      }
    };
    fetchData();
  }, []);



if (isLoading) {
    return <div className="absolute top-[20rem] left-[45rem]">
        <LoadingSpinner></LoadingSpinner>
        </div>
  }

    return <div>
 <Appbar></Appbar>


<div>
        <div className=" relative grid grid-cols-10 h-lvh overflow-hidden">
        <div className=" col-span-7 overflow-y-auto">
            <div className="flex h-20">

            </div>
            <div className="grid grid-rows  px-20 mt-10 overflow-y-auto">
                <div className="flex ">
                    <div className="text-4xl font-bold text-gray-500">
                    Results For
                </div>
                <div className="text-4xl font-bold text-black ml-5">
                    {searchTerm}
                </div>
                </div>
                
                {/* posts */}
                {/* {PostsLoading && <div className="flex items-center mt-48 justify-center">
        <PulseLoader
          color={"#000000"}
          loading={PostsLoading}

          size={40}
          aria-label="Loading Spinner"
          data-testid="loader"
        />

      </div>} */}
      { searchPosts && searchPosts.map((post, index) => {
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
        <Sidebar tags={tags} tagsLoading={tagsLoading} users={users} user={user} followingStatus={followingStatus} onFollow={onFollow} onUnFollow={onUnFollow} color={"#000000"} />
    </div>
    </div>
    </div>
}