import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";
import Home from "./pages/Home";
import MovieList from "./pages/MovieList";
import MovieDetail from "./pages/MovieDetail";
import AdminPage from "./pages/AdminPage";
import Layout from "./components/Layout";
import NotFoundPage from "./pages/NotFoundPage";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                <ProtectedRoute redirectTo="/">
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/movies/:category"
              element={
                <ProtectedRoute>
                  <MovieList onBack={() => {}} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tv/:category"
              element={
                <ProtectedRoute>
                  <MovieList onBack={() => {}} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/movie/detail/:id"
              element={
                <ProtectedRoute>
                  <MovieDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tv/detail/:id"
              element={
                <ProtectedRoute>
                  <MovieDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
