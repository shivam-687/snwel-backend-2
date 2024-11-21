import express from 'express';
import { getMeController, getUserController, getUserListController, updateUserController } from '@/controllers/userController';
import passport from 'passport';

const router = express.Router();

router.get('/', passport.authenticate('jwt', {session: false}), getUserListController);
router.get('/me', passport.authenticate('jwt', {session: false}), getMeController);
router.put('/:id', passport.authenticate('jwt', {session: false}), updateUserController);
router.get('/:id', passport.authenticate('jwt', {session: false}), getUserController);



export { router as UserRouter };
