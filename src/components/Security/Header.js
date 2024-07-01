import React from 'react';
import './style/Dashboard.css'; 

export default function Header() {
  return (
    <div className="header">
      
      <div className="notification-icon">
        <span>🔔</span>
      </div>
      <input type="text" placeholder="ابحث هنا..." />
      {/* Ajoutez d'autres éléments du header ici */}
    </div>
  );
}
