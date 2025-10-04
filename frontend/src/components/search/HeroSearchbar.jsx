import React from "react";
import { BuildingsDropdownButton } from "./BuildingsDropdownButton";
import "./HeroSearchbar.module.css";
import vector109 from "./vector-109.svg";

export const HeroSearchbar = () => {
  return (
    <div className="hero-searchbar">
      <div className="div">
        <div className="text-wrapper">I’m looking for</div>

        <div className="buildings">
          <div className="text-wrapper-2">Any buildings</div>

          <BuildingsDropdownButton className="buildings-dropdown-button" />
        </div>
      </div>

      <div className="div-2" />

      <div className="div-3">
        <div className="text-wrapper">Near</div>

        <div className="text-wrapper-3">Any location</div>
      </div>

      <div className="div-4" />

      <div className="div-5">
        <div className="text-wrapper-4">Beds</div>

        <div className="div-6">
          <div className="text-wrapper-5">Any</div>

          <BuildingsDropdownButton className="buildings-dropdown-button" />
        </div>
      </div>

      <div className="div-7" />

      <div className="div-5">
        <div className="text-wrapper-4">Baths</div>

        <div className="div-6">
          <div className="text-wrapper-5">Any</div>

          <BuildingsDropdownButton className="buildings-dropdown-button" />
        </div>
      </div>

      <div className="div-7" />

      <div className="div-8">
        <div className="text-wrapper">From</div>

        <div className="text-wrapper-3">Min $</div>
      </div>

      <div className="div-7" />

      <div className="div-8">
        <div className="text-wrapper">To</div>

        <div className="text-wrapper-3">Max $</div>
      </div>

      <div className="div-7" />

      <div className="group-wrapper">
        <div className="group">
          <div className="ellipse" />

          <img className="vector" alt="Vector" src={vector109} />
        </div>
      </div>
    </div>
  );
};