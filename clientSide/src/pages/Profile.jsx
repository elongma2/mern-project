import React from 'react'
import { useSelector } from 'react-redux'
export default function Profile() {
  const {currentUser}=useSelector((state)=>state.user)//using the current user from slice redux
  return (
    <div className='p-3 max-w-lg mx-auto' >
      <h1 className='text-3xl font-semibold my-7 text-center'>Profile</h1>
      <form className='flex flex-col gap-4 '>
        <img className='w-24 h-24 rounded-full object-cover cursor-pointer mt-2 self-center' src={currentUser.avatar} alt="profile"/>
        <input type="text" className='border p-3 
        rounded-lg' placeholder='username' id='username'/>
        <input type="email" className='border p-3 
        rounded-lg' placeholder='email' id='email'/> 
        <input type="text" className='border p-3 
        rounded-lg' placeholder='password' id='password'/>
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 
        disabled:opacity-80'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
