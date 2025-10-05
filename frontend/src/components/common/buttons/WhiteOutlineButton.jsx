import styles from "./Buttons.module.css";

export const WhiteOutlineButton = ({ buttonText, icon }) => {
  return (
    <div className={styles["white-outline-button"]}>
      <h4 style={{ fontWeight: "600" }}>{buttonText}</h4>
      {icon && <img src={icon} alt="Button icon" />}
    </div>
  );
};
