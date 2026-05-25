import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";
import "../Styles/admin.css";
import { toast } from "react-toastify";
function AdminDashboard() {

const [orders,setOrders]=useState([]);
const [selectedOrder,setSelectedOrder]=useState(null);

const [statusFilter,setStatusFilter]=useState("all");
const [dateFilter,setDateFilter]=useState("");
// for order selection for ship
const [selectedOrders, setSelectedOrders] = useState([]);
const handleCheckboxChange = (id) => {
  setSelectedOrders((prev) =>
    prev.includes(id)
      ? prev.filter((orderId) => orderId !== id)
      : [...prev, id]
  );
};

const baseURL=process.env.REACT_APP_API_URL;


useEffect(()=>{

fetchOrders(); // initial load

const interval = setInterval(()=>{
 fetchOrders();
},30000); // 30 sec

return ()=>clearInterval(interval);

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


const validTransitions = {
  created: ["confirmed"],
  confirmed: ["processing"],   // ✅ allow move to processing
  processing: ["shipped"],     // ✅ allow move to shipped
  shipped: ["delivered"],      // ✅ final step
  delivered: [],               // ❌ locked
  cancelled: []                // ❌ locked
};
const updateStatus = async(id,newStatus)=>{
try{

const order = orders.find(o=>o._id===id);
if(!order) return;

const currentStatus = order.orderStatus;

// stop backward/invalid movement
if(
!validTransitions[currentStatus].includes(newStatus)
){
toast.error(
`Invalid transition: ${currentStatus} → ${newStatus}`
);
return;
}

await axios.put(
`${baseURL}/api/admin/order/${id}`,
{status:newStatus},
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


// BULK SHIP
const shipSelectedOrders = async () => {
  try {
    if (selectedOrders.length === 0) {
      toast.error("Please select orders");
      return;
    }

    const requests = selectedOrders.map((id) =>
      axios.post(
        `${baseURL}/api/admin/ship/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
    );

    const results = await Promise.allSettled(requests);

    const success = results.filter(
      (r) => r.status === "fulfilled"
    ).length;

    const failed = results.length - success;

    toast.success(`${success} shipped, ${failed} failed`);

    setSelectedOrders([]);
    fetchOrders();
  } catch (err) {
    toast.error("Bulk shipping failed");
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
 
<button
  className=" btn btn-ship-all"
  onClick={shipSelectedOrders}
>
  🚚 Ship Selected
</button>


<select
value={statusFilter}
onChange={(e)=>
setStatusFilter(
e.target.value
)
}
>
<option value="all">All Orders</option>
{/* <option value="created">Created</option> */}
<option value="confirmed">Confirmed</option>
<option value="shipped">Shipped</option>
<option value="delivered">Delivered</option>
<option value="cancelled">Cancelled</option>
<option value="ready_to_ship">Ready to Ship</option >
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
    <th>

<input
  type="checkbox"
  onChange={(e) => {

    if (e.target.checked) {

      const confirmedOrders =
        filteredOrders
          .filter(
            o => o.orderStatus === "confirmed"
          )
          .map(o => o._id);

      setSelectedOrders(
        confirmedOrders
      );

    } else {

      setSelectedOrders([]);

    }

  }}
/>

</th>
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
{/* SINGLE CHECKBOX */}
<th>

{["confirmed"].includes(order.orderStatus) && (

<input
  type="checkbox"
  checked={
    selectedOrders.includes(order._id)
  }
  onChange={() =>
    handleCheckboxChange(order._id)
  }
/>

)}

</th>

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

{/* <select
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
<option value="shipped">Shipped</option>
<option value="delivered">Delivered</option>


</select>  */}

 <select
className="status-dropdown"
disabled={
["delivered","cancelled"].includes(
order.orderStatus
)
}
value={order.orderStatus}
onChange={(e)=>
updateStatus(
order._id,
e.target.value
)
}
>

<option value={order.orderStatus}>
{
order.orderStatus.charAt(0).toUpperCase() +
order.orderStatus.slice(1)
}
</option>

{/* CONFIRMED → PROCESSING (manual if needed) */}
{order.orderStatus==="confirmed" && (
<option value="ready_to_ship">
Ready to Ship
</option>
)}

{/* READY TO SHIP → SHIPPED */}
{order.orderStatus==="ready_to_ship" && (
<option value="shipped">
Shipped
</option>
)}

{
order.orderStatus==="shipped" && (
<option value="delivered">
Delivered
</option>
)
}

</select> 

<button
className="btn-view"
onClick={()=>
setSelectedOrder(order)
}
>
👁
</button>



{/* {order.orderStatus==="confirmed" && (
<button
className="btn-ship"
onClick={()=>shipOrder(order._id)}
>
🚚 Ship
</button>
)} */}

{order.orderStatus==="ready_to_ship" && (
<button disabled className="btn-ship shipped">
⏳ Ready to Ship
</button>
)}

{order.orderStatus==="shipped" && (
<button disabled className="btn-ship shipped">
✅ Shipped
</button>
)}

{order.orderStatus==="delivered" && (
<button disabled className="btn-ship shipped">
🎉 Delivered
</button>
)}

{order.orderStatus==="cancelled" && (
<button disabled className="btn-ship shipped">
❌ Cancelled
</button>
)}

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
<strong>Subtotal:</strong>
₹{selectedOrder.subtotal || selectedOrder.totalAmount}
</p>

{selectedOrder.discount > 0 && (
<p>
<strong>Discount:</strong>
- ₹{selectedOrder.discount}
</p>
)}

<p>
<strong>Total Paid:</strong>
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
selectedOrder.paymentStatus === "paid"
? "payment paid"
: "payment pending"
}
>
{selectedOrder.paymentStatus}
</span>
</p>

{/* PAYMENT DETAILS */}
<p>
<strong>Payment Method:</strong>
{" "}
{selectedOrder.paymentMethod}
</p>

{selectedOrder.razorpayPaymentId && (
<p>
<strong>Razorpay Payment ID:</strong>
{" "}
{selectedOrder.razorpayPaymentId}
</p>
)}

{selectedOrder.razorpayOrderId && (
<p>
<strong>Razorpay Order ID:</strong>
{" "}
{selectedOrder.razorpayOrderId}
</p>
)}

</div>


<hr/>


<h5>🛒 Items</h5>

{selectedOrder.items.map((item, i) => (

<div
key={i}
className="item-row"
>

<div className="item-left">

<p className="item-name">
{item.name}
</p>

<small className="item-price">

₹{item.price} × {item.quantity}

</small>

</div>

<div className="item-total">

₹{item.price * item.quantity}

</div>

</div>

))}


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
className="mx-3 btn btn-danger"
onClick={() => setSelectedOrder(null)}
>
✖ Close
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