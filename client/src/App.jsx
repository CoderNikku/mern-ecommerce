import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { store, persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from 'react-redux'
import Home from './components/home'
import Blog from './components/blog'
import About from './components/about'
import Contact from './components/contact'
import ShowBlog from './components/showblog'
import Product from './components/product'
import ShowProduct from './components/showproduct'
import YourItem from './components/youritem'




// import user comonent
import UserSignIn from './components/user/usersignin'
import UserLogin from './components/user/userlogin'
import UserBlog from './components/user/userblog'
import Profile from './components/user/profile'
import UpdateUserBlog from './components/user/updateuserBlog'
import ViewUserBlog from './components/user/viewUserBlog'

// admin component import 
import NewBlog from './components/admin/newblog'
import Mypost from './components/admin/mypost'
import Post from './components/admin/post'
import Admin from './components/admin/admin'
import Addminaddproduct from './components/admin/adminaddproduct'
import AdminSignin from'./components/admin/adminSignIn'
import AddminLogin from './components/admin/addminlogin'
import AdminpostUpdate from './components/admin/postupdate'
import AdminProduct from './components/admin/adminProduct'
import AdminShowProduct from './components/admin/adminshowProduct'
import { Nav } from 'react-bootstrap'




const ProtectedRoute = ({ children }) => {
  // Check if user is logged in by looking at localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // If no user is found, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  // If user exists, render the protected component (e.g., Profile)
  return children;
};

const AdminProtect = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem("admin"));

  if (!admin) {
    return <Navigate to="/adminlogin" replace />;
  }
  return children;
}
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/nav' element={<Nav />} />
            <Route path='/blog' element={<Blog />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/blog' element={<Blog />} />
            <Route path='/showblog/:id' element={<ShowBlog/>}/>
            <Route path='/product' element={<Product />} />
            <Route path='/showproduct/:id' element={<ShowProduct/>}/>

            {/* User Routes */}
            <Route path='/signin' element={<UserSignIn />} />
            <Route path='/login' element={<UserLogin />} />
            <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path='/userBlog' element={<UserBlog />} />
            <Route path='/userupdateBlog/:id' element={<UpdateUserBlog />} />
            <Route path='/viewUserblog/:id' element={<ViewUserBlog />} />


            {/* Admin Routes */}
            <Route path='/admin' element={<AdminProtect><Admin /></AdminProtect>} />
            <Route path='/adminlogin' element={<AddminLogin />} />
            <Route path='/adminsignin' element={<AdminSignin />} />
            <Route path='/newblog' element={<NewBlog />} />
            <Route path='/mypost' element={<Mypost />} />
            <Route path='/post/:id' element={<Post />} />
            <Route path='adminpostupdate/:id' element={<AdminpostUpdate />} />
            <Route path='addminaddproduct/' element={<Addminaddproduct />} />
            <Route path='adminproduct/' element={<AdminProduct />} />
            <Route path="/adminshowproduct/:id" element={<AdminShowProduct />} />
            <Route path='/youritem' element={<YourItem />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )
}
export default App
