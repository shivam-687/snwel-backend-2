"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const app_1 = require("./app");
require("./service/notificationService");
const PORT = process.env.PORT || 3000;
app_1.app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
