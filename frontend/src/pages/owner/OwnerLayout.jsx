import { useContext } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  CalendarArrowDown,
  Warehouse,
} from "lucide-react";

import { toast } from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const OwnerLayout = () => {
  // Keep this name consistent with AppContext.jsx
  const { owner, setOwner, setUser, axios } = useContext(AppContext);

  const location = useLocation();
  const navigate = useNavigate();

  const dashboardIcon = (
    <svg
      className="w-6 h-6"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm16 14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2ZM4 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6Zm16-2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6Z"
      />
    </svg>
  );

  const sidebarLinks = [
    {
      name: "Dashboard",
      path: "/owner",
      icon: dashboardIcon,
    },
    {
      name: "Rooms",
      path: "/owner/allroom",
      icon: <Warehouse size={24} />,
    },
    {
      name: "Bookings",
      path: "/owner/bookings",
      icon: <CalendarArrowDown size={24} />,
    },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");

      if (data.success) {
        toast.success(data.message || "Logged out successfully!");

        setOwner(null);
        setUser(null);

        navigate("/");
      } else {
        toast.error(data.message || "Logout failed.");
      }
    } catch (error) {
      console.error("Logout error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to log out. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
        <Link to="/owner">
          <img
            className="h-9"
            src={assets.logo}
            alt="StayNest Logo"
          />
        </Link>

        <div className="flex items-center gap-5 text-gray-500">
          <p>
            Hi! {owner?.name || "Owner"}
          </p>

          <button
            type="button"
            onClick={logout}
            className="border border-gray-300 rounded-full text-sm px-4 py-1 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex min-h-[calc(100vh-65px)]">
        {/* Sidebar */}
        <aside className="md:w-64 w-16 shrink-0 border-r border-gray-300 bg-white text-base pt-4 flex flex-col">
          {sidebarLinks.map((item) => {
            const isActive =
              item.path === "/owner"
                ? location.pathname === "/owner"
                : location.pathname === item.path ||
                  location.pathname.startsWith(
                    `${item.path}/`
                  );

            return (
              <Link
                to={item.path}
                key={item.path}
                className={`flex items-center py-3 px-4 gap-3 transition-all ${
                  isActive
                    ? "border-r-4 md:border-r-[6px] bg-indigo-500/10 border-indigo-500 text-indigo-500"
                    : "hover:bg-gray-100 border-transparent text-gray-700"
                }`}
              >
                {item.icon}

                <span className="hidden md:block">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </aside>

        {/* Page Content */}
        <main className="flex-1 min-w-0 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;
