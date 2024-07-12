import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style/Dashboard.css';

export default function Sidebar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [isContractsOpen, setIsContractsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenPayload = token.split('.')[1];
      const decodedTokenPayload = atob(tokenPayload);
      const parsedTokenPayload = JSON.parse(decodedTokenPayload);
      const username = parsedTokenPayload.sub;
      setUsername(username);
    }
  }, []);

  const toggleContracts = () => {
    setIsContractsOpen(!isContractsOpen);
  };

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
            <Link to="/maintenanceform">الأنشطة المخططة</Link>
          </li>
          <li onClick={toggleContracts} className="has-submenu">
            العقود
            {isContractsOpen && (
              <ul className="submenu">
                <li>
                  <Link to="/salescontracts">عقود البيع</Link>
                </li>
                <li>
                  <Link to="/rentalcontracts">عقود الكراء</Link>
                </li>
              </ul>
            )}
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
