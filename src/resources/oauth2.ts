import bcrypt from 'bcrypt-nodejs';
import { serviceModel as ServiceModel } from '../models/service';
import { userModel as UserModel } from '../models/user';
import DimiAPI from './dimiapi';
import Token from './token';

export const createService = async (name: string) => {
  if (!name) throw new Error('서비스 이름을 입력해주세요.');

  const clientId = Math.random().toString(36).slice(2);
  const clientSecret = Math.random().toString(36).slice(2);

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(clientSecret, salt);

  const Service = new ServiceModel({ name, clientId, clientSecret: hash });

  Service.save();

  return {
    name,
    clientId,
    clientSecret,
  };
};

export const getServiceByClientId = async (clientId: string) => {
  const service = await ServiceModel.findOne(
    { clientId },
    { _id: false, name: true, clientId: true },
  );
  if (!service) throw new Error('서비스가 없습니다.');
  return service.toObject();
};

export const userConfirming = async () => {};

export const isUserConfirmed = async () => {};

// export const getToken = async (username: string, password: string) => {
//   const { id: idx } = await DimiAPI.getIdentity({ username, password });
//   const identity = await UserModel.findByIdx(idx);
//   return {
//     accessToken: Token.issue(identity, false),
//     refreshToken: Token.issue(identity, true),
//     user: identity,
//   };
// };

export const getUserInfoByToken = async () => {};
