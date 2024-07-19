import axios from "axios";
import { Sidebar } from "../components/Sidebar"
import { useState, useRef, useEffect, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { PropagateLoader, ScaleLoader } from "react-spinners";
import { useRecoilState, useRecoilStateLoadable } from "recoil";
import { usePosts, useUsers, useTags } from "../hooks/Hooks";
import { followingStatusAtom, UserAtom } from "../states/atoms";
import ErrorDisplay from "./error";
import { GrayButton } from "../components/GrayButton";
import { ProfileCompo } from "../components/Who_TO_Follow";
import { Appbar } from "../components/Appbar";

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
export const MobileSideBar=()=>{


    const [socialGraphData, setSocialGraphData] = useState<Map<string, User>>(new Map());
    const graphRef = useRef<SociaGraph | null>(null);
    const [followingStatus, setFollowingStatus] = useRecoilState(followingStatusAtom) ;
   
    const [isLoading, setIsLoading] = useState(true);

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



const [fills,setFills]=useState<Fills>(()=>{
    const savedFills= localStorage.getItem("fills");
    return savedFills? JSON.parse(savedFills) : {}
});






    
   
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

  




































    
    
    
    
const navigate = useNavigate()

    
   

  
   



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

  if( tagsError ||usersError || error.length>0){
    return <div>
        {error.length>0 && <ErrorDisplay messages={error}></ErrorDisplay>}

{tagsError && <ErrorDisplay messages={tagsError}></ErrorDisplay>}
{usersError && <ErrorDisplay messages={usersError}></ErrorDisplay>}
    </div>
  }
  









return <div>

<Appbar></Appbar>
<div className="border-l  border-slate-200  md:hidden md:col-span-3 overflow-y-auto">
        <div className="flex flex-col justify-start ml-10">
          <div className="font-medium pt-28">
            Recommended topics
            {tagsLoading && (
              <div className="flex items-center mt-12 justify-center">
                <ScaleLoader color={color} loading={tagsLoading} size={40} aria-label="Loading Spinner" data-testid="loader" />
              </div>
            )}
            {!tagsLoading && (
              <div className="flex flex-wrap pt-5">
                {tags.slice(0, 9).map((tag) => (
                  <GrayButton
                    key={tag.id}
                    text={tag.tag}
                    onClick={() => {
                      navigate(`/tag/${tag.tag}`);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
  
          <div
            onClick={() => {
              navigate('/explore-topics');
            }}
            className="mt-14 font-light hover:underline cursor-pointer"
          >
            See More
          </div>
  
          <div className="font-medium pt-28">
            Who To Follow
            <div className="space-y-10 pt-8">
              {users &&
                users.length > 0 &&
                users.map((user1) => {
                  if (user1.id === user.id) {
                    return null;
                  } else {
                    return (
                      <ProfileCompo
                        key={user1.id}
                        onFollow={() => onFollow(user1.id, user.id)}
                        onUnFollow={() => onUnFollow(user1.id, user.id)}
                        userId={user1.id}
                        name={user1.name}
                        isFollowing={followingStatus.get(user1.id) || false}
                      />
                    );
                  }
                })}
            </div>
          </div>
        </div>
      </div>
      </div>
}