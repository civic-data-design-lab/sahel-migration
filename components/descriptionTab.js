import styles from '../styles/DescriptionTab.module.css';

export default function DescriptionTab({ title, body }) {
  return (
    <div className={styles.main}>
      <h7>{title}</h7>
      <small>{body}</small>
    </div>
  );
}
