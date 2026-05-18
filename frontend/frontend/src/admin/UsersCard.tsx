type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function UsersCard({ users }: { users: User[] }) {
  return (
    <div className="card">
      <h2>Users</h2>

      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        {users.map((u) => (
          <div
            key={u.id}
            style={{
              padding: 10,
              border: "1px solid #334155",
              borderRadius: 10,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <strong>{u.name}</strong>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>
                {u.email}
              </div>
            </div>

            <span
              style={{
                padding: "4px 10px",
                borderRadius: 999,
                fontSize: 12,
                background:
                  u.role === "Admin"
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(148,163,184,0.15)",
                color:
                  u.role === "Admin"
                    ? "#22c55e"
                    : "#94a3b8",
              }}
            >
              {u.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}