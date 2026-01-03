import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import api from "../api/client";
import DashboardNavbar from "../components/DashboardNavbar";
import "./Settings.css";

export default function Settings() {
  const { user } = useAuth();

  // 🔒 Hooks always run
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [subscriptionPlan, setSubscriptionPlan] = useState("");
  const [saving, setSaving] = useState(false);

  const isSuperAdmin = user?.role === "super_admin";
  const isTenantAdmin = user?.role === "tenant_admin";

  // Initialize user state
  useEffect(() => {
    if (!user) return;

    setFullName(user.full_name || "");
    setRole(user.role);
    setIsActive(Boolean(user.is_active));
  }, [user]);

  // ✅ Fetch tenant subscription plan (read-only)
  useEffect(() => {
    if (!isTenantAdmin || !user?.tenant_id) return;

    async function loadTenantPlan() {
      try {
        const res = await api.get(`/tenants/${user.tenant_id}`);
        setSubscriptionPlan(res.data.data.subscription_plan);
      } catch (err) {
        console.error("Failed to load subscription plan", err);
      }
    }

    loadTenantPlan();
  }, [isTenantAdmin, user]);

  async function handleSave() {
    try {
      setSaving(true);

      const payload = { full_name: fullName };

      if (isTenantAdmin) {
        payload.role = role;
        payload.is_active = isActive;
      }

      await api.put(`/users/${user.id}`, payload);

      alert("Settings updated successfully");
      window.location.reload();
    } catch (err) {
      console.error("Settings update failed", err);
      alert("Failed to update settings");
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <DashboardNavbar />

      {!user ? (
        <div className="settings-loading">Loading settings...</div>
      ) : (
        <div className="settings-page">
          <div className="settings-card">
            <h1>Account Settings</h1>

            <div className="section">
              <label>User ID</label>
              <div className="readonly">{user.id}</div>
            </div>

            <div className="section">
              <label>Email</label>
              <div className="readonly">{user.email}</div>
            </div>

            <div className="section">
              <label>Full Name</label>
              <input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                disabled={isSuperAdmin}
              />
            </div>

            {!isSuperAdmin && (
              <div className="section">
                <label>Tenant ID</label>
                <div className="readonly">{user.tenant_id}</div>
              </div>
            )}

            {isTenantAdmin && (
              <>
                <div className="section">
                  <label>Role</label>
                  <select value={role} onChange={e => setRole(e.target.value)}>
                    <option value="user">User</option>
                    <option value="tenant_admin">Tenant Admin</option>
                  </select>
                </div>

                <div className="section checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={e => setIsActive(e.target.checked)}
                    />
                    Active
                  </label>
                </div>

                {/* 🔐 Subscription Plan (Read-only) */}
                <div className="section">
                  <label>Subscription Plan</label>
                  <div className={`plan-badge ${subscriptionPlan}`}>
                    {subscriptionPlan || "—"}
                  </div>
                </div>

                <div className="subscription-note">
                  Contact <strong>Super Admin</strong> to upgrade or modify your
                  subscription plan.
                </div>
              </>
            )}

            {isSuperAdmin && (
              <div className="system-note">
                You are a <strong>Super Admin</strong>.  
                System-level account — edits disabled.
              </div>
            )}

            {!isSuperAdmin && (
              <button
                className="save-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
