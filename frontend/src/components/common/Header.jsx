import styles from "./Header.module.css";

export default function Header() {
  return (
    <nav className={styles.header}>
      <h3 style={{ color: "white" }}>
        Badger<b>Rent</b>
      </h3>
    </nav>
  );
}
