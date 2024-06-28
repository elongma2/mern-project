
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {Swiper,SwiperSlide} from 'swiper/react'
import { Navigation} from 'swiper/modules';
import  SwiperCore  from 'swiper';
import 'swiper/css/bundle'
export default function Listed() {
  SwiperCore.use([Navigation]);
  const [listing,setlisting]=useState(null);
  const[loading,setloading]=useState(false);
  const[error,seterror]=useState(false);
  const params=useParams();
    useEffect(() => {
        const fetchlisting =async()=>{
          const listingid=params.listingId;
          console.log("Listing ID:", listingid);
          try {
            const res=await fetch(`/api/listing/get/${listingid}`);
            const data = await res.json();
            if(data.success===false){
              seterror(true);
              setloading(false);
              return;
            }
            setlisting(data);
            setloading(false);
            seterror(false);
          } catch (error) {
            seterror(true);
            setloading(false);
          }
      }
      fetchlisting();
  }, [params.listingId])
  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className='text-center my-7 text-2xl'>Something When Wrong</p>}
      {listing && !loading && !error && (
        <>
          <Swiper navigation>
            {listing.imageUrls.map((url)=>(
              <SwiperSlide key={url}>
                <div className='h-[550px]' style={{background:`url(${url}) center no-repeat`,
                backgroundSize:'cover'}}>
                    
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </main>
  )
}
