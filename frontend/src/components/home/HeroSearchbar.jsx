import styles from "./HeroSearchbar.module.css";
import { DropdownButton } from "../common/buttons/DropdownButton";
import SearchIcon from "../../assets/search-icon.svg";
import SearchDropdown from "./SearchDropdown";
import SearchInput from "./SearchInput";
import React from "react";
import Select from "react-select";

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
        <SearchDropdown options={buildingOptions}></SearchDropdown>
      </div>
      <vertical-spacer />
      <div className={styles["input-container"]}>
        <p2 style={{ color: "var(--DARK_GRAY)" }}>Location</p2>
        <SearchInput options={buildingOptions}></SearchInput>
      </div>
      <vertical-spacer />
      <div className={styles["input-container"]} style={{ maxWidth: "10%" }}>
        <p2 style={{ color: "var(--DARK_GRAY)" }}>Beds</p2>
        <SearchDropdown options={numOptions}></SearchDropdown>
      </div>
      <vertical-spacer />
      <div className={styles["input-container"]} style={{ maxWidth: "10%" }}>
        <p2 style={{ color: "var(--DARK_GRAY)" }}>Baths</p2>
        <SearchDropdown options={numOptions}></SearchDropdown>
      </div>
      <vertical-spacer />
      <div className={styles["input-container"]} style={{ maxWidth: "12%" }}>
        <p2 style={{ color: "var(--DARK_GRAY)" }}>Min $</p2>
        <p1>Any</p1>
      </div>
      <vertical-spacer />
      <div className={styles["input-container"]} style={{ maxWidth: "12%" }}>
        <p2 style={{ color: "var(--DARK_GRAY)" }}>Max $</p2>
        <p1>Any</p1>
      </div>
      <div className={styles["search-button"]} style={{ cursor: "pointer" }}>
        <img src={SearchIcon} alt="Search icon" />
      </div>
    </div>
  );
}
