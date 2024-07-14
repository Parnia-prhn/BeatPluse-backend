import { getAsync, setAsync, delAsync } from "../configs/redisClient";
import { Radio } from "../database/models/Radio";
import { IRadio } from "../database/interfaces/IRadio";

async function createRadio(
  title: string | null,
  description: string | null,
  userIdCreator: string | null
): Promise<IRadio> {
  const radio = new Radio({
    title,
    description,
    userIdCreator,
    created: Date.now(),
    updated: Date.now(),
  });
  await radio.save();
  return radio;
}
async function getRadio(radioId: string): Promise<IRadio | null> {
  let radio = await getAsync(`radio:${radioId}`);
  if (radio) {
    return JSON.parse(radio) as IRadio;
  }
  radio = await Radio.findById(radioId).exec();
  if (radio) {
    await setAsync(`radio:${radioId}`, JSON.stringify(radio), "EX", 3600);
  }
  return radio;
}
async function updateRadio(
  radioId: string,
  updates: Partial<IRadio>
): Promise<IRadio | null> {
  const radio = await Radio.findByIdAndUpdate(radioId, updates, {
    new: true,
  }).exec();
  if (radio) {
    await setAsync(`radio:${radioId}`, JSON.stringify(radio), "EX", 3600);
  }
  return radio;
}
async function deleteRadio(radioId: string): Promise<void> {
  const radio = await Radio.findByIdAndUpdate(radioId, {
    isDeleted: true,
  }).exec();
  await delAsync(`radio:${radioId}`);
}
async function getAllRadios(): Promise<IRadio[]> {
  return Radio.find().exec();
}
export { createRadio, getRadio, updateRadio, deleteRadio, getAllRadios };
