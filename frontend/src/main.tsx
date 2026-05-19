import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

function App() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">LeaveFlow Starter</p>
        <h1>Leave Management System</h1>
        <p className="subtitle">
          Initial frontend scaffold. Feature branches will add authentication,
          dashboards, leave forms, admin pages, and API integration.
        </p>
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
