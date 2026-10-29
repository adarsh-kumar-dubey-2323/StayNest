import React, { createContext, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [owner, setOwner] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);

  const checkUserLoggedInorNot = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success && data.user) {
        setUser(data.user);
        setOwner(data.user.role === "owner" ? data.user : null);
      } else {
        setUser(null);
        setOwner(null);
      }
    } catch (error) {
      setUser(null);
      setOwner(null);
      // Avoid showing a toast on every public page when a guest is not logged in.
      console.debug("No active login session:", error.response?.status || error.message);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const fetchHotels = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/hotel/get-all");
      if (data.success) setHotels(data.hotels || []);
      else toast.error(data.message || "Failed to fetch hotels.");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to fetch hotels.");
    }
  }, []);

  const fetchRooms = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/room/get-all");
      if (data.success) setRooms(data.rooms || []);
      else toast.error(data.message || "Failed to fetch rooms.");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to fetch rooms.");
    }
  }, []);

  useEffect(() => {
    checkUserLoggedInorNot();
    fetchHotels();
    fetchRooms();
  }, [checkUserLoggedInorNot, fetchHotels, fetchRooms]);

  const value = {
    navigate, axios, user, setUser, owner, setOwner,
    hotels, setHotels, fetchHotels,
    rooms, setRooms, fetchRooms, authLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
