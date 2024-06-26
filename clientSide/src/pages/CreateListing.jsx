import { getStorage,ref, uploadBytesResumable ,getDownloadURL} from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../firebase';

export default function CreateListing() {
    // State to hold selected files
    const[file,setfile]=useState([]);
    // State to hold form data, initially containing an empty array for image URLs
    const[formdata,setformdata]=useState({
        imageUrls:[],

    });
     // State to hold any image upload errors
    const [imageuploaderror,setimageuploaderror]=useState(false);
     // State to indicate if the images are being uploaded
    const [upload,setupload]=useState(false);
    
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
    
  return (
    <main className='p-3 max-w-4xl mx-auto '>
        <h1 className='text-3xl font-semibold text-center my-7'>
            Create a listing
        </h1>
        <form className='flex flex-col sm:flex-row gap-6'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type='text' placeholder='Name' className='border p-3 rounded-lg' id='name'
                maxLength='62' minLength='10' required/>
                <textarea type='text' placeholder='Description' className='border p-3 rounded-lg' id='description'
                required/>
                <input type='text' placeholder='Address' className='border p-3 rounded-lg' id='adress' required/>
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='sale' className='w-5'/>
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='rent' className='w-5'/>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='parking' className='w-5'/>
                        <span>parking spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='furnished' className='w-5'/>
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='offer' className='w-5'/>
                        <span>Offer</span>
                    </div>
                </div>

                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input className='border p-3 rounded-lg border-gray-300' type='number' id='bedrooms' min='1' max='10' required/>
                        <p>Beds</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input className='border p-3 rounded-lg border-gray-300' type='number' id='bathrooms' min='1' max='10' required/>
                        <p>Baths</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input className='border p-3 rounded-lg border-gray-300' type='number' id='regularPrice' min='1' max='10' required/>
                        <div className='flex flex-col items-center'>
                            <p>Regular Price</p>
                            <span className='text-xs'>($/month)</span>
                        </div>
                        
                    </div>
                    <div className='flex items-center gap-2'>
                        <input className='border p-3 rounded-lg border-gray-300' type='number' id='discountPrice' min='1' max='10' required/>
                        <div className='flex flex-col items-center'>
                            <p>Disocunted Price</p>
                            <span className='text-xs'>($/month)</span>
                        </div>
                    </div>
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
               <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
            </div>
            
        </form>
    </main>
  )
}
