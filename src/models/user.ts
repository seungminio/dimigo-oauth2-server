import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';
import {
  GenderValues,
  UserTypeValues,
  GradeValues,
  ClassValues,
} from '../types';

export const userSchema = createSchema({
  _id: Type.objectId(),
  idx: Type.number({ required: true, unique: true }),
  username: Type.string({ required: true, unique: true }),
  password: Type.string({ required: true }),
  name: Type.string({ required: true }),
  gender: Type.string({ enum: GenderValues }),
  phone: Type.string({ required: true }),
  type: Type.string({ required: true, enum: UserTypeValues }),
  grade: Type.number({ enum: GradeValues }),
  class: Type.number({ enum: ClassValues }),
  number: Type.number(),
  serial: Type.number(),
  photo: Type.array().of(Type.string()),
});

export type userDoc = ExtractDoc<typeof userSchema>;
export const userModel = typedModel('User', userSchema);
