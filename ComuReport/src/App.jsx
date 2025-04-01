import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/colony-dashboard" element={<ColonyDashboard />}>
          
          <Route path="presidents" element={<Presidents />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        <Route path='/municipal-dashboard' element={<MunicipalDashboard />}>
          <Route path='colonies' element={<Colonies />} />
          <Route path='reports' element={<ReportsMunicipal />} />
          <Route path='areas' element={<Areas />} />
        </Route>

        <Route path='/state-dashboard' element={<StateDashboard />} >
          <Route path='municipios' element={<Municipios />} />
        </Route>

      </Routes>
    </Router>
  );
};

export default App;