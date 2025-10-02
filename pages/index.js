import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/Converter.module.css';

import { useTranslation, availableLanguages } from '../lib/translations';
import ConverterForm from '../components/ConverterForm';
import ResultDisplay from '../components/ResultDisplay';
import Steps from '../components/Steps';
import Examples from '../components/Examples';

export default function ConverterPage() {
    const router = useRouter();
    const [inputNumber, setInputNumber] = useState('');
    const [fromBase, setFromBase] = useState('10');
    const [toBase, setToBase] = useState('16');
    const [customFrom, setCustomFrom] = useState('10');
    const [customTo, setCustomTo] = useState('16');

    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [steps, setSteps] = useState([]);

    const [showCustomFrom, setShowCustomFrom] = useState(false);
    const [showCustomTo, setShowCustomTo] = useState(false);

    const [lang, setLang] = useState('en'); // Default to English
    const { t } = useTranslation(lang);

    const [isHydrated, setIsHydrated] = useState(false);
    const initialConversionDone = useRef(false);

    useEffect(() => {
        if (!router.isReady) return;

        const { number, from, to } = router.query;
        const standardBases = ['2', '8', '10', '16'];

        if (number) setInputNumber(number);

        if (from) {
            if (standardBases.includes(from)) {
                setFromBase(from);
                setShowCustomFrom(false);
            } else {
                setFromBase('custom');
                setCustomFrom(from);
                setShowCustomFrom(true);
            }
        }

        if (to) {
            if (standardBases.includes(to)) {
                setToBase(to);
                setShowCustomTo(false);
            } else {
                setToBase('custom');
                setCustomTo(to);
                setShowCustomTo(true);
            }
        }
        setIsHydrated(true);
    }, [router.isReady]);

    useEffect(() => {
        if (isHydrated && router.query.number && !initialConversionDone.current) {
            handleConvert();
            initialConversionDone.current = true;
        }
    }, [isHydrated, router.query.number]);

    useEffect(() => {
        const browserLang = navigator.language.split('-')[0];
        if (availableLanguages.includes(browserLang)) {
            setLang(browserLang);
        }
    }, []);

    useEffect(() => {
        setError('');
    }, [inputNumber]);

    const handleFromBaseChange = (e) => {
        const value = e.target.value;
        setFromBase(value);
        setShowCustomFrom(value === 'custom');
    };

    const handleToBaseChange = (e) => {
        const value = e.target.value;
        setToBase(value);
        setShowCustomTo(value === 'custom');
    };

    const getFromBase = () => fromBase === 'custom' ? parseInt(customFrom) : parseInt(fromBase);
    const getToBase = () => toBase === 'custom' ? parseInt(customTo) : parseInt(toBase);

    const isValidDigit = (digit, base) => {
        if (digit === '.') return true;
        const validChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const digitIndex = validChars.indexOf(digit.toUpperCase());
        return digitIndex !== -1 && digitIndex < base;
    };

    const validateNumber = (number, base) => {
        if (!number || number.trim() === '') return false;
        const parts = number.split('.');
        if (parts.length > 2) return false;
        for (let part of parts) {
            for (let digit of part.toUpperCase()) {
                if (!isValidDigit(digit, base)) return false;
            }
        }
        return true;
    };

    const convertIntegerPartToDecimal = (integerStr, fromBase) => {
        let steps = [];
        let decimal = 0;
        const validChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let stepDetails = '';
        for (let i = 0; i < integerStr.length; i++) {
            const digit = integerStr[integerStr.length - 1 - i];
            const digitValue = validChars.indexOf(digit.toUpperCase());
            const power = Math.pow(fromBase, i);
            const addValue = digitValue * power;
            decimal += addValue;
            stepDetails += `${digit} × ${fromBase}^${i} = ${digitValue} × ${power} = ${addValue}\n`;
        }
        steps.push({ key: 'step.intConversionDetails', values: { integer: integerStr, fromBase: fromBase, details: stepDetails, sum: decimal } });
        return { result: decimal, steps };
    };

    const convertFractionalPartToDecimal = (fractionalStr, fromBase) => {
        let steps = [];
        if (!fractionalStr) return { result: 0, steps };
        let decimal = 0;
        const validChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let stepDetails = '';
        for (let i = 0; i < fractionalStr.length; i++) {
            const digit = fractionalStr[i];
            const digitValue = validChars.indexOf(digit.toUpperCase());
            const power = Math.pow(fromBase, -(i + 1));
            const addValue = digitValue * power;
            decimal += addValue;
            stepDetails += `${digit} × ${fromBase}^-${i+1} = ${digitValue} × ${power.toFixed(6)} = ${addValue.toFixed(6)}\n`;
        }
        steps.push({ key: 'step.fracConversionDetails', values: { fractional: fractionalStr, fromBase: fromBase, details: stepDetails, sum: decimal } });
        return { result: decimal, steps };
    };

    const convertFromBaseToDecimal = (number, fromBase) => {
        let steps = [];
        steps.push({ key: 'step.split', values: { number: number } });
        const parts = number.split('.');
        let integerPart = parts[0] || '0';
        let fractionalPart = parts[1] || '';
        steps.push({ key: 'step.parts', values: { integer: integerPart, fractional: fractionalPart || '0' } });

        const intConversion = convertIntegerPartToDecimal(integerPart, fromBase);
        const fracConversion = convertFractionalPartToDecimal(fractionalPart, fromBase);

        const result = intConversion.result + fracConversion.result;
        steps.push(...intConversion.steps, ...fracConversion.steps);
        steps.push({ key: 'step.decResult', values: { intResult: intConversion.result, fracResult: fracConversion.result, total: result } });
        return { result, steps };
    };

    const convertIntegerToBase = (integer, toBase) => {
        let steps = [];
        if (integer === 0) {
            steps.push({ key: 'step.zeroIsZero' });
            return { result: '0', steps };
        }
        const validChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        let stepDetails = '';
        let num = integer;
        while (num > 0) {
            const remainder = num % toBase;
            stepDetails += `${num} / ${toBase} = ${Math.floor(num / toBase)} (${t('step.remainder')}: ${remainder} → ${validChars[remainder]})\n`;
            result = validChars[remainder] + result;
            num = Math.floor(num / toBase);
        }
        steps.push({ key: 'step.intToBaseDetails', values: { integer: integer, toBase: toBase, details: stepDetails, result: result } });
        return { result, steps };
    };

    const convertFractionalToBase = (fractional, toBase, precision) => {
        let steps = [];
        if (fractional === 0) return { result: '', steps };
        const validChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        let count = 0;
        let frac = fractional;
        let stepDetails = '';
        while (frac > 0 && count < precision) {
            const originalFrac = frac;
            frac *= toBase;
            const digit = Math.floor(frac);
            stepDetails += `${originalFrac.toFixed(6)} * ${toBase} = ${frac.toFixed(6)} → ${t('step.integerPart')}: ${digit} (${validChars[digit]})\n`;
            result += validChars[digit];
            frac -= digit;
            count++;
        }
        steps.push({ key: 'step.fracToBaseDetails', values: { fractional: fractional, toBase: toBase, details: stepDetails, result: result } });
        return { result, steps };
    };

    const convertFromDecimalToBase = (decimal, toBase) => {
        let steps = [];
        let integerPart = Math.floor(decimal);
        let fractionalPart = decimal - integerPart;
        steps.push({ key: 'step.parts', values: { integer: integerPart, fractional: fractionalPart } });

        const intConversion = convertIntegerToBase(integerPart, toBase);
        const fracConversion = convertFractionalToBase(fractionalPart, toBase, 10);

        steps.push(...intConversion.steps, ...fracConversion.steps);
        const finalResult = fracConversion.result ? `${intConversion.result}.${fracConversion.result}` : intConversion.result;
        steps.push({ key: 'step.finalResult', values: { result: finalResult } });
        return { result: finalResult, steps };
    };

    const handleConvert = () => {
        setResult(null);
        setError('');
        setSteps([]);

        const standardizedInput = inputNumber.replace(',', '.');

        const currentFromBase = getFromBase();
        const currentToBase = getToBase();

        if (!standardizedInput) {
            setError(t('error.enterNumber'));
            return;
        }
        if (currentFromBase < 2 || currentFromBase > 36) {
            setError(t('error.fromBaseRange'));
            return;
        }
        if (currentToBase < 2 || currentToBase > 36) {
            setError(t('error.toBaseRange'));
            return;
        }
        if (!validateNumber(standardizedInput, currentFromBase)) {
            setError(t('error.invalidChars').replace('{number}', standardizedInput).replace('{base}', currentFromBase));
            return;
        }

        try {
            let allSteps = [];
            let decimalValue;
            let toDecimalSteps = [];

            if (currentFromBase === 10) {
                decimalValue = parseFloat(standardizedInput);
            } else {
                const toDecimalConversion = convertFromBaseToDecimal(standardizedInput.toUpperCase(), currentFromBase);
                decimalValue = toDecimalConversion.result;
                toDecimalSteps = toDecimalConversion.steps;
            }

            let finalResult;
            let fromDecimalSteps = [];

            if (currentToBase === 10) {
                finalResult = String(decimalValue);
            } else {
                const fromDecimalConversion = convertFromDecimalToBase(decimalValue, currentToBase);
                finalResult = fromDecimalConversion.result;
                fromDecimalSteps = fromDecimalConversion.steps;
            }

            allSteps.push(...toDecimalSteps, ...fromDecimalSteps);

            setResult({
                original: standardizedInput.toUpperCase(),
                fromBase: currentFromBase,
                converted: finalResult,
                toBase: currentToBase,
                decimal: (currentFromBase !== 10 && currentToBase !== 10) ? decimalValue : null
            });
            setSteps(allSteps);
        } catch (e) {
            setError(t('error.conversion').replace('{message}', e.message));
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleConvert();
        }
    };

    return (
        <>
            <Head>
                <title>{t('title')}</title>
                <meta name="description" content={t('meta.description')} />
                <meta name="keywords" content={t('meta.keywords')} />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <div className={styles.container}>
                <h1 className={styles.title}>{t('title')}</h1>

                <ConverterForm
                    t={t}
                    inputNumber={inputNumber} setInputNumber={setInputNumber}
                    fromBase={fromBase} handleFromBaseChange={handleFromBaseChange}
                    toBase={toBase} handleToBaseChange={handleToBaseChange}
                    showCustomFrom={showCustomFrom} customFrom={customFrom} setCustomFrom={setCustomFrom}
                    showCustomTo={showCustomTo} customTo={setCustomTo} setCustomTo={setCustomTo}
                    handleConvert={handleConvert} handleKeyPress={handleKeyPress}
                />

                <ResultDisplay
                    t={t}
                    result={result}
                    error={error}
                    inputNumber={inputNumber}
                    fromBase={fromBase}
                    toBase={toBase}
                    customFrom={customFrom}
                    customTo={customTo}
                />

                <Steps t={t} steps={steps} />

                <Examples t={t} />
            </div>
        </>
    );
}
