import React, { useState } from 'react';
import './style/Register.css';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: fullName,
          email,
          password,
          role: [role], // Sending role as an array (could be extended for multiple roles)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('User registered successfully!');
        setError(null);
        // Redirect to login or other page
        window.location.href = '/login';
      } else {
        setError(data.message || 'An error occurred');
      }
    } catch (error) {
      setError('An error occurred');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <form className="form-signup" onSubmit={handleSubmit}>
            <h1 className="h3 mb-3 font-weight-normal text-center">
              إنشاء حساب جديد
            </h1>
            <img
              src="flag).png"
              alt="Profile Image"
              className="profile-image"
            />

            <div className="form-group">
              <label htmlFor="fullName" className="sr-only">
                الاسم الكامل
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                className="form-control"
                required
                autoFocus
                placeholder="الاسم الكامل"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="sr-only">
                عنوان البريد الإلكتروني
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="form-control"
                required
                placeholder="عنوان البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="sr-only">
                كلمة المرور
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="form-control"
                required
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="sr-only">
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="form-control"
                required
                placeholder="تأكيد كلمة المرور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">الدور:</label>
              <select
                id="role"
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">مستخدم</option>
                <option value="admin">مدير</option>
                <option value="mod">مشرف</option>
              </select>
            </div>

            <button
              className="btn btn-lg btn-primary btn-block btn-custom"
              type="submit"
            >
              إنشاء حساب
            </button>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            {message && (
              <div className="alert alert-success mt-3">{message}</div>
            )}
            <div className="text-center mt-3">
              <a href="/login" className="login-link">
                تسجيل الدخول
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
