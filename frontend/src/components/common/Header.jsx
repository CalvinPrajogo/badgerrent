import styles from './Header.module.css';

export default function Header() {
   return (
    <nav className={styles.header}>
        <h1>Badger<b>Rent</b></h1>
    </nav>
   );
}