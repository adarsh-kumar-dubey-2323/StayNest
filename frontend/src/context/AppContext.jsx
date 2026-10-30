
import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

// ========================================
// AXIOS CONFIGURATION
// ========================================

axios.defaults.withCredentials = true;

axios.defaults.baseURL = (
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

// ========================================
// CREATE CONTEXT
// ========================================

export const AppContext = createContext(null);

// ========================================
// APP CONTEXT PROVIDER
// ========================================

const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // AUTHENTICATION STATES
  const [user, setUser] = useState(null);
  const [owner, setOwner] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // HOTEL AND ROOM STATES
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);

  // ========================================
  // CHECK USER AUTHENTICATION
  // ========================================

  const checkUserLoggedInorNot = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");

      if (data.success && data.user) {
        setUser(data.user);

        if (data.user.role === "owner") {
          setOwner(data.user);
        } else {
          setOwner(null);
        }

        return data.user;
      }

      setUser(null);
      setOwner(null);

      return null;

    } catch (error) {
      setUser(null);
      setOwner(null);

      console.debug(
        "Authentication check:",
        error.response?.status || error.message
      );

      return null;

    } finally {
      setAuthLoading(false);
    }
  }, []);

  // ========================================
  // FETCH ALL HOTELS
  // ========================================

  const fetchHotels = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/hotel/get-all");

      if (data.success) {
        setHotels(data.hotels || []);
      } else {
        setHotels([]);

        console.error(
          "Hotel fetch failed:",
          data.message
        );
      }

    } catch (error) {
      console.error(
        "Fetch hotels error:",
        error.response?.data || error.message
      );

      setHotels([]);
    }
  }, []);

  // ========================================
  // FETCH ALL ROOMS
  // ========================================

  const fetchRooms = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/room/get-all");

      if (data.success) {
        setRooms(data.rooms || []);
      } else {
        setRooms([]);

        console.error(
          "Room fetch failed:",
          data.message
        );
      }

    } catch (error) {
      console.error(
        "Fetch rooms error:",
        error.response?.data || error.message
      );

      setRooms([]);
    }
  }, []);

  // ========================================
  // REFRESH APP DATA
  // ========================================

  const refreshAppData = useCallback(async () => {
    await Promise.all([
      checkUserLoggedInorNot(),
      fetchHotels(),
      fetchRooms(),
    ]);
  }, [
    checkUserLoggedInorNot,
    fetchHotels,
    fetchRooms,
  ]);

  // ========================================
  // INITIAL DATA LOADING
  // ========================================

  useEffect(() => {
    checkUserLoggedInorNot();
    fetchHotels();
    fetchRooms();
  }, [
    checkUserLoggedInorNot,
    fetchHotels,
    fetchRooms,
  ]);

  // ========================================
  // CONTEXT VALUES
  // ========================================

  const value = {
    // Navigation
    navigate,

    // Axios
    axios,

    // Authentication
    user,
    setUser,
    owner,
    setOwner,
    authLoading,
    checkUserLoggedInorNot,

    // Hotels
    hotels,
    setHotels,
    fetchHotels,

    // Rooms
    rooms,
    setRooms,
    fetchRooms,

    // Refresh
    refreshAppData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
