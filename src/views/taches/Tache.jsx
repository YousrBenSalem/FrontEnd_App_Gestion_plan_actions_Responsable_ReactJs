import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import dragula from 'react-dragula';
import { Offcanvas } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import tache from '../../services/tache';
import { FaCalendarAlt, FaClipboardList, FaRegComment } from 'react-icons/fa';

function Tache() {
    const [showSidebar, setShowSidebar] = useState(false);
        const [imagePreview, setImagePreview] = useState(null); // Stocker l'aperçu de l'image

  const [Data, setData] = useState([]);
  const [selectedTache, setSelectedTache] = useState(null); 
  const { sousActiviteId } = useParams();
    const handleCloseSidebar = () => {
        setShowSidebar(false);
        setSelectedTache(null);
        setImagePreview(null);
    };
  const handleShowSidebar = (act) => {
    setSelectedTache(act);  
    setShowSidebar(true);
  };  
    const getTache = async () => {
      try {
        const res = await tache.getTache();
        const allTaches = res?.data?.data ;
        const filtredTache = allTaches?.filter(tache => tache?.sousActiviteId === sousActiviteId)
        setData(filtredTache);
        console.log("Taches récupérés avec succès:", filtredTache);
      } catch (error) {
        console.error("Erreur lors de la récupération de Taches :", error);
      }
    };
  
    useEffect(() => {
      getTache();
    }, []);

  const TacheToDo = Data?.filter(tache => tache.etat === "To Do");
  const TacheInProgress = Data?.filter(tache => tache.etat === "En cours");
  const TacheDone = Data?.filter(tache => tache.etat !== "To Do" && tache.etat !== "En cours");
    // Fonction pour mettre à jour l'état du plan dans la base de données
  const updateTacheStatus = async (TacheId, newStatus) => {
    try {
      await tache.updateTache(TacheId, { etat: newStatus });  // Appel à ton API pour mettre à jour l'état
      console.log(`tache ${TacheId} a été mis à jour avec l'état: ${newStatus}`);
        toast.success(`Tache changer son etat en ${newStatus} avec succès !`);
      getTache();  
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'état du tache:", error);
          toast.error(`Erreur lors de la mise à jour de l'état du tache: : ${error}` );
    }
  };

        // Fonction pour supprimer un sous act
      const deleteTache = async (tacheId) => {
        try {
          await tache.deleteTache(tacheId);
          console.log(`La tache ${tacheId} a été supprimé.`);
              toast.success(" Tachea été supprimé avec succès !");
          
          getTache(); // Rafraîchir les données des sous activites
          handleCloseSidebar(); // Fermer le sidebar après suppression
        } catch (error) {
          console.error("Erreur lors de la suppression de tache :", error);
            toast.error(`Erreur lors de la suppression de tache : : ${error}` );
        }
      };
          // Fonction pour mettre à jour le sous act dans la base de données
const updateTache = async (tacheId, updatedData) => {
    try {
        const formData = new FormData();

        // Ajouter les autres champs
        for (const key in updatedData) {
            if (updatedData[key] && key !== "pieceJointe") {
                formData.append(key, updatedData[key]);
            }
        }

        // Vérifier si une pièce jointe a été ajoutée et l'ajouter au FormData
        if (updatedData.pieceJointe instanceof File) {
            formData.append("pieceJointe", updatedData.pieceJointe); 
        }

        const res =await tache.updateTache(tacheId, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        if (res){
  console.log(`La tâche ${tacheId} a été mise à jour avec succès.`);
          toast.success(" Tache  a été mise à jour avec succès !");
        getTache(); // Rafraîchir les tâches
        handleCloseSidebar(); // Fermer le sidebar après mise à jour
        }
      
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la tâche :", error);
          toast.error(`Erreur lors de la mise à jour de la tâche :: ${error}` );
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
    const TacheId = el.dataset.TacheId;
    const newStatus = target.id;

    if (TacheId && newStatus) {
      let updatedStatus = "";
      if (newStatus === "to-do") {
        updatedStatus = "To Do";
      } else if (newStatus === "in-progress") {
        updatedStatus = "En cours";
      } else if (newStatus === "done") {
        updatedStatus = "Done";
      }
      updateTacheStatus(TacheId, updatedStatus);
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
      <li class="breadcrumb-item"><Link to="/activite">Activite</Link></li>
        <li class="breadcrumb-item"><Link to="/activite">Sous Activite</Link></li>

      <li class="breadcrumb-item active" aria-current="page">Tache</li>
  </ol>
</nav>
  <div className="row  ">
        {/* To Do */}
        <Column title="To Do" id="to-do" acts={TacheToDo} handleShowSidebar={handleShowSidebar} sousActiviteId={sousActiviteId}/>
        
        {/* In Progress */}
        <Column title="In Progress" id="in-progress" acts={TacheInProgress} handleShowSidebar={handleShowSidebar} sousActiviteId={sousActiviteId} />

        {/* Done */}
        <Column title="Done" id="done" acts={TacheDone} handleShowSidebar={handleShowSidebar} sousActiviteId={sousActiviteId} />
      </div>
            {/* Sidebar */}
      <Offcanvas show={showSidebar} onHide={handleCloseSidebar} placement="end" className="w-25">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Mise à jour de sous activité - {selectedTache?.titre}</Offcanvas.Title>
        </Offcanvas.Header>
                  <hr class="my-0" />

        <Offcanvas.Body>
              {selectedTache &&(
          <>
          <form>
                   <div className="mb-3 text-center">
                              
                                <div className="d-flex flex-column align-items-center">
                                    <img
                                        src={imagePreview || (selectedTache?.pieceJointe ? `http://localhost:3000/storage/${selectedTache.pieceJointe}` : "https://via.placeholder.com/150")}
                                        alt="Tâche"
                                        className="rounded img-fluid mb-2"
                                        style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "cover" }}
                                    />
      <input
            type="file"
            className="form-control mt-2"
            accept="image/*"
            onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                    setSelectedTache({ ...selectedTache, pieceJointe: file });
                }
            }}
        />                                </div>
                            </div>
                <div className="mb-3">
                  <label className="form-label">Titre</label>
                  <input 
                    className="form-control"
                    value={selectedTache?.titre}
                    onChange={(e) => setSelectedTache({ ...selectedTache, titre: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-control"
                    value={selectedTache?.description}
                    onChange={(e) => setSelectedTache({ ...selectedTache, description: e.target.value })}
                  />
                </div>
                
                
                
              
              
              
                

                <div className="">
                  <button type="button" className="btn btn-primary m-3" onClick={() => updateTache(selectedTache._id, selectedTache)}>
                    Update
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => deleteTache(selectedTache._id)}>
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
const Column = ({ title, id, acts, handleShowSidebar , sousActiviteId }) => {
  const getPriorityClass = (periorite) => {
  switch (periorite) {
    case "Haute":
      return "bg-danger text-white";  // 🔴 Rouge
    case "Moyenne":
      return "bg-warning text-dark";  // 🟠 Orange
    case "Basse":
      return "bg-success text-white"; // 🟢 Vert
    default:
      return "bg-secondary text-white"; // ⚪ Gris (par défaut)
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
      data-TacheId-id={act?._id}
      style={{ transition: "all 0.3s ease-in-out", backgroundColor: "#fff" }}
    >
      {/* En-tête de la carte avec icône et titre */}
      <div className="card-header text-white d-flex align-items-center justify-content-between" style={{backgroundColor:"#e7e7ff"}}>
        <div className="d-flex align-items-center">
          <FaClipboardList className="me-2 text-primary" size={18} />
          <h6 className="m-0"><strong>{act?.titre}</strong></h6>
        </div>

        {/* Badge de priorité */}
        <span className={`badge ${getPriorityClass(act?.periorite)}`}>
          {act?.periorite}
        </span>
      </div>

      {/* Contenu principal */}
      <div className="card-body" onClick={() => handleShowSidebar(act)}>
        <p className="mb-2 mt-3 text-muted">{act?.description}</p>

        {/* Détails en bas */}
    {/*     <div className="d-flex justify-content-between align-items-center mt-3"> */}
          {/* Date de création avec icône */}
        {/*   <span className="d-flex align-items-center text-muted">
            <FaCalendarAlt className="me-1 text-primary" size={16} />
            {act?.date_lancement}
          </span> */}

          {/* Nombre de commentaires avec icône */}
    {/*       <span className="d-flex align-items-center text-muted">
            <FaRegComment className="me-1 text-warning" size={16} />
            {act?.comments?.length || 0}
          </span>
        </div> */}
      </div>
    </div>
  ))}

  {/* Bouton d'ajout */}
  <Link to={`/AddTache/${sousActiviteId}`} className="text-center mb-3">
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

export default Tache;