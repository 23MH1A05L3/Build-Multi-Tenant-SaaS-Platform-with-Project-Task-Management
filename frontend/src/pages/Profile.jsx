import { useAuth } from "../auth/AuthContext";
import DashboardNavbar from "../components/DashboardNavbar";
import "./Profile.css";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  const isSuperAdmin = user.role === "super_admin";
  const isTenantUser = user.role === "tenant_admin" || user.role === "user";

  return (
    <>
      <DashboardNavbar />

      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar">
              {user.full_name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h2>{user.full_name || "System User"}</h2>
              <span className={`role-badge ${user.role}`}>
                {user.role.replace("_", " ")}
              </span>
            </div>
          </div>

          <div className="profile-details">
            <ProfileItem label="User ID" value={user.id} />
            <ProfileItem label="Email" value={user.email} />

            {isTenantUser && (
              <ProfileItem label="Tenant ID" value={user.tenant_id} />
            )}

            <ProfileItem
              label="Status"
              value={user.is_active ? "Active" : "Inactive"}
              status={user.is_active}
            />

            {isSuperAdmin && (
              <>
                <div className="divider" />
                <h3 className="section-title">System Access</h3>
                <p className="system-note">
                  You have full system-wide administrative privileges.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function ProfileItem({ label, value, status }) {
  return (
    <div className="profile-item">
      <span className="label">{label}</span>
      <span className={`value ${status !== undefined ? (status ? "active" : "inactive") : ""}`}>
        {value}
      </span>
    </div>
  );
}
