import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/offersection.css";

export default function OffersSection({ baseURL }) {

  const [offers, setOffers] = useState([]);

  const getEndOfDay = (dateString) => {
  const date = new Date(dateString);
  date.setHours(23, 59, 59, 999);
  return date;
};

  /* FETCH OFFERS */
  useEffect(() => {
    axios.get(`${baseURL}/api/offers`)
      .then(res => {
        setOffers(res.data.offers || []);
      })
      .catch(err => console.log(err));
  }, [baseURL]);

  /* FILTER ACTIVE OFFERS */
  const activeOffers = offers.filter(o => {
    if (!o.active) return false;

    const now = new Date();
    const start = o.startDate ? new Date(o.startDate) : null;
 const end = o.endDate ? getEndOfDay(o.endDate) : null;

    if (start && now < start) return false;
    if (end && now > end) return false;

    return true;
  });

  /* SPLIT OFFERS */
  const autoDiscounts = activeOffers.filter(o => o.type === "auto_discount");
  const otherOffers = activeOffers.filter(o => o.type !== "auto_discount");

  /* DAYS LEFT */
  const getDaysLeft = (endDate) => {
    if (!endDate) return null;

    const now = new Date();
    const end = new Date(endDate);

    const diff = end - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
  <div className="offers-wrapper container py-5">

  <h2 className="offer-heading text-center mb-5">
    🔥 Exclusive Offers
  </h2>

  <div className="row g-4">

    {/* ⚡ AUTO DISCOUNT (STACK STYLE) */}
    {autoDiscounts.length > 0 && (
      <div className="col-lg-4 col-md-6">
        <div className="auto-offer-box">

          <h5>⚡ Auto Savings</h5>

          {autoDiscounts.map(o => (
            <div key={o._id} className="auto-offer-item">

              <div className="discount">
                {o.discountPercent}% OFF
              </div>

              <div className="details">
                {o.applyTo === "all" && "All Products"}

                {o.applyTo === "category" &&
                  `On ${o.applicableCategory}`
                }

                {o.applyTo === "products" &&
                  (o.applicableProducts?.map(p => p.name).join(", "))
                }

                {o.minOrderValue && (
                  <div className="min">
                    Above ₹{o.minOrderValue}
                  </div>
                )}
              </div>

            </div>
          ))}

        </div>
      </div>
    )}

    {/* 🎟️ COUPON (TICKET STYLE) */}
    {otherOffers
      .filter(o => o.type === "coupon")
      .map((o) => (
        <div className="col-lg-4 col-md-6" key={o._id}>
          <div className="coupon-card">

            <div className="left">
              <h3>{o.discountPercent}%</h3>
              <span>OFF</span>
            </div>

            <div className="right">

              <div className="code">{o.code}</div>

              <div className="desc">
                {o.applyTo === "all" && "All Products"}

                {o.applyTo === "category" &&
                  `Category: ${o.applicableCategory}`
                }

                {o.applyTo === "products" &&
                  o.applicableProducts?.map(p => p.name).join(", ")
                }
              </div>

              {o.minOrderValue && (
                <small>Min ₹{o.minOrderValue}</small>
              )}

              {o.endDate && (
                <div className="expiry">
                  ⏳ {getDaysLeft(o.endDate)} days left
                </div>
              )}

            </div>

          </div>
        </div>
      ))}

    {/* 🛍️ BOGO (PRODUCT STYLE) */}
    {otherOffers
      .filter(o => o.type === "bogo")
      .map((o) => (
        <div className="col-lg-4 col-md-6" key={o._id}>
          <div className="bogo-card">

            <div className="badge">BOGO</div>

            <h4>
              Buy {o.buyQty} Get {o.freeQty}
            </h4>

            <p className="product-name">
              {o.productId?.name}
            </p>

            {o.endDate && (
              <div className="expiry">
                ⏳ {getDaysLeft(o.endDate)} days left
              </div>
            )}

          </div>
        </div>
      ))}

  </div>
</div>
  );
}