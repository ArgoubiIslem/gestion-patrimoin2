import React, { useState } from 'react';
import './style/Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8081/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Stocker le JWT dans le localStorage
        localStorage.setItem('token', data.accessToken);
        // Rediriger ou faire autre chose après une connexion réussie
        window.location.href = '/dashboard'; // Modifier en fonction de votre route
      } else {
        setError(data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      setError('Une erreur est survenue');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <form className="form-signin" onSubmit={handleSubmit}>
            <h1 className="h3 mb-3 font-weight-normal text-center">
              تسجيل الدخول
            </h1>
            <img
              src="flag).png"
              alt="Profile Image"
              className="profile-image"
            />

            <div className="form-group">
              <label htmlFor="username" className="sr-only">
                عنوان البريد الإلكتروني
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="form-control"
                autoComplete="email"
                required
                autoFocus
                placeholder="عنوان البريد الإلكتروني"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                autoComplete="current-password"
                required
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="btn btn-lg btn-primary btn-block btn-custom"
              type="submit"
            >
              تسجيل الدخول
            </button>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            <div className="text-center mt-3">
              <a href="/register" className="login-link">
                إنشاء حساب جديد
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
