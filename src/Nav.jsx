import styles from './Nav.module.css';

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <a href="#" className={styles.logo}>Fangorn</a>
      <div className={styles.right}>
        <a href="#products" className={styles.link}>Products</a>
        <a href="#contact" className={styles.link}>Contact</a>
        <a href="https://docs.fangorn.network" className={styles.btn}>Documentation</a>
      </div>
    </nav>
  );
}
