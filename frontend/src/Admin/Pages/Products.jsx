import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";
import "../Styles/products.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Products() {

  const [products, setProducts] = useState([]);
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const load = async () => {
    const res = await axios.get(
      `${baseURL}/api/admin/products`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    setProducts(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const deleteProduct = async (id) => {
    await axios.delete(
      `${baseURL}/api/admin/product/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    load();
  };

  return (
    <AdminLayout>

      <div className="container-fluid">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">📦 All Products</h2>
          <Link to="/admin/add-product" className="btn btn-success">
            + Add Product
          </Link >
        </div>

        {/* TABLE CARD */}
        <div className="card shadow-sm border-0">

          <div className="card-body p-0">

            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead style={{ background: "var(--primary-green)", color: "white" }}>
                  <tr>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        No Products Found
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p._id}>

                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="product-avatar">
                              {p.name?.charAt(0)}
                            </div>
                            <strong>{p.name}</strong>
                          </div>
                        </td>

                        <td>
                          <span className="badge bg-warning text-dark">
                            ₹{p.price}
                          </span>
                        </td>

                        <td>
                          <span className={`badge ${p.stock > 0 ? "bg-success" : "bg-danger"}`}>
                            {p.stock}
                          </span>
                        </td>

                        <td className="text-center">
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteProduct(p._id)}
                          >
                            Delete
                          </button>

                          <button
                            className="btn btn-warning btn-sm mx-2"
                           onClick={() => navigate(`/admin/edit-product/${p._id}`)}
                          >
                            Edit
                          </button>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </AdminLayout>
  );
}