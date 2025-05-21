import { Menu } from "lucide-react";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 flex justify-between items-center h-16 px-4 md:px-6">
      <div className="flex items-center">
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700 focus:outline-none md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="ml-4 md:ml-0 text-lg font-semibold text-gray-800">
          Patient Records System
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 focus:outline-none">
          <div className="bg-gray-800 rounded-full h-8 w-8 flex items-center justify-center text-white">
            R
          </div>
          <span className="text-sm font-medium text-gray-700">Dr. Rajesh</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
