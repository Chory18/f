import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Users from './Users';
import UserForm from './UserForm';
import { isAuthenticated } from './apiAuth';
import Register from './Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/users"
          element={isAuthenticated() ? <Users /> : <Navigate to="/login" />}
        />
        <Route
          path="/users/new"
          element={isAuthenticated() ? <UserForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/users/:id/edit"
          element={isAuthenticated() ? <UserForm /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/users" />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
