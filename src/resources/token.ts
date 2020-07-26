import jwt from 'jsonwebtoken';
import config from '../config';

async function issue(identity: any, refresh: boolean = false) {
  const signOptions: jwt.SignOptions = {
    algorithm: 'HS256',
    expiresIn: refresh ? '1y' : '1w',
  };

  const token = jwt.sign(
    { ...identity, refresh },
    config.jwtSecret,
    signOptions,
  );

  return token;
}

export default {
  issue,
};
