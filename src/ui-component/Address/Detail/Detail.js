import styles from './Detail.module.css';

const Detail = ({ title, description }) => {
  return (
    <div className={styles.detail}>
      <h2 className={styles.title}>{title}</h2>
      <h3 className={styles.description}>{description}</h3>
    </div>
  );
};

export default Detail;
