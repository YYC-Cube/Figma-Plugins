"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSnakeCase = toSnakeCase;
exports.toCamelCase = toCamelCase;
exports.toPascalCase = toPascalCase;
exports.toKebabCase = toKebabCase;
exports.pluralize = pluralize;
exports.singularize = singularize;
exports.generateId = generateId;
exports.escapeSqlString = escapeSqlString;
exports.quoteIdentifier = quoteIdentifier;
exports.isValidIdentifier = isValidIdentifier;
exports.sanitizeName = sanitizeName;
exports.truncate = truncate;
exports.capitalize = capitalize;
exports.uncapitalize = uncapitalize;
exports.deepClone = deepClone;
exports.deepMerge = deepMerge;
exports.debounce = debounce;
exports.throttle = throttle;
exports.formatDate = formatDate;
exports.parseDate = parseDate;
exports.generateHash = generateHash;
exports.isValidEmail = isValidEmail;
exports.isValidUrl = isValidUrl;
exports.formatBytes = formatBytes;
exports.formatNumber = formatNumber;
exports.sleep = sleep;
exports.retry = retry;
exports.chunk = chunk;
exports.unique = unique;
exports.groupBy = groupBy;
exports.sortBy = sortBy;
exports.pick = pick;
exports.omit = omit;
function toSnakeCase(str) {
    return str
        .replace(/([A-Z])/g, '_$1')
        .replace(/[-\s]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .toLowerCase();
}
function toCamelCase(str) {
    const snake = toSnakeCase(str);
    return snake.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}
function toPascalCase(str) {
    const camel = toCamelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
}
function toKebabCase(str) {
    return str
        .replace(/([A-Z])/g, '-$1')
        .replace(/[_\s]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
}
function pluralize(str) {
    if (str.endsWith('y')) {
        return str.slice(0, -1) + 'ies';
    }
    if (str.endsWith('s') || str.endsWith('x') || str.endsWith('z') || str.endsWith('ch') || str.endsWith('sh')) {
        return str + 'es';
    }
    return str + 's';
}
function singularize(str) {
    if (str.endsWith('ies')) {
        return str.slice(0, -3) + 'y';
    }
    if (str.endsWith('es') && !str.endsWith('ses')) {
        return str.slice(0, -2);
    }
    if (str.endsWith('s')) {
        return str.slice(0, -1);
    }
    return str;
}
function generateId(prefix = '') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 9);
    return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
}
function escapeSqlString(str) {
    return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
}
function quoteIdentifier(name) {
    return `"${name.replace(/"/g, '""')}"`;
}
function isValidIdentifier(name) {
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
}
function sanitizeName(name) {
    return name
        .replace(/[^a-zA-Z0-9_]/g, '_')
        .replace(/^[0-9]/, '_$&')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
}
function truncate(str, maxLength, suffix = '...') {
    if (str.length <= maxLength)
        return str;
    return str.slice(0, maxLength - suffix.length) + suffix;
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function uncapitalize(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function deepMerge(target, source) {
    const result = Object.assign({}, target);
    for (const key in source) {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key]) && key in target) {
            result[key] = deepMerge(target[key], source[key]);
        }
        else {
            result[key] = source[key];
        }
    }
    return result;
}
function debounce(func, wait) {
    let timeout = null;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}
function throttle(func, limit) {
    let inThrottle = false;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return format
        .replace('YYYY', String(year))
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}
function parseDate(dateStr) {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
}
function generateHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
}
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    }
    catch (_a) {
        return false;
    }
}
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
function formatNumber(num, decimals = 2) {
    return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function retry(fn_1) {
    return __awaiter(this, arguments, void 0, function* (fn, maxAttempts = 3, delay = 1000) {
        let lastError;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return yield fn();
            }
            catch (error) {
                lastError = error;
                if (attempt < maxAttempts) {
                    yield sleep(delay * attempt);
                }
            }
        }
        throw lastError;
    });
}
function chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}
function unique(array) {
    return Array.from(new Set(array));
}
function groupBy(array, key) {
    return array.reduce((result, item) => {
        const groupKey = String(item[key]);
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});
}
function sortBy(array, key, order = 'asc') {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal < bVal)
            return order === 'asc' ? -1 : 1;
        if (aVal > bVal)
            return order === 'asc' ? 1 : -1;
        return 0;
    });
}
function pick(obj, keys) {
    const result = {};
    for (const key of keys) {
        if (key in obj) {
            result[key] = obj[key];
        }
    }
    return result;
}
function omit(obj, keys) {
    const result = Object.assign({}, obj);
    for (const key of keys) {
        delete result[key];
    }
    return result;
}
