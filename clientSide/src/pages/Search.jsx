import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import Listingitem from '../components/Listingitem';
export default function Search() {
    const navigate=useNavigate();
    const [sidebar,setsidebar]=useState({
        searchTerm:'',
        type:"all",
        parking:false,
        furnished:false,
        offer:false,
        sort:'created_at',
        order:'desc'
    })
    const[loading,setloading]=useState(false);
    const[listings,setlistings]=useState([]);
    

    useEffect(()=>{
        const urlParams=new URLSearchParams(location.search);
        const searchTermFromUrl=urlParams.get('searchTerm');
        const typeFromUrl=urlParams.get('type');
        const parkingFromUrl=urlParams.get('parking');
        const furnishedFromUrl=urlParams.get('furnished');
        const offerFromUrl=urlParams.get('offer');
        const sortFromUrl=urlParams.get('sort');
        const orderFromUrl=urlParams.get('order');
        if(searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || 
            offerFromUrl || sortFromUrl || orderFromUrl){
            setsidebar({
                ...sidebar,
                searchTerm:searchTermFromUrl || '',
                type:typeFromUrl || 'all',
                parking:parkingFromUrl==='true'? true: false,
                furnished:furnishedFromUrl==='true'? true: false,
                offer:offerFromUrl ==='true'? true: false,
                sort:sortFromUrl || 'createdAt',
                order:orderFromUrl || 'desc'
            })
        }
        const fetchlistings=async()=>{
            setloading(true);
            const searchquery=urlParams.toString();
            const res= await fetch(`/api/listing/get/?${searchquery}`);
            const data= await res.json();
            console.log(data)
            setlistings(data);
            setloading(false);
        }
        fetchlistings();
    },[location.search])



    

    const handlechange=(e)=>{
        if(e.target.id==='all' || e.target.id==='rent' || e.target.id==='sale'){
            setsidebar({...sidebar,type:e.target.id})
        }

        if(e.target.id==='searchTerm'){
            setsidebar({...sidebar,searchTerm:e.target.value})
        }

        if(e.target.id==='parking' || e.target.id==='furnished' || e.target.id==='offer'){
            setsidebar({...sidebar,[e.target.id]:e.target.checked || e.target.checked==='true' ? true : false})
        }

        if(e.target.id==='sort_order'){
            const sort=e.target.value.split('_')[0] || 'created_at';
            const order=e.target.value.split('_')[1] || 'desc';//use by mongoose
            setsidebar({...sidebar,sort,order})
        }
        //in the sort_order, we created terms such as createdAt_desc, createdAt_asc, etc.
        //this allows us to split thge string by _ and can set the sort and order based on the values, like order can be in asc or desc while sort can be regularPrice or createdAt
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        const urlParams=new URLSearchParams();
        urlParams.set('searchTerm',sidebar.searchTerm);
        urlParams.set('type',sidebar.type);
        urlParams.set('parking',sidebar.parking);
        urlParams.set('furnished',sidebar.furnished);
        urlParams.set('offer',sidebar.offer);
        urlParams.set('sort',sidebar.sort);
        urlParams.set('order',sidebar.order);
        const searchQuery=urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }



    
  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                <div className='flex items-center gap-2  '>
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <input type='text' id='searchTerm' placeholder='Search....' 
                    className='border rounded-lg p-3 w-full' value={sidebar.searchTerm} 
                    onChange={handlechange}/>
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='whitespace-nowrap font-semibold'>Type:</label>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='all' className='w-5' checked={sidebar.type==="all"} onChange={handlechange}/>
                        <span>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='rent' className='w-5' onChange={handlechange} 
                        checked={sidebar.type==="rent"}/>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='sale' className='w-5' onChange={handlechange} 
                        checked={sidebar.type==="sale"}/>
                        <span>Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='offer' className='w-5' checked={sidebar.offer} 
                        onChange={handlechange}/>
                        <span>Offer</span>
                    </div>
                </div>

                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='whitespace-nowrap font-semibold'>Amenities:</label>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='parking' className='w-5' onChange={handlechange}
                        checked={sidebar.parking}/>
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='furnished' className='w-5' onChange={handlechange} 
                        checked={sidebar.furnished}/>
                        <span>Furnished</span>
                    </div>
                </div>

                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap font-semibold'>Sort By:</label>
                    <select onChange={handlechange} defaultValue={'created_at_desc'} 
                    id='sort_order' className='border rounded-lg p-3'>
                        <option value='regularPrice_desc'>Price high to low</option>
                        <option value='regularPrice_asc'>Price low to high</option>
                        <option value='createdAt_desc'>Latest Listing</option>
                        <option value='createdAt_asc'>Oldest Listing</option>
                    </select>
                </div>
                <button className='bg-slate-700 text-white p-3 rounded-lg uppercase
                hover:opacity-95'>Search</button>
            </form>
        </div>

        <div className='flex-1'>
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing Results:</h1>
            <div className='flex flex-wrap gap-4'>
                {!loading &&listings.length===0 && (
                    <p className='text-xl text-slate-700 '>No listings found!</p>
                )}
                {
                    loading && (
                        <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
                    )
                }
                {
                    !loading && listings && listings.map((listing)=>{
                        return <Listingitem key={listing._id} listing={listing}/>
                    })
                }
            </div>
        </div>
    </div>
  )
}
