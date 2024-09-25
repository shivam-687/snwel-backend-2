import {config} from 'dotenv';
config();

import { app } from './app';
import './service/notificationService'

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
