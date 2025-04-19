import axiosContext from "./axiosContent";
const createActivite= (data) =>{
  return axiosContext.post('/activite/add' , data)
}
const updateActivite= (id , data) =>{
  return axiosContext.put(`/activite/update/${id}` , data)
}
const getActivite= () =>{
  return axiosContext.get(`/activite/get`)
}

const getActiviteById= (id) =>{
  return axiosContext.get(`/activite/get/${id}`)
}

const deleteActivite= (id) =>{
  return axiosContext.delete(`/activite/delete/${id}`)
}



export default {createActivite , updateActivite, getActivite, getActiviteById , deleteActivite};