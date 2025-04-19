import React, { useEffect, useState } from "react";
import secteur from "../../services/secteur";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";

function Secteurs() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedSecteur, setSelectedSecteur] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [libelle, setLibelle] = useState("");
    const [code, setCode] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const getSecteurs = async () => {
            try {
                const res = await secteur.getSecteur();
                setData(res.data.data);
                setFilteredData(res.data.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des secteurs :", error);
            }
        };

        getSecteurs();
    }, []);

    // Fonction pour filtrer la liste en fonction de la recherche
    useEffect(() => {
        setFilteredData(
            data.filter((secteur) =>
                secteur?.libelle?.toLowerCase().includes(search.toLowerCase())||
                secteur?.code?.toLowerCase().includes(search.toLowerCase())

            )
        );
    }, [search, data]);

    // Pagination - Calcule les données à afficher
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Afficher le formulaire de mise à jour
const handleShowUpdate = (secteur) => {
    setSelectedSecteur(secteur);
    setLibelle(secteur?.libelle || "");
    setCode(secteur?.code || "");
    setShowUpdateModal(true);
};


    // Supprimer un secteur
    const handleDelete = async (id) => {
        try {
            await secteur.deleteSecteur(id);
            setData(data.filter((item) => item._id !== id));
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };
const handleUpdate = async (id) => {
    if (!id) return;

    const updatedSecteur = {
        libelle,
        code,
    };

    try {
        await secteur.updateSecteur(id, updatedSecteur);

        // Mettre à jour la liste des secteurs
        setData((prevData) =>
            prevData.map((sect) =>
                sect._id === id ? { ...sect, ...updatedSecteur } : sect
            )
        );

        setShowUpdateModal(false);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du secteur :", error);
    }
};


    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Secteurs</li>
                </ol>
            </nav>

            <div className="row mb-3">
                <div className="col-md-6">
                </div>
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Rechercher un secteur..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="card shadow-sm p-3">
                <table className="table table-striped table-hover">
                    <thead className="table-light">
                        <tr  className="text-center">
                            <th>Libellé</th>
                            <th>Code</th>
                            <th>Nombre des structures</th>

                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {currentItems?.length > 0 ? (
                            currentItems?.map((secteur) => (
                                <tr key={secteur?._id}>
                                    <td>{secteur?.libelle}</td>
                                    <td>{secteur?.code}</td>
                                    <td>{secteur?.structureId?.length}</td>

                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm me-2"
                                            onClick={() => navigate(`/structure/${secteur?._id}`)}
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            className="btn btn-success btn-sm me-2"
                                            onClick={() => handleShowUpdate(secteur)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => {
                                                setSelectedSecteur(secteur);
                                                setShowDeleteModal(true);
                                            }}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">Aucun secteur trouvé</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, i) => (
                            <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                                <button onClick={() => paginate(i + 1)} className="page-link">
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Modal de mise à jour */}
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifier le Secteur</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
    <Form.Label>Libellé</Form.Label>
    <Form.Control 
        type="text" 
        value={libelle} 
        onChange={(e) => setLibelle(e.target.value)} 
    />
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <Form.Label>Code</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={code} 
                                onChange={(e) => setCode(e.target.value)} 
                            />
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Fermer</Button>
                    <Button variant="primary"  onClick={() => handleUpdate(selectedSecteur?._id)}>Enregistrer</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de confirmation de suppression */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmer la suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Êtes-vous sûr de vouloir supprimer <strong>{selectedSecteur?.libelle}</strong> ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Annuler</Button>
                    <Button variant="danger" onClick={() => handleDelete(selectedSecteur?._id)}>Supprimer</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Secteurs;
