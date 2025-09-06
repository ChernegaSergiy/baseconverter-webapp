import styles from '../styles/Result.module.css';

export default function ResultDisplay({ t, result, error }) {
    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (!result) {
        return null;
    }

    return (
        <div className={styles.resultSection}>
            <div className={styles.title}>{t('result.title')}</div>
            <div className={styles.fromSection}>
                <strong>{result.original}</strong> {t('result.fromSystem').replace('{base}', result.fromBase)}
            </div>
            <div className={styles.arrow}>↓</div>
            <div className={styles.resultNumber}>{result.converted}</div>
            <div className={styles.toSection}>{t('result.toSystem').replace('{base}', result.toBase)}</div>
            {result.decimal && (
                <div className={styles.decimalValue}>
                    {t('result.throughDecimal').replace('{decimal}', result.decimal)}
                </div>
            )}
        </div>
    );
}
