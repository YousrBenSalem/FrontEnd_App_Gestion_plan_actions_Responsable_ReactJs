import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: null,
  tokens : null,
  isAuthentificated : false ,
  loading : false ,
  error : null ,
}

const authSlice = createSlice({
  name: 'auth',
  initialState : initialState ,
  reducers : {
    loginRequest(state , action) {
      state.loading = true ;
    }
    ,
    loginSuccess(state , action) {
      state.user = action.payload.user ;
      state.tokens = action.payload.tokens ;
      state.isAuthentificated = true ;
      state.loading = false ;
    }
    ,
    loginError(state , action) {
      state.error = action.payload.error ;
      state.loading = false ;
      state.user =null;
      state.tokens = null ;
      }, 
       logout(state , action){
    state.user = null ;
    state.tokens =null  ;
    state.isAuthentificated = false ;
    state.loading = false ;
    state.error = null ;

  }
  },

})
export const { loginRequest , loginSuccess , loginError , logout } = authSlice.actions ;
export default authSlice.reducer ;