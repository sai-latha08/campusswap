import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/user/ProfilePage';
import EditProfilePage from './pages/user/EditProfilePage';
import DashboardPage from './pages/dashboard/DashboardPage';

// Skill Exchange Pages
import ExploreSkillsPage from './pages/skills/ExploreSkillsPage';
import MySkillsPage from './pages/skills/MySkillsPage';
import SkillRequestsPage from './pages/skills/SkillRequestsPage';
import SkillSessionsPage from './pages/skills/SkillSessionsPage';

// Student Rental Marketplace Pages
import ExploreRentalsPage from './pages/rentals/ExploreRentalsPage';
import ItemDetailPage from './pages/rentals/ItemDetailPage';
import CreateItemPage from './pages/rentals/CreateItemPage';
import MyItemsPage from './pages/rentals/MyItemsPage';
import RentalBookingsPage from './pages/rentals/RentalBookingsPage';

// Signature Skill-for-Item Barter Pages
import BarterExplorePage from './pages/barter/BarterExplorePage';
import BarterRequestsPage from './pages/barter/BarterRequestsPage';

// Real-time Messaging Page
import MessagesPage from './pages/messages/MessagesPage';

// Reviews & Trust Reputation Page
import ReviewsPage from './pages/reviews/ReviewsPage';

// Notification Center Page
import NotificationsPage from './pages/notifications/NotificationsPage';

// Admin Moderation Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminItemsPage from './pages/admin/AdminItemsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

import NotFound from './pages/NotFound';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import { setUser, logout, setLoading } from './store/authSlice';
import api from './services/api';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user has an existing token on app mount
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch(setLoading(false));
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          dispatch(setUser(res.data.data.user));
        } else {
          dispatch(logout());
        }
      } catch (err) {
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Public Routes */}
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="users/:id" element={<ProfilePage />} />

          {/* Skill Exchange Routes */}
          <Route path="skills" element={<ExploreSkillsPage />} />
          <Route path="skills/explore" element={<ExploreSkillsPage />} />
          <Route
            path="skills/my-skills"
            element={
              <ProtectedRoute>
                <MySkillsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="skills/requests"
            element={
              <ProtectedRoute>
                <SkillRequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="skills/sessions"
            element={
              <ProtectedRoute>
                <SkillSessionsPage />
              </ProtectedRoute>
            }
          />

          {/* Student Rental Marketplace Routes */}
          <Route path="rentals" element={<ExploreRentalsPage />} />
          <Route path="rentals/explore" element={<ExploreRentalsPage />} />
          <Route path="rentals/:id" element={<ItemDetailPage />} />
          <Route
            path="rentals/create"
            element={
              <ProtectedRoute>
                <CreateItemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="rentals/my-items"
            element={
              <ProtectedRoute>
                <MyItemsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="rentals/bookings"
            element={
              <ProtectedRoute>
                <RentalBookingsPage />
              </ProtectedRoute>
            }
          />

          {/* Signature Skill ↔ Item Barter Routes */}
          <Route path="barter" element={<BarterExplorePage />} />
          <Route
            path="barter/requests"
            element={
              <ProtectedRoute>
                <BarterRequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="barter/sent"
            element={
              <ProtectedRoute>
                <BarterRequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="barter/received"
            element={
              <ProtectedRoute>
                <BarterRequestsPage />
              </ProtectedRoute>
            }
          />

          {/* Real-time Messaging Route */}
          <Route
            path="messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />

          {/* Authenticated User Routes */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile/edit"
            element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="reviews"
            element={
              <ProtectedRoute>
                <ReviewsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Moderation Routes (Protected by AdminRoute) */}
          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="admin/items"
            element={
              <AdminRoute>
                <AdminItemsPage />
              </AdminRoute>
            }
          />
          <Route
            path="admin/reports"
            element={
              <AdminRoute>
                <AdminReportsPage />
              </AdminRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
