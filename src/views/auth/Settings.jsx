import { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // 🔥 Import Redux pour récupérer l'ID du responsable
import responsableService from "../../services/responsable"; // 🔥 Service API
import { FaUserEdit, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <ToastContainer />
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Paramètres de profil</li>
        </ol>
      </nav>
      <div className="row mb-3">
        {/* Sidebar - Navigation */}
        <div className="col-md-4">
          <ul className="nav nav-pills flex-column">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                <FaUserEdit className="me-2" /> Modifier les informations
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "password" ? "active" : ""}`}
                onClick={() => setActiveTab("password")}
              >
                <FaLock className="me-2" /> Changer le mot de passe
              </button>
            </li>
          </ul>
        </div>

        {/* Contenu - Formulaires */}
        <div className="col-md-8">
          <div className="card shadow-sm p-4">
            {activeTab === "profile" ? <EditProfileForm /> : <ChangePasswordForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Formulaire de modification des informations personnelles
const EditProfileForm = () => {
  const responsableId = useSelector((state) => state.auth.user.id); // Modifier selon ton Redux
  const [user, setUser] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Charger les informations du responsable
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!responsableId) return;
        const res = await responsableService.getResponsableById(responsableId);
        setUser(res.data.data);
        setImagePreview(`http://localhost:3000/storage/${res.data.data.image}`);
      } catch (error) {
        toast.error("Erreur lors du chargement des informations.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [responsableId]);

  // ✅ Mettre à jour les champs du formulaire
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // ✅ Gérer le changement d'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser({ ...user, image: file });
      setImagePreview(URL.createObjectURL(file)); // Prévisualisation de l'image
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("📤 Données utilisateur envoyées:", user);

    try {
        const formData = new FormData();

        // ✅ Ajouter les autres champs (sauf l’image)
        for (const key in user) {
            if (user[key] && key !== "image") {
                formData.append(key, user[key]);
            }
        }

        // ✅ Ajouter l’image seulement si elle est modifiée
        if (user.image instanceof File) {
            console.log("🖼️ Nouvelle image détectée, ajout dans FormData...");
            formData.append("image", user.image);
        }

        console.log("📤 Contenu de FormData avant envoi:", [...formData.entries()]);

        // ✅ Envoi de la requête PUT
        const response = await responsableService.updateResponsable(responsableId, formData);
        console.log("✅ Réponse de l'API:", response.data);

        toast.success("Profil mis à jour avec succès !");
    } catch (error) {
        console.error("❌ Erreur Axios:", error);
        console.error("❌ Réponse du serveur:", error.response?.data);
        toast.error("Échec de la mise à jour !");
    }
};


  if (loading) return <p>Chargement...</p>;

  return (
    <>
      <h4 className="mb-3">Modifier les informations</h4>
      <form onSubmit={handleSubmit}>
        {/* Image */}
        <div className="mb-3 text-center">
          <img
            src={imagePreview || "https://via.placeholder.com/150"}
            alt="Profil utilisateur"
            className="rounded-circle shadow"
            style={{ width: "120px", height: "120px", objectFit: "cover", border: "4px solid #007bff" }}
          />
          <input type="file" className="form-control mt-2" accept="image/*" onChange={handleImageChange} />
        </div>

        {/* Nom */}
        <div className="mb-3">
          <label className="form-label">Nom</label>
          <input type="text" className="form-control" name="nom" value={user?.nom || ""} onChange={handleChange} />
        </div>

        {/* Prénom */}
        <div className="mb-3">
          <label className="form-label">Prénom</label>
          <input type="text" className="form-control" name="prenom" value={user?.prenom || ""} onChange={handleChange} />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" value={user?.email || ""} onChange={handleChange} />
        </div>

        {/* Téléphone */}
        <div className="mb-3">
          <label className="form-label">Téléphone</label>
          <input type="text" className="form-control" name="telephone" value={user?.telephone || ""} onChange={handleChange} />
        </div>

        {/* Adresse */}
        <div className="mb-3">
          <label className="form-label">Adresse</label>
          <input type="text" className="form-control" name="adresse" value={user?.adresse || ""} onChange={handleChange} />
        </div>
            {/*Champ "Poste" */}
        <div className="mb-3">
          <label className="form-label">Poste</label>
          <input type="text" className="form-control" name="post" value={user?.post || ""} onChange={handleChange} />
        </div>

        {/*Champ "Date de Nomination" */}
        <div className="mb-3">
          <label className="form-label">Date de Nomination</label>
          <input type="text" className="form-control" name="date_nomination" value={user?.date_nomination || ""} onChange={handleChange} />
        </div>

        {/* Bouton de sauvegarde */}
        <button type="submit" className="btn btn-primary">Enregistrer</button>
      </form>
    </>
  );
};

// ✅ Formulaire de changement de mot de passe (identique)
const ChangePasswordForm = () => {
  return (
    <>
      <h4 className="mb-3">Changer le mot de passe</h4>
      <form>
        <div className="mb-3">
          <label className="form-label">Ancien mot de passe</label>
          <input type="password" className="form-control" placeholder="Entrez l'ancien mot de passe" />
        </div>
        <div className="mb-3">
          <label className="form-label">Nouveau mot de passe</label>
          <input type="password" className="form-control" placeholder="Entrez le nouveau mot de passe" />
        </div>
        <button type="submit" className="btn btn-success">Modifier</button>
      </form>
    </>
  );
};

export default UserProfile;
