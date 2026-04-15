import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../componenets/Navbar";
import Footer from "../componenets/Footer";
import "../styles/profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [newAddress, setNewAddress] = useState({});
  const baseURL = process.env.REACT_APP_API_URL;

  const fetchProfile = async () => {
    const res = await axios.get(`${baseURL}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    setUser(res.data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const addAddress = async () => {
    await axios.post(`${baseURL}/api/auth/address`, newAddress, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    fetchProfile();
    setNewAddress({});
  };

  const deleteAddress = async (id) => {
    await axios.delete(`${baseURL}/api/auth/address/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    fetchProfile();
  };

  if (!user) return <p>Loading...</p>;

 return (
  <>
    <Navbar />

    <div className="profile-container">
      <div className="profile-card">

        <h2 className="profile-title">👤 My Profile</h2>

        <div className="user-info">
          <p><span>Name:</span> {user.name}</p>
          <p><span>Email:</span> {user.email}</p>
        </div>

        <h3 className="section-title">📍 My Addresses</h3>

        <div className="address-list">
          {user.addresses.length > 0 ? (
            user.addresses.map(addr => (
              <div key={addr._id} className="address-box">
                <p className="addr-name">{addr.name}</p>
                <p>{addr.houseNo}, {addr.addressLine}</p>
                <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                <p>📞 {addr.phone}</p>

                <button 
                  className="delete-btn"
                  onClick={() => deleteAddress(addr._id)}
                >
                  Delete ❌
                </button>
              </div>
            ))
          ) : (
            <p>No addresses found</p>
          )}
        </div>

        <h3 className="section-title">➕ Add New Address</h3>

        <div className="address-form">
          <input placeholder="Full Name"
            onChange={e => setNewAddress({...newAddress, name: e.target.value})} />

          <input placeholder="Phone"
            onChange={e => setNewAddress({...newAddress, phone: e.target.value})} />

          <input placeholder="House No"
            onChange={e => setNewAddress({...newAddress, houseNo: e.target.value})} />

          <input placeholder="Address Line"
            onChange={e => setNewAddress({...newAddress, addressLine: e.target.value})} />

          <input placeholder="City"
            onChange={e => setNewAddress({...newAddress, city: e.target.value})} />

          <input placeholder="State"
            onChange={e => setNewAddress({...newAddress, state: e.target.value})} />

          <input placeholder="Pincode"
            onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} />

          <button className="add-btn" onClick={addAddress}>
            Add Address ➕
          </button>
        </div>

      </div>
    </div>

    <Footer />
  </>
); 
}

export default Profile;