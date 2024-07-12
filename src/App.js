import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Security/Dashboard';
import Login from './components/Security/Login';
import Register from './components/Security/Register';
import Gestiondebien from './components/Security/Gestiondebien';
import MaintenanceForm from './components/Security/MaintenanceForm';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/gestiondebien" element={<Gestiondebien />}></Route>
          <Route path="/maintenanceform" element={<MaintenanceForm />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
