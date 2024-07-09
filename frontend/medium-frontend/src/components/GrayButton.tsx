  
interface Props{
    onClick? : ()=>void;
    text: string;
}


 export const GrayButton=({onClick,text}:Props)=>{
    return <button onClick={onClick} className="rounded-xl bg-[#F2F2F2] font-light text-sm py-2 px-4  m-2 basis-1/4 whitespace-nowrap inline-flex">
   {text}
    </button>
 }