import axiosContext from "./axiosContent";
const createSousActivite= (data) =>{
  return axiosContext.post('/SousActivite/add' , data)
}
const updateSousActivite= (id , data) =>{
  return axiosContext.put(`/SousActivite/update/${id}` , data)
}
const getSousActivite= () =>{
  return axiosContext.get(`/SousActivite/get`)
}

const getSousActiviteById= (id) =>{
  return axiosContext.get(`/SousActivite/get/${id}`)
}

const deleteSousActivite= (id) =>{
  return axiosContext.delete(`/SousActivite/delete/${id}`)
}



export default {createSousActivite , updateSousActivite, getSousActivite, getSousActiviteById , deleteSousActivite};