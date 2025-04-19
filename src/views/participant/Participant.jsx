import React, { useEffect, useState } from 'react';
import participant from '../../services/participant';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

function Participant() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // Stocke les données filtrées
    const [searchTerm, setSearchTerm] = useState(""); // Pour la recherche
    const [currentPage, setCurrentPage] = useState(1);
    const participantsPerPage = 4; // Nombre max de participants par page
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        getParticipant();
    }, []);

    const getParticipant = async () => {
        try {
            const res = await participant.getParticipant();
            setData(res.data.data);
            setFilteredData(res.data.data);
        } catch (error) {
            setError("Impossible de charger les participants.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Filtrage en temps réel des participants
    useEffect(() => {
        const filtered = data.filter(participant =>
            participant.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            participant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            participant.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Revenir à la première page après filtrage
    }, [searchTerm, data]);

    // ✅ Pagination : calcul des indices de début et fin
    const indexOfLastParticipant = currentPage * participantsPerPage;
    const indexOfFirstParticipant = indexOfLastParticipant - participantsPerPage;
    const currentParticipants = filteredData.slice(indexOfFirstParticipant, indexOfLastParticipant);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleUpdate = (id) => {
        const participantToUpdate = data.find(p => p._id === id);
        if (participantToUpdate) {
            setSelectedParticipant(participantToUpdate);
            setShowModal(true);
        } else {
            toast.error("Erreur : Participant introuvable !");
        }
    };

    const handleSaveChanges = async () => {
        if (!selectedParticipant || !selectedParticipant._id) {
            toast.error("Erreur : ID du participant introuvable !");
            return;
        }

        try {
            await participant.updateParticipant(selectedParticipant._id, selectedParticipant);
            getParticipant();
            setShowModal(false);
            toast.success("Participant mis à jour avec succès !");
        } catch (error) {
            toast.error("Échec de la mise à jour !");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce participant ?")) {
            try {
                await participant.deleteParticipant(id);
                getParticipant();
                toast.success("Participant supprimé avec succès !");
            } catch (error) {
                toast.error("Échec de la suppression !");
            }
        }
    };

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <ToastContainer />

            {/* ✅ Barre de recherche */}
            <Form className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Rechercher un participant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Form>

            {loading && <p>Chargement des participants...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && filteredData.length === 0 && <p>Aucun participant trouvé.</p>}

            <div className="row">
                {currentParticipants.map((participant, index) => (
                    <div key={participant.id || index} className="col-12 col-sm-6 col-lg-3">
                        <div className="single_advisor_profile wow fadeInUp" data-wow-delay={`${0.2 + index * 0.1}s`}>
                            <div className="advisor_thumb">
                                <img src={`http://localhost:3000/storage/${participant?.image}`} 
                                     alt={participant.nom} 
                                     style={{ width: '250px', height: '250px' }} />
                            </div>
                            <div className="single_advisor_details_info">
                                <h6>{participant.prenom} {participant.nom}</h6>
                                <p className="designation">{participant.email || "Participant"}</p>
                                <div className="button-group d-flex justify-content-around mt-3">
                                    <FaEdit 
                                        className="text-success cursor-pointer" 
                                        onClick={() => handleUpdate(participant._id)} 
                                        style={{ fontSize: '24px', marginRight: '15px' }} 
                                    />
                                    <FaTrashAlt 
                                        className="text-danger cursor-pointer" 
                                        onClick={() => handleDelete(participant._id)} 
                                        style={{ fontSize: '24px' }} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ✅ Pagination */}
            <nav className="mt-4">
                <ul className="pagination justify-content-center">
                    {[...Array(Math.ceil(filteredData.length / participantsPerPage)).keys()].map(number => (
                        <li key={number} className={`page-item ${currentPage === number + 1 ? "active" : ""}`}>
                            <button onClick={() => paginate(number + 1)} className="page-link">
                                {number + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* ✅ MODALE POUR L'UPDATE */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifier le Participant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedParticipant && (
                        <>
                            <div className="mb-3">
                                <label>Prénom</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={selectedParticipant.prenom} 
                                    onChange={(e) => setSelectedParticipant({...selectedParticipant, prenom: e.target.value})} 
                                />
                            </div>
                            <div className="mb-3">
                                <label>Nom</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={selectedParticipant.nom} 
                                    onChange={(e) => setSelectedParticipant({...selectedParticipant, nom: e.target.value})} 
                                />
                            </div>
                            <div className="mb-3">
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    value={selectedParticipant.email} 
                                    onChange={(e) => setSelectedParticipant({...selectedParticipant, email: e.target.value})} 
                                />
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Fermer</Button>
                    <Button variant="primary" onClick={handleSaveChanges}>Sauvegarder</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Participant;
