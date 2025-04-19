import { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Importer Redux
import responsableService from "../../services/responsable"; // Importer le service API
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const UserProfileCard = () => {
  // 🔥 Récupérer l'ID depuis Redux (assure-toi que Redux est bien configuré)
  const responsableId = useSelector((state) => state.auth.user.id); // Modifier selon ton Redux

  // 🔥 Stocker les données du responsable
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Récupérer les infos du responsable depuis l'API
  const getResponsable = async () => {
    try {
      if (!responsableId) return; // Vérifier que l'ID est bien disponible
      const response = await responsableService.getResponsableById(responsableId);
      setUser(response.data.data); // Mettre à jour les données de l'utilisateur
      console.log("les données de responsable", response.data.data)
    } catch (err) {
      setError("Erreur lors du chargement des informations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getResponsable();
  }, [responsableId]);

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Mon Profil</li>
        </ol>
      </nav>

      <div className="container d-flex justify-content-center">
        <div className="row mb-3">
          <div className="card p-4 shadow-lg rounded-lg" style={{ maxWidth: "450px", width: "100%" }}>
            {/* 🔄 Affichage du chargement */}
            {loading && <p>Chargement des informations...</p>}
            {error && <p className="text-danger">{error}</p>}

            {/* ✅ Vérifier si les données sont disponibles */}
            {user && (
              <>
                {/* Image et nom */}
                <div className="text-center">
                  <img
                    src={`http://localhost:3000/storage/${user.image || "default.jpg"}`}
                    alt="Profil utilisateur"
                    className="rounded-circle shadow"
                    style={{ width: "120px", height: "120px", objectFit: "cover", border: "4px solid #007bff" }}
                  />
                  <h3 className="mt-3">{user.nom} {user.prenom}</h3>
                  <p className="text-muted">{user.post}</p>
                </div>

                {/* Informations utilisateur */}
                <ul className="list-group list-group-flush mt-3">
                  <li className="list-group-item d-flex align-items-center">
                    <FaEnvelope className="text-primary me-2" /> <strong>Email :</strong> {user.email}
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <FaPhone className="text-success me-2" /> <strong>Téléphone :</strong> {user.telephone}
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <FaMapMarkerAlt className="text-danger me-2" /> <strong>Adresse :</strong> {user.adresse}
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <FaBriefcase className="text-warning me-2" /> <strong>Poste :</strong> {user.post}
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <FaCalendarAlt className="text-info me-2" /> <strong>Date de nomination :</strong> {user.date_nomination}
                  </li>
                </ul>

                {/* Bouton de modification */}
                <div className="text-center mt-3">
                  <Link to="/parametre">
                    <button className="btn btn-primary">Modifier les informations</button>

                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
