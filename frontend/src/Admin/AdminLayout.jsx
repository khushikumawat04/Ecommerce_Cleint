import Sidebar from "./Component/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ marginLeft: "240px", width: "100%", padding: "20px" }}>
        {children}
      </div>
    </div>
  );
}