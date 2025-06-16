import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={logout} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;