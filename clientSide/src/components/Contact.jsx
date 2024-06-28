import React from 'react'
import { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
export default function Contact({listing}) {
  const[landlord,setlandlord] = useState(null)
  const[message,setmessage]=useState('')
  
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res=await fetch(`/api/user/${listing.userRef}`);
        const data=await res.json();
        console.log(data)
        setlandlord(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchLandlord();
  },[listing.userRef])
  return (
    <>
    {landlord&&(
      <div className='flex flex-col gap-2'>
        <p>Contact <span className='font-semibold'>{landlord.username}</span> for 
        <span className='font-semibold'>new {listing.name.toLowerCase()}</span></p>
        <textarea placeholder='Enter Your Message here...' name='message' id='message'  
        rows='2' value={message} onChange={(e)=>setmessage(e.target.value)} className='w-full border p-3 rounded-lg
        '></textarea>
        <Link to={`mailto:${landlord.email}?Subject=Regarding the offer on ${listing.name}&body=${message}`}>
        <button className='bg-slate-700 text-white p-3 rounded-lg text-center uupercase w-full
        hover:opacity-95'>Send Message</button>
        </Link>
      </div>
    )}
    </>
  )
}
