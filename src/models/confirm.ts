import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';
import { serviceSchema } from './service';
import { userSchema } from './user';

export const confirmSchema = createSchema({
  service: Type.ref(Type.objectId()).to('Service', serviceSchema),
  user: Type.ref(Type.objectId()).to('User', userSchema),
});

export type confirmDoc = ExtractDoc<typeof confirmSchema>;
export const confirmModel = typedModel('Confirm', confirmSchema);
