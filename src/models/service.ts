import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';

export const serviceSchema = createSchema({
  name: Type.string({ required: true }),
  clientId: Type.string({ required: true }),
  clientSecret: Type.string({ required: true }),
});

export type serviceDoc = ExtractDoc<typeof serviceSchema>;
export const serviceModel = typedModel('Service', serviceSchema);
