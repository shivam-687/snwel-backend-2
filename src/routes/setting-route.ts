import { settingsController } from '@/controllers/setting-controller';
import { authenticateJWT } from '@/middleware/auth.middleware';
import { Router } from 'express';
import { checkPermission } from '@/middleware/permissionMiddleware';

const router = Router();

router.get('/', settingsController.listSettings);
router.post('/', authenticateJWT, checkPermission('SETTINGS_UPDATE'), settingsController.createSetting);

router.get('/:code', settingsController.getSetting);
router.put('/:code', authenticateJWT, checkPermission('SETTINGS_UPDATE'), settingsController.updateSetting);
router.patch('/:code', authenticateJWT, checkPermission('SETTINGS_UPDATE'), settingsController.partialUpdateSetting);
router.delete('/:code', authenticateJWT, checkPermission('SETTINGS_UPDATE'), settingsController.deleteSetting);

export {router as SettingRouter};