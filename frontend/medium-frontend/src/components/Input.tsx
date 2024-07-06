import React from "react";

interface InputBoxProps {
    label: string; // The label text displayed above the input
    placeholder?: string; // Optional placeholder text for the input
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Event handler for input change
  }

export const InputBox1 = ({onChange,label,placeholder}:InputBoxProps)=>{

    return <div>
        <div className="text-sm font-medium text-left py-2">
          {label}
        </div>
        
        <input onChange={onChange} placeholder={placeholder} type="text" className=" w-full px-2 py-1 border rounded-md focus:outline-black" />
    </div>
}