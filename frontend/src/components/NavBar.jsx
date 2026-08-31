import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="tab-navbar">
      <NavLink to="/news" className={({isActive}) => `tab-btn ${isActive ? 'active' : ''}`}>
        <i className="fa-solid fa-newspaper"></i> 경제 뉴스
      </NavLink>
      <NavLink to="/portfolio" className={({isActive}) => `tab-btn ${isActive ? 'active' : ''}`}>
        <i className="fa-solid fa-wallet"></i> 자산 현황
      </NavLink>
      <NavLink to="/indicators" className={({isActive}) => `tab-btn ${isActive ? 'active' : ''}`}>
        <i className="fa-solid fa-chart-line"></i> 시장 지표
      </NavLink>
    </nav>
  );
}
