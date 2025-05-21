import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FolderIcon,
  ScrollText,
  UsersIcon,
  HomeIcon,
  ChevronLeft,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.FC<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Patients", href: "/patients", icon: UsersIcon },
  { name: "Raw SQL Interface", href: "/sql-interface", icon: ScrollText },
  { name: "Patients Records", href: "/records", icon: FolderIcon },
];

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
}: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      <div
        className={`${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } fixed inset-0 z-20 bg-gray-900 bg-opacity-50 transition-opacity md:hidden`}
        onClick={toggleSidebar}
      />
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transition-transform transform md:translate-x-0 md:static md:inset-auto md:flex flex-col flex-shrink-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">PMS</h1>
              <p className="text-xs text-gray-500">Patient Management System</p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleSidebar}
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-2 py-2 text-sm font-medium rounded-md group
                  ${
                    isActive
                      ? "bg-gray-100 bg-opacity-10 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center p-4 border-t border-gray-200">
          <div className="flex-shrink-0">
            <div className="bg-gray-800 rounded-full h-8 w-8 flex items-center justify-center text-white">
              R
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Dr. Rajesh</p>
            <p className="text-xs text-gray-500">Rajesh@gmail.com</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
