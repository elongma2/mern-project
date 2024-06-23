import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  // State variables to manage form data, errors, and loading state
  const [formdata, setFormdata] = useState({});
  const [error, setError] = useState(null);
  const [isloading, setIsloading] = useState(false);

  // React Router hook for navigation
  const navigate = useNavigate();

  // Function to update formdata state based on input changes
  const handleChange = (e) => {
    setFormdata({
      ...formdata,
      [e.target.id]: e.target.value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault();
    // Set loading state to true to show loading indicator
    setIsloading(true);

    try {
      // Make a POST request to '/api/auth/signup' with form data
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
      });

      // Parse response JSON
      const data = await res.json();
      console.log(data);

      // If signup is unsuccessful, set error and stop loading, .success and .message are taken from the API file,index.js
      // wherre it uses error from the signup funtion in authcontroller.js
      if (data.success === false) {
        setIsloading(false);
        setError(data.message);
        return;
      }

      // If signup is successful, clear error, stop loading, and navigate to sign-in page
      setIsloading(false);
      setError(null);
      navigate('/sign-in');

    } catch (error) {
      // If an error occurs during fetch or JSON parsing, set error and stop loading
      setIsloading(false);
      setError(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      {/* Sign Up form */}
      <h1 className='text-3xl text-center font-semibold my-7 '>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* Input fields for username, email, and password */}
        <input className='border p-3 rounded-lg' type='text' placeholder='username' id='username' onChange={handleChange} />
        <input className='border p-3 rounded-lg' type='email' placeholder='email' id='email' onChange={handleChange} />
        <input className='border p-3 rounded-lg' type='password' placeholder='password' id='password' onChange={handleChange} />
        {/* Submit button with loading state handling */}
        <button disabled={isloading} className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80'>
          {isloading ? 'loading...' : 'Sign Up'}
        </button>
      </form>
      
      {/* Link to sign-in page */}
      <div className='flex justify-between mt-5'>
        <p>Have an account?</p>
        <Link to='/sign-in'>
          <span className='text-blue-700 '>Sign in</span>
        </Link>
      </div>
      
      {/* Display error message if there is an error */}
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}
