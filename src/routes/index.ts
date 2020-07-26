import { Router, Request, Response } from 'express';
import { createService, getServiceByClientId } from '../resources/oauth2';
import { getAccountInfo } from '../resources/global';

const router = Router();

// Use imported routes

router.get('/', (_, res: Response) => {
  res.status(200).send('👋 DIMIGOin Backnd Server');
});

router.get(
  '/service/info',
  async (req: Request<any, any, any, { clientId: string }>, res: Response) => {
    try {
      const service = await getServiceByClientId(req.query.clientId);
      res.status(200).json(service);
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  },
);

router.post('/service/new', async (req: Request, res: Response) => {
  try {
    const service = await createService(req.body.name);
    res.status(200).json(service);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

router.post('/account/info', async (req: Request, res: Response) => {
  try {
    const account = await getAccountInfo(req.body.username, req.body.password);
    res.status(200).json(account);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

export default router;
