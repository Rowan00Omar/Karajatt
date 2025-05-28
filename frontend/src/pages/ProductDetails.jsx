import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
 const [product, setProduct] = useState(null);
 const [loading, setLoading] = useState(true);


 const handleBooking = async () => {
    if (!userId || !_id) {
        setBookingMessage("User not authenticated or event ID missing.");
        return;
    }

    try {
        const response = await axios.post("http://localhost:5000/events/BookEventByUser", {
        userId,
        eventId: _id,
        });

        if (response.status === 200 || response.status === 201) {
        navigate("/booking-success");
        } else {
        setBookingMessage("Booking failed. Please try again.");
        }
    } catch (error) {
        console.error("Booking error:", error);
        setBookingMessage("An error occurred during booking.");
    }
    };

 const { productId } = useParams();
 useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`api/product/getSingleProduct/${productId}`);
        if (!response.ok) throw new Error("product not found");
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [productId]);
const {
    company_name,
    car_name,
    part_name,
    catergory_name,
    price,
    description,
    start_year,
    end_year,
    condition,
    storage_duration,
    seller_id,
    rating,
    review_count,
    parts_in_stock,
    status,
    title
  } = product;
  console.log(product)
 return (
<>
<div className="event-card">
     <div className="event-image">
       <img src={image?.url || "/images/default.png"} alt="Image" />
     </div>
  <div className="event-info">
    <h2 className="event-title">{title}</h2>
    <p className="event-description">{description || "No description available."}</p>
    <div className="event-details">
      <div className="info-column">
        <div className="event-detail-item">
          <FaTags className="event-icon" />
          <span>Category:</span> {catergory_name}
        </div>    
      </div>   
    </div>

    <button className="book-button" onClick={handleBooking}>
       Add to Cart
    </button>
    {bookingMessage && <p className="booking-message">{bookingMessage}</p>}
  </div>
</div>
</>
  )
}

export default ProductDetails
