import { GrayButton } from "./GrayButton"
import { ProfileCompo } from "./Who_TO_Follow"



export const Dashboard = () => {
    return <div><div className=" relative grid grid-cols-10 h-lvh overflow-hidden">
        <div className=" col-span-7 overflow-y-auto">
            <div className="flex h-20">

            </div>
            <div className="grid grid-rows  px-20 mt-10 overflow-y-auto">
                <div className="flex mx-[30px] mb-10 justify-between text-md font-light">
                    <div className=" text-gray-700 hover:text-black">
                        For You
                    </div>
                    <div className=" text-gray-700 hover:text-black">
                        Following
                    </div>
                </div>
                {/* posts */}
                <div className="h-[19rem] mx-[30px] border-y-[1px] border-[#F2F2F2] pt-10 space-y-2">


                    <div className="flex">
                        <div className="rounded-full h-5 w-5 bg-black flex-shrink-0">

                        </div>
                        <div className="text-sm font-light px-5">
                            Jackob Ferenick
                        </div>
                    </div>

                    {/* middele content */}
                    <div className="flex pt-3">
                        {/* title and content */}
                        <div className="flex flex-col w-[80%]">
                            <div className="text-2xl font-extrabold w-[90%]">
                                Atheists vs. Christians on the Meaning of Life — Who Makes More Sense?
                            </div>
                            <div className=" h-16 text-md font-medium text-gray-500 w-[90%] pt-4  text-ellipsis overflow-hidden">
                                In a lot of discussions I have had over the years with people of faith, I am usually told that atheists cannot find meaning in life because everything is arbitrary.
                                In a lot of discussions I have had over the years with people of faith, I am usually told that atheists cannot find meaning in life because everything is arbitrary.
                                In a lot of discussions I have had over the years with people of faith, I am usually told that atheists cannot find meaning in life because everything is arbitrary.
                                In a lot of discussions I have had over the years with people of faith, I am usually told that atheists cannot find meaning in life because everything is arbitrary.
                                In a lot of discussions I have had over the years with people of faith, I am usually told that atheists cannot find meaning in life because everything is arbitrary.

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
                        <div className="flex items-center space-x-10">
                            <div className="text-sm font-light">
                                Jun 28
                            </div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                </svg>

                            </div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                                </svg>

                            </div>
                        </div>

                        {/* Right icons */}

                        <div className="flex items-center space-x-9">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
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




            </div>

        </div>



        {/* Sidebar */}
        <div className=" border-l border-slate-200  col-span-3 overflow-y-auto ">


            <div className="flex flex-col justify-start ml-10">
                <div className="font-medium pt-28">
                    Recommended topics
                    <div className="flex flex-wrap pt-5">
                        <GrayButton text={"Web Developmenr"}></GrayButton>
                        <GrayButton text={"Web Developmenr"}></GrayButton>
                        <GrayButton text={"Web Developmenr"}></GrayButton>
                        <GrayButton text={"Web Developmenr"}></GrayButton>
                        <GrayButton text={"Web Developmenr"}></GrayButton>
                        <GrayButton text={"Web Developmenr"}></GrayButton>
                        <GrayButton text={"Web Developmenr"}></GrayButton>
                        <GrayButton text={"Web Developmenr"}></GrayButton>
                        <GrayButton text={"Web Developmenr"}></GrayButton>
                        <GrayButton text={"Web Developmenr"}></GrayButton>
                        <GrayButton text={"Web Developmenr"}></GrayButton>
                        <GrayButton text={"Web Developmenr"}></GrayButton>
                    </div>
                </div>




                <div className="font-medium pt-28">
                    Who To Follow
                    <div className="space-y-10 pt-8">
                        <ProfileCompo></ProfileCompo>
                        <ProfileCompo></ProfileCompo>

                    </div>
                </div>

            </div>








        </div>
    </div>
    </div>
}