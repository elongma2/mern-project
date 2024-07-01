import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import {Swiper,SwiperSlide} from 'swiper/react'
import { Navigation} from 'swiper/modules';
import  SwiperCore  from 'swiper';
import 'swiper/css/bundle'
import Listingitem from '../components/Listingitem';
export default function Home() {
  const[offerlisting,setofferlisting]=useState([]);
  const[salelisting,setsalelisting]=useState([]);
  const[rentlisting,setrentlisting]=useState([]);
  SwiperCore.use([Navigation]);
  

  useEffect(() => {
      const fetchofferlisting=async()=>{
        try {
          const res=await fetch('api/listing/get?offer=true&limit=3');
          const data=await res.json()
          
          setofferlisting(data)
          fetchrentlisting()
        } catch (error) {
          console.log(error)
        }
      }
      const fetchrentlisting=async()=>{
        try {
          const res=await fetch('api/listing/get?type=rent&limit=3');
          const data=await res.json()
          setrentlisting(data)
          fetchsalelisting()
        } catch (error) {
          console.log(error)
        }
      }
      const fetchsalelisting=async()=>{
        try {
          const res=await fetch('api/listing/get?type=sale&limit=3');
          const data=await res.json()
          console.log(data)
          setsalelisting(data);
        } catch (error) {
          console.log(error)
        }
    }

    fetchofferlisting()
},[])

  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto'>
          <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
            Find your next <span className='text-slate-500'>perfect</span> 
            <br/>
            place with ease
          </h1>
          <div className='text-gray-400 text-xs sm:text-sm'>
            Joshua estate is the best place to find your next perfect place to live.
            <br/>
            we have a wide range of properties for you to choose from.
          </div>
          <Link className='text-xs sm:text-sm text-blue-800 font-bold hover:underline' to={('/search')}>
            Lets's get started now....
          </Link>
      </div>


      {/* swiper */}
      <Swiper navigation>
        {
         salelisting&&salelisting.length>1 && 
         salelisting.map((listing)=>{
           return <SwiperSlide>
              <div style={{ background: `url(${listing.imageUrls[0]}) center no-repeat`,backgroundSize: 'cover' }}
               className='h-[500px]' key={listing._id}></div>
            </SwiperSlide>
          })
        }
      </Swiper>
      



      {/* listing results for offer, sale and rent */}

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {
          offerlisting.length>0 && offerlisting && (
            <div className=''>
                <div>
                  <h2 className='text-2xl font-semibold text-slate-600'>Recent Offers</h2>
                  <Link className='text-sm text-blue-800 font-bold hover:underline' to={'search?offer=true'}>
                    Show More Offers
                  </Link>
                </div>
                <div className='flex flex-wrap gap-4'>
                  {
                    offerlisting.map((listing)=>{
                      return <Listingitem listing={listing} key={listing._id}/>
                    })
                  }
                </div>
            </div>
          )
        }
        {
         rentlisting.length>0 &&rentlisting && (
            <div className=''>
                <div>
                  <h2 className='text-2xl font-semibold text-slate-600'>Recent Places For Rent</h2>
                  <Link className='text-sm text-blue-800 font-bold hover:underline' to={'search?type=rent'}>
                    Show More Offers
                  </Link>
                </div>
                <div className='flex flex-wrap gap-4'>
                  {
                   rentlisting.map((listing)=>{
                      return <Listingitem listing={listing} key={listing._id}/>
                    })
                  }
                </div>
            </div>
          )
        }
        {
          salelisting.length>0 && salelisting && (
            <div className=''>
                <div>
                  <h2 className='text-2xl font-semibold text-slate-600'>Recent Offers for Sale</h2>
                  <Link className='text-sm text-blue-800 font-bold hover:underline' to={'search?type=sale'}>
                    Show More Offers
                  </Link>
                </div>
                <div className='flex flex-wrap gap-4'>
                  {
                    salelisting.map((listing)=>{
                      return <Listingitem listing={listing} key={listing._id}/>
                    })
                  }
                </div>
            </div>
          )
        }
       
      </div>
    </div>
  )
}
