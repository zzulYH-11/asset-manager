import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import Header from './components/Header';
import NavBar from './components/NavBar';
import Portfolio from './pages/Portfolio';
import News from './pages/News';
import Indicators from './pages/Indicators';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="app-container">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/news" element={<News />} />
                <Route path="/indicators" element={<Indicators />} />
                <Route path="*" element={<Navigate to="/portfolio" replace />} />
              </Routes>
            </main>
            <NavBar />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
