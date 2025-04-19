import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import participant from '../../services/participant';


const AddParticipant = () => {
  
       const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        if (e.target.name === "image") {
            setFormData({ ...formData, image: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        try {
            const res = await participant.createParticipant(data);
            console.log("Participant ajouté :", res.data);
                  toast.success("Participant ajouté avec succès !");

              

        } catch (error) {
                toast.error("Erreur lors de l'ajout du participant.");

            console.error("Erreur lors de l'ajout :", error);
            setError("Une erreur est survenue, veuillez réessayer.");
              

        } finally {
            setLoading(false);
        }
    };

  return (
<div classname="">
  <div className="container-xxl flex-grow-1 container-p-y">
                <ToastContainer />

    <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Ajouter participant</li>
                </ol>
            </nav>
    {/* Basic Layout & Basic with Icons */}
    <div className="row">
    
      {/* Basic with Icons */}
      <div className="col-xxl">
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleFormSubmit}>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label" htmlFor="basic-icon-default-fullname">Nom</label>
                <div className="col-sm-10">
                  <div className="input-group input-group-merge">
                    <span id="basic-icon-default-fullname2" className="input-group-text"><i className="bx bx-user" /></span>
                    <input type="text" name="nom"  onChange={handleChange} className="form-control" id="basic-icon-default-fullname" placeholder="John" aria-label="John" aria-describedby="basic-icon-default-fullname2" />
                  </div>
                </div>
              </div>
                  <div className="row mb-3">
                <label className="col-sm-2 col-form-label" htmlFor="basic-icon-default-fullname">Prenom</label>
                <div className="col-sm-10">
                  <div className="input-group input-group-merge">
                    <span id="basic-icon-default-fullname2" className="input-group-text"><i className="bx bx-user" /></span>
                    <input type="text" name="prenom" className="form-control" id="basic-icon-default-fullname"  onChange={handleChange} placeholder="Doe" aria-label="Doe" aria-describedby="basic-icon-default-fullname2" />
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label" htmlFor="basic-icon-default-email">Email</label>
                <div className="col-sm-10">
                  <div className="input-group input-group-merge">
                    <span className="input-group-text"><i className="bx bx-envelope" /></span>
                    <input type="email"  name="email"  onChange={handleChange} id="basic-icon-default-email" className="form-control" placeholder="john.doe" aria-label="john.doe" aria-describedby="basic-icon-default-email2" />
                    <span id="basic-icon-default-email2" className="input-group-text">@example.com</span>
                  </div>
                  
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 form-label" htmlFor="basic-icon-default-phone">Telephone</label>
                <div className="col-sm-10">
                  <div className="input-group input-group-merge">
                    <span id="basic-icon-default-phone2" className="input-group-text"><i className="bx bx-phone" /></span>
                    <input type="text"  name="telephone" 
                    onChange={handleChange} id="basic-icon-default-phone" className="form-control phone-mask" placeholder="658 799 8941" aria-label="658 799 8941" aria-describedby="basic-icon-default-phone2" />
                  </div>
                </div>
              </div>
            
    <div className="row mb-3">
                <label className="col-sm-2 col-form-label" htmlFor="basic-icon-default-fullname">Adresse</label>
                <div className="col-sm-10">
                  <div className="input-group input-group-merge">
                    <span id="basic-icon-default-fullname2" className="input-group-text"><i className="bx bx-map" /></span>
                    <input type="text" name="adresse"  onChange={handleChange} className="form-control" id="basic-icon-default-fullname" placeholder="123 Rue Exemple, Ville" aria-label="123 Rue Exemple, Ville" aria-describedby="basic-icon-default-fullname2" />
                  </div>
                </div>
              </div>
                <div className="row mb-3">
                <label className="col-sm-2 col-form-label" htmlFor="basic-icon-default-fullname">Fonction</label>
                <div className="col-sm-10">
                  <div className="input-group input-group-merge">
                    <span id="basic-icon-default-fullname2" className="input-group-text"><i className="bx bx-briefcase" /></span>
                    <input type="text"  onChange={handleChange} name="fonction" className="form-control" id="basic-icon-default-fullname" placeholder="Ingenieur , Architect ..." aria-label="Ingenieur , Architect ..." aria-describedby="basic-icon-default-fullname2" />
                  </div>
                </div>
              </div>
              

                <div className="row mb-3">
                <label className="col-sm-2 col-form-label" htmlFor="basic-icon-default-fullname">Image</label>
                <div className="col-sm-10">
                  <div className="input-group input-group-merge">
                    <span id="basic-icon-default-fullname2" className="input-group-text"><i className="bx bx-image" /></span>
                    <input type="file" name="image"  onChange={handleChange} className="form-control" id="basic-icon-default-fullname" placeholder="Votre image" aria-label="Votre image" aria-describedby="basic-icon-default-fullname2" />
                  </div>
                </div>
              </div>

                  <div className="row mb-3">
                <label className="col-sm-2 col-form-label" htmlFor="basic-icon-default-fullname">Mot de passe</label>
                <div className="col-sm-10">
                  <div className="input-group input-group-merge">
                    <span id="basic-icon-default-fullname2" className="input-group-text"><i className="bx bx-lock" />
</span>
                    <input type="password" name="password"  onChange={handleChange} className="form-control" id="basic-icon-default-fullname" placeholder="*********" aria-label="*********" aria-describedby="basic-icon-default-fullname2" />
                  </div>
                </div>
              </div>
                                                  {error && <p className="text-danger">{error}</p>}

              <div className="row justify-content-end">
                <div className="col-sm-10">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                                {loading ? "Ajout en cours..." : "Ajouter"}
                                            </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}

export default AddParticipant;
