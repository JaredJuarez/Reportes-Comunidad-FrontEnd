import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ColonyDashboard from './pages/ColonyDashboard';
import Presidents from './pages/colony/Presidents';
import Reports from './pages/colony/Reports';
import MunicipalDashboard from './pages/MunicipalDashboard';
import Colonies from './pages/municipal/Colonias';
import ReportsMunicipal from './pages/municipal/Reports';
import Areas from './pages/municipal/Areas';
import StateDashboard from './pages/StateDashboard';
import Municipios from './pages/state/Municipios';
import AreaDashboard from './pages/AreaDashboard';
import StatusArea from './pages/area/StatusArea';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/colony-dashboard"
          element={
            <PrivateRoute>
              <ColonyDashboard />
            </PrivateRoute>
          }
        >
          <Route path="presidents" element={<Presidents />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        <Route
          path="/municipal-dashboard"
          element={
            <PrivateRoute>
              <MunicipalDashboard />
            </PrivateRoute>
          }
        >
          <Route path="colonies" element={<Colonies />} />
          <Route path="reports" element={<ReportsMunicipal />} />
          <Route path="areas" element={<Areas />} />
        </Route>

        <Route
          path="/state-dashboard"
          element={
            <PrivateRoute>
              <StateDashboard />
            </PrivateRoute>
          }
        >
          <Route path="municipios" element={<Municipios />} />
        </Route>
        
        <Route
          path="/area-dashboard"
          element={
            <PrivateRoute>
              <AreaDashboard />
            </PrivateRoute>
          }
        >
          <Route path="statusControl" element={<StatusArea />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;