import styles from '../styles/Form.module.css';

export default function ConverterForm({
    t,
    inputNumber, setInputNumber,
    fromBase, handleFromBaseChange,
    toBase, handleToBaseChange,
    showCustomFrom, customFrom, setCustomFrom,
    showCustomTo, customTo, setCustomTo,
    handleConvert, handleKeyPress
}) {

    return (
        <div className={styles.converterSection}>
            <div className={styles.inputGroup}>
                <div className={styles.inputField}>
                    <label htmlFor="inputNumber">{t('form.inputText')}</label>
                    <input
                        type="text"
                        id="inputNumber"
                        value={inputNumber}
                        onChange={(e) => setInputNumber(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={t('form.inputPlaceholder')}
                    />
                </div>
                <div className={styles.baseField}>
                    <label htmlFor="fromBase">{t('form.fromBase')}</label>
                    <select id="fromBase" value={fromBase} onChange={handleFromBaseChange}>
                        <option value="2">{t('form.baseOption.2')}</option>
                        <option value="8">{t('form.baseOption.8')}</option>
                        <option value="10">{t('form.baseOption.10')}</option>
                        <option value="16">{t('form.baseOption.16')}</option>
                        <option value="custom">{t('form.baseOption.custom')}</option>
                    </select>
                </div>
            </div>

            {showCustomFrom && (
                <div className={styles.inputGroup} id="customFromBase">
                    <div className={styles.baseField}>
                        <label htmlFor="customFrom">{t('form.customBaseLabel')}</label>
                        <input
                            type="number"
                            id="customFrom"
                            min="2"
                            max="36"
                            defaultValue={customFrom}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    setCustomFrom(value);
                                }
                            }}
                        />
                    </div>
                </div>
            )}

            <div className={styles.inputGroup}>
                <div className={styles.baseField}>
                    <label htmlFor="toBase">{t('form.toBase')}</label>
                    <select id="toBase" value={toBase} onChange={handleToBaseChange}>
                        <option value="2">{t('form.baseOption.2')}</option>
                        <option value="8">{t('form.baseOption.8')}</option>
                        <option value="10">{t('form.baseOption.10')}</option>
                        <option value="16">{t('form.baseOption.16')}</option>
                        <option value="custom">{t('form.baseOption.custom')}</option>
                    </select>
                </div>
            </div>

            {showCustomTo && (
                <div className={styles.inputGroup} id="customToBase">
                    <div className={styles.baseField}>
                        <label htmlFor="customTo">{t('form.customBaseLabel')}</label>
                        <input
                            type="number"
                            id="customTo"
                            min="2"
                            max="36"
                            defaultValue={customTo}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    setCustomTo(value);
                                }
                            }}
                        />
                    </div>
                </div>
            )}

            <div className='buttonWrapper'>
                <button className="btn" onClick={handleConvert}>
                    {t('form.convertButton')}
                </button>
            </div>
        </div>
    );
}
