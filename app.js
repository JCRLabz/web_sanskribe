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

// Sanscript transliteration mapping for Harvard-Kyoto to Devanagari
const vowels = {
    'a': 'अ', 'A': 'आ', 'i': 'इ', 'I': 'ई', 'u': 'उ', 'U': 'ऊ',
    'R': 'ऋ', 'RR': 'ॠ', 'lR': 'ऌ', 'lRR': 'ॡ',
    'e': 'ए', 'ai': 'ऐ', 'o': 'ओ', 'au': 'औ'
};

const consonants = {
    'k': 'क', 'kh': 'ख', 'g': 'ग', 'gh': 'घ', 'G': 'ङ',
    'c': 'च', 'ch': 'छ', 'j': 'ज', 'jh': 'झ', 'J': 'ञ',
    'T': 'ट', 'Th': 'ठ', 'D': 'ड', 'Dh': 'ढ', 'N': 'ण',
    't': 'त', 'th': 'थ', 'd': 'द', 'dh': 'ध', 'n': 'न',
    'p': 'प', 'ph': 'फ', 'b': 'ब', 'bh': 'भ', 'm': 'म',
    'y': 'य', 'r': 'र', 'l': 'ल', 'v': 'व',
    'z': 'श', 'S': 'ष', 's': 'स', 'h': 'ह',
    'M': 'ं', 'H': 'ः', '.': '।'
};

const vowelMarks = {
    'a': '', 'A': 'ा', 'i': 'ि', 'I': 'ी', 'u': 'ु', 'U': 'ू',
    'R': 'ृ', 'RR': 'ॄ', 'lR': 'ॢ', 'lRR': 'ॣ',
    'e': 'े', 'ai': 'ै', 'o': 'ो', 'au': 'ौ'
};

// Simple transliteration function
function transliterate(text) {
    if (!text) return '';
    
    let result = '';
    let i = 0;
    
    while (i < text.length) {
        let matched = false;
        
        // Try to match longer sequences first
        for (let len = 3; len >= 1; len--) {
            const substr = text.substr(i, len);
            
            // Check for vowels
            if (vowels[substr]) {
                result += vowels[substr];
                i += len;
                matched = true;
                break;
            }
            
            // Check for consonants
            if (consonants[substr]) {
                result += consonants[substr];
                
                // Look ahead for vowel mark
                let j = i + len;
                let vowelMatched = false;
                for (let vlen = 3; vlen >= 1; vlen--) {
                    const vsubstr = text.substr(j, vlen);
                    if (vowelMarks[vsubstr]) {
                        result += vowelMarks[vsubstr];
                        i = j + vlen;
                        vowelMatched = true;
                        break;
                    }
                }
                
                if (!vowelMatched) {
                    result += '्'; // Add halant if no vowel follows
                    i += len;
                }
                matched = true;
                break;
            }
        }
        
        // If no match, keep the character as-is
        if (!matched) {
            result += text[i];
            i++;
        }
    }
    
    return result;
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
        console.error('Copy failed:', error);
        // Fallback for older browsers
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
