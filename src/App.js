import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./views/home/Home";
import Layout from "./views/home/Layout";
import Plan from "./views/plan/Plan";
import Activite from "./views/activites/Activite";
import Tache from "./views/taches/Tache";
import AddSecteur from "./views/secteur/AddSecteur";
import Participant from "./views/participant/Participant";
import Login from "./views/auth/Login";
import Forgot from "./views/auth/Forgot";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import AddParticipant from "./views/participant/AddParticipant";
import Secteurs from "./views/secteur/Secteurs";
import Structures from "./views/structure/Structures";
import AddStructure from "./views/structure/AddStructure";
import "react-toastify/dist/ReactToastify.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import Calendrier from "./views/calender/Calendrier";
import SousActivite from "./views/sousActivites/SousActivite";
import AddPlan from "./views/plan/AddPlan";
import AddActivite from "./views/activites/AddActivite";
import AddSousActivite from "./views/sousActivites/AddSousActivite";
import AddTache from "./views/taches/AddTache";
import Settings from "./views/auth/Settings";
import UserProfileCard from "./views/auth/Profile";
import Reset from "./views/auth/Reset";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Layout />} />
          <Route path="/plan/:StructureId" element={<Plan />} />
          <Route path="/addSecteur" element={<AddSecteur />} />
          <Route path="/secteurs" element={<Secteurs />} />
          <Route path="/structure/:secteurId" element={<Structures />} />
          <Route path="/addStructure/:secteurId" element={<AddStructure />} />
          <Route path="/addPlan/:structureId" element={<AddPlan />} />
          <Route path="/addActivite/:planId" element={<AddActivite />} />
          <Route
            path="/addSousActivite/:activiteId"
            element={<AddSousActivite />}
          />

          <Route path="/addTache/:sousActiviteId" element={<AddTache />} />

          <Route path="/activite/:planId" element={<Activite />} />
          <Route path="/SousActivite/:activiteId" element={<SousActivite />} />
          <Route path="/Tache/:sousActiviteId" element={<Tache />} />
          <Route path="/participant" element={<Participant />} />
          <Route path="/addParticipant" element={<AddParticipant />} />
          <Route path="/calendrier" element={<Calendrier />} />
          <Route path="/parametre" element={<Settings />} />
          <Route path="/profil" element={<UserProfileCard />} />
        </Route>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot"
          element={
            <PublicRoute>
              <Forgot />
            </PublicRoute>
          }
        />
        <Route
          path="/reset/:token"
          element={
            <PublicRoute>
              <Reset />
            </PublicRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
