
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Calculator, TrendingUp, Settings } from "lucide-react";
import { AppTutorial } from "./AppTutorial";
import { AnimatePresence, motion } from "framer-motion";

const NavLayout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppTutorial />
      
      <main className="flex-1 overflow-auto pb-16">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
          <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0}}
              transition={{ duration: 0.15, ease: "circIn" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-lg z-50">
        <div className="max-w-md mx-auto px-6">
          <div className="flex justify-around py-2">
            <NavLink to="/" className={({ isActive }) => 
              `flex items-center justify-center p-2 rounded-xl transition-all duration-500 ease-out min-w-[48px] h-12 ${
                isActive 
                  ? 'text-blue-600 bg-blue-50 scale-105 shadow-md border border-blue-100' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50/80 hover:scale-102'
              }`}
              end
            >
              <Calculator className="w-6 h-6 transition-transform duration-300" />
            </NavLink>
            
            <NavLink to="/sales" className={({ isActive }) => 
              `flex items-center justify-center p-2 rounded-xl transition-all duration-500 ease-out min-w-[48px] h-12 ${
                isActive 
                  ? 'text-blue-600 bg-blue-50 scale-105 shadow-md border border-blue-100' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50/80 hover:scale-102'
              }`}
            >
              <TrendingUp className="w-6 h-6 transition-transform duration-300" />
            </NavLink>

            <NavLink to="/settings" className={({ isActive }) => 
              `flex items-center justify-center p-2 rounded-xl transition-all duration-500 ease-out min-w-[48px] h-12 ${
                isActive 
                  ? 'text-blue-600 bg-blue-50 scale-105 shadow-md border border-blue-100' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50/80 hover:scale-102'
              }`}
            >
              <Settings className="w-6 h-6 transition-transform duration-300" />
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavLayout;
