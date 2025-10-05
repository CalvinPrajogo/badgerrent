import styles from "./PropertyCard.module.css";
import ReviewStars from "./ReviewStars";

export default function PropertyCard() {
  return (
    <div className={styles["card-container"]}>
      <div className={styles["card-image"]} />
      <div className={styles["card-details-container"]}>
        <div className={styles["card-details"]}>
          <h4 style={{ fontWeight: "600" }}>Address</h4>
          <p1>
            Address line 2<br></br>Address line 3
          </p1>
        </div>
        <horizontal-spacer />
        <div className={styles["card-details"]}>
          <ReviewStars />
          <p1>$0,000/month</p1>
          <red-link>More info...</red-link>
        </div>
      </div>
    </div>
  );
}
