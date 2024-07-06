import { Link } from "react-router-dom"
interface Props{
label:string;
buttonText:string;
to:string;
}

export const Subheading=({label,buttonText,to}:Props)=>{
    return <div>

 
    <div className="text-md font-light text-slate-600 pt-1 px-4 pb-1">
        {label}
    </div>
    <Link className="pointer underline pl-1 cursor-pointer" to={to}>
{buttonText}
</Link>
    </div>
}