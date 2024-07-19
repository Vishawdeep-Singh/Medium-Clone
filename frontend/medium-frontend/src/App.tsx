import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'
import { Blog } from './pages/Blog'
import { NewBlog } from './pages/New-Blog'
import { BlogInfo } from './pages/Blog-Info'
import { ProfileInfo } from './pages/Profile-Info'
import { ExploreTags } from './pages/MoreTags'
import { TagPosts } from './pages/TagPosts'
import { SearchPosts } from './pages/searchPost'
import { RecoilRoot } from 'recoil'
import { Sidebar } from './components/Sidebar'
import { MobileSideBar } from './pages/MobileSidebar'
// import { Signin } from './pages/Signin'
// import { Blog } from './pages/Blog'

function App() {

  return (
    <>
       <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/new-blog" element={<NewBlog />} />
          <Route path="/blog-info/:postId1" element={<BlogInfo />} />
          <Route path='/userInfo/:userId1' element={<ProfileInfo />} />
          <Route path='/explore-topics' element={<ExploreTags />} />
          <Route path='/tag/:tagName' element={<TagPosts />} />
          <Route path='/search' element={<SearchPosts />} />
          <Route path='/side' element={<MobileSideBar />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
    </>
  )
}

export default App
