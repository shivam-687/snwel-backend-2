"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebinarRouter = void 0;
const express_1 = __importDefault(require("express"));
const webinarController_1 = require("../controllers/webinarController");
const passport_config_1 = __importDefault(require("../config/passport-config"));
const router = express_1.default.Router();
exports.WebinarRouter = router;
// Define routes for webinars
router.post('/', passport_config_1.default.authenticate('jwt', { session: false }), webinarController_1.createWebinarController); // Create a new webinar
router.get('/slug/:slug', webinarController_1.getWebinarBySlugController); // Get a webinar by ID
router.get('/:id', webinarController_1.getWebinarByIdController); // Get a webinar by ID
router.get('/', webinarController_1.getAllWebinarController); // Get all webinars
router.put('/:id', webinarController_1.updateWebinarByIdController); // Update a webinar by ID
router.delete('/:id', webinarController_1.deleteWebinarByIdController); // Delete a webinar by ID
router.post('/:id/hosts', webinarController_1.addHostsToWebinarController); // Add hosts to a webinar
