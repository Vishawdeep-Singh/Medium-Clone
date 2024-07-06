import React from "react";



interface HeaderProps {
    label: string; // Define 'label' as a required string prop
  }
export const Header:React.FC<HeaderProps>=({label})=>{


    return <div className="font-extrabold text-4xl pt-6">
        {label}
    </div>
}