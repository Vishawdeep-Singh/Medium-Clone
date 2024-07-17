import axios from "axios";
import { useState, useEffect } from "react";
import { useRecoilValueLoadable, useRecoilState } from "recoil";
import { PostsAtom, TagsAtom } from "../states/atoms";
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
export const usePosts=()=>{
    const postsLoadable = useRecoilValueLoadable(PostsAtom);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    switch (postsLoadable.state) {
      case 'hasValue':
        setPosts(postsLoadable.contents);
        setIsLoading(false);
        break;
      case 'loading':
        setIsLoading(true);
        break;
      case 'hasError':
        setError(postsLoadable.contents.message);
        setIsLoading(false);
        break;
      default:
        break;
    }
  }, [postsLoadable]);

  return { posts, isLoading, error };

    
}

 export const useUsers = ()=>{

    const [users,SetUsers]=useState<Users[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null)

    useEffect(()=>{
        const fetchUsers = async()=>{
            try {
                const token:string | null = localStorage.getItem("token");
                if(!token){
                    throw new Error("Token Not Found")
                }
        
                const headers = {
                    'authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json', // Optional: Set other headers if needed
                  };
                  const response = await axios.get('http://localhost:8787/api/v1/users', { headers });
        
                  if (response.status === 200) {
                    
                    SetUsers(response.data); // Assuming response.data is an array of posts
                    setIsLoading(false)
                    
                  } else {
                    throw new Error(`Failed to fetch users: ${response.statusText}`);
                    setIsLoading(false)
                  }
                } catch (error:any) {

                    if(error.response){
                        setError(`Error fetching users:, ${error.response.data.message}`)
                    }
                    else{
                        setError(`Error fetching users:, ${error.message}`)
                    }
                  console.error('Error fetching users:', error.message);
                  setIsLoading(false)
                 
                  
                  
                }
        }
        fetchUsers()
    },[])
    return { users, isLoading, error };
}



export const useTags=()=>{
const [tags,SetTags]=useRecoilState<Tag[]>(TagsAtom);
const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null)

    useEffect(()=>{
        const  fetchTags = async ()=>{
            try {
                setIsLoading(true)
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
                        setIsLoading(false)
            
                      }
                      else{
                        throw new Error(`Failed to fetch tags: ${response.statusText}`);
                        setIsLoading(false)
                      }
            } catch (error:any) {
                if(error.response){
                    setError(`Error fetching tags: ${error.response.data.message}`)
                }
                else{
                    setError(`Error fetching tags: ${error.message}`)
                }
                console.error('Error fetching tags:', error.message);
             
                      setIsLoading(false)
            }
            }
            fetchTags()
    },[])

    return {tags,isLoading,error}
}
