import styles from '../../styles/DescriptionTab.module.css';

export default function DescriptionTab({ title, body }) {
  return (
    <div className={styles.main}>
      <small className='body-3'>{body}</small>
    </div>
  );
}
