import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style/Dashboard.css';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprimer le token JWT du localStorage
    localStorage.removeItem('token');
    // Rediriger vers la page de connexion ou une autre page appropriée
    navigate('/login'); // Utilisez useNavigate ou l'approche de navigation que vous préférez
  };
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenPayload = token.split('.')[1];
      const decodedTokenPayload = atob(tokenPayload);
      const parsedTokenPayload = JSON.parse(decodedTokenPayload);
      const username = parsedTokenPayload.sub; // 'sub' est le champ contenant le nom d'utilisateur
      setUsername(username);
    }
  }, []);
  return (
    <div className="sidebar">
      <h2>القائمة الجانبية</h2>
      <p>
        مرحباً بك، <span>{username}</span>
      </p>
      <nav>
        <ul>
          <li>
            <Link to="/dashboard">لوحة القيادة</Link>
          </li>
          <li>
            <Link to="/gestiondebien">الأملاك البلدية</Link>
          </li>
          <li>
            <Link to="/settings">الإعدادات</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-button">
              تسجيل الخروج
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
