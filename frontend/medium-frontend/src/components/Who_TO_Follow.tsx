import { useNavigate } from "react-router-dom";

 
interface Props{
    onFollow : ()=> void;
    onUnFollow:()=>void
    name:string;
    isFollowing:boolean;
    userId:string
}


 export const ProfileCompo=({name,onFollow,onUnFollow,isFollowing,userId}:Props)=>{
 const navigate=useNavigate()
    return <div className="flex items-center justify-between ">
        <div className="rounded-full h-10 w-10 bg-black flex-shrink-0 self-baseline">
   
        </div>

        <div className="flex flex-col px-7">
            <p onClick={()=>{
            navigate(`/userInfo/${userId}`)
            }} className="font-bold text-lg hover:underline hover:cursor-pointer">{name}
            </p>
            <p className="font-normal line leading-5 text-[#7a7979] text-sm">Visual journalist/writer for New Yorker. Looking to ... </p>
        </div>
        {isFollowing ? (
 <button onClick={onUnFollow} className="px-3 rounded-xl border-[1px] border-black mr-5 font-light py-1 " >
          Following
 </button>
    ) : (
        <button onClick={onFollow} className="px-3 rounded-xl border-[1px] border-black mr-5 font-light py-1 " >
          Follow
        </button>
    )}
        
    </div>
 }