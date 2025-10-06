import styles from "./HeroSearchbar.module.css";
import { DropdownButton } from "../common/buttons/DropdownButton";
import SearchIcon from "../../assets/search-icon.svg";
import SearchDropdown from "./SearchDropdown";
import React from "react";
import Select from "react-select";

const options = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "studio", label: "Studio" },
];

export default function HeroSearchbar() {
  return (
    <div className={styles["hero-searchbar-container"]}>
      <div
        className={styles["input-container"]}
        style={{ paddingLeft: "36px", width: "45%" }}
      >
        <p2 style={{ color: "var(--DARK_GRAY)" }}>Building type</p2>
        <SearchDropdown options={options}></SearchDropdown>
      </div>
      <vertical-spacer />
      <div className={styles["input-container"]}>
        <p2 style={{ color: "var(--DARK_GRAY)" }}>Location</p2>
        <h4>Any</h4>
      </div>
      <vertical-spacer />
      <div className={styles["input-container"]} style={{ width: "10%" }}>
        <p2 style={{ color: "var(--DARK_GRAY)" }}>Beds</p2>
        <div className={styles["dropdown-container"]}>
          <h4>Any</h4>
          <DropdownButton />
        </div>
      </div>
      <vertical-spacer />
      <div className={styles["input-container"]} style={{ width: "10%" }}>
        <p2 style={{ color: "var(--DARK_GRAY)" }}>Baths</p2>
        <div className={styles["dropdown-container"]}>
          <h4>Any</h4>
          <DropdownButton />
        </div>
      </div>
      <vertical-spacer />
      <div className={styles["input-container"]} style={{ width: "25%" }}>
        <p2 style={{ color: "var(--DARK_GRAY)" }}>Min $</p2>
        <h4>Any</h4>
      </div>
      <vertical-spacer />
      <div className={styles["input-container"]} style={{ width: "25%" }}>
        <p2 style={{ color: "var(--DARK_GRAY)" }}>Max $</p2>
        <h4>Any</h4>
      </div>
      <div className={styles["search-button"]} style={{ cursor: "pointer" }}>
        <img src={SearchIcon} alt="Search icon" />
      </div>
    </div>
  );
}
