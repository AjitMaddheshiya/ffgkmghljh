// Utility Functions

// DOM Utilities
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Show/Hide elements
const show = (element) => {
    if (element) element.classList.remove('hidden');
};

const hide = (element) => {
    if (element) element.classList.add('hidden');
};

// Toggle element visibility
const toggle = (element) => {
    if (element) element.classList.toggle('hidden');
};

// Validation Functions
const validators = {
    email: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    password: (password) => {
        return password.length >= 6;
    },
    
    required: (value) => {
        return value && value.trim().length > 0;
    },
    
    minLength: (value, min) => {
        return value && value.length >= min;
    },
    
    maxLength: (value, max) => {
        return value && value.length <= max;
    }
};

// Form validation
const validateForm = (formData, rules) => {
    const errors = {};
    
    for (const [field, fieldRules] of Object.entries(rules)) {
        const value = formData[field];
        
        for (const rule of fieldRules) {
            if (rule.type === 'required' && !validators.required(value)) {
                errors[field] = rule.message || `${field} is required`;
                break;
            }
            
            if (rule.type === 'email' && !validators.email(value)) {
                errors[field] = rule.message || 'Invalid email format';
                break;
            }
            
            if (rule.type === 'password' && !validators.password(value)) {
                errors[field] = rule.message || 'Password must be at least 6 characters';
                break;
            }
            
            if (rule.type === 'minLength' && !validators.minLength(value, rule.value)) {
                errors[field] = rule.message || `${field} must be at least ${rule.value} characters`;
                break;
            }
            
            if (rule.type === 'maxLength' && !validators.maxLength(value, rule.value)) {
                errors[field] = rule.message || `${field} must be no more than ${rule.value} characters`;
                break;
            }
        }
    }
    
    return errors;
};

// Display form errors
const displayFormErrors = (errors) => {
    // Clear previous errors
    $$('.error-message').forEach(el => el.textContent = '');
    
    // Display new errors
    for (const [field, message] of Object.entries(errors)) {
        const errorElement = $(`#${field}Error`);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
};

// Clear form errors
const clearFormErrors = () => {
    $$('.error-message').forEach(el => el.textContent = '');
};

// Data Storage (LocalStorage wrapper)
const storage = {
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },
    
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },
    
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

// Date/Time utilities
const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return {
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: secs.toString().padStart(2, '0')
    };
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Generate unique ID
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Debounce function
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Deep clone object
const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
};

// Random number generator
const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Shuffle array
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Calculate percentage
const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
};

// Format file size
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Check if element is in viewport
const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

// Scroll to element
const scrollToElement = (element, offset = 0) => {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
};

// Copy to clipboard
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy text:', error);
        return false;
    }
};

// Download file
const downloadFile = (data, filename, type = 'text/plain') => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Export utilities
window.utils = {
    $,
    $$,
    show,
    hide,
    toggle,
    validators,
    validateForm,
    displayFormErrors,
    clearFormErrors,
    storage,
    formatTime,
    formatDate,
    generateId,
    debounce,
    throttle,
    deepClone,
    random,
    shuffleArray,
    calculatePercentage,
    formatFileSize,
    isInViewport,
    scrollToElement,
    copyToClipboard,
    downloadFile
}; 