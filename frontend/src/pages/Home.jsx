import { DropdownButton } from "../components/common/buttons/DropdownButton";
import RightArrow from "../assets/right-arrow.svg";
import Header from "../components/common/Header";
import Styles from "./Home.module.css";
import HeroSearchbar from "../components/home/HeroSearchbar";
import PropertyCard from "../components/common/PropertyCard";
import { WhiteOutlineButton } from "../components/common/buttons/WhiteOutlineButton";
import { useState, useEffect, useRef } from "react";
import { getProperties } from "../services/api";

function Home() {
  // State to store properties from the database
  const [properties, setProperties] = useState([]);
  
  // State to track if data is still loading
  const [loading, setLoading] = useState(true);
  
  // State to store any error messages
  const [error, setError] = useState(null);

  // Ref to access the scrollable container
  const scrollContainerRef = useRef(null);

  // Scroll left function
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,  // Scroll 400px to the left
        behavior: 'smooth'
      });
    }
  };

  // Scroll right function
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,  // Scroll 400px to the right
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);  // Start loading
        const data = await getProperties();
        setProperties(data);  // Save the data
        setError(null);  // Clear any previous errors
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError("Failed to load properties. Please try again later.");  // Set error message
      } finally {
        setLoading(false);  // Done loading (whether success or error)
      }
    }

    fetchProperties();
  }, []);

  return (
    <div>
      <Header />
      <div className={Styles["homepage-container"]}>
        <div className={Styles["hero-section"]}>
          <h2
            style={{
              color: "white",
              textShadow: "0 0 20px rgba(0,0,0,0.5)",
              paddingLeft: "2vw",
            }}
          >
            Your search for the perfect place starts here.
          </h2>
          <HeroSearchbar />
          <red-link
            style={{
              color: "white",
              textShadow: "0 0 20px rgba(0,0,0,0.5)",
              paddingLeft: "2vw",
            }}
          >
            Additional filters...
          </red-link>
        </div>
      </div>
      <div className={Styles["featured-section"]}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between", width: "100%" }}>
          <h2 className={Styles["red-on-hover"]}>
            Featured Listings
          </h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <button 
              onClick={scrollLeft}
              style={{
                background: "var(--BADGER_RED)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ←
            </button>
            <button 
              onClick={scrollRight}
              style={{
                background: "var(--BADGER_RED)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              →
            </button>
          </div>
        </div>
        <div className={Styles["cards-container"]} ref={scrollContainerRef}>
            {loading && <p>Loading properties...</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}
            {!loading && !error && properties.map((property) => (
                <PropertyCard 
                key={property.id}
                property={property}
                />
            ))}
        </div>
      </div>
      <div className={Styles["sublease-section"]}>
        <div className={Styles["sublease-section-text"]}>
          <h1 style={{ color: "white" }}>
            Looking for a short term solution?
            <br />
            <b>We got you</b>.
          </h1>
          <h4 style={{ color: "white", width: "80%" }}>
            BadgerRent offers subleasing and subletting assistance – get started
            by browsing other Badgers’ listings, or post one of your own.
          </h4>
        </div>
        <div className={Styles["sublease-section-buttons"]}>
          <WhiteOutlineButton buttonText="Browse listings"></WhiteOutlineButton>
          <WhiteOutlineButton buttonText="Make post"></WhiteOutlineButton>
        </div>
      </div>
    </div>
  );
}

export default Home;
