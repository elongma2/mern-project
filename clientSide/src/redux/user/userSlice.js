import {createSlice} from '@reduxjs/toolkit'


const initialState = {
    currentUser:null,
    error:null,
    loading:false
};

const userSlice = createSlice({
    name:'users',
    initialState,
    reducers:{
        signinStart:(state)=>{
            state.loading = true
        },
        signinSuccess:(state,action)=>{
            state.currentUser = action.payload//data we recieve from fetch
            state.loading = false
            state.error=null;
        },
        signinFailure:(state,action)=>{
            state.error = action.payload
            state.loading = false
        },
    }
});

export const {signinStart,signinSuccess,signinFailure} = userSlice.actions
export default userSlice.reducer
    
    