import React from "react"
import image from '../assets/bitmap.png';
import texture from '../assets/texture3.png';


export const Appbar = () => {
    return <><div className="flex justify-between  border-solid border-black h-[57px]  items-center">
        <div className="flex items-center">
        <div className="text-black font-body text-3xl font-extrabold ml-3 antialiased hover:subpixel-antialiased">
            Thought
        </div>
        <div className="flex ml-4 rounded-2xl items-center  bg-[#F9F9F9] py-2 px-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-black">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>

            <div className="ml-3">
                <input type="text" placeholder="Search" className=" focus:outline-none rounded-lg placeholder-gray-500 bg-inherit placeholder:font-thin" />
            </div>
        </div>
        </div>

        <div className="flex items-center w-[20%] justify-around">
            <div className="flex items-center text-slate-600 font-medium text-sm  hover:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                    
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    
                </svg>
                    <div className="mx-1 self-end" >
                        Write
                    </div>
                
            </div>

            <div className=" text-slate-600  hover:text-black ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
</svg>

            </div>



            <div className="Profile">
                <div className="rounded-full h-10 w-10 bg-black">

                </div>
            </div>


        </div>

    </div>

        <div className="bg-gradient-to-r from-zinc-50 to-zinc-950 h-10 w-[100%] overflow-hidden mix-blend-overlay">

        </div>
    </>
}