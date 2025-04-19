import axiosContext from "./axiosContent";
const createSecteur= (data) =>{
  return axiosContext.post('/secteur/add' , data)
}
const updateSecteur= (id , data) =>{
  return axiosContext.put(`/secteur/update/${id}` , data)
}
const getSecteur= () =>{
  return axiosContext.get(`/secteur/get`)
}

const getSecteurById= (id) =>{
  return axiosContext.get(`/secteur/get/${id}`)
}

const deleteSecteur= (id) =>{
  return axiosContext.delete(`/secteur/delete/${id}`)
}



export default {createSecteur , updateSecteur, getSecteur, getSecteurById , deleteSecteur};