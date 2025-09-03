import React from 'react';
import Home from './pages/Home';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { Navigate } from 'react-router-dom';


function App() {
  const { user } = useAuthContext();
  return (
    <React.StrictMode>
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!user ? <Navigate to="/login"/> : <Home />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <Signup />}
        />
      </Routes>
      </BrowserRouter>
    </div>
    </React.StrictMode>
  );
}

export default App;
