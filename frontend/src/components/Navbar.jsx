import React, { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AppContext } from "../context/AppContext.jsx";

const Navbar = () => {
    const { navigate, user, owner, setUser, setOwner, axios } = useContext(AppContext);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Hotels", path: "/Hotel" },
        { name: "Rooms", path: "/Rooms" },
        { name: "About", path: "/Aboutus" },  
    ];

    const [isMenuOpen, setIsMenuOpen] = useState(false);


    const logout = async () => {
        try{
            const {data} = await axios.get("/api/user/logout");
            if(data.success){
                toast.success(data.message || "Logged out successfully.");
                setUser(null);
                setOwner(null);
                setIsMenuOpen(false);
                navigate("/");
            }
            else{
                toast.error(data.message);
              }
        }
        catch(error){
            toast.error(error.response?.data?.message || error.message || "Logout failed.");
        }
    }

    return (
        <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 bg-[#ff6347] shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4 z-50">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
                <img src={assets.logo} alt="logo" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link, i) => (
                    <Link
                        key={i}
                        to={link.path}
                        className="group flex flex-col gap-0.5 text-white"
                    >
                        {link.name}

                        <div className="bg-white h-0.5 w-0 group-hover:w-full transition-all duration-300" />
                    </Link>
                ))}

                {/* <button
                    onClick={() => navigate("/owner")}
                    className="border border-white px-4 py-1 text-sm font-light rounded-full cursor-pointer text-white transition-all hover:bg-white hover:text-[#ff6347]"
                >
                    Owner
                </button> */}
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-3">
                {user ? (
                    <>
                        {owner?.role === "owner" ? (
                            <button onClick={() => navigate("/owner")} className="rounded-full border border-white px-5 py-2 text-white hover:bg-white hover:text-black">
                                Dashboard
                            </button>
                        ) : (
                            <button onClick={() => navigate("/mybookings")} className="rounded-full border border-white px-5 py-2 text-white hover:bg-white hover:text-black">
                                My Bookings
                            </button>
                        )}
                        <button onClick={logout} className="rounded-full bg-white px-6 py-2.5 text-black transition hover:bg-amber-300">
                            Logout
                        </button>
                    </>
                ) : (
                    <button onClick={() => navigate("/login")} className="ml-4 rounded-full bg-white px-8 py-2.5 text-black transition-all duration-300 hover:bg-amber-300">
                        Login
                    </button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">

                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 rounded-full bg-white text-black cursor-pointer hover:bg-[#fbbf24] hover:text-white transition-all"
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <line x1="4" y1="6" x2="20" y2="6" />
                        <line x1="4" y1="12" x2="20" y2="12" />
                        <line x1="4" y1="18" x2="20" y2="18" />
                    </svg>
                </button>

            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-[#ff6347] shadow-md flex flex-col items-center gap-5 py-6 md:hidden">

                    {navLinks.map((link, i) => (
                        <Link
                            key={i}
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-white hover:text-yellow-300 transition-all"
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* New Launch */}
                    {/* <button
                         onClick={() => {
                            setIsMenuOpen(false);
                            navigate("/owner");
                        }}
                        className="px-5 py-2 rounded-full bg-white text-black cursor-pointer hover:bg-[#fbbf24] hover:text-white transition-all"
                    >
                        Owner
                    </button> */}

                    {/* Owner */}
                    {/* <button
                        className="px-5 py-2 rounded-full bg-white text-black cursor-pointer hover:bg-[#fbbf24] hover:text-white transition-all"
                    >
                        Owner
                    </button> */}

                    {user ? (
                        <>
                            <button onClick={() => { setIsMenuOpen(false); navigate(owner?.role === "owner" ? "/owner" : "/mybookings"); }} className="rounded-full bg-white px-5 py-2 text-black">
                                {owner?.role === "owner" ? "Dashboard" : "My Bookings"}
                            </button>
                            <button onClick={logout} className="rounded-full bg-white px-5 py-2 text-black">Logout</button>
                        </>
                    ) : (
                        <button onClick={() => { setIsMenuOpen(false); navigate("/login"); }} className="rounded-full bg-white px-5 py-2 text-black">
                            Login
                        </button>
                    )}

                </div>
            )}
        </nav>
    );
};

export default Navbar;