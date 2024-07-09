export const NewBlog = () => {
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      };
  return (
    <div className="flex flex-col items-center">

        {/* APp bar */}
      <div className="flex   border-solid border-black h-[57px]  items-center w-[70%] m-auto pt-16">
        <div className="flex items-center mr-[40rem]">
          <div className="text-black font-body text-6xl font-extrabold ml-3 antialiased hover:subpixel-antialiased">
            Thought
          </div>
        </div>

        <div className="flex items-center w-[20%] space-x-7">
          <button className="bg-green-600 text-white rounded-full px-3 py-2 text-xs">
            Publish
          </button>

          <div className="Profile">
            <div className="rounded-full h-10 w-10 bg-black"></div>
          </div>
        </div>
      </div>


    {/* Form */}

    <div className="w-[70%] mt-48 pl-28">
    <textarea rows={1} onInput={handleInput}
  placeholder="Title"
  className=" focus:border-l-2 focus:border-gray-600 focus:outline-none text-gray-900 text-5xl  block p-2.5 resize-none w-[90%] font-body"
  
 
/>

        <textarea  id="editor" rows={1} onInput={handleInput} className=" focus:outline-none focus:border-l-2 focus:border-gray-600 mt-16 w-[90%]   text-gray-900   block p-2.5 resize-none  font-body text-2xl"
        placeholder="Tell Us your story" required />
    </div>



    </div>
  );
};
