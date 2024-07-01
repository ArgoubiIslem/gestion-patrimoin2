// src/Dashboard.js

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './style/Dashboard.css';
import { Navigate } from 'react-router-dom';

import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const barData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'الممتلكات المسجلة',
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(75,192,192,0.6)',
      hoverBorderColor: 'rgba(75,192,192,1)',
      data: [65, 59, 80, 81, 56, 55],
    },
  ],
};

const lineData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'عدد التدخلات المخططة',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55],
    },
  ],
};

export default function Dashboard() {
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="App">
      <Sidebar />
      <header className="header">
        <Header />
      </header>
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>الممتلكات المسجلة</h3>
          <p>عدد الممتلكات المسجلة: 50</p>
        </div>
        <div className="dashboard-card">
          <h3>التدخلات المخططة</h3>
          <p>عدد التدخلات المخططة: 20</p>
        </div>
        <div className="dashboard-card">
          <h3>الموارد المتاحة</h3>
          <p>عدد الموارد المتاحة: 15</p>
        </div>
        <div className="dashboard-card">
          <h3>الاقتراحات المقدمة</h3>
          <p>عدد الاقتراحات المقدمة: 10</p>
        </div>
      </div>
      <div className="chart-container">
        <div className="chart-card">
          <h3>إحصائيات الممتلكات المسجلة</h3>
          <Bar data={barData} />
        </div>
        <div className="chart-card">
          <h3>إحصائيات التدخلات المخططة</h3>
          <Line data={lineData} />
        </div>
      </div>
      <div className="dashboard-table">
        <h3>جدول البيانات</h3>
        <table>
          <thead>
            <tr>
              <th>العنوان</th>
              <th>التاريخ</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>بيان 1</td>
              <td>2023-01-01</td>
              <td>مكتمل</td>
            </tr>
            <tr>
              <td>بيان 2</td>
              <td>2023-02-01</td>
              <td>قيد التنفيذ</td>
            </tr>
            <tr>
              <td>بيان 3</td>
              <td>2023-03-01</td>
              <td>مخطط</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
