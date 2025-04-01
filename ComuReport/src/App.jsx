import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import PresidentDashboard from './pages/PresidentDashboard';
import ColonyDashboard from './pages/ColonyDashboard';
import MunicipalDashboard from './pages/MunicipalDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/president-dashboard" element={<PresidentDashboard />} />
        <Route path='/colony-dashboard' element={<ColonyDashboard />} />
        <Route path='/municipal-dashboard' element={<MunicipalDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;