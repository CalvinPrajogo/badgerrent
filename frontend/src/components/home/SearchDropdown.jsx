import React from "react";
import Select from "react-select";

export default function SearchDropdown({ options }) {
  return (
    <Select
      options={options}
      placeholder="Any"
      styles={{
        container: (baseStyles) => ({
          ...baseStyles,
          width: "100%",
          fontFamily: "Wix Madefor Text",
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
        indicatorsContainer: (baseStyles) => ({}),
        dropdownIndicator: (baseStyles) => ({
          padding: "0px",
          color: "var(--DARK_GRAY)",
          "&:hover": {
            color: "var(--BADGER_RED)",
          },
          cursor: "pointer",
        }),
        input: () => ({
          display: "none",
        }),
        placeholder: () => ({
          color: "black",
          fontFamily: "Wix Madefor Text",
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          width: "100%",
          borderRadius: "10px",
          boxShadow: "0 5px 20px 0 rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
          padding: "0px",
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
      }}
    />
  );
}
