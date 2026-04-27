import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";
import "../Styles/admin.css";

function AdminDashboard() {

const [orders,setOrders]=useState([]);
const [selectedOrder,setSelectedOrder]=useState(null);

const [statusFilter,setStatusFilter]=useState("all");
const [dateFilter,setDateFilter]=useState("");

const baseURL=process.env.REACT_APP_API_URL;


useEffect(()=>{
 fetchOrders();
},[]);



const fetchOrders=async()=>{
try{

const res=await axios.get(
`${baseURL}/api/admin/orders`,
{
headers:{
Authorization:`Bearer ${localStorage.getItem("token")}`
}
}
);

setOrders(res.data.orders);

}catch(err){
console.error(err);
}
};



const updateStatus=async(id,status)=>{
try{
await axios.put(
`${baseURL}/api/admin/order/${id}`,
{status},
{
headers:{
Authorization:`Bearer ${localStorage.getItem("token")}`
}
}
);

fetchOrders();

}catch(err){
console.error(err);
}
};



const shipOrder=async(id)=>{
try{

const res=await axios.post(
`${baseURL}/api/admin/ship/${id}`,
{},
{
headers:{
Authorization:`Bearer ${localStorage.getItem("token")}`
}
}
);

alert(res.data.message);

/* avoid stale modal */
setSelectedOrder(null);

fetchOrders();

}catch(err){

alert(
err.response?.data?.message ||
"Shipping failed"
);

console.error(err);
}
};

// const syncTracking = async(id)=>{
// try{

// const res = await axios.get(
// `${baseURL}/api/admin/sync-shipment/${id}`,
// {
// headers:{
// Authorization:`Bearer ${localStorage.getItem("token")}`
// }
// }
// );

// alert(res.data.message);

// fetchOrders();

// }catch(err){

// alert(
// err.response?.data?.message ||
// "Sync failed"
// );

// }
// };


const filteredOrders=orders.filter(order=>{

if(
statusFilter!=="all" &&
order.orderStatus!==statusFilter
){
return false;
}

if(dateFilter){
const orderDate=
new Date(order.createdAt)
.toISOString()
.split("T")[0];

if(orderDate!==dateFilter){
return false;
}
}

return true;
});



return(
<>
 <AdminLayout>


<div className="admin-container">

<h2 className="admin-title">
📊 Admin Dashboard
</h2>


<div className="filters">

<select
value={statusFilter}
onChange={(e)=>
setStatusFilter(
e.target.value
)
}
>
<option value="all">All Orders</option>
<option value="created">Created</option>
<option value="confirmed">Confirmed</option>
<option value="shipped">Shipped</option>
<option value="delivered">Delivered</option>
<option value="cancelled">Cancelled</option>
</select>


<input
type="date"
value={dateFilter}
onChange={(e)=>
setDateFilter(
e.target.value
)
}
/>

</div>



<div className="table-wrapper">

<table className="admin-table">

<thead>
<tr>
<th>Order ID</th>
<th>Total</th>
<th>Status</th>
<th>Payment</th>
<th>Actions</th>
</tr>
</thead>


<tbody>

{filteredOrders.map(order=>(

<tr key={order._id}>

<td>
#{order._id.slice(-6)}

<br/>

<small className="order-date">
{
new Date(
order.createdAt
).toLocaleDateString()
}
</small>

</td>


<td className="price">
₹{order.totalAmount}
</td>


<td>
<span
className={`status-badge ${order.orderStatus}`}
>
{
order.orderStatus==="cancelled"
? "❌ Cancelled"
: order.orderStatus
}
</span>
</td>


<td>
<span
className={
order.paymentStatus==="paid"
? "payment paid"
: "payment pending"
}
>
{order.paymentStatus}
</span>
</td>


<td className="actions">

<select
className="status-dropdown"
disabled={
order.orderStatus==="cancelled"
}
value={order.orderStatus}
onChange={(e)=>
updateStatus(
order._id,
e.target.value
)
}
>
<option value="created">Created</option>
<option value="confirmed">Confirmed</option>
{/* <option value="shipped">Shipped</option> */}
<option value="delivered">Delivered</option>
</select>



<button
className="btn-view"
onClick={()=>
setSelectedOrder(order)
}
>
👁
</button>



{
  ["shipped", "delivered", "cancelled"].includes(order.orderStatus) ? (
    <div>
      <button disabled className="btn-ship shipped">
        {order.orderStatus === "delivered"
          ? "🎉 Delivered"
          : order.orderStatus === "cancelled"
          ? "❌ Cancelled"
          : "✅ Shipped"}
      </button>
    </div>
  ) : (
    <button
      className="btn-ship"
      onClick={() => shipOrder(order._id)}
    >
      🚚 Ship
    </button>

    /* <button
className="btn-sync"
onClick={()=>syncTracking(order._id)}
>
🔄 Sync
</button> */
  )
}

</td>

</tr>

))}

</tbody>

</table>

</div>
</div>




{/* MODAL */}

{selectedOrder && (

<div className="modal-overlay">

<div className="modal-box">

<h4>📦 Order Details</h4>


<div className="order-info">

<p>
<strong>ID:</strong>
{selectedOrder._id}
</p>

<p>
<strong>Total:</strong>
₹{selectedOrder.totalAmount}
</p>


<p>
<strong>Status:</strong>

<span
className={`status-badge ${selectedOrder.orderStatus}`}
>
{selectedOrder.orderStatus}
</span>

</p>


<p>
<strong>Payment:</strong>

<span
className={
selectedOrder.paymentStatus==="paid"
? "payment paid"
: "payment pending"
}
>
{selectedOrder.paymentStatus}
</span>

</p>

</div>


<hr/>


<h5>🛒 Items</h5>

{selectedOrder.items.map(
(item,i)=>(
<div
key={i}
className="item-row"
>
<span>{item.name}</span>
<span>x {item.quantity}</span>
</div>
)
)}


<hr/>


<h5>📍 Address</h5>

<p>
{selectedOrder.address.name}
</p>

<p>
{selectedOrder.address.houseNo},
{" "}
{selectedOrder.address.addressLine}
</p>

<p>
{selectedOrder.address.city}
</p>

<p>
📞 {selectedOrder.address.phone}
</p>



{/* TRACKING SECTION */}

{selectedOrder.awbCode && (
<>
<hr/>

<h5>🚚 Shipment Tracking</h5>

<p>
<strong>Courier:</strong>
{" "}
{selectedOrder.courier}
</p>

<p>
<strong>AWB:</strong>
{" "}
{selectedOrder.awbCode}
</p>

<p>
<strong>Shipment ID:</strong>
{" "}
{selectedOrder.shipmentId}
</p>

<a
href={selectedOrder.trackingUrl}
target="_blank"
rel="noreferrer"
className="track-btn"
>
Track Shipment
</a>

</>
)}



<button
className="btn-close"
onClick={()=>
setSelectedOrder(null)
}
>
Close ❌
</button>

</div>
</div>

)}


{/* <Footer/> */}
</AdminLayout>

</>
);

}

export default AdminDashboard;