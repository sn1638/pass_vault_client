import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import VaultList from './components/vault/VaultList';
import CreateVaultEntry from './components/vault/CreateVaultEntry';
import EditVaultEntry from './components/vault/EditVaultEntry';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <div>
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/vault"
            element={
              <ProtectedRoute>
                <VaultList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vault/create"
            element={
              <ProtectedRoute>
                <CreateVaultEntry />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vault/edit/:id"
            element={
              <ProtectedRoute>
                <EditVaultEntry />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/vault" />} />
        </Routes>
      </AuthProvider>
    </Router>
    </div>
  );
}

export default App;
