import axiosContext from "./axiosContent";
const createTache= (data) =>{
  return axiosContext.post('/tache/add' , data, {
      headers: {
          "Content-Type": "multipart/form-data"
      }
  })
}
const updateTache= (id , data) =>{
  return axiosContext.put(`/tache/update/${id}` , data)
}
const getTache= () =>{
  return axiosContext.get(`/tache/get`)
}

const getTacheById= (id) =>{
  return axiosContext.get(`/tache/get/${id}`)
}

const deleteTache= (id) =>{
  return axiosContext.delete(`/tache/delete/${id}`)
}



export default {createTache , updateTache, getTache, getTacheById , deleteTache};