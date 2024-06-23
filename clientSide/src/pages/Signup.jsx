import React from 'react'
import {Link} from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [formdata,setFormdata]=useState({});
  const [error,setError]=useState(null);
  const [isloading,setIsloading]=useState(false);
  const navigate=useNavigate();
  const handleChange=(e)=>{
      setFormdata({...formdata,
        [e.target.id]:e.target.value});
  };
  //links to backend 
  const handleSubmit=async (e)=>{
    setIsloading(true);
    e.preventDefault();
    try {
      const res=await fetch('/api/auth/signup',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formdata)
      })
      const data=await res.json();
      console.log(data)
      if(data.success===false){
        setIsloading(false);
        setError(data.message);
        return;
      }
      
      setIsloading(false);
      setError(null);
      navigate('/sign-in')

    } catch (error) {
      setIsloading(false);
      setError(error.message);
    }
  }
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7 '>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input className='border p-3 rounded-lg' type='text' placeholder='username' id='username'onChange={handleChange}/>
        <input className='border p-3 rounded-lg' type='email' placeholder='email' id='email'onChange={handleChange}/>
        <input className='border p-3 rounded-lg' type='password' placeholder='password' id='password'onChange={handleChange}/>
        <button disabled={isloading} className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80'>{isloading?'loading...':'Sign Up'}</button>
      </form>
      <div className='flex justify-between mt-5'>
        <p>Have an account?</p>
        <Link to='/sign-in'>
          <span className='text-blue-700 '>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}