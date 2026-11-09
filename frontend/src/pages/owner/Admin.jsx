import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AppContext } from "../../context/AppContext";

const Admin = () => {
  const { axios } = useContext(AppContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState("");

  const loadApplications = async () => {
    try {
      const { data } = await axios.get("/api/owner-applications/admin");
      if (data.success) setApplications(data.applications || []);
      else toast.error(data.message || "Could not load applications.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadApplications(); }, []);

  const review = async (id, status) => {
    if (reviewing) return;
    try {
      setReviewing(id);
      const { data } = await axios.patch("/api/owner-applications/admin/" + id, { status });
      if (data.success) {
        toast.success(data.message);
        setApplications((current) => current.map((item) => item._id === id ? { ...item, status } : item));
      } else toast.error(data.message || "Review failed.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Review failed.");
    } finally {
      setReviewing("");
    }
  };

  const pendingCount = applications.filter((item) => item.status === "pending").length;
  return (
    <section>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-sm font-semibold text-indigo-600">STAYNEST ADMIN</p><h1 className="mt-1 text-2xl font-bold text-gray-900">Owner applications</h1><p className="mt-1 text-sm text-gray-500">Review property owners before granting dashboard access.</p></div>
        <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">{pendingCount} pending</span>
      </div>
      {loading ? <p className="text-gray-500">Loading applications...</p> : applications.length === 0 ? <div className="rounded-xl border bg-white p-8 text-center text-gray-500">No owner applications yet.</div> : (
        <div className="space-y-4">
          {applications.map((item) => (
            <article key={item._id} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><h2 className="text-lg font-bold text-gray-900">{item.hotelName}</h2><p className="mt-1 text-sm text-gray-600">{item.user?.name} · {item.user?.email}</p></div>
                <span className={"rounded-full px-3 py-1 text-xs font-semibold capitalize " + (item.status === "approved" ? "bg-green-100 text-green-700" : item.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800")}>{item.status}</span>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-gray-700 sm:grid-cols-2"><p><strong>Contact:</strong> {item.phone}</p><p><strong>Submitted:</strong> {new Date(item.createdAt).toLocaleString()}</p><p className="sm:col-span-2"><strong>Address:</strong> {item.hotelAddress}</p>{item.message && <p className="sm:col-span-2"><strong>Details:</strong> {item.message}</p>}</div>
              {item.status === "pending" && <div className="mt-5 flex flex-wrap gap-3"><button disabled={!!reviewing} onClick={() => review(item._id, "approved")} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{reviewing === item._id ? "Saving..." : "Approve owner"}</button><button disabled={!!reviewing} onClick={() => review(item._id, "rejected")} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">Reject</button></div>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Admin;
