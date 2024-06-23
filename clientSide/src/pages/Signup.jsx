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
  // Function to handle form submission
const handleSubmit = async (e) => {
  // Set loading state to true to indicate submission in progress
  setIsloading(true);
  e.preventDefault(); // Prevent the default form submission behavior
  
  try {
      // Send a POST request to the backend endpoint for user signup
      const res = await fetch('/api/auth/signup', {
          method: 'POST', // Specify the request method as POST
          headers: {
              'Content-Type': 'application/json' // Set the request content type to JSON
          },
          body: JSON.stringify(formdata) // Convert form data to JSON string
      });

      // Parse the JSON response from the backend
      const data = await res.json();

      // Check if the backend response indicates a failure
      if (data.success === false) {
          setIsloading(false); // Stop the loading state
          setError(data.message); // Set the error state with the message from the backend,.message and .sucess is from backend file index.js
          return; // Exit the function early since the request failed
      }

      // If the signup is successful, stop the loading state and clear any error messages
      setIsloading(false);
      setError(null);
      // Navigate to the sign-in page after successful signup
      navigate('/sign-in');
  } catch (error) {
      // Handle any unexpected errors (e.g., network issues, unexpected backend errors)
      setIsloading(false); // Stop the loading state
      setError(error.message); // Set the error state with the error message
      console.error('Unexpected error:', error); // Log the unexpected error for debugging
  }
};

  
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
