import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams  } from "react-router-dom";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";
import structure from "../../services/structure";

function Structure() {
  const { secteurId } = useParams(); // 
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedStructure, setSelectedStructure] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [nom, setNom] = useState("");
    const [lieu, setLieu] = useState("");

    const navigate = useNavigate();

   useEffect(() => {
        const getStructures = async () => {
            try {
                const res = await structure.getStructure();
                const allStructures = res?.data?.data;
                console.log("Toutes les structures récupérées :", allStructures);
        console.log("Secteur ID recherché :", secteurId);

        const filteredStructures = allStructures?.filter(struc => struc?.secteurId?.toString() === secteurId.toString());
        console.log("Structures après filtrage :", filteredStructures);


                setData(filteredStructures);
                setFilteredData(filteredStructures);
            } catch (error) {
                console.error("Erreur lors de la récupération des structures :", error);
            }
        };

        getStructures();
    }, [secteurId]);

    // Fonction pour filtrer la liste en fonction de la recherche
    useEffect(() => {
        setFilteredData(
            data.filter((structure) =>
                structure?.nom?.toLowerCase().includes(search.toLowerCase())||
                structure?.lieu?.toLowerCase().includes(search.toLowerCase())

            )
        );
    }, [search, data]);

    // Pagination - Calcule les données à afficher
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Afficher le formulaire de mise à jour
const handleShowUpdate = (structure) => {
    setSelectedStructure(structure);
    setNom(structure?.nom || "");
    setLieu(structure?.lieu || "");
    setShowUpdateModal(true);
};


    // Supprimer un structure
    const handleDelete = async (id) => {
        try {
            await structure.deleteStructure(id);
            setData(data.filter((item) => item._id !== id));
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };
const handleUpdate = async (id) => {
    if (!id) return;

    const updatedStructure = {
        nom,
        lieu,
    };

    try {
        await structure.updateStructure(id, updatedStructure);

        // Mettre à jour la liste des secteurs
        setData((prevData) =>
            prevData.map((struc) =>
                struc._id === id ? { ...struc, ...updatedStructure } : struc
            )
        );

        setShowUpdateModal(false);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du structure :", error);
    }
};


    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item "><Link to="/secteurs">Secteur</Link></li>

                    <li className="breadcrumb-item active" aria-current="page">Structure</li>
                </ol>
            </nav>

          <div className="row mb-3 d-flex justify-content-between align-items-center">
    <div className="col-md-6">
        <input
            type="text"
            className="form-control"
            placeholder="Rechercher une structure..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
    </div>
    <div className="col-md-6 text-end">
        <button className="btn btn-primary" onClick={()=>navigate(`/addStructure/${secteurId}`)}>Ajouter une structure</button>
    </div>
</div>


            <div className="card shadow-sm p-3">
                <table className="table table-striped table-hover">
                    <thead className="table-light">
                        <tr  className="text-center">
                            <th>Nom</th>
                            <th>Lieu</th>

                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {currentItems?.length > 0 ? (
                            currentItems?.map((structure) => (
                                <tr key={structure?._id}>
                                    <td>{structure?.nom}</td>
                                    <td>{structure?.lieu}</td>
                                

                                    <td>
                                      
                                        <button
                                            className="btn btn-primary btn-sm me-2"
                                            onClick={() => navigate(`/plan/${structure?._id}`)}
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            className="btn btn-success btn-sm me-2"
                                            onClick={() => handleShowUpdate(structure)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => {
                                                setSelectedStructure(structure);
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
                                <td colSpan="3" className="text-center">Aucun structure trouvé</td>
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
                    <Modal.Title>Modifier le Structure</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
    <Form.Label>Nom</Form.Label>
    <Form.Control 
        type="text" 
        value={nom} 
        onChange={(e) => setNom(e.target.value)} 
    />
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <Form.Label>Lieu</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={lieu} 
                                onChange={(e) => setLieu(e.target.value)} 
                            />
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Fermer</Button>
                    <Button variant="primary"  onClick={() => handleUpdate(selectedStructure?._id)}>Enregistrer</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de confirmation de suppression */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmer la suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Êtes-vous sûr de vouloir supprimer <strong>{selectedStructure?.nom}</strong> ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Annuler</Button>
                    <Button variant="danger" onClick={() => handleDelete(selectedStructure?._id)}>Supprimer</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Structure;
