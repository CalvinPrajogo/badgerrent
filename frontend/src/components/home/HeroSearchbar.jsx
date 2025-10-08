import styles from "./HeroSearchbar.module.css";
import SearchIcon from "../../assets/search-icon.svg";
import SearchDropdown from "./SearchDropdown";
import SearchInput from "./SearchInput";
import React from "react";


// temporary options
const buildingOptions = [
  { value: 0, label: "Any" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "studio", label: "Studio" },
];

const numOptions = [
  { value: 0, label: "Any" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
];

export default function HeroSearchbar() {
  return (
    <div className={styles["hero-searchbar-container"]}>
      <div
        className={styles["input-container"]}
        style={{ paddingLeft: "36px", maxWidth: "20%" }}
      >
        <p2 style={{ color: "var(--DARK_GRAY)" }}>Building type</p2>
        <SearchDropdown id="buildingTypeSelect" options={buildingOptions}></SearchDropdown>
      </div>
      <vertical-spacer />
      <div className={styles["input-container"]}>
        <p2 style={{ color: "var(--DARK_GRAY)" }}>Location</p2>
        <SearchInput id="locationInput" options={buildingOptions}></SearchInput>
      </div>
      <vertical-spacer />
      <div className={styles["input-container"]} style={{ maxWidth: "10%" }}>
        <p2 style={{ color: "var(--DARK_GRAY)" }}>Beds</p2>
        <SearchDropdown id="numBedsSelect" options={numOptions}></SearchDropdown>
      </div>
      <vertical-spacer />
      <div className={styles["input-container"]} style={{ maxWidth: "10%" }}>
        <p2 style={{ color: "var(--DARK_GRAY)" }}>Baths</p2>
        <SearchDropdown id="numBathsSelect" options={numOptions}></SearchDropdown>
      </div>
      <vertical-spacer />
      <div className={styles["input-container"]} style={{ maxWidth: "12%" }}>
        <p2 style={{ color: "var(--DARK_GRAY)" }}>Min $</p2>
        <div style={{ display: "flex", alignItems: "center" }}>
          $<input id="minRentInput" placeholder="--"></input>
        </div>
      </div>
      <vertical-spacer />
      <div className={styles["input-container"]} style={{ maxWidth: "12%" }}>
        <p2 style={{ color: "var(--DARK_GRAY)" }}>Max $</p2>
        <div style={{ display: "flex", alignItems: "center" }}>
          $<input id="maxRentInput" placeholder="--"></input>
        </div>
      </div>
      <div className={styles["search-button"]} style={{ cursor: "pointer" }}>
        <img src={SearchIcon} alt="Search icon" />
      </div>
    </div>
  );
}
