import axiosContext from "./axiosContent";
const createResponsable= (data) =>{
  return axiosContext.post('/responsable/add' , data)
}
const updateResponsable= (id , data) =>{
  return axiosContext.put(`/responsable/update/${id}` , data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
}
const getResponsable= () =>{
  return axiosContext.get(`/responsable/get`)
}

const getResponsableById= (id) =>{
  return axiosContext.get(`/responsable/get/${id}`)
}

const deleteResponsable= (id) =>{
  return axiosContext.delete(`/responsable/delete/${id}`)
}



export default {createResponsable , updateResponsable, getResponsable, getResponsableById , deleteResponsable};