import React, { useState, useEffect } from 'react';
import dragula from 'react-dragula';
import {  FaCalendarAlt, FaClipboardList } from "react-icons/fa"; 
import { Offcanvas } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import plan from '../../services/plan';

function Plan() {
    const { StructureId } = useParams(); // 
console.log("id de structure dans la page de plan" , StructureId)
  const [showSidebar, setShowSidebar] = useState(false);
  const [Data, setData] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null); 

  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = (plan) => {
    setSelectedPlan(plan);  // Met à jour l'état du plan sélectionné
    setShowSidebar(true);
  };


  const getPlan = async () => {
    try {
      const res = await plan.getPlan();
      console.log('id de structure' , StructureId)
      const allPlans = res?.data?.data;
      console.log("touts les plans ",allPlans)
  const filtredPlan = allPlans?.filter(plan => plan?.structureId && plan.structureId.includes(StructureId));


      setData(filtredPlan);
      console.log("Plans récupérés avec succès:", filtredPlan);
    } catch (error) {
      console.error("Erreur lors de la récupération des plans :", error);
    }
  };

  useEffect(() => {
    getPlan();
  }, [StructureId]);

  // Filtrer les plans acceptables et les répartir par état
  const filteredPlans = Data?.filter(plan => plan.status === "Acceptable");

  const plansToDo = filteredPlans?.filter(plan => plan.etat === "To Do");
  const plansInProgress = filteredPlans?.filter(plan => plan.etat === "En cours");
  const plansDone = filteredPlans?.filter(plan => plan.etat !== "To Do" && plan.etat !== "En cours");

    // Fonction pour mettre à jour l'état du plan dans la base de données
  const updatePlanStatus = async (planId, newStatus) => {
    try {
      await plan.updatePlanStatus(planId, { etat: newStatus });  // Appel à ton API pour mettre à jour l'état
      console.log(`Le plan ${planId} a été mis à jour avec l'état: ${newStatus}`);
      getPlan();  // Rafraîchir la liste des plans après la mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'état du plan:", error);
    }
  };
    // Fonction pour supprimer un plan
  const deletePlan = async (planId) => {
    try {
      await plan.deletePlan(planId);
      console.log(`Le plan ${planId} a été supprimé.`);
      getPlan(); // Rafraîchir les données des plans
      handleCloseSidebar(); // Fermer le sidebar après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression du plan :", error);
    }
  };
    // Fonction pour mettre à jour le plan dans la base de données
  const updatePlan = async (planId, updatedData) => {
    try {
      await plan.updatePlan(planId, updatedData);
      console.log(`Le plan ${planId} a été mis à jour.`);
      getPlan(); // Rafraîchir les données des plans
      handleCloseSidebar(); // Fermer le sidebar après mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour du plan :", error);
    }
  };
useEffect(() => {
  const containers = [
    document.querySelector('#to-do'),
    document.querySelector('#in-progress'),
    document.querySelector('#done'),
  ].filter(Boolean);
  if (containers.length === 0) return;

  const drake = dragula(containers);

  drake.on('drop', (el, target) => {
    if (target && target.contains(el)) {
      // Effectuer la mise à jour seulement si le parent contient bien l'élément
      const planId = el.dataset.planId;
      const newStatus = target.id;

      if (planId && newStatus) {
        let updatedStatus = "";
        if (newStatus === "to-do") {
          updatedStatus = "To Do";
        } else if (newStatus === "in-progress") {
          updatedStatus = "En cours";
        } else if (newStatus === "done") {
          updatedStatus = "Done";
        }
        updatePlanStatus(planId, updatedStatus);
      }
    }
  });

  // Fonction de nettoyage
  return () => {
    drake.destroy();  // Nettoyer l'instance de dragula lors du démontage du composant
  };
}, []);


  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Plan d'action</li>
        </ol>
      </nav>

      <div className="row  ">
        {/* To Do */}
        <Column title="To Do" structureId= {StructureId} id="to-do" plans={plansToDo} handleShowSidebar={handleShowSidebar} />
        
        {/* In Progress */}
        <Column title="In Progress" id="in-progress" structureId= {StructureId} plans={plansInProgress} handleShowSidebar={handleShowSidebar} />

        {/* Done */}
        <Column title="Done" structureId= {StructureId} id="done" plans={plansDone} handleShowSidebar={handleShowSidebar} />
      </div>

      {/* Sidebar */}
    <Offcanvas show={showSidebar} onHide={handleCloseSidebar} placement="end" className="w-25">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Mise à jour duPlan - {selectedPlan?.titre}</Offcanvas.Title>
        </Offcanvas.Header>
        <hr class="my-0" />

        <Offcanvas.Body>
          {selectedPlan && (
            <>
              <form>
                <div className="mb-3">
                  <label className="form-label">Titre</label>
                  <input 
                    className="form-control"
                    value={selectedPlan?.titre}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, titre: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-control"
                    value={selectedPlan?.description}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, description: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date creation</label>
                  <input 
                    className="form-control"
                    value={selectedPlan?.date_creation}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, date_creation: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date validation</label>
                  <input 
                    className="form-control"
                    value={selectedPlan?.date_validation}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, date_validation: e.target.value })}
                  />
                </div>
            

                <div className="">
                  <button type="button" className="btn btn-primary m-3" onClick={() => updatePlan(selectedPlan._id, selectedPlan)}>
                    Update
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => deletePlan(selectedPlan._id)}>
                    Delete
                  </button>
                </div>
              </form>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

// Composant réutilisable pour chaque colonne
const Column = ({ title, id, plans, handleShowSidebar, structureId }) => {
  return (
    <div className="col-12 col-lg-4">
      <div className="card mb-3" style={{ backgroundColor: '#f5f5f9' }}>
        <div className="card-header">
          <h3 className="card-title h5 mb-1">{title}</h3>
        </div>
        <div className="card-body">
          <div className="tasks" id={id}>
            {plans?.map(plan => (
            <div 
              key={plan?.id} 
              className="card mb-3 border-0 shadow-sm hover-shadow cursor-pointer rounded-lg" 
              data-plan-id={plan?._id}
              style={{ transition: "all 0.3s ease-in-out", backgroundColor: "#fff" }}
            >
              {/* En-tête de la carte avec icône et titre */}
              <Link to={`/activite/${plan?._id}`} className="card-header  text-white d-flex align-items-center" style={{backgroundColor:"#e7e7ff"}}>
                <FaClipboardList className="me-2 text-primary" size={18} />
                <h6 className="m-0"><strong>{plan?.titre}</strong></h6>
              </Link>

              {/* Contenu principal */}
              <div className="card-body" onClick={() => handleShowSidebar(plan)} // Passer le plan au sidebar
>
                <p className="mb-2 mt-3 text-muted">{plan?.description}</p>

                {/* Détails en bas */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  {/* Date de création avec icône */}
                  <span className="d-flex align-items-center text-muted">
                    <FaCalendarAlt className="me-1 text-primary" size={16} />
                    {plan?.date_creation}
                  </span>

              
                </div>
              </div>
            </div>
            ))}
            <Link to={`/addPlan/${structureId} `}className="text-center mb-3">
              <button className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                + Add New Item
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plan;
