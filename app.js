// DOM Elements
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const autoTransliterate = document.getElementById('autoTransliterate');
const translateBtn = document.getElementById('translateBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const inputCount = document.getElementById('inputCount');
const outputCount = document.getElementById('outputCount');
const exampleButtons = document.querySelectorAll('.example-btn');

// Wait for Sanscript to load
function transliterate(text) {
    if (!text) return '';
    if (typeof Sanscript === 'undefined') {
        console.error('Sanscript not loaded');
        return text;
    }
    return Sanscript.t(text, 'hk', 'devanagari');
}

// Update character counts
function updateCounts() {
    inputCount.textContent = inputText.value.length;
    outputCount.textContent = outputText.value.length;
}

// Handle input changes
inputText.addEventListener('input', () => {
    if (autoTransliterate.checked) {
        outputText.value = transliterate(inputText.value);
    }
    updateCounts();
});

// Manual transliteration button
translateBtn.addEventListener('click', () => {
    outputText.value = transliterate(inputText.value);
    updateCounts();
});

// Copy to clipboard
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(outputText.value);
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
        }, 2000);
    } catch (error) {
        outputText.select();
        document.execCommand('copy');
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
        }, 2000);
    }
});

// Clear button
clearBtn.addEventListener('click', () => {
    inputText.value = '';
    outputText.value = '';
    updateCounts();
    inputText.focus();
});

// Example buttons
exampleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        inputText.value = btn.dataset.text;
        outputText.value = transliterate(btn.dataset.text);
        updateCounts();
    });
});

// Auto-transliterate toggle
autoTransliterate.addEventListener('change', () => {
    if (autoTransliterate.checked && inputText.value) {
        outputText.value = transliterate(inputText.value);
        updateCounts();
    }
});

// Initialize
updateCounts();
inputText.focus();
