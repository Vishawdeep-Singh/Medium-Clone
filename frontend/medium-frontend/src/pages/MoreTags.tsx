import { useNavigate, useParams } from "react-router-dom"
import { Appbar } from "../components/Appbar"
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { LoadingSpinner } from "./LoadingSpinner";
import { GrayButton } from "../components/GrayButton";


export const ExploreTags = ()=>{
    interface Fills {
        [key: string]: string;
      } interface Tag {
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
      const [tags,SetTags]=useState<Tag[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const scoller= useRef<HTMLDivElement>(null);
    const [searchTag,setsearchTag]=useState<string>("");
    const [containsArr,setContainsArr]=useState<string[]>([]);
    const [posts,SetPosts]=useState<Post[]>([]);
  
    
    const [user,SetUser]=useState({
        id:"",
        email:" ",
        name:" ",
        savedPosts:[]

    })
    const [fills,setFills]=useState<Fills>(()=>{
        const savedFills= localStorage.getItem("fills");
        return savedFills? JSON.parse(savedFills) : {}
    });
    const navigate = useNavigate()
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
                const fillobj =  savePostsIds.map((post:any)=>{
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
    const  fetchTags = async ()=>{
        try {
            const token:string | null = localStorage.getItem("token");
                if(!token){
                    throw new Error("Token Not Found")
                }
        
                const headers = {
                    'authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json', // Optional: Set other headers if needed
                  };
                  const response = await axios.get('http://localhost:8787/api/v1/blog/tags', { headers });
                  if(response.status===200){
                   
                    SetTags(response.data);
                    
        
                  }
                  else{
                    throw new Error(`Failed to fetch tags: ${response.statusText}`);
                  }
        } catch (error:any) {
            console.error('Error fetching tags:', error.message);
                  setIsLoading(false)
        }
        }
        async function fetchPosts() {
          try {
              const token:string | null = localStorage.getItem("token");
              if(!token){
                  throw new Error("Token Not Found")
              }
      
              const headers = {
                  'authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json', // Optional: Set other headers if needed
                };
                const response = await axios.get('http://localhost:8787/api/v1/blog', { headers });
      
                if (response.status === 200) {
                  SetPosts(response.data); // Assuming response.data is an array of posts
                 
                 
                } else {
                  throw new Error(`Failed to fetch posts: ${response.statusText}`);
                }
              } catch (error:any) {
                console.error('Error fetching posts:', error.message);
                
                setIsLoading(false);
              }
      }

       

               useEffect(()=>{
                async function fetchData(){
                  try {
                    await Promise.all([fetchUser(),fetchTags(),fetchPosts()])
                  } catch (error) {
                    console.error("Error fetching data:", error);
                  }
                  finally{
                    setIsLoading(false);
                  }
                }
                fetchData()
               })




                const scrollLeft = () => {
                    if (scoller.current) {
                      scoller.current.scrollBy({ left: -600, behavior: 'smooth' });
                    }
                  };
                
                  const scrollRight = () => {
                    if (scoller.current) {
                      scoller.current.scrollBy({ left: 600, behavior: 'smooth' });
                    }
                  };



                 function SearchTags(){
                    try {
                      const tagsNames =  tags.map((tag)=>{
                        return tag.tag
                        })

                        const containsArr1 = tagsNames.filter(tag=>{
                          return  tag.includes(searchTag)
                        })
                        setContainsArr(containsArr1)
                        

                    } catch (error) {
                        
                    }
                  }
                  useEffect(()=>{
                    SearchTags()
                  },[searchTag])

                  console.log(searchTag,containsArr)


                  if(isLoading){
                    return <div className="absolute top-[20rem] left-[45rem]">
        <LoadingSpinner></LoadingSpinner>
        </div>
                  }
    return <div>
        <Appbar  posts={posts} user={user}></Appbar>



        <div className="flex items-center mt-10 mx-48 space-x-4">
        <button
          onClick={scrollLeft}
          className=" z-10 bg-black text-white flex-shrink-0 p-2 h-10 w-10 rounded-full"
        >
          &#8592;
        </button>
            <div ref={scoller} className="overflow-x-auto scrollbar-hide w-[80%] flex scroll-smooth ">
                {tags.map((tag)=>{
                    return <GrayButton key={tag.id} onClick={()=>{
                        navigate(`/tag/${tag.tag}`)
                    }} text={tag.tag}></GrayButton>
                })}

            </div>
            <button
          onClick={scrollRight}
          className=" z-10 bg-black text-white p-2 flex-shrink-0 h-10 w-10 rounded-full"
        >
          &#8594;
        </button>
           
        </div>

        <div className="text-6xl font-bold text-center mt-28">
            Explore Topics
        </div>
        <div className="flex flex-col items-center relative mt-10">
        <div className="flex ml-4 rounded-[2.5rem] bor items-center w-[50%] h-16 bg-[#F9F9F9] py-2 px-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-inherit">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>

            <div className="ml-3 hover:cursor-text w-[100%]">
                <input onChange={(e)=>{
                    setsearchTag(e.target.value)
                }} type="text" placeholder="Search all topics" className=" w-[100%] focus:outline-none rounded-lg placeholder-gray-500 bg-inherit placeholder:font-medium" />
            </div>
            
        </div>
        <div className={`w-80 shadow-lg h-36 bg-white  select-none overflow-y-auto z-30 self-center top-16 left-[21rem] absolute p-4 ${setContainsArr.length>0 ? 'block':'hidden'} ${searchTag.length>0 ? 'block':'hidden'} `}>
        
                {setContainsArr.length>0 && searchTag.length>0 && containsArr.map((tag)=>{
                    return <div onClick={()=>{
                        navigate(`/tag/${tag}`)
                    }}  className=" rounded-lg text-md p-3 hover:bg-black hover:text-white">
                        {tag}
                    </div>
                })}
            </div>
        </div>
      
    </div>
}