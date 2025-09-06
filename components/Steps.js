import { useState } from 'react';
import styles from '../styles/Steps.module.css';

const formatStep = (template, values) => {
    if (!values) {
        return template;
    }
    let formatted = template;
    for (const key in values) {
        formatted = formatted.replace(new RegExp(`\\{${key}\\}`, 'g'), values[key]);
    }
    return formatted;
};

export default function Steps({ t, steps }) {
    const [areStepsVisible, setAreStepsVisible] = useState(true);

    if (steps.length === 0) {
        return null;
    }

    return (
        <div className={styles.stepsSection}>
            <h3>{t('steps.title')}</h3>

            {steps.map((step, i) => (
                <div className={`${styles.step} ${!areStepsVisible ? styles.stepHidden : ''}`} key={i}>
                    <div className={styles.stepTitle}>{t('steps.step').replace('{num}', i + 1)}</div>
                    <div className={styles.stepContent}>{formatStep(t(step.key), step.values)}</div>
                </div>
            ))}

            <button className={styles.toggleSteps} onClick={() => setAreStepsVisible(!areStepsVisible)}>
                {areStepsVisible ? t('steps.toggle.hide') : t('steps.toggle.show')}
            </button>
        </div>
    );
}
