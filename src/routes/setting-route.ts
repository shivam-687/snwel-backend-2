import { settingsController } from '@/controllers/setting-controller';
import { authenticateJWT } from '@/middleware/auth.middleware';
import { Router } from 'express';

const router = Router();

router.get('/', settingsController.listSettings);
router.post('/', authenticateJWT, settingsController.createSetting);
router.get('/:code', settingsController.getSetting);
router.put('/:code', authenticateJWT, settingsController.updateSetting);
router.patch('/:code', authenticateJWT, settingsController.partialUpdateSetting);
router.delete('/:code', authenticateJWT, settingsController.deleteSetting);



export {router as SettingRouter};