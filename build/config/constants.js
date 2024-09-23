"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
exports.Constants = {
    ROLES: {
        ADMIN: 'ADMIN',
        USER: 'USER'
    },
    OTP: {
        EXPIRATION_DAYS: 2,
        DELIVERY_METHOD: {
            whatsapp: true,
            email: true
        },
        MASTER_OTP: 796239
    },
    TOKEN_SECRET: 'snwellacademy',
    FROM_EMAIL: "snwellacademy@gmail.com",
    MASTER_TYPES: {
        MASTER: 'MASTER',
        SUB_MASTER: 'SUB_MASTER'
    }
};
