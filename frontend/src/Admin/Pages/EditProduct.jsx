import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ProductForm from "../Component/ProductForm";
import AdminLayout from "../AdminLayout";
import { toast } from "react-toastify";

export default function EditProduct() {

  const { id } = useParams();
  const navigate = useNavigate();

  const baseURL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");

  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(
        `${baseURL}/api/admin/product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProduct(res.data);
    };

    fetchProduct();
  }, [id]);

  const handleUpdate = async (data) => {
    await axios.put(
      `${baseURL}/api/admin/product/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    toast.success("Product Updated Successfully 🚀");
    navigate("/admin/products");
  };

  return (
    <div>
        <AdminLayout>

      <h2>✏️ Edit Product</h2>

      {product && (
        <ProductForm
          initialData={product}
          onSubmit={handleUpdate}
        />
      )}
</AdminLayout>
    </div>
  );
}