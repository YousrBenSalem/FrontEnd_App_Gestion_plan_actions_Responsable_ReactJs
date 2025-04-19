import React, { useEffect, useState } from "react";
import moment from "moment";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import planService from "../../services/plan";
import { useSelector } from "react-redux";

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Layout() {
    const [totalPlans, setTotalPlans] = useState(null);
    const [plansValides, setPlansValides] = useState(null);
    const [plansEnAttente, setPlansEnAttente] = useState(null);
    const [activites, setActivites] = useState({ todo: 0, enCours: 0, termine: 0 });
    const [recentPlans, setRecentPlans] = useState([]);
      const responsableId = useSelector((state) => state.auth.user.id);

    useEffect(() => {
        

const fetchData = async () => {
    try {
        const res = await planService.getPlan();
        const plans = res.data.data;

        if (!Array.isArray(plans)) {
            console.error("Erreur : plans n'est pas un tableau", plans);
            return;
        }

        // Filtrer les plans pour ne garder que ceux du responsable
        const filteredPlans = plans.filter(plan => plan.responsableId === responsableId);

        const formattedPlans = filteredPlans.map(plan => ({
            ...plan,
            date_creation: moment(plan.date_creation, "DD/MM/YYYY").format("YYYY-MM-DD"),
            date_validation: moment(plan.date_validation, "DD/MM/YYYY").format("YYYY-MM-DD")
        }));

        console.log("🔍 Plans récupérés:", formattedPlans);

        setTotalPlans(formattedPlans.length);
        setPlansValides(formattedPlans.filter(p => p.status === "Acceptable").length);
        setPlansEnAttente(formattedPlans.filter(p => p.status === "Pending").length);

        let todo = 0, enCours = 0, termine = 0;
        formattedPlans.forEach(plan => {
            if (Array.isArray(plan.activiteId)) {
                plan.activiteId.forEach(act => {
                    if (act.etat === "To Do") todo++;
                    else if (act.etat === "En cours") enCours++;
                    else termine++;
                });
            }
        });

        setActivites({ todo, enCours, termine });
        setRecentPlans(formattedPlans.slice(0, 5));

    } catch (error) {
        console.error("Erreur lors du chargement des plans:", error);
    }
};

        fetchData();
    }, []);

    // Données pour le graphique en camembert
    const pieData = {
        labels: ["Plans Validés", "Plans en Attente"],
        datasets: [
            {
                data: [plansValides, plansEnAttente],
                backgroundColor: ["#28a745", "#ffc107"],
            },
        ],
    };

    // Données pour le graphique en barres
    const barData = {
        labels: ["To Do", "En Cours", "Terminé"],
        datasets: [
            {
                label: "Nombre d'activités",
                data: [activites.todo, activites.enCours, activites.termine],
                backgroundColor: ["#007bff", "#ffc107", "#28a745"],
            },
        ],
    };

    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="row">
          {/* ✅ Statistiques Générales */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h5 className="card-title">📋 Nombre Total de Plans</h5>
                <h2 className="text-primary">
                  {totalPlans ?? "Chargement..."}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h5 className="card-title">⏳ Plans en Attente</h5>
                <h2 className="text-warning">
                  {plansEnAttente ?? "Chargement..."}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h5 className="card-title">✅ Plans Validés</h5>
                <h2 className="text-success">
                  {plansValides ?? "Chargement..."}
                </h2>
              </div>
            </div>
          </div>

          {/* ✅ Graphique des Plans Validés vs En Attente */}
          <div className="col-lg-6 col-md-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">📊 État des Plans</h5>
                {totalPlans !== null &&
                plansValides !== null &&
                plansEnAttente !== null ? (
                  <Pie data={pieData} width={150} height={150} />
                ) : (
                  <p>Chargement...</p>
                )}
              </div>
            </div>
          </div>

          {/* ✅ Graphique des Activités */}
          <div className="col-lg-6 col-md-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">📊 Progression des Activités</h5>
                {totalPlans !== null ? (
                  <Bar
                    data={barData}
                    options={{
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                ) : (
                  <p>Chargement...</p>
                )}
              </div>
            </div>
          </div>

          {/* ✅ Liste des derniers Plans */}
          <div className="col-lg-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">📅 Derniers Plans Créés</h5>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Titre</th>
                      <th>Date de Création</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPlans.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center">
                          Aucun plan trouvé
                        </td>
                      </tr>
                    ) : (
                      recentPlans.map((plan) => (
                        <tr key={plan._id}>
                          <td>{plan?.titre}</td>
                          <td>
                            {plan?.date_creation
                              ? new Date(
                                  plan.date_creation
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                plan?.status === "Acceptable"
                                  ? "bg-success"
                                  : "bg-warning"
                              }`}
                            >
                              {plan?.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Layout;