import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Navbar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Branding Mode' },
    { path: '/product', label: 'Product Mode' },
    { path: '/reverse', label: 'Reverse Mode' }
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-blue-600">
            AI Asset Generator
          </Link>
          <div className="flex space-x-1">
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className="relative px-4 py-2 rounded-lg text-gray-600 hover:text-blue-600 transition-colors"
              >
                {location.pathname === path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-blue-50 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;