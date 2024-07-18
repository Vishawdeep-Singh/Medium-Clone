import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { Appbar } from "../components/Appbar";
import { GrayButton } from "../components/GrayButton";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingSpinner } from "./LoadingSpinner";
import { useTags } from "../hooks/Hooks";
import { useRecoilStateLoadable } from "recoil";
import { UserAtom } from "../states/atoms";
import { PulseLoader } from "react-spinners";
import { Posts } from "../components/Posts";
import ErrorDisplay from "./error";

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
  interface UseTagsResult {
    tags: Tag[];
    isLoading: boolean;
    error: string | null;
  }
  const [error, setError] = useState<string[]>([]);
  const addError = (errorMessage: string) => {
      setError(prevErrors => [...prevErrors, errorMessage]);
    };
  const { tags, isLoading: tagsLoading, error: tagsError }: UseTagsResult = useTags();

  const [isLoading, setIsLoading] = useState(true);
  const [PostsLoading, setPostsLoading] = useState(true);
  const scoller = useRef<HTMLDivElement>(null);
  const [posts, SetPosts] = useState<Post[]>([]);

  const navigate = useNavigate()


  const [user, SetUser] = useState({
    id: "",
    email: "",
    name: "",
    savedPosts: []
  })

  const [Loadableuser, LoadableSetUser] = useRecoilStateLoadable(UserAtom);


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
        addError(`Error in loading user ${Loadableuser.contents.message}`)
        setIsLoading(false);
        break;
      default:
        break;
    }
  }, [Loadableuser]);




  let { tagName } = useParams();
  const [fills, setFills] = useState<Fills>(() => {
    const savedFills = localStorage.getItem("fills");
    return savedFills ? JSON.parse(savedFills) : {}
  });


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
      if(error.response){
        addError(`Error fetching and setting some properties from it userInfo: ${error.response.data.message}`)
      }
      else{
        addError(`Error fetching and setting some properties from it userInfo: ${error.message}`)
      }
      console.error('Error fetching and setting some properties from it userInfo:', error.message);
      setIsLoading(false)

    }
  }







  useEffect(() => {

    SetSomePropertiesDueToUser()

  }, [user]);





  const fetchTagsPosts = async () => {
    setPostsLoading(true)
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

        setPostsLoading(false)

      }
      else {
        throw new Error(`Failed to fetch tagPosts: ${response.statusText}`);
      }
    } catch (error: any) {
      if(error.response){
        addError(`Failed to fetch tagPosts ${error.response.data.message}`)
      }
      else{
        console.error('Error fetching tagPosts:', error.message);
        addError(`Error fetching tagPosts: ${error.message}`)
      }
     
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
        await Promise.all([]);
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
      if(error.response){
        addError(`Failed save post ${error.response.data.message}`)
      }
      else{
        console.error('Error in saving post:', error.message);
        addError(`Failed to save post ${error.message}`)
      }
     

    }
  }


  if( tagsError || error.length>0){
    return <div>
        {error.length>0 && <ErrorDisplay messages={error}></ErrorDisplay>}

{tagsError && <ErrorDisplay messages={tagsError}></ErrorDisplay>}

    </div>
  }

  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>
  }
  return <div>

    <Appbar></Appbar>





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
      {PostsLoading && <div className="flex items-center mt-48 justify-center">
        <PulseLoader
          color={"#000000"}
          loading={PostsLoading}

          size={40}
          aria-label="Loading Spinner"
          data-testid="loader"
        />

      </div>}
      {!PostsLoading && posts && posts.map((post, index) => {
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
}