"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertSortOrder = exports.queryHandler = exports.extractListOptions = exports.generateRandomPassword = exports.getFilterQuery = exports.generateJwtToken = exports.generateOTPObject = exports.generateOTP = exports.decryptToken = exports.generateToken = exports.convertToPagination = exports.getPaginationParams = exports.withPagination = exports.parseErrorMessage = exports.validatedPassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const dayjs_1 = __importDefault(require("dayjs"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../../config/constants");
async function hashPassword(password) {
    const hash = await bcrypt_1.default.hash(password, 10);
    return hash;
}
exports.hashPassword = hashPassword;
async function validatedPassword(plainPassword, hash) {
    return bcrypt_1.default.compare(plainPassword, hash);
}
exports.validatedPassword = validatedPassword;
function parseErrorMessage(error) {
    const errorMessage = error.message;
    // Check if the error message follows a specific format
    const regex = /Error\: (\d+)\:(.*)/;
    const match = errorMessage.match(regex);
    if (match && match.length === 3) {
        const statusCode = parseInt(match[1]);
        const errorMessage = match[2];
        return { status: statusCode, message: errorMessage };
    }
    else {
        // If the string format is not found, return default 500 status
        return { status: 500, message: error.message };
    }
}
exports.parseErrorMessage = parseErrorMessage;
function withPagination(qb, orderByColumn, page = 1, pageSize = 10) {
    return qb
        .orderBy(orderByColumn)
        .limit(pageSize)
        .offset((page - 1) * pageSize);
}
exports.withPagination = withPagination;
const getPaginationParams = (limit = 20, page = 1) => {
    // Calculate offset based on page number and limit
    limit = Number(limit);
    page = Number(page);
    const offset = (page - 1) * limit;
    return { limit, offset, page };
};
exports.getPaginationParams = getPaginationParams;
const convertToPagination = (data, total, limit = 20, page = 1) => {
    const offset = Math.max((page - 1) * limit, 0);
    const nextPage = page < Math.ceil(total / limit) ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;
    const hasNext = nextPage !== null;
    const currentPage = page;
    console.log(total);
    return {
        docs: data,
        limit: limit,
        offset: offset,
        total: total,
        nextPage: nextPage,
        prevPage: prevPage,
        hasNext: hasNext,
        currentPage: currentPage
    };
};
exports.convertToPagination = convertToPagination;
// Function to generate a token with action
function generateToken(action) {
    // Generate a unique token using UUID (Universally Unique Identifier)
    const token = (0, uuid_1.v4)();
    return token + '|' + action; // Concatenate token with action using a separator
}
exports.generateToken = generateToken;
// Function to decrypt token and extract action
function decryptToken(token) {
    // Split the token using the separator '|'
    const parts = token.split('|');
    if (parts.length === 2) {
        // Return the action part of the token
        return parts[1];
    }
    return null; // Return null if the token format is invalid
}
exports.decryptToken = decryptToken;
function generateOTP(length = 6) {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}
exports.generateOTP = generateOTP;
function generateOTPObject({ length = 6 }) {
    const expiry = (0, dayjs_1.default)(Date.now()).add(1, 'year').toDate();
    return {
        otp: generateOTP(length),
        expirationTime: expiry,
        verified: false,
    };
}
exports.generateOTPObject = generateOTPObject;
function generateJwtToken(payload) {
    return jsonwebtoken_1.default.sign(payload, constants_1.Constants.TOKEN_SECRET, { expiresIn: '1y' });
}
exports.generateJwtToken = generateJwtToken;
const getFilterQuery = (options) => {
    const { filter } = options;
    const query = {};
    if (filter && filter.search) {
        const searchRegex = new RegExp(filter.search, 'i');
        query.$or = [{ name: searchRegex }, { email: searchRegex }]; // Assuming you're searching by name and email, you can adjust this accordingly
    }
    return query;
};
exports.getFilterQuery = getFilterQuery;
function generateRandomPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
    let password = "";
    for (let i = 0; i < (length || 10); i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}
exports.generateRandomPassword = generateRandomPassword;
const extractListOptions = (req) => {
    const { limit, page, search, ...rest } = req.query;
    // Parse limit and page to numbers if they exist, otherwise set defaults
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    const parsedPage = page ? parseInt(page, 10) : 1;
    // Construct the filter object from remaining query parameters
    const filter = { ...rest };
    return {
        limit: parsedLimit,
        page: parsedPage,
        search: search,
        filter
    };
};
exports.extractListOptions = extractListOptions;
function buildQuery(filter, searchFields) {
    const query = {};
    // Handle dynamic search across multiple fields
    if (filter?.search && searchFields?.length) {
        const searchRegex = new RegExp(filter.search, 'i');
        query.$or = searchFields.map(field => ({ [field]: searchRegex }));
    }
    // Handle dynamic filters
    if (filter) {
        for (const [key, value] of Object.entries(filter)) {
            if (key !== 'search') { // Exclude search from normal filter processing
                query[key] = value;
            }
        }
    }
    console.log(query);
    return query;
}
async function queryHandler(model, options) {
    const { limit = 10, page = 1, filter, sort, searchFields, search } = options;
    const { limit: parsedLimit, offset } = (0, exports.getPaginationParams)(limit, page);
    const query = buildQuery({ ...filter, search }, searchFields);
    const documents = model
        .find(query)
        .sort(sort)
        .skip(offset)
        .limit(parsedLimit);
    return {
        documents,
        limit: parsedLimit,
        offset,
        page: Number(page)
    };
}
exports.queryHandler = queryHandler;
function convertSortOrder(obj) {
    const newObj = {};
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            // Recursively handle nested objects
            newObj[key] = convertSortOrder(obj[key]);
        }
        else if (obj[key] === 'asc') {
            newObj[key] = 1;
        }
        else if (obj[key] === 'desc') {
            newObj[key] = -1;
        }
        else {
            newObj[key] = obj[key]; // Keep other values unchanged
        }
    }
    return newObj;
}
exports.convertSortOrder = convertSortOrder;
