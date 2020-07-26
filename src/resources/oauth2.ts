/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import { serviceModel as ServiceModel } from '../models/service';
import { userModel as UserModel } from '../models/user';
import Token from './token';
import { confirmModel as ConfirmModel } from '../models/confirm';
import config from '../config';

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

const getUserInfoByUsernameAndPassword = async (
  username: string,
  password: string,
) => {
  const identity = await UserModel.findOne({ username });
  if (!identity) throw new Error('아이디나 비밀번호를 다시 한번 확인해주세요.');

  const comparePassword = await bcrypt.compareSync(password, identity.password);
  if (!comparePassword)
    throw new Error('아이디나 비밀번호를 다시 한번 확인해주세요.');

  return identity;
};

export const userConfirming = async (
  username: string,
  password: string,
  clientId: string,
) => {
  const user = await getUserInfoByUsernameAndPassword(username, password);
  const service = await ServiceModel.findOne({ clientId });
  if (!service) throw new Error('서비스가 없습니다.');
  const findConfirm = await ConfirmModel.findOne({
    user: user._id,
    service: service._id,
  });
  if (findConfirm) throw new Error('이미 연결한 서비스입니다.');
  const confirm = new ConfirmModel({ user: user._id, service: service._id });
  await confirm.save();
  return { message: '정상적으로 연결되었습니다.' };
};

export const isUserConfirmed = async (
  username: string,
  password: string,
  clientId: string,
) => {
  const user = await getUserInfoByUsernameAndPassword(username, password);
  const service = await ServiceModel.findOne({ clientId });
  if (!service) throw new Error('서비스가 없습니다.');
  const findConfirm = await ConfirmModel.findOne({
    user: user._id,
    service: service._id,
  });
  return { confirmed: !!findConfirm };
};

export const getToken = async (
  username: string,
  password: string,
  clientId: string,
) => {
  const user = await getUserInfoByUsernameAndPassword(username, password);

  const service = await ServiceModel.findOne({ clientId });
  if (!service) throw new Error('서비스가 없습니다.');

  const confirm = await ConfirmModel.findOne({
    user: user._id,
    service: service._id,
  });
  if (!confirm) throw new Error('연결되지 않은 서비스입니다.');

  return {
    accessToken: await Token.issue(
      { user: user._id, service: clientId },
      false,
    ),
  };
};

export const getUserInfoByToken = async (
  token: string,
  clientId: string,
  clientSecret: string,
) => {
  const tokenVerify = jwt.verify(token, config.jwtSecret);
  if (!tokenVerify) throw new Error('토큰이 올바르지 않습니다.');

  const client = await ServiceModel.findOne({ clientId });
  if (!client) throw new Error('서비스가 없습니다.');

  const compareClientSecret = await bcrypt.compareSync(
    clientSecret,
    client.clientSecret,
  );
  if (!compareClientSecret)
    throw new Error('clientSecret 키가 올바르지 않습니다.');

  const user = UserModel.findById(Object(tokenVerify).user, {
    _id: false,
    password: false,
  });
  if (!user) throw new Error('유저가 없습니다.');

  return user;
};
