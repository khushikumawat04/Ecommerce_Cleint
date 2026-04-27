import axios from "axios";
import AdminLayout from "../AdminLayout";
import ProductForm from "../Component/ProductForm";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const baseURL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const Navigate = useNavigate();
  const addProduct = async (data) => {
    await axios.post(`${baseURL}/api/admin/product/create`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    toast.success(" successfully added ");
    Navigate("/admin/products");
  };

  return (
    <AdminLayout>
      <h2>Add Product</h2>
      <ProductForm onSubmit={addProduct} />
    </AdminLayout>
  );
}