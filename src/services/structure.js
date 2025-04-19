import axiosContext from "./axiosContent";
const createStructure= (data) =>{
  return axiosContext.post('/structure/add' , data)
}
const updateStructure= (id , data) =>{
  return axiosContext.put(`/structure/update/${id}` , data)
}
const getStructure= () =>{
  return axiosContext.get(`/structure/get`)
}

const getStructureById= (id) =>{
  return axiosContext.get(`/structure/get/${id}`)
}

const deleteStructure= (id) =>{
  return axiosContext.delete(`/structure/delete/${id}`)
}



export default {createStructure , updateStructure, getStructure, getStructureById , deleteStructure};