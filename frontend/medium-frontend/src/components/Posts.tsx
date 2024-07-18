import React from "react";

interface PostProps {
    post: Post | Post1;
    formatDate : (dateString:string) => string
    handleClick: (postId: string) => void;
    GotouserInfo: (userId: string) => void;
    savePost: (postId: string) => void;
    fills: Fills;
  }
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




export const Posts: React.FC<PostProps> = React.memo(({ post, handleClick, GotouserInfo, savePost, fills,formatDate }) => {
    return (
      <div key={post.id} className="h-[19rem] overflow-y-auto mx-4 md:mx-[30px] border-y-[1px] border-[#F2F2F2] pt-10 space-y-2">
        {/* Author */}
        <div className="flex cursor-pointer">
          <div className="rounded-full h-5 w-5 bg-black flex-shrink-0"></div>
          <div className="text-sm font-light px-5 hover:underline" onClick={() => GotouserInfo(post.authorId)}>
            {post.author.name}
          </div>
        </div>
  
        {/* Content */}
        <div className="flex pt-3 cursor-pointer" onClick={() => handleClick(post.id)}>
          {/* Title and Content */}
          <div className="flex flex-col w-[80%]">
            <div className="md:text-2xl text-lg font-extrabold w-[90%]">{post.title}</div>
            <div className="md:h-14 h-14  md:text-md text-sm font-medium text-gray-500 w-[90%] pt-4 text-ellipsis overflow-hidden">
              {post.content}
            </div>
            {/* Add ellipsis or other content as needed */}
          </div>
  
          {/* Image */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1620030537215-9ef4d9c0d3ab?q=80&w=2875&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="md:h-32 md:w-48 h-16 w-24 pr-4"
              alt="Placeholder"
            />
          </div>
        </div>
  
        {/* Footer Buttons */}
        <div className="flex px-3 md:px-7 pt-5 justify-between">
          {/* Left icons */}
          <div className="flex items-center space-x-7 md:space-x-10 cursor-pointer" onClick={() => handleClick(post.id)}>
            <div className=" text-xs md:text-sm font-light">{formatDate(post.date)}</div>
            <div className="flex space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="black"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className=" size-5 md:size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                />
              </svg>
              <div className="text-sm md:text-lg">{post.likes}</div>
            </div>
            <div className="flex space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="lightgray"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 md:size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                />
              </svg>
              <div className="text-sm md:text-lg">{post.comments.length}</div>
            </div>
          </div>
  
          {/* Right icons */}
          <div className="flex items-center space-x-9">
            <div>
              <svg
                post-save={post.id}
                xmlns="http://www.w3.org/2000/svg"
                fill={fills[post.id] || 'none'}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className=" size-5 md:size-6  cursor-pointer z-[1000]"
                onClick={() => savePost(post.id)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                />
              </svg>
            </div>
            <div>
              <svg
                className="w-6 h-6 text-gray-800 font-extrabold dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 12h.01m6 0h.01m5.99 0h.01" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  });
  