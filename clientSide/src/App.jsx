import React from 'react'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import Home from "./pages/Home"
import Signin from "./pages/Signin"
import Signup from './pages/Signup'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import PrivateRoute from './components/privateRoute'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'

export default function App() {
  return (<BrowserRouter>
    <Header/> {/* add things in all sections */}
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/sign-in' element={<Signin />}/>
      <Route path='/sign-up' element={<Signup />}/>
      <Route path='/about' element={<About />}/>
      {/* 
        Nested Routing Setup:
        - The parent Route element={<PrivateRoute/>} indicates that any child routes, such as /profile,
          should be handled by PrivateRoute, which likely includes authentication or private route logic.
      */}
      <Route element={<PrivateRoute/>}>
        {/* 
          Child Route path='/profile' element={<Profile />}: 
          - When navigating to /profile, it's rendered within the context of PrivateRoute.
          - This setup ensures that accessing /profile triggers PrivateRoute to manage the route,
            typically involving authentication checks or other private route handling mechanisms.
        */}
        <Route path='/profile' element={<Profile />} />
        <Route path='/create-listing' element={<CreateListing />} />
        <Route path='/update-listing/:listingId' element={<UpdateListing />}/>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

