let currentInput = '';
let previousInput = '';
let operator = '';
let shouldResetDisplay = false;

const resultDisplay = document.getElementById('result');

// Theme management
function changeTheme(theme) {
    // Remove all theme classes
    document.body.classList.remove('dark-theme', 'light-theme', 'neon-theme', 'retro-theme');
    
    // Add the selected theme class
    if (theme !== 'dark') {
        document.body.classList.add(theme + '-theme');
    }
    
    // Save theme preference
    localStorage.setItem('calculator-theme', theme);
    
    // Update the select dropdown
    document.getElementById('theme-select').value = theme;
}

function loadTheme() {
    const savedTheme = localStorage.getItem('calculator-theme') || 'dark';
    changeTheme(savedTheme);
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', loadTheme);

// Ensure the window has focus for keyboard events
window.addEventListener('load', () => {
    window.focus();
});

function updateDisplay(value) {
    resultDisplay.textContent = value || '0';
}

// Helper function to simulate button press visual effect
function simulateButtonPress(buttonText) {
    const buttons = document.querySelectorAll('.btn');
    let targetButton = null;
    
    // Find the button that matches the text
    buttons.forEach(btn => {
        if (btn.textContent.trim() === buttonText) {
            targetButton = btn;
        }
    });
    
    if (targetButton) {
        // Add pressed class temporarily
        targetButton.classList.add('pressed');
        setTimeout(() => {
            targetButton.classList.remove('pressed');
        }, 100);
    }
}

function inputNumber(num) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    if (currentInput === '0' && num !== '.') {
        currentInput = num;
    } else {
        currentInput += num;
    }
    
    updateDisplay(currentInput);
    // Brief delay to show visual feedback before removing focus
    setTimeout(() => document.activeElement.blur(), 100);
}

function inputDecimal() {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    if (currentInput === '') {
        currentInput = '0.';
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    
    updateDisplay(currentInput);
    // Brief delay to show visual feedback before removing focus
    setTimeout(() => document.activeElement.blur(), 100);
}

function inputOperator(op) {
    if (previousInput && currentInput && operator) {
        calculate();
    }
    
    previousInput = currentInput || '0';
    operator = op;
    shouldResetDisplay = true;
    // Brief delay to show visual feedback before removing focus
    setTimeout(() => document.activeElement.blur(), 100);
}

function calculate() {
    if (!previousInput || !currentInput || !operator) {
        return;
    }
    
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                updateDisplay('Error');
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Round to avoid floating point precision issues
    result = Math.round(result * 100000000) / 100000000;
    
    currentInput = result.toString();
    previousInput = '';
    operator = '';
    shouldResetDisplay = true;
    
    updateDisplay(currentInput);
    // Brief delay to show visual feedback before removing focus
    setTimeout(() => document.activeElement.blur(), 100);
}

function clearAll() {
    currentInput = '';
    previousInput = '';
    operator = '';
    shouldResetDisplay = false;
    updateDisplay('0');
    // Brief delay to show visual feedback before removing focus
    setTimeout(() => document.activeElement.blur(), 100);
}

function clearEntry() {
    currentInput = '';
    updateDisplay('0');
    // Brief delay to show visual feedback before removing focus
    setTimeout(() => document.activeElement.blur(), 100);
}

function deleteLast() {
    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        updateDisplay(currentInput || '0');
    }
    // Brief delay to show visual feedback before removing focus
    setTimeout(() => document.activeElement.blur(), 100);
}

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        simulateButtonPress(key);
        inputNumber(key);
    } else if (key === '.') {
        simulateButtonPress('.');
        inputDecimal();
    } else if (key === '+') {
        simulateButtonPress('+');
        inputOperator('+');
    } else if (key === '-') {
        simulateButtonPress('-');
        inputOperator('-');
    } else if (key === '*') {
        simulateButtonPress('×');
        inputOperator('*');
    } else if (key === '/') {
        event.preventDefault(); // Prevent browser search
        simulateButtonPress('÷');
        inputOperator('/');
    } else if (key === 'Enter' || key === '=') {
        simulateButtonPress('=');
        calculate();
    } else if (key === 'Escape') {
        simulateButtonPress('C');
        clearAll();
    } else if (key === 'Backspace') {
        simulateButtonPress('⌫');
        deleteLast();
    }
});
