import DimiAPI from './dimiapi';
import { userModel as UserModel } from '../models';

export const getAccountInfo = async (username: string, password: string) => {
  try {
    const dimiAccount = await DimiAPI.getIdentity({ username, password });
    const globalAccount = await UserModel.findOne({ idx: dimiAccount.id });
    if (globalAccount) throw new Error('이미 통합계정으로 등록되어 있습니다.');
    return { name: dimiAccount.name, photo: dimiAccount.photofile1 };
  } catch (err) {
    throw new Error('아이디나 비밀번호를 다시 한번 확인해주세요.');
  }
};
