import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/user/userSlice.js'
import { deleteUserFailure, deleteUserStart, deleteUserSuccess } from '../redux/user/userSlice.js'
import { signOutUserFailure, signOutUserStart, signOutUserSuccess } from '../redux/user/userSlice.js'
import { useDispatch } from 'react-redux'
//just follow the steps/instructions from this code
export default function Profile() {
  const fileref = useRef(null); // useRef to store a reference to file input element
  const { currentUser,loading,error } = useSelector((state) => state.user); // Redux: get current user from state
  const [file, setFile] = useState(undefined); // State to hold selected file
  const [filePerc, setFilePerc] = useState(0); // State to track file upload progress percentage
  const [fileUploadError, setFileUploadError] = useState(false); // State to handle file upload errors
  const [formData, setFormData] = useState({}); // State to hold form data including uploaded file URL
  const [updateSuccess,setUpdateSucess]=useState(false);
  const dispatch = useDispatch();
 /*  useEffect(() => {
    // Retrieve avatar URL from local storage on component mount
    const savedAvatar = localStorage.getItem('avatar');
    if (savedAvatar) {
      setFormData({ avatar: savedAvatar });
    }
  }, []); */

  useEffect(() => {
    if (file) {
      handleFileUpload(file); // Call handleFileUpload when 'file' state changes
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const storage = getStorage(app); // Initialize Firebase storage with the app instance
    const filename = new Date().getTime() + file.name; // Generate a unique filename
    const storageRef = ref(storage, 'images/' + filename); // Create a reference to storage location
    const uploadTask = uploadBytesResumable(storageRef, file); // Upload the file
    
    // Track upload progress
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress, 2)); // Update upload progress percentage
      },
      (error) => {
        setFileUploadError(true); // Handle upload errors
      },
      () => {
        // Upload complete, get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL }); // Update form data with uploaded file URL
          /* localStorage.setItem('avatar', downloadURL); */
        });
      }
    );
  };
  // Comments explaining snapshot:
//
// - `snapshot`: Represents the current state of a Firebase Storage operation.
// - Inside the `state_changed` event listener, `snapshot` provides real-time information
//   about the progress of the file upload, including `bytesTransferred` (amount of data
//   uploaded so far) and `totalBytes` (total size of the file being uploaded).
// - This information allows us to calculate and update the upload progress percentage
//   (`(snapshot.bytesTransferred / snapshot.totalBytes) * 100`) to provide feedback to the user.
// - After the upload completes, `snapshot` can also provide access to the reference (`ref`)
//   of the uploaded file, which is used to retrieve the download URL (`getDownloadURL`).

  const handlechange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method:'POST',  // PATCH request is used to update a resource
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data=await res.json();
      console.log(data);
      if(data.success===false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSucess(true);
      
    } catch (error) { 
      dispatch(updateUserFailure(error.message));
    }
  }
  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res=await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      });
      const data=await res.json();
      if(data.success===false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res=await fetch('api/auth/signout');
      const data=await res.json();
      if(data.success===false){
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto' >
      <h1 className='text-3xl font-semibold my-7 text-center'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        <input onChange={(e)=>setFile(e.target.files[0])}/* use [0] to get the first file in case of multiple files */ type='file' ref={fileref} hidden accept='image/*'/>{/*file upload only accept image */}
        <img onClick={()=>fileref.current.click()} className='w-24 h-24 rounded-full object-cover cursor-pointer mt-2 self-center' 
        src={formData?.avatar || currentUser.avatar} alt="profile"/>

        <p className='text-sm self-center'>
          {fileUploadError ? 
         ( <span className='text-red-700'>Error upload image</span>) :
          filePerc>0 && filePerc<100 ? 
          (<span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>) :
          filePerc===100 ? (<span className='text-green-700'>sucessfully uploaded</span>) : " "}
        </p>

        <input type="text" className='border p-3 
        rounded-lg' placeholder='username' id='username' defaultValue={currentUser.username} onChange={handlechange}/>
        <input type="email" className='border p-3 
        rounded-lg' placeholder='email' id='email' defaultValue={currentUser.email} onChange={handlechange}/> 
        <input type="password" className='border p-3 
        rounded-lg' placeholder='password' id='password' onChange={handlechange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 
        disabled:opacity-80'>{loading ? "Loading..." : "Update"}</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDelete} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{error? error :''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess? 'Updated Successfully' :''}</p>
    </div>
  )
}
