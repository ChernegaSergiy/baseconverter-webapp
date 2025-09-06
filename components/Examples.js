import styles from '../styles/Examples.module.css';

export default function Examples({ t }) {
    return (
        <div className={styles.examples}>
            <h3>{t('examples.title')}</h3>
            <div className={styles.exampleItem}>255 (10) = FF (16) = 377 (8) = 11111111 (2)</div>
            <div className={styles.exampleItem}>15.5 (10) = F.8 (16) = 17.4 (8) = 1111.1 (2)</div>
            <div className={styles.exampleItem}>A.8 (16) = 10.5 (10) = 12.4 (8) = 1010.1 (2)</div>
            <div className={styles.exampleItem}>{t('examples.item4')}</div>
        </div>
    );
}
