import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { logout, selectCurrentUser, selectIsAuthenticated } from '../store/authSlice';
import api from '../services/api';

export default function MainLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (_) {
      // Ignore errors — still log out locally
    } finally {
      dispatch(logout());
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
