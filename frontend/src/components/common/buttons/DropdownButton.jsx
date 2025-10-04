import React from "react";
import dropdownIcon from "../../../assets/dropdown-button.svg";

export const DropdownButton = () => {
  return (
    <div style={{ cursor: "pointer" }}>
      <img src={dropdownIcon} alt="Dropdown button"/>
    </div>
  );
};
