import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom'; 
import Login from './auth/login';
import Register from './auth/Register';
import ProtectedRoute from './ProtectedRoute';
import Userhome from './component/Userhome';

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  const userType = window.localStorage.getItem("userType");

  return (
    <>
      {/* <Navbar isLoggedIn={isLoggedIn} userType={userType} /> */}

      <Routes>
        {!isLoggedIn && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login />} />
          </>
        )}

        <Route element={<ProtectedRoute />}>
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/register" element={<Navigate to="/" />} />
          {userType != "Admin" ? (
            <>
              <Route path="/" element={<Navigate to="/userDetails" />} />
              <Route path="/userDetails" element={<Userhome />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/admin-dashboard" />} />
              <Route path="/userDetails" element={<Navigate to="/" />} />
            </>
          )}
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
