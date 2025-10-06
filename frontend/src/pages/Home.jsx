import { DropdownButton } from "../components/common/buttons/DropdownButton";
import RightArrow from "../assets/right-arrow.svg";
import Header from "../components/common/Header";
import Styles from "./Home.module.css";
import HeroSearchbar from "../components/home/HeroSearchbar";
import PropertyCard from "../components/common/PropertyCard";
import { WhiteOutlineButton } from "../components/common/buttons/WhiteOutlineButton";

function Home() {
  return (
    <div>
      <Header />
      <div className={Styles["homepage-container"]}>
        <div className={Styles["hero-section"]}>
          <h2>Your search for the perfect place starts here.</h2>
          <HeroSearchbar />
          <red-link
            style={{
              color: "white",
              textShadow: "0 0 20px rgba(0,0,0,0.5)",
            }}
          >
            Additional filters...
          </red-link>
        </div>
      </div>
      <div className={Styles["featured-section"]}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h2 style={{ color: "var(--DARK_GRAY)" }}>Featured Listings</h2>
          <img
            src={RightArrow}
            alt="Right arrow"
            style={{ aspectRatio: "1 / 1", height: "35px" }}
          />
        </div>
        <div className={Styles["cards-container"]}>
          <PropertyCard />
          <PropertyCard />
          <PropertyCard />
          <PropertyCard />
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
