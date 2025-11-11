import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  TbDashboard,
  TbMenu2,
  TbUsers,
  TbSettings
} from "react-icons/tb";

import { BiLogOut } from "react-icons/bi";
import logo from "../assets/calling_agent.png";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export function AdmindminDashboard() {
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const navigate = useNavigate();
  const {logout:logoutuser} = useAuth()
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setShowSidebar(!mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function logout() {
    logoutuser();
    navigate("/login");
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", Icon: TbDashboard },
    { href: "/admin/user", label: "User", Icon: TbUsers },
    { href: "/admin/assistants", label: "Assistants", Icon: TbUsers },
    { href: "/admin/setting", label: "Setting", Icon: TbSettings },
    
  ];

  return (
    <div className="flex w-full overflow-x-hidden">
      <div
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out 
          ${
            showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-center -ml-10 mb-8">
            <img src={logo} alt="Logo" className="w-20 h-20 object-contain" />
          </div>

          <nav className="flex flex-col gap-2 flex-1">
            {navItems.map(({ href, label, Icon }) => (
              <NavLink
                key={href}
                to={href}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition 
                    ${
                      isActive
                        ? "bg-primary text-white shadow"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                }
                onClick={() => isMobile && setShowSidebar(false)}
              >
                <Icon size={20} />
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 mt-auto text-red-600 hover:text-red-700 px-4 py-2 rounded-md hover:bg-red-50 transition text-sm font-medium cursor-pointer"
          >
            <BiLogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {showSidebar && isMobile && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300 
          ${showSidebar ? "lg:ml-64" : "ml-0"}`}
      >
        <div className="lg:hidden sticky top-0 z-30 bg-white shadow-md px-4 py-3 flex items-center justify-between">
          <button onClick={() => setShowSidebar(true)}>
            <TbMenu2 size={24} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
        </div>

        <main className="flex-1  h-[100vh] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
