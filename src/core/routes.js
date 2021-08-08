import { Router } from 'express';

import { INDEX_NAME } from '~/env';
import TDEE from '~/TDEE';

const router = Router();

// eslint-disable-next-line consistent-return

router.get('/', (req, res) => {
  res.send(`app-root, ${INDEX_NAME} mode`);
});

router.get('/me', (req, res) => {
  const { user } = req;
  res.status(200).json({ data: user });
});

router.use(TDEE.prefix, TDEE);

export default router;
