import React, { useContext } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Aboutus from "./pages/Aboutus";
import Hotel from "./pages/Hotel";
import Rooms from "./pages/Rooms";
import SingleRoom from "./pages/Singleroom";
import Mybookings from "./pages/Mybookings.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Admin from "./pages/owner/Admin.jsx";
import OwnerLayout from "./pages/owner/OwnerLayout.jsx";
import RegisterHotel from "./pages/owner/RegisterHotel.jsx";
import Bookings from "./pages/owner/Bookings.jsx";
import AllRoom from "./pages/owner/AllRoom.jsx";
import AllHotels from "./pages/owner/AllHotels.jsx";
import AddRoom from "./pages/owner/AddRoom.jsx";
import { AppContext } from "./context/AppContext.jsx";
import Loader from "./components/Loader.jsx";

const App = () => {
  const location = useLocation();
  const ownerPath = location.pathname.startsWith("/owner");
  const { owner, authLoading } = useContext(AppContext);

  if (authLoading && ownerPath) {
    return <div className="flex min-h-screen items-center justify-center text-gray-600">Checking session...</div>;
  }

  const isOwner = Boolean(owner && owner.role === "owner");

  return (
    <div className="mx-auto w-full">
      {!ownerPath && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/hotel" element={<Hotel />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:id" element={<SingleRoom />} />
        <Route path="/mybookings" element={<Mybookings />} />
        <Route path="/loader/:nextUrl" element={<Loader />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/owner" element={isOwner ? <OwnerLayout /> : <Navigate to="/login" replace />}>
          <Route index element={<AllHotels />} />
          <Route path="allhotels" element={<AllHotels />} />
          <Route path="admin" element={<Admin />} />
          <Route path="addroom" element={<AddRoom />} />
          <Route path="allroom" element={<AllRoom />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="registerhotel" element={<RegisterHotel />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!ownerPath && <Footer />}
    </div>
  );
};

export default App;
