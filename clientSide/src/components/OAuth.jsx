import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth";
import { app } from '../firebase';
import { useDispatch} from 'react-redux';
import { signinSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
export default function OAuth() {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const handleGoogleclick =async() => {
    try {
      const provider=new GoogleAuthProvider()
      const auth=getAuth(app)//import app from the firebase.js
      const result=await signInWithPopup(auth,provider)
      //console.log(result)
      const res=await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name:result.user.displayName,
                              email: result.user.email,
                              photo:result.user.photoURL})
                          });
                          
      const data=await res.json()
      console.log(data)
      dispatch(signinSuccess(data))
      navigate('/')
    } catch (error) {
      console.log("could not sign in with google",error)
    }
  }
  return (
    <button onClick={handleGoogleclick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
    >Continue with Google</button>
  )
}
