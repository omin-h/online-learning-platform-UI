import React from 'react';
import Navbar from './navbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => (
  <div style={{ display: 'flex' }}>
    <Navbar />
    <div style={{ marginLeft: 250, padding: 24, width: '100%' }}>
      <Outlet />
    </div>
  </div>
);

export default MainLayout;