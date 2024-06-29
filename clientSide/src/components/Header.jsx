import React, { useEffect } from 'react'
import {FaSearch} from 'react-icons/fa'//import react icons
import { Link } from 'react-router-dom'//allow u to change different paths
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
export default function Header() {
    const {currentUser}=useSelector((state)=>state.user)//using the current user from slice redux
    const[searchTerm,setsearchTerm]=useState('');
    const navigate=useNavigate();
    const handleSubmit=(e)=>{
        e.preventDefault();
        const urlParams=new URLSearchParams(window.location.search);
        urlParams.set('searchTerm',searchTerm);
        const searchQuery=urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    useEffect(() => {
        const urlParams=new URLSearchParams(location.search);
        const searchTermFromUrl=urlParams.get('searchTerm');
        if(searchTermFromUrl) {
            setsearchTerm(searchTermFromUrl);
        }
    },[location.search])

  return (
    <header className='bg-slate-200 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
            <Link to='/'>
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap '>
                <span className='text-slate-500'>Joshua</span>
                <span className='text-slate-700'>Estate</span>
            </h1>
            </Link>
            <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-baseline'>

                <input type='text' placeholder='Search....' 
                className='bg-transparent focus:outline-none w-24 sm:w-64' 
                onChange={(e)=>setsearchTerm(e.target.value)} value={searchTerm}/>

                <button>
                    <FaSearch className='text-slate-600' />
                </button>
               
            </form>
            <ul className='flex gap-4'>
                <Link to='/'>
                    <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
                </Link>
                <Link to='/about'>
                    <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
                </Link>
              
                <Link to='/profile'>
                {currentUser? (<img className='w-7 h-7 rounded-full object-cover' src={currentUser.avatar} alt='profile'/>) : <li className=' text-slate-700 hover:underline'>Sign in</li>}
                </Link>
            </ul>
        </div>
    </header>
  )
}
