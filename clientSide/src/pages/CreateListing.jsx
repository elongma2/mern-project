import { getStorage,ref, uploadBytesResumable ,getDownloadURL} from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../firebase';
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
export default function CreateListing() {
    // State to hold selected files
    const[file,setfile]=useState([]);
    // State to hold form data, initially containing an empty array for image URLs
    const[formdata,setformdata]=useState({
        imageUrls:[],
        name:'',
        description:'',
        address:'',
        type:'rent',
        bathrooms:1,
        bedrooms:1,
        regularPrice:50,
        discountPrice:0,
        offer:false,
        furnished:false,
        parking:false

    });
     // State to hold any image upload errors
    const [imageuploaderror,setimageuploaderror]=useState(false);
     // State to indicate if the images are being uploaded
    const [upload,setupload]=useState(false);
    const [error,seterror]=useState(false);
    const[loading,setloading]=useState(false);
    const {currentUser}=useSelector((state)=>state.user);
    const navigate=useNavigate();
    
    console.log(formdata);
    const handleImageSubmit=(e)=>{
        // Check if there are files to upload and that the total number of images will be less than 6
        if(file.length>0 && file.length+formdata.imageUrls.length<6){
            setupload(true);// Set upload state to true
            setimageuploaderror(false);// Reset any previous upload errors
            const promises=[];
            
            // Loop through each file and push the promise returned by storeImage into the promises array
            for(let i=0;i<file.length;i++){
                promises.push(storeImage(file[i]));
            };

            // Wait for all image upload promises to resolve
            Promise.all(promises).then((urls)=>{
                // Update formData with the new image URLs
                setformdata({...formdata,
                    imageUrls:formdata.imageUrls.concat(urls)
                });
                // Handle any errors that occur during image upload
                setimageuploaderror(false);
                setupload(false);// Set upload state to false
                
            }).catch((error)=>{
                setimageuploaderror('Something went wrong with the image upload');
                
            });
        }
        else{
            // Handle the case where there are no files or more than 6 images
            setimageuploaderror('Upload only 6 images per listing');
            setupload(false);// Set upload state to false
        }
    }

    const storeImage=async (file)=>{
        return new Promise((res,rej)=>{
            const storage=getStorage(app);// Get Firebase Storage instance
            const fileName= new Date().getTime()+file.name; // Create a unique file name
            const storageRef=ref(storage,fileName);// Create a reference to the file in storage
            const uploadTask =uploadBytesResumable(storageRef,file);// Start the file upload

            // Monitor the upload progress
            uploadTask.on('state_changed',
                (snapshot)=>{
                    const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error)=>{
                    rej(error);// Reject the promise if an error occurs
                },
                ()=>{
                    // Get the download URL after the upload is complete
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                        res(downloadURL);// Resolve the promise with the download URL
                    });
                }
            )
        })
    };
    // Function to remove an image from formData by index
    const handleremoveimage=(index)=>{
        setformdata({...formdata,
            imageUrls:formdata.imageUrls.filter((_,i)=>i!==index)
        });
    }
    const handlechange=(e)=>{
        if(e.target.id ==='sale' || e.target.id ==='rent'){
            setformdata({...formdata,type:e.target.id});
        }
        if(e.target.id==='parking' || e.target.id==='furnished' || e.target.id==='offer'){
            setformdata({...formdata,[e.target.id]:e.target.checked});
        }

        if(e.target.type==='number' || e.target.type==='text' || e.target.type==='textarea'){
            setformdata({...formdata,[e.target.id]:e.target.value});
        }
    };

    const handleSubmit=async (e)=>{
        e.preventDefault();
        try {
            if(formdata.imageUrls.length<1){
                seterror('Please upload at least one image');
                return;
            }
            //use + so that it is always a integer
            if(+ formdata.regularPrice< + formdata.discountPrice){
                seterror('Discount price should be less than regular price');
                return;
            }

            setloading(true);
            seterror(false);
            //get data from backend api, pass in id so that data._id can be used to redirect
            const res=await fetch('api/listing/create', {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    ...formdata,
                    userRef:currentUser._id
                }),
            })
            const data=await res.json()
            setloading(false);
            
            if(data.success===false){
                seterror(data.message);
                setloading(false);
            }
            navigate(`/listing/${data._id}`);

        } catch (error) {
            seterror(error.message);
            setloading(false);
        }
    }
  return (
    <main className='p-3 max-w-4xl mx-auto '>
        <h1 className='text-3xl font-semibold text-center my-7'>
            Create a listing
        </h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-6'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type='text' placeholder='Name' className='border p-3 rounded-lg' id='name'
                maxLength='62' minLength='10' required onChange={handlechange} value={formdata.name}/>

                <textarea type='text' placeholder='Description' className='border p-3 rounded-lg' id='description'
                required onChange={handlechange} value={formdata.description}/>

                <input type='text' placeholder='Address' className='border p-3 rounded-lg' id='address' required
                onChange={handlechange} value={formdata.address}/>
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='sale' className='w-5' onChange={handlechange} 
                        checked={formdata.type==='sale'}/>
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='rent' className='w-5' onChange={handlechange} 
                        checked={formdata.type==='rent'}/>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='parking' className='w-5' onChange={handlechange} 
                        checked={formdata.parking}/>
                        <span>parking spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='furnished' className='w-5' onChange={handlechange} 
                        checked={formdata.furnished}/>
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='offer' className='w-5' onChange={handlechange} 
                        checked={formdata.offer}/>
                        <span>Offer</span>
                    </div>
                </div>

                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input className='border p-3 rounded-lg border-gray-300' type='number' id='bedrooms' min='1' max='10'
                         required onChange={handlechange} value={formdata.bedrooms}/>
                        <p>Beds</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input className='border p-3 rounded-lg border-gray-300' type='number' id='bathrooms' 
                        min='1' max='10' required onChange={handlechange} value={formdata.bathrooms}/>
                        <p>Baths</p>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input className='border p-3 rounded-lg border-gray-300' type='number' 
                        id='regularPrice' min='50' max='100000' required onChange={handlechange} 
                        value={formdata.regularPrice}/>

                        <div className='flex flex-col items-center'>
                            <p>Regular Price</p>
                            <span className='text-xs'>{formdata.type==='rent' ? '$ / Month' : ''}</span>
                        </div>
                    </div>
                    {formdata.offer && (
                            <div className='flex items-center gap-2'>
                            <input className='border p-3 rounded-lg border-gray-300' type='number' 
                            id='discountPrice' min='0' max='1000000' required onChange={handlechange} value={formdata.discountPrice}/>
                            <div className='flex flex-col items-center'>
                                <p>Discounted Price</p>
                            <span className='text-xs'>{formdata.type==='rent' ? '$ / Month' : ''}</span>
                            </div>
                        </div>
                    )}

                </div>
            </div>
            <div className='flex flex-col gap-5 flex-1 '>
                <p className='semi-bold'>Images:
                    <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                </p>

               <div className='flex gap-4'>
                    <input onChange={(e)=>setfile(e.target.files)} className="p-3 border border-gray-300 rounded w-full " type='file' id='images' accept='image/*' multiple/>
                    {/* use button, since wrap inside a form to prevent submission of the whole form, we just want to submit the file because an argument is used*/}
                    <button disabled={upload} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>
                        {upload? 'Uploading...':'Upload'}
                    </button>

               </div>
               <p className='text-red-700 text-sm'>{imageuploaderror && imageuploaderror}</p>
               {
                formdata.imageUrls.length>0 && formdata.imageUrls.map((url,index)=>(
                    <div key={index} className='flex justify-between p-3 border items-center '>
                        <img className='w-20 h-20 object-cotain rounded-lg' src={url} alt='listing image'  />
                        {/* callback function added so that the handleremoveimage does not occur when not clicked */}
                        <button type='button' onClick={()=>handleremoveimage(index)} className='p-3 text-red-700 uppercase rounded-lg hover:opacity-75'>Delete</button>
                    </div>
                ))
               }
               <button disabled={loading || upload} className='p-3 bg-slate-700 text-white 
               rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading? 'Creating...':'Create lsiting'}
               </button>
               {error && <p className='text-red-700 text-sm'>{error}</p>}
            </div>
            
        </form>
    </main>
  )
}
