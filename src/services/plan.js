import axiosContext from "./axiosContent";
const createPlan= (data) =>{
  return axiosContext.post('/plan/add' , data)
}
const updatePlan= (id , data) =>{
  return axiosContext.put(`/plan/update/${id}` , data)
}
const updatePlanStatus = async (planId, updatedData) => {
 return axiosContext.put(`/plan/update/${planId}`, updatedData);
};
const getPlan= () =>{
  return axiosContext.get(`/plan/get`)
}

const getPlanById= (id) =>{
  return axiosContext.get(`/plan/get/${id}`)
}

const deletePlan= (id) =>{
  return axiosContext.delete(`/plan/delete/${id}`)
}



export default {createPlan , updatePlan, getPlan, getPlanById , deletePlan, updatePlanStatus};