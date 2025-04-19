import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/fr";
import { Link } from "react-router-dom";
import plan from "../../services/plan";
import "react-big-calendar/lib/css/react-big-calendar.css"; // ✅ Ajout du CSS obligatoire
import { useSelector } from "react-redux";

moment.locale("fr");
const localizer = momentLocalizer(moment);

function Calendrier() {
    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date()); // ✅ Gérer la navigation
        const responsableId = useSelector((state) => state.auth.user.id);

    // ✅ Récupérer les plans depuis l'API backend
    const fetchPlans = async () => {
        try {
            const response = await plan.getPlan();
            const plans = response.data.data;
  const filteredPlans = plans.filter(plan => plan.responsableId === responsableId);
            // ✅ Transformer les plans en événements pour le calendrier
            const formattedEvents = filteredPlans.map(plan => ({
                title: plan.titre,
                start: new Date(plan.date_creation),
                end: new Date(plan.date_validation || plan.date_creation), // Par défaut, date_creation si validation absente
            }));

            setEvents(formattedEvents);
        } catch (error) {
            console.error("Erreur lors du chargement des plans:", error);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Calendrier</li>
                </ol>
            </nav>

            <div className="row">
                <div className="col-xxl">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h4 className="mb-4 text-center">📅 Planning des Plans</h4>
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                defaultDate={new Date()} // ✅ Positionner la date par défaut
                                date={currentDate} // ✅ Permet la navigation
                                onNavigate={(date) => setCurrentDate(date)} // ✅ Met à jour la date quand on change de vue
                                style={{ height: 500 }}
                                views={[ "month", "week", "day", "agenda" ]} // ✅ Bonne déclaration des vues
                                step={60} // Durée d'un pas en minutes
                                defaultView="month"
                                messages={{
                                    next: "Suivant",
                                    previous: "Précédent",
                                    today: "Aujourd'hui",
                                    month: "Mois",
                                    week: "Semaine",
                                    day: "Jour",
                                    agenda: "Agenda",
                                    noEventsInRange: "Aucun événement dans cette période",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Calendrier;
