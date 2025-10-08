import styles from "./HeroSearchbar.module.css";
import React from "react";
import Select from "react-select";

export default function SearchInput({ options }) {
  return (
    <Select
      className={styles["dropdown-text"]}
      options={options}
      placeholder="Any"
      styles={{
        container: (baseStyles) => ({
          ...baseStyles,
          width: "100%",
        }),
        control: () => ({
          border: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0px",
          width: "100%",
        }),
        valueContainer: () => ({
          paddingLeft: 0,
          paddingRight: 0,
          width: "100%",
        }),
        indicatorSeparator: () => ({
          display: "none",
        }),
        indicatorsContainer: (baseStyles) => ({
          display: "none",
        }),
        placeholder: () => ({
          position: "absolute",
          color: "black",
          paddingTop: "3px",
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          width: "100%",
          borderRadius: "10px",
          boxShadow: "0 5px 20px 0 rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
          padding: "0px",
          zIndex: 10,
        }),
        menuList: (baseStyles) => ({
          ...baseStyles,
          padding: "0px",
        }),
        option: (baseStyles, { isFocused, isSelected }) => ({
          ...baseStyles,
          color: "black",
          cursor: "pointer",
          backgroundColor: isFocused ? "var(--LIGHT_GRAY)" : null,
        }),
        singleValue: (baseStyles) => ({
          ...baseStyles,
          position: "absolute",
          paddingTop: "3px",
        }),
      }}
    />
  );
}
