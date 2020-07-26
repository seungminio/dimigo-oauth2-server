/* eslint-disable no-underscore-dangle */
import bcrypt from 'bcrypt-nodejs';
import { serviceModel as ServiceModel } from '../models/service';
import { userModel as UserModel } from '../models/user';
import Token from './token';
import { confirmModel as ConfirmModel } from '../models/confirm';

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

export const userConfirming = async (userId: string, clientId: string) => {
  const findConfirm = await ConfirmModel.findOne({
    user: userId,
    service: clientId,
  });
  if (findConfirm) throw new Error('이미 연결한 서비스입니다.');
  const confirm = new ConfirmModel({ user: userId, service: clientId });
  await confirm.save();
  return { message: '정상적으로 연결되었습니다.' };
};

export const isUserConfirmed = async (userId: string, clientId: string) => {
  const findConfirm = await ConfirmModel.findOne({
    user: userId,
    service: clientId,
  });
  return { confirmed: !!findConfirm };
};

export const getToken = async (
  username: string,
  password: string,
  clientId: string,
) => {
  const identity = await UserModel.findOne({ username });
  if (!identity) throw new Error('아이디나 비밀번호를 다시 한번 확인해주세요.');

  const comparePassword = await bcrypt.compareSync(password, identity.password);
  if (!comparePassword)
    throw new Error('아이디나 비밀번호를 다시 한번 확인해주세요.');

  const service = await ServiceModel.findOne({ clientId });
  if (!service) throw new Error('서비스가 없습니다.');

  const confirm = await ConfirmModel.findOne({
    user: identity._id,
    service: clientId,
  });
  if (!confirm) throw new Error('연결되지 않은 서비스입니다.');

  return {
    accessToken: await Token.issue(
      { user: identity._id, service: clientId },
      false,
    ),
  };
};

export const getUserInfoByToken = async () => {};
