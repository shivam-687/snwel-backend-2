export const Constants = {
    ROLES: {
        SUPER_ADMIN: 'Super Admin',
        ADMIN: 'Admin',
        USER: 'User'
    },
    PERMISSIONS: {
        // User Management
        USER_CREATE: 'USER_CREATE',
        USER_VIEW: 'USER_VIEW',
        USER_UPDATE: 'USER_UPDATE',
        USER_DELETE: 'USER_DELETE',
        
        // Role Management
        ROLE_CREATE: 'ROLE_CREATE',
        ROLE_VIEW: 'ROLE_VIEW',
        ROLE_UPDATE: 'ROLE_UPDATE',
        ROLE_DELETE: 'ROLE_DELETE',
        
        // Other permissions...
    },
    OTP:{
        EXPIRATION_DAYS: 2,
        DELIVERY_METHOD: {
            whatsapp: true,
            email: true
        },
        MASTER_OTP: 796239,
        RESEND_COOLDOWN_SEC: 30,
        MAX_RESENDS: 5,
        SESSION_TTL_MINUTES: 20
    },
    TOKEN_SECRET: 'snwellacademy',
    FROM_EMAIL: "snwellacademy@gmail.com",
    MASTER_TYPES: {
        MASTER: 'MASTER',
        SUB_MASTER: 'SUB_MASTER'
    }
}