import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-secondary-50">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-6 pt-16 md:pt-6 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
}
