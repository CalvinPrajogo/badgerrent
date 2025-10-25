import styles from "./PropertyCard.module.css";
import ReviewStars from "./ReviewStars";

export default function PropertyCard({ property }) {
  // If no property data is passed, show placeholder
  if (!property) {
    return (
      <div className={styles["card-container"]}>
        <div className={styles["card-image"]} />
        <div className={styles["card-details-container"]}>
          <p>No property data available</p>
        </div>
      </div>
    );
  }

  // Format rent with commas (e.g., 1200 -> $1,200)
  const formattedRent = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(property.rent);

  // Use property image if available, otherwise use placeholder
  const imageUrl = property.image_url || `https://placehold.co/600x400/e0e0e0/666666?text=${encodeURIComponent(property.address.split(' ')[0])}`;

  return (
    <div className={styles["card-container"]}>
      <div 
        className={styles["card-image"]} 
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className={styles["card-details-container"]}>
        <div className={styles["card-details"]}>
          <h4 style={{ fontWeight: "600" }}>{property.address}</h4>
          <p1>
            {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bed`} • {property.bathrooms} bath
            <br></br>
            {property.company}
          </p1>
        </div>
        <horizontal-spacer />
        <div className={styles["card-details"]}>
          <ReviewStars />
          <p1>{formattedRent}/month</p1>
          <red-link>More info...</red-link>
        </div>
      </div>
    </div>
  );
}
