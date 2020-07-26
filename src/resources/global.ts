import bcrypt from 'bcrypt-nodejs';
import DimiAPI from './dimiapi';
import { userModel as UserModel } from '../models';
import { userDoc } from '../models/user';

export const getAccountInfo = async (username: string, password: string) => {
  try {
    const dimiAccount = await DimiAPI.getIdentity({ username, password });
    const globalAccount = await UserModel.findOne({ idx: dimiAccount.id });
    if (globalAccount) throw new Error('이미 통합계정으로 등록되어 있습니다.');
    return { name: dimiAccount.name, photo: dimiAccount.photofile1 };
  } catch (err) {
    if (err.response) {
      throw new Error('아이디나 비밀번호를 다시 한번 확인해주세요.');
    }
    throw new Error(err.message);
  }
};

export const convertToGlobalAccount = async (
  username: string,
  password: string,
) => {
  try {
    const dimiAccount = await DimiAPI.getIdentity({ username, password });
    const globalAccount = await UserModel.findOne({ idx: dimiAccount.id });
    if (globalAccount) throw new Error('이미 통합계정으로 등록되어 있습니다.');

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const allStudents = await DimiAPI.getAllStudents();

    let data: any = {
      idx: dimiAccount.id,
      username: dimiAccount.username,
      password: hashedPassword,
      name: dimiAccount.name,
      type: dimiAccount.user_type,
      gender: dimiAccount.gender,
      phone: dimiAccount.phone,
      photo: [dimiAccount.photofile1, dimiAccount.photofile2].filter((v) => v),
    };

    console.log(allStudents);

    await Promise.all(
      allStudents.map((student: any) => {
        if (student.user_id === dimiAccount.id) {
          data = {
            ...data,
            grade: student.grade,
            class: student.class,
            number: student.number,
            serial: student.serial,
          };
        }
        return student;
      }),
    );

    const account = new UserModel(data);
    await account.save();
    return account;
  } catch (err) {
    console.log(err);
    throw new Error('아이디나 비밀번호를 다시 한번 확인해주세요.');
  }
};
