export const errorHandle=(statuscode,message)=>{
    const error=new Error()
    error.statuscode=statuscode// Create a new Error object with the specified message and statuscode
    error.message=message;
    return error;
}

//custom error, send this error to the index.js file