import React, { useEffect, useState } from "react";
import dragula from "react-dragula";
import { Offcanvas } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Sousactivite from "../../services/sousActivite";
import { FaCalendarAlt, FaClipboardList } from "react-icons/fa";

function SousActivite() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [Data, setData] = useState([]);
  const [selectedSousAct, setSelectedSousAct] = useState(null);
  const { activiteId } = useParams();
  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = (Sousact) => {
    setSelectedSousAct(Sousact);
    setShowSidebar(true);
  };

  const getSousAct = async () => {
    try {
      const res = await Sousactivite.getSousActivite();
      const allSousAct = res?.data?.data;
      const filtredSousAct = allSousAct?.filter(
        (sousAct) => sousAct?.activiteId === activiteId
      );
      setData(filtredSousAct);
      console.log("Sous Activité récupérés avec succès:", filtredSousAct);
    } catch (error) {
      console.error("Erreur lors de la récupération de Sous Activité :", error);
    }
  };

  useEffect(() => {
    getSousAct();
  }, []);

  const SousActToDo = Data?.filter((SousAct) => SousAct.etat === "To Do");
  const SousActInProgress = Data?.filter(
    (SousAct) => SousAct.etat === "En cours"
  );
  const SousActDone = Data?.filter(
    (SousAct) => SousAct.etat !== "To Do" && SousAct.etat !== "En cours"
  );
  // Fonction pour mettre à jour l'état du plan dans la base de données
  const updateSousActStatus = async (SousActId, newStatus) => {
    try {
      await Sousactivite.updateSousActivite(SousActId, { etat: newStatus }); // Appel à ton API pour mettre à jour l'état
      console.log(
        `Le sous act ${SousActId} a été mis à jour avec l'état: ${newStatus}`
      );
      getSousAct();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de l'état du sous act:",
        error
      );
    }
  };

  // Fonction pour supprimer un sous act
  const deleteSousAct = async (sousActId) => {
    try {
      await Sousactivite.deleteSousActivite(sousActId);
      console.log(`Le sous act ${sousActId} a été supprimé.`);
      getSousAct(); // Rafraîchir les données des sous activites
      handleCloseSidebar(); // Fermer le sidebar après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression de sous activite :", error);
    }
  };
  // Fonction pour mettre à jour le sous act dans la base de données
  const updateSousAct = async (sousActId, updatedData) => {
    try {
      await Sousactivite.updateSousActivite(sousActId, updatedData);
      console.log(`Le sous act ${sousActId} a été mis à jour.`);
      getSousAct(); // Rafraîchir les données des plans
      handleCloseSidebar(); // Fermer le sidebar après mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'act :", error);
    }
  };

  useEffect(() => {
    const containers = [
      document.querySelector("#to-do"),
      document.querySelector("#in-progress"),
      document.querySelector("#done"),
    ].filter(Boolean);
    if (containers.length === 0) return;

    const drake = dragula(containers);

    drake.on("drop", (el, target) => {
      if (target && target.contains(el)) {
        // Effectuer la mise à jour seulement si le parent contient bien l'élément
        const SousActId = el.dataset.SousActId;
        const newStatus = target.id;

        if (SousActId && newStatus) {
          let updatedStatus = "";
          if (newStatus === "to-do") {
            updatedStatus = "To Do";
          } else if (newStatus === "in-progress") {
            updatedStatus = "En cours";
          } else if (newStatus === "done") {
            updatedStatus = "Done";
          }
          updateSousActStatus(SousActId, updatedStatus);
        }
      }
    });

    return () => {
      drake.destroy(); // Nettoyer l'instance de dragula lors du démontage du composant
    };
  }, []);
  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li class="breadcrumb-item">
            <Link to="/plan">Plan d'action</Link>
          </li>
          <li class="breadcrumb-item">
            <Link to="/plan">Activité</Link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            Sous activité
          </li>
        </ol>
      </nav>
      <div className="row  ">
        {/* To Do */}
        <Column
          title="To Do"
          id="to-do"
          acts={SousActToDo}
          handleShowSidebar={handleShowSidebar}
          activiteId={activiteId}
        />

        {/* In Progress */}
        <Column
          title="In Progress"
          id="in-progress"
          acts={SousActInProgress}
          handleShowSidebar={handleShowSidebar}
          activiteId={activiteId}
        />

        {/* Done */}
        <Column
          title="Done"
          id="done"
          acts={SousActDone}
          handleShowSidebar={handleShowSidebar}
          activiteId={activiteId}
        />
      </div>
      {/* Sidebar */}
      <Offcanvas
        show={showSidebar}
        onHide={handleCloseSidebar}
        placement="end"
        className="w-25"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            Mise à jour de sous activité - {selectedSousAct?.titre}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <hr class="my-0" />
        <Offcanvas.Body>
          {selectedSousAct && (
            <>
              <form>
                <div className="mb-3">
                  <label className="form-label">Titre</label>
                  <input
                    className="form-control"
                    value={selectedSousAct?.titre}
                    onChange={(e) =>
                      setSelectedSousAct({
                        ...selectedSousAct,
                        titre: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={selectedSousAct?.description}
                    onChange={(e) =>
                      setSelectedSousAct({
                        ...selectedSousAct,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date lancement</label>
                  <input
                    className="form-control"
                    value={selectedSousAct?.Date_lancement}
                    onChange={(e) =>
                      setSelectedSousAct({
                        ...selectedSousAct,
                        Date_lancement: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="">
                  <button
                    type="button"
                    className="btn btn-primary m-3"
                    onClick={() =>
                      updateSousAct(selectedSousAct._id, selectedSousAct)
                    }
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => deleteSousAct(selectedSousAct._id)}
                  >
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
const Column = ({ title, id, acts, handleShowSidebar, activiteId }) => {
  return (
    <div className="col-12 col-lg-4">
      <div className="card mb-3" style={{ backgroundColor: "#f5f5f9" }}>
        <div className="card-header">
          <h3 className="card-title h5 mb-1">{title}</h3>
        </div>
        <div className="card-body">
          <div className="tasks" id={id}>
            {acts?.map((act) => (
              <div
                key={act?.id}
                className="card mb-3 border-0 shadow-sm hover-shadow cursor-pointer rounded-lg"
                data-SousActId-id={act?._id}
                style={{
                  transition: "all 0.3s ease-in-out",
                  backgroundColor: "#fff",
                }}
              >
                {/* En-tête de la carte avec icône et titre */}
                <Link
                  to={`/Tache/${act?._id}`}
                  className="card-header  text-white d-flex align-items-center"
                  style={{ backgroundColor: "#e7e7ff" }}
                >
                  <FaClipboardList className="me-2 text-primary" size={18} />
                  <h6 className="m-0">
                    <strong>{act?.titre}</strong>
                  </h6>
                </Link>

                {/* Contenu principal */}
                <div
                  className="card-body"
                  onClick={() => handleShowSidebar(act)} // Passer le plan au sidebar
                >
                  <p className="mb-2 mt-3 text-muted">{act?.description}</p>

                  {/* Détails en bas */}
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    {/* Date de création avec icône */}
                    <span className="d-flex align-items-center text-muted">
                      <FaCalendarAlt className="me-1 text-primary" size={16} />
                      {act?.date_lancement}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <Link
              to={`/AddSousActivite/${activiteId}`}
              className="text-center mb-3"
            >
              <button
                className="btn btn-primary btn-lg"
                style={{ width: "100%" }}
              >
                + Add New Item
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SousActivite;
