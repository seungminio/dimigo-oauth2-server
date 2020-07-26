import { Router, Request, Response } from 'express';
import {
  createService,
  getServiceByClientId,
  getToken,
  isUserConfirmed,
  userConfirming,
  getUserInfoByToken,
} from '../resources/oauth2';
import { getAccountInfo, convertToGlobalAccount } from '../resources/global';

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

router.post('/account/convert', async (req: Request, res: Response) => {
  try {
    const account = await convertToGlobalAccount(
      req.body.username,
      req.body.password,
    );
    res.status(200).json(account);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

router.post('/account/login', async (req: Request, res: Response) => {
  try {
    const { username, password, clientId } = req.body;
    const user = await getToken(username, password, clientId);
    res.status(200).json(user);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

router.post('/account/confirm', async (req: Request, res: Response) => {
  try {
    const { username, password, clientId } = req.body;
    const confirm = await userConfirming(username, password, clientId);
    res.status(200).json(confirm);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

router.post('/account/confirm/info', async (req: Request, res: Response) => {
  try {
    const { username, password, clientId } = req.body;
    const result = await isUserConfirmed(username, password, clientId);
    res.status(200).json(result);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

router.post('/oauth/account/info', async (req: Request, res: Response) => {
  try {
    const { token, clientId, clientSecret } = req.body;
    const userInfo = await getUserInfoByToken(token, clientId, clientSecret);
    res.status(200).json(userInfo);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

export default router;
