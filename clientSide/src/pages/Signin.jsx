import React from 'react'
import {Link} from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { signinStart,signinSuccess,signinFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function Signin() {
  const [formdata,setFormdata]=useState({});
  const {loading,error}=useSelector((state)=>state.user);//ensure same name as the store.js reducer key
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const handleChange=(e)=>{
      setFormdata({...formdata,
        [e.target.id]:e.target.value});
  };
  //links to backend 
  const handleSubmit=async (e)=>{
    dispatch(signinStart());
    e.preventDefault();
    try {
      const res=await fetch('/api/auth/signin',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formdata)
      })
      const data=await res.json();
      console.log(data)

      if(data.success===false){
        dispatch(signinFailure(data.message));
        return;
      }
      
      dispatch(signinSuccess(data));
      navigate('/')

    } catch (error) {
      dispatch(signinFailure(error.message));
    }
  }
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7 '>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input className='border p-3 rounded-lg' type='email' placeholder='email' id='email'onChange={handleChange}/>
        <input className='border p-3 rounded-lg' type='password' placeholder='password' id='password'onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 
        disabled:opacity-80'>{loading?'loading...':'Sign Up'}</button>
        <OAuth/>
      </form>
      <div className='flex justify-between mt-5'>
        <p>Do not have an account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-700 '>Sign In</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}