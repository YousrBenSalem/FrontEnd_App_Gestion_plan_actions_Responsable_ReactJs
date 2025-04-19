import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import sousActivite from '../../services/sousActivite';
import { toast, ToastContainer } from 'react-toastify';
import tache from '../../services/tache';

function AddSousActivite() {
  const user = useSelector((state) => state.auth.user); 
    const responsableId = user.id
    console.log("Utilisateur actuel :", user);
    console.log("Responsable ID :", responsableId);
    const [step, setStep] = useState(1); // Étape actuelle
    const [data, setData] = useState([]); 
      
        const [sousActiviteId, setSousActiviteId] = useState(null);
      const [formData, setFormData] = useState({});
  const { activiteId } = useParams(); // 

    const handleChange = (e) => {
        if (e.target.name === "pieceJointe") {
            setFormData({ ...formData, pieceJointe: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };
const handleNextStep = (e) => {
        e.preventDefault(); // Empêche le rechargement de la page
        if (step < 2) setStep(step + 1); // Passe à l'étape suivante
    };
    const handleFormSubmit = async (e, entity) => {
        e.preventDefault();
        let res;
        try {
            switch (entity) {
                case "sousActivite":
                    res = await sousActivite.createSousActivite({ ...formData, activiteId });
                    if (res){
                        toast.success("Sous activité ajoutée avec succès !");
                      setSousActiviteId(res.data.data._id)} ;
                    break;
                case "tache":
                    const formDataWithImage = new FormData();
   // Vérifier et convertir les valeurs en chaîne si nécessaire
formDataWithImage.append("titre", Array.isArray(formData.titre) ? formData.titre[0] : formData.titre || "");
formDataWithImage.append("description", Array.isArray(formData.description) ? formData.description[0] : formData.description || "");
formDataWithImage.append("avancement", Array.isArray(formData.avancement) ? formData.avancement[0] : formData.avancement || "");
formDataWithImage.append("periorite", Array.isArray(formData.periorite) ? formData.periorite[0] : formData.periorite || "");
formDataWithImage.append("sousActiviteId", sousActiviteId || "");
if (!formData.titre || !formData.avancement || !formData.periorite) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
}
      // Ajouter les autres champs, sauf `pieceJointe`

                    Object.keys(formData).forEach((key) => {
                        if (key !== "pieceJointe") {
                            formDataWithImage.append(key, formData[key] || "");
                        }
                    });

                        // Vérifier et ajouter la pièce jointe si elle est valide

                  if (formData.pieceJointe && formData.pieceJointe instanceof File) {
    formDataWithImage.append("pieceJointe", formData.pieceJointe);
} else {
    console.log("Aucune image valide détectée !");
}
  // Afficher les valeurs envoyées dans la console
    console.log({
        titre: formDataWithImage.get("titre"),
        description: formDataWithImage.get("description"),
        avancement: formDataWithImage.get("avancement"),
        periorite: formDataWithImage.get("periorite"),
    });

    // Envoyer la requête

                    res = await tache.createTache(formDataWithImage);
                      if (res){
                        toast.success(" Tache ajoutée avec succès !");
                    } ;
                    break;
                default:
                    return;
            }
           const fieldsToReset = {
              
                sousActivite: ["titre", "description", "Date_lancement"],
                tache: ["titre", "description", "avancement", "pieceJointe", "periorite"],
            };

                setFormData((prevFormData) => {
            const resetData = { ...prevFormData };
            fieldsToReset[entity].forEach((field) => delete resetData[field]);
            return resetData;
        });
            if (step < 2) setStep(step + 1); 
        } catch (error) {
            toast.error(`Erreur lors de l'ajout de ${entity} : ${error}` );
            console.error(`Erreur lors de l'ajout de ${entity} :`, error);
        }
    };
    const renderForm = () => {
        switch (step) {
            case 1:
                return (
                    <form className='row'>
                        <div className="mb-3 col-md-6">
                            <label className="form-label">Titre</label>
                            <input className="form-control" type="text" name="titre" onChange={handleChange} required value={formData.titre || ""}  />
                        </div>
                        <div className="mb-3 col-md-6">
                            <label className="form-label">Description</label>
                            <input className="form-control" type="text" name="description" onChange={handleChange} required value={formData.description || ""}/>
                        </div>
                        <div className="mb-3 col-md-6">
                            <label className="form-label">Date lancement</label>
                            <input className="form-control" type="date" name="Date_lancement" onChange={handleChange} required value={formData.Date_lancement || ""}/>
                        </div>
                        <div className="mt-4 d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary me-2" onClick={(e) => handleFormSubmit(e, "sousActivite")}>{step < 6 ? 'Suivant' : 'Terminer'}</button>
                        </div>
                    </form>
                );
            case 2:
                return (
                    <form className='row'>
                        <div className="mb-3 col-md-6">
                            <label className="form-label">Titre</label>
                            <input className="form-control" type="text" name="titre" onChange={handleChange} required value={formData.titre || ""} />
                        </div>
                        <div className="mb-3 col-md-6">
                            <label className="form-label">Description</label>
                            <input className="form-control" type="text" name="description" onChange={handleChange} required value={formData.description || ""} />
                        </div>
                        <div className="mb-3 col-md-6">
                            <label className="form-label">Avancement</label>
                            <select className="form-select" name="avancement" onChange={handleChange} required value={formData.avancement || ""} >
                                <option value="">Sélectionnez l'avancement</option>
                                <option value="To Do">Nouveau</option>
                                <option value="En cours">En Cours</option>
                                <option value="Terminé">Terminé</option>
                            </select>
                        </div>
                        <div className="mb-3 col-md-6">
                            <label className="form-label">Piece Jointe</label>
                            <input      className="form-control" 
                            type="file" 
                            name="pieceJointe" 
                            onChange={handleChange} />
                        </div>
                        <div className="mb-3 col-md-6">
                            <label className="form-label">Priorite</label>
                            <select className="form-select" name="periorite" onChange={handleChange} required value={formData.periorite || ""} >
                                <option value="">Select priorite</option>
                                <option value="Haute">Haute</option>
                                <option value="Moyenne">Moyenne</option>
                                <option value="Basse">Basse</option>
                            </select>
                        </div>
                        <div className="mt-4 d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary me-2" onClick={(e) => handleFormSubmit(e, "tache")}>{step < 6 ? 'Suivant' : 'Terminer'}</button>
                        </div>
                    </form>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
                    <ToastContainer />
          
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to={`/`}>Sous Activites</Link></li>

                    <li className="breadcrumb-item active" aria-current="page">Ajouter une sous activite</li>
                </ol>
            </nav>
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-4">
                        <div className="row mt-4">
                            <div className="col">
                                <div className="timeline-steps aos-init aos-animate" data-aos="fade-up">
                                    <div className="timeline-steps mb-0">
                                        {[  
                                  "Ajouter sous activité", "Ajouter tâche"].map((label, index) => (
                                            <div key={index} className={`timeline-step ${step >= index + 1 ? 'active' : ''}`}>
                                                <div className="timeline-content">
                                                    <div className="inner-circle"></div>
                                                    <p className="h6 text-muted mb-0">{label}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <form id="formAccountSettings" onSubmit={handleNextStep}>
                                <div className="row">
                                    {renderForm()}
                                </div>
                            
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddSousActivite