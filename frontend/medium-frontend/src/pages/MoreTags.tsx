import { useNavigate, useParams } from "react-router-dom"
import { Appbar } from "../components/Appbar"
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { LoadingSpinner } from "./LoadingSpinner";
import { GrayButton } from "../components/GrayButton";
import { useTags } from "../hooks/Hooks";
import { BarLoader } from "react-spinners";
import ErrorDisplay from "./error";


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
      interface UseTagsResult {
        tags: Tag[] ;
        isLoading: boolean;
        error: string | null;
      }
      const [error, setError] = useState<string[]>([]);
const addError = (errorMessage: string) => {
    setError(prevErrors => [...prevErrors, errorMessage]);
  };
      const {tags,isLoading:tagsLoading,error:tagsError}:UseTagsResult=useTags();
    const [isLoading, setIsLoading] = useState(true);
    const scoller= useRef<HTMLDivElement>(null);
    const [searchTag,setsearchTag]=useState<string>("");
    const [containsArr,setContainsArr]=useState<string[]>([]);
  
  
    const [scrollAmount, setScrollAmount] = useState(200); // Default scroll amount

    useEffect(() => {
      const handleResize = () => {
        const width = window.innerWidth;
        if (width <= 480) {
          setScrollAmount(100); // Small screen scroll amount
        } else if (width <= 768) {
          setScrollAmount(300); // Medium screen scroll amount
        } else {
          setScrollAmount(600); // Large screen scroll amount
        }
      };
  
      window.addEventListener('resize', handleResize);
      handleResize(); // Initial call to set the scroll amount
  
      return () => window.removeEventListener('resize', handleResize);
    }, []);
   
    
    const navigate = useNavigate()
    

       

               useEffect(()=>{
                async function fetchData(){
                  try {
                    await Promise.all([])
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
                      scoller.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                    }
                  };
                
                  const scrollRight = () => {
                    if (scoller.current) {
                      scoller.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
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
                        

                    } catch (error:any) {
                        addError(`Failed to search the tags ${error.message}`)
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

            
                  if(tagsError ||error.length>0){
                    return <div>
                        {error.length>0 && <ErrorDisplay messages={error}></ErrorDisplay>}
                
                {tagsError && <ErrorDisplay messages={tagsError}></ErrorDisplay>}
                
                    </div>
                  }
                  
    return <div>
        <Appbar></Appbar>



        <div className="flex items-center mt-10 mx-6 md:mx-48 space-x-4">
          
        <button
          onClick={scrollLeft}
          className=" z-10 bg-black text-white flex-shrink-0 p-2 h-10 w-10 rounded-full"
        >
          &#8592;
        </button>
            <div ref={scoller} className="overflow-x-auto scrollbar-hide w-[80%] flex scroll-smooth ">
            {tagsLoading &&   <BarLoader
        color={"#000000"}
        loading={tagsLoading}
       width={"1000px"}
        aria-label="Loading Spinner"
        data-testid="loader"
      /> }
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

        <div className="md:text-6xl text-2xl font-bold text-center mt-28">
            Explore Topics
        </div>
        <div className="flex w-[100%] flex-col items-center relative mt-10">
        <div className="flex ml-4 rounded-[2.5rem] w-full mx-1 items-center md:w-[50%] h-16 bg-[#F9F9F9] py-2 px-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-inherit">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>

            <div className="ml-3  hover:cursor-text w-[100%]">
                <input onChange={(e)=>{
                    setsearchTag(e.target.value)
                }} type="text" placeholder="Search all topics" className=" md:w-[100%] focus:outline-none rounded-lg placeholder-gray-500 bg-inherit placeholder:font-medium" />
            </div>
            
        </div>
        <div className={`w-80 shadow-lg h-36 bg-white  select-none overflow-y-auto z-30 self-center top-20 md:top-16 left-[2rem] md:left-[21rem] absolute p-4 ${setContainsArr.length>0 ? 'block':'hidden'} ${searchTag.length>0 ? 'block':'hidden'} `}>
        
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