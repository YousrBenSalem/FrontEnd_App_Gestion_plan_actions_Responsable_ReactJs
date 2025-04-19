import React, { useEffect, useState } from 'react';
import dragula from 'react-dragula';
import { Offcanvas } from 'react-bootstrap';
import { Link, useParams  } from "react-router-dom";
import activite from '../../services/activite';
import { FaCalendarAlt, FaClipboardList, FaRegComment } from 'react-icons/fa';

function Activite() {
  
    const [showSidebar, setShowSidebar] = useState(false);
  const [Data, setData] = useState([]);
  const [selectedAct, setSelectedAct] = useState(null); 
  const { planId } = useParams();
  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = (act) => {
    setSelectedAct(act);  
    setShowSidebar(true);
  };  

    const getAct = async () => {
      try {
        const res = await activite.getActivite();
        const allActs = res?.data?.data ;
        const filtredActs = allActs?.filter(plan => plan?.planId === planId)
        setData(filtredActs);
        console.log("Activité récupérés avec succès:", filtredActs);
      } catch (error) {
        console.error("Erreur lors de la récupération d'Activité :", error);
      }
    };
  
    useEffect(() => {
      getAct();
    }, []);

  const actToDo = Data?.filter(act => act.etat === "To Do");
  const actInProgress = Data?.filter(act => act.etat === "En cours");
  const actDone = Data?.filter(act => act.etat !== "To Do" && act.etat !== "En cours");
    // Fonction pour mettre à jour l'état du plan dans la base de données
  const updateActStatus = async (actId, newStatus) => {
    try {
      await activite.updateActivite(actId, { etat: newStatus });  // Appel à ton API pour mettre à jour l'état
      console.log(`L'act ${actId} a été mis à jour avec l'état: ${newStatus}`);
      getAct();  // Rafraîchir la liste des plans après la mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'état du act:", error);
    }
  };
    // Fonction pour supprimer un plan
  const deleteAct = async (actId) => {
    try {
      await activite.deleteActivite(actId);
      console.log(`L'act ${actId} a été supprimé.`);
      getAct(); // Rafraîchir les données des plans
      handleCloseSidebar(); // Fermer le sidebar après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression d'activite :", error);
    }
  };
      // Fonction pour mettre à jour le plan dans la base de données
    const updateAct = async (actId, updatedData) => {
      try {
        await activite.updateActivite(actId, updatedData);
        console.log(`L'act ${actId} a été mis à jour.`);
        getAct(); // Rafraîchir les données des plans
        handleCloseSidebar(); // Fermer le sidebar après mise à jour
      } catch (error) {
        console.error("Erreur lors de la mise à jour d'act :", error);
      }
    };
  useEffect(() => {
  const containers = [
    document.querySelector('#to-do'),
    document.querySelector('#in-progress'),
    document.querySelector('#done'),
  ].filter(Boolean);;
  if (containers.length === 0) return;

  const drake = dragula(containers);

drake.on('drop', (el, target) => {
  if (target && target.contains(el)) {
    // Effectuer la mise à jour seulement si le parent contient bien l'élément
    const actId = el.dataset.actId;
    const newStatus = target.id;

    if (actId && newStatus) {
      let updatedStatus = "";
      if (newStatus === "to-do") {
        updatedStatus = "To Do";
      } else if (newStatus === "in-progress") {
        updatedStatus = "En cours";
      } else if (newStatus === "done") {
        updatedStatus = "Done";
      }
      updateActStatus(planId, updatedStatus);
    }
  }
});


  return () => {
    drake.destroy();  // Nettoyer l'instance de dragula lors du démontage du composant
  };
}, []);
  return (
    <div className="container-xxl flex-grow-1 container-p-y">
    <nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><Link to="/">Home</Link></li>
    <li class="breadcrumb-item"><Link to="/plan">Plan d'action</Link></li>
    <li class="breadcrumb-item active" aria-current="page">activité</li>
  </ol>
</nav>
      <div className="row  ">
        {/* To Do */}
        <Column title="To Do" id="to-do" acts={actToDo} handleShowSidebar={handleShowSidebar} planId={planId}/>
        
        {/* In Progress */}
        <Column title="In Progress" id="in-progress" acts={actInProgress} handleShowSidebar={handleShowSidebar}planId={planId} />

        {/* Done */}
        <Column title="Done" id="done" acts={actDone} handleShowSidebar={handleShowSidebar} planId={planId} />
      </div>
            {/* Sidebar */}
      <Offcanvas show={showSidebar} onHide={handleCloseSidebar} placement="end" className="w-25">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Mise à jour  d'activité -{selectedAct?.titre} </Offcanvas.Title>
        </Offcanvas.Header>
        <hr class="my-0" />

        <Offcanvas.Body>
        {selectedAct &&(
          <>
          <form>
                <div className="mb-3">
                  <label className="form-label">Titre</label>
                  <input 
                    className="form-control"
                    value={selectedAct?.titre}
                    onChange={(e) => setSelectedAct({ ...selectedAct, titre: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-control"
                    value={selectedAct?.description}
                    onChange={(e) => setSelectedAct({ ...selectedAct, description: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label"> Budget</label>
                  <input 
                    className="form-control"
                    value={selectedAct?.budget}
                    onChange={(e) => setSelectedAct({ ...selectedAct, budget: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date prevu</label>
                  <input 
                    className="form-control"
                    value={selectedAct?.Date_prevu}
                    onChange={(e) => setSelectedAct({ ...selectedAct, Date_prevu: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date lancement</label>
                  <input 
                    className="form-control"
                    value={selectedAct?.Date_lancement}
                    onChange={(e) => setSelectedAct({ ...selectedAct, Date_lancement: e.target.value })}
                  />
                </div>
                  <div className="mb-3">
                  <label className="form-label">Date fin prevu</label>
                  <input 
                    className="form-control"
                    value={selectedAct?.Date_fin_prevu}
                    onChange={(e) => setSelectedAct({ ...selectedAct, Date_fin_prevu: e.target.value })}
                  />
                </div>
                    <div className="mb-3">
                  <label className="form-label">Date fin lancement</label>
                  <input 
                    className="form-control"
                    value={selectedAct?.Date_fin_lanc}
                    onChange={(e) => setSelectedAct({ ...selectedAct, Date_fin_lanc: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Type financement</label>
                  <input 
                    className="form-control"
                    value={selectedAct?.TypeFinancement}
                    onChange={(e) => setSelectedAct({ ...selectedAct, TypeFinancement: e.target.value })}
                  />
                </div>
                
              
              
                

                <div className="">
                  <button type="button" className="btn btn-primary m-3" onClick={() => updateAct(selectedAct._id, selectedAct)}>
                    Update
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => deleteAct(selectedAct._id)}>
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
const Column = ({ title, id, acts, handleShowSidebar , planId}) => {
  const getPriorityClass = (priorite) => {
  switch (priorite) {
    case "Haute":
      return "bg-danger text-white";  // Rouge
    case "Moyenne":
      return "bg-warning text-dark";  // Orange
    case "Basse":
      return "bg-success text-white"; // Vert
    default:
      return "bg-secondary text-white"; // Gris si aucune priorité
  }
};

  return (
    <div className="col-12 col-lg-4">
      <div className="card mb-3" style={{ backgroundColor: '#f5f5f9' }}>
        <div className="card-header">
          <h3 className="card-title h5 mb-1">{title}</h3>
        </div>
        <div className="card-body">
        <div className="tasks" id={id}>
  {acts?.map(act => (
    <div 
      key={act?.id} 
      className="card mb-3 border-0 shadow-sm hover-shadow cursor-pointer rounded-lg" 
      data-act-id={act?._id}
      style={{ transition: "all 0.3s ease-in-out", backgroundColor: "#fff" }}
    >
      {/* En-tête de la carte avec icône et titre */}
      <Link to={`/SousActivite/${act?._id}`} className="card-header text-white d-flex align-items-center justify-content-between" style={{backgroundColor:"#e7e7ff"}}>
        <div className="d-flex align-items-center">
          <FaClipboardList className="me-2 text-primary" size={18} />
          <h6 className="m-0"><strong>{act?.titre}</strong></h6>
        </div>

        {/* Badge de priorité */}
        <span className={`badge ${getPriorityClass(act?.priorite)}`}>
          {act?.priorite}
        </span>
      </Link>

      {/* Contenu principal */}
      <div className="card-body" onClick={() => handleShowSidebar(act)}>
        <p className="mb-2 mt-3 text-muted">{act?.description}</p>

        {/* Détails en bas */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          {/* Date de création avec icône */}
          <span className="d-flex align-items-center text-muted">
            <FaCalendarAlt className="me-1 text-primary" size={16} />
            {act?.Date_lancement}
          </span>

          {/* Image de l'utilisateur */}
          {act?.userId?.image && (
            <img
              src={`http://localhost:3000/storage/${act?.userId?.image}`}  
              alt="Utilisateur"
              className="rounded-circle ms-2"
              style={{ width: "30px", height: "30px", objectFit: "cover" }}
              title={`${act?.userId?.nom} ${act?.userId?.prenom}`}
            />
          )}
        </div>
      </div>
    </div>
  ))}
  
  {/* Bouton d'ajout */}
  <Link to={`/addActivite/${planId}`} className="text-center mb-3">
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

export default Activite;