import axios from "axios";
import { atom, selector } from "recoil";


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
export const UserAtom = atom({
    key:"userAtom",
    default: selector({
      key:"DefaultUser",
      get: async()=>{
        
          try {
              
              const token:string | null = localStorage.getItem("token");
              if(!token){
                  throw new Error("Token Not Found")
              }
      
              const headers = {
                  'authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json', // Optional: Set other headers if needed
                };
                const response = await axios.get('https://backend.vishawdeepsingh29.workers.dev/api/v1/user', { headers });
      
                if (response.status === 200) {
                  return response.data; 
                 
                  
                } else {
                  throw new Error(`Failed to fetch userInfo: ${response.statusText}`);
                  
                }
              } catch (error:any) {
                if(error.response){
                  throw Error(`Error fetching user info ${error.response.data.message}`)
                }
                else{
                  throw Error(`Error fetching user info: ${error.message}`)
                }
                console.error('Error fetching user info:', error.message);
        throw error;
                
              }
     
      }
    })
})

export const TagsAtom=atom<Tag[]>({
    key:'tagsAtom',
    default:[]
})
export const PostsAtom = atom<Post[]>({
    key:"postsAtom",
    default:selector({
        key:"PostAtomSelector",
        get: async ()=>{
            try {
                const token:string | null = localStorage.getItem("token");
                if(!token){
                    throw new Error("Token Not Found")
                }
        
                const headers = {
                    'authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json', // Optional: Set other headers if needed
                  };
                  const response = await axios.get('https://backend.vishawdeepsingh29.workers.dev/api/v1/blog', { headers });
        
                  if (response.status === 200) {
                    console.log(response.data)
                    return response.data; // Assuming response.data is an array of posts
                 
                   
                  } else {
                    throw new Error(`Failed to fetch posts: ${response.statusText}`);
                  }
                } catch (error:any) {
                  if(error.response){
                    throw Error(`Failed to fetch posts ${error.response.data.message}`)
                  }
                  else{
                    console.error('Error fetching posts:', error.message);
                    throw new Error(`Failed to fetch posts. Please try again later. ${error.message}`);
                   
                  }
                  console.error('Error fetching posts:', error.message);
                  throw new Error('Failed to fetch posts. Please try again later.');
                  
                }
        }
    }),
})

export const followingStatusAtom = atom<Map<string, boolean>>({
  key: 'followingStatus',
  default: new Map(), // Initial value can be empty or pre-populated based on your logic
});

