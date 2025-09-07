import { useState } from 'react';
import styles from '../styles/Result.module.css';

export default function ShareButton({ t, inputNumber, fromBase, toBase, customFrom, customTo, result }) {
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        const effectiveFrom = fromBase === 'custom' ? customFrom : fromBase;
        const effectiveTo = toBase === 'custom' ? customTo : toBase;

        if (!inputNumber || !effectiveFrom || !effectiveTo) {
            return;
        }

        const query = new URLSearchParams({
            number: inputNumber,
            from: effectiveFrom,
            to: effectiveTo,
        });

        const shareUrl = `${window.location.origin}${window.location.pathname}?${query.toString()}`;

        const fallbackCopyToClipboard = (text) => {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }
            document.body.removeChild(textArea);
        };

        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareUrl).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }).catch(err => {
                console.error('Async: Could not copy text: ', err);
                fallbackCopyToClipboard(shareUrl);
            });
        } else {
            fallbackCopyToClipboard(shareUrl);
        }
    };

    return (
        <button onClick={handleShare} className="btn" disabled={!result || !inputNumber}>
            {copied ? t('share.copied') : t('share.button')}
        </button>
    );
}
