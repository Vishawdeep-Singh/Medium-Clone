import React from "react";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { GrayButton } from "./GrayButton";
import { ProfileCompo } from "./Who_TO_Follow";

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
interface SidebarProps {
    tags:Tag[];
    tagsLoading:boolean;
    users:Users[];
    user:any;
    followingStatus:Map<string,boolean>;
    onFollow:(targetId: string, ownerId: string) => void;
    onUnFollow:(targetId: string, ownerId: string) => void;
    color:string;


}




export const Sidebar:React.FC<SidebarProps> = ({ tags, tagsLoading, users, user, followingStatus, onFollow, onUnFollow, color}) => {
    const navigate = useNavigate();
  console.log(followingStatus)
    return (
      <div className="border-l border-slate-200 col-span-3 overflow-y-auto">
        <div className="flex flex-col justify-start ml-10">
          <div className="font-medium pt-28">
            Recommended topics
            {tagsLoading && (
              <div className="flex items-center mt-12 justify-center">
                <ScaleLoader color={color} loading={tagsLoading} size={40} aria-label="Loading Spinner" data-testid="loader" />
              </div>
            )}
            {!tagsLoading && (
              <div className="flex flex-wrap pt-5">
                {tags.slice(0, 9).map((tag) => (
                  <GrayButton
                    key={tag.id}
                    text={tag.tag}
                    onClick={() => {
                      navigate(`/tag/${tag.tag}`);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
  
          <div
            onClick={() => {
              navigate('/explore-topics');
            }}
            className="mt-14 font-light hover:underline cursor-pointer"
          >
            See More
          </div>
  
          <div className="font-medium pt-28">
            Who To Follow
            <div className="space-y-10 pt-8">
              {users &&
                users.length > 0 &&
                users.map((user1) => {
                  if (user1.id === user.id) {
                    return null;
                  } else {
                    return (
                      <ProfileCompo
                        key={user1.id}
                        onFollow={() => onFollow(user1.id, user.id)}
                        onUnFollow={() => onUnFollow(user1.id, user.id)}
                        userId={user1.id}
                        name={user1.name}
                        isFollowing={followingStatus.get(user1.id) || false}
                      />
                    );
                  }
                })}
            </div>
          </div>
        </div>
      </div>
    );
  };

