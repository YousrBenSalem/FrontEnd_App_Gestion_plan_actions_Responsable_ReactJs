import axiosContext from "./axiosContent";
const createParticipant= (data) =>{
  return axiosContext.post('/user/add' , data)
}
const updateParticipant= (id , data) =>{
  return axiosContext.put(`/user/update/${id}` , data)
}
const getParticipant= () =>{
  return axiosContext.get(`/user/get`)
}

const getParticipantById= (id) =>{
  return axiosContext.get(`/user/get/${id}`)
}

const deleteParticipant= (id) =>{
  return axiosContext.delete(`/user/delete/${id}`)
}



export default {createParticipant , updateParticipant, getParticipant, getParticipantById , deleteParticipant};