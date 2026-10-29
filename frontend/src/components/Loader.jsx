import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

const Loader = () => {
  const { navigate } = useContext(AppContext);
  const { nextUrl } = useParams();

  useEffect(() => {
    if (!nextUrl) return undefined;
    const timeoutId = window.setTimeout(() => {
      navigate(`/${nextUrl}`);
    }, 1500);
    return () => window.clearTimeout(timeoutId);
  }, [nextUrl, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Loading">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
    </div>
  );
};

export default Loader;
