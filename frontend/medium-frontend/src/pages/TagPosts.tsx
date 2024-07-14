import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { Appbar } from "../components/Appbar";
import { GrayButton } from "../components/GrayButton";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingSpinner } from "./LoadingSpinner";

export const TagPosts = () => {

  interface Fills {
    [key: string]: string;
  } interface Tag {
    id: number;
    tag: string;
    post: Post[]

  }
  interface post {
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
  const [tags, SetTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const scoller = useRef<HTMLDivElement>(null);
  const [posts, SetPosts] = useState<Post[]>([]);
  const [posts1, SetPosts1] = useState<Post[]>([]);
  const navigate = useNavigate()


  const [user, SetUser] = useState({
    id: "",
    email: " ",
    name: " ",
    savedPosts: []


  })
  let { tagName } = useParams();
  const [fills, setFills] = useState<Fills>(() => {
    const savedFills = localStorage.getItem("fills");
    return savedFills ? JSON.parse(savedFills) : {}
  });
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
      const response = await axios.get('http://localhost:8787/api/v1/user', { headers });

      if (response.status === 200) {
        SetUser(response.data); // Assuming response.data is an array of posts
        const savePostsIds = response.data.savedPosts;
        const fillobj = savePostsIds.map((post: any) => {
          return post.id
        });
        let fills: Fills = {}
        fillobj.forEach((id: string) => {
          fills[id] = "black"
        })
        localStorage.setItem("fills", JSON.stringify(fills))

      } else {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
        setIsLoading(false)
      }
    } catch (error: any) {
      console.error('Error fetching posts:', error.message);
      setIsLoading(false)

    }
  }

  const fetchTags = async () => {
    try {

      const token: string | null = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token Not Found")
      }

      const headers = {
        'authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Optional: Set other headers if needed
      };
      const response = await axios.get('http://localhost:8787/api/v1/blog/tags', { headers });
      if (response.status === 200) {
        SetTags(response.data);

      }
      else {
        throw new Error(`Failed to fetch tags: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('Error fetching tags:', error.message);
      setIsLoading(false)
    }
  }
  async function fetchPosts() {
    try {
      const token: string | null = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token Not Found")
      }

      const headers = {
        'authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Optional: Set other headers if needed
      };
      const response = await axios.get('http://localhost:8787/api/v1/blog', { headers });

      if (response.status === 200) {
        SetPosts1(response.data); // Assuming response.data is an array of posts


      } else {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('Error fetching posts:', error.message);

      setIsLoading(false);
    }
  }
  const fetchTagsPosts = async () => {
    setIsLoading(true)
    try {

      const token: string | null = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token Not Found")
      }

      const headers = {
        'authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Optional: Set other headers if needed
      };
      const response = await axios.post('http://localhost:8787/api/v1/blog/tag', { tagName }, { headers });
      if (response.status === 200) {
        SetPosts(response.data.post);

        setIsLoading(false)

      }
      else {
        throw new Error(`Failed to fetch tagPosts: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('Error fetching tagPosts:', error.message);
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTagsPosts()
  }, [tagName])


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        await Promise.all([fetchUser(), fetchTags(),fetchPosts()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Set loading to false after data fetching
      }
    };
    fetchData();
  }, []);
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
  const GotouserInfo = (userId: string) => {
    navigate(`/userInfo/${userId}`)
  }
  const formatDate = (dateString: string): string => {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() returns 0-based index
    const day = ('0' + dateObj.getDate()).slice(-2);
    return `${day}-${month}-${year}`;
  };
  function handleClick(postId: string) {
    navigate(`/blog-info/${postId}`);
  }
  async function savePost(postId: string) {
    setFills(prevFills => {
      const newFills = {
        ...prevFills
      }
      if (newFills.hasOwnProperty(postId)) {
        delete newFills[postId]
      }
      else {
        newFills[postId] = "black"
      }

      localStorage.setItem("fills", JSON.stringify(newFills));
      return newFills
    })
    try {
      const token: string | null = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token Not Found")
      }
      const headers = {
        'authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Optional: Set other headers if needed
      };
      const response = await axios.post('http://localhost:8787/api/v1/blog/save', { postId }, { headers });

      if (response.status === 200) {

        console.log("Post saved")
      }
      else {
        throw new Error(`Failed save post: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('Error in saving post:', error.message);

    }
  }


  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>
  }
  return <div>

    <Appbar posts={posts1} user={user}></Appbar>





    <div className="flex items-center mt-10 mx-48 space-x-4">
      <button
        onClick={scrollLeft}
        className=" z-10 bg-black text-white flex-shrink-0 p-2 h-10 w-10 rounded-full"
      >
        &#8592;
      </button>
      <div ref={scoller} className="overflow-x-auto scrollbar-hide w-[80%] flex scroll-smooth ">
        {tags.map((tag) => {
          return <GrayButton key={tag.id} text={tag.tag} onClick={() => {
            navigate(`/tag/${tag.tag}`)
          }} ></GrayButton>
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
      {tagName}
    </div>


    <div className="w-[60%] m-auto mt-16">
      {posts && posts.map((post, index) => {
        return <div key={post.id} className="h-[19rem] mx-[30px] border-y-[1px] border-[#F2F2F2] pt-10 space-y-2" >


          <div className="flex cursor-pointer" >
            <div className="rounded-full h-5 w-5 bg-black flex-shrink-0">

            </div>
            <div className="text-sm font-light px-5 hover:underline" onClick={() => {
              GotouserInfo(post.authorId)
            }}>
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
                {formatDate(post.date)}
              </div>
              <div className="flex space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                </svg>
                <div>
                  {post.likes}


                </div>


              </div>
              <div className="flex space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="lightgray" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                </svg>
                <div>
                  {post.comments.length}
                </div>

              </div>
            </div>

            {/* Right icons */}

            <div className="flex items-center space-x-9">
              <div>
                <svg post-save={post.id} xmlns="http://www.w3.org/2000/svg" fill={fills[post.id] || "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer z-[1000]" onClick={() => {
                  savePost(post.id)
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



        </div>
      })}
    </div>

  </div>
}