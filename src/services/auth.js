import axiosContext from "./axiosContent";
const SignIn= (data) =>{
  return axiosContext.post('/personne/login' , data)
}

const Forgot= (email) =>{
  return axiosContext.post('/personne/forget' , email)
}

const Reset= (password , token) =>{
  return axiosContext.post(`/personne/reset/${token}` , password)
}
const logOut = (token) => {
  return axiosContext.post('/personne/logout', { 
    token // Envoyer le token dans le `body`
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

const UpdatePass= (id , Data) =>{
  return axiosContext.put(`/user/${id}` , Data)
}

export default {SignIn , Forgot,Reset,logOut, UpdatePass};