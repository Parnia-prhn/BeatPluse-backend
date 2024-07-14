import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import { IRadio } from "../database/interfaces/IRadio";
import { Radio } from "../database/models/Radio";
import {
  createRadio,
  updateRadio,
  getRadio,
  deleteRadio,
  getAllRadios,
} from "../services/radioService";
async function createRadioController(obj: IRadio): Promise<IRadio> {
  const title = obj.title;
  const description = obj.description;
  const userIdCreator = obj.userIdCreator;

  try {
    const existingRadio: IRadio | null = await Radio.findOne({
      title,
      userIdCreator,
    });
    if (existingRadio) {
      throw new Error("radio already exists");
    }

    const newRadio: IRadio = await createRadio(
      title,
      description,
      userIdCreator
    );
    return newRadio;
  } catch (err) {
    throw new Error("Internal server error");
  }
}
async function updateRadioController(
  req: Request,
  reply: Reply
): Promise<void> {
  const radioId = (req.params as { id: string }).id;
  const updates = req.body as Partial<IRadio>;
  try {
    const radio: IRadio | null = await Radio.findById(radioId);
    if (!radio || radio.isDeleted) {
      reply.status(404).send({ error: "Radio not found" });
      return;
    }
    const updatedRadio: IRadio | null = await updateRadio(radioId, updates);
    reply.status(200).send(updatedRadio);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function deleteRadioController(
  req: Request,
  reply: Reply
): Promise<void> {
  const radioId = (req.params as { id: string }).id;
  try {
    const radio: IRadio | null = await Radio.findById(radioId);
    if (!radio || radio.isDeleted) {
      reply.status(404).send({ error: "radio not found!" });
    }
    await deleteRadio(radioId);
    reply.status(500).send({ message: "radio deleted successfully!" });
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getRadioController(req: Request, reply: Reply) {
  const radioId = (req.params as { id: string }).id;
  try {
    const radio: IRadio | null = await Radio.findById(radioId);
    if (!radio || radio.isDeleted) {
      reply.status(404).send({ error: "radio not found!" });
    }
    const radioInfo = await getRadio(radioId);
    reply.send(radio);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getAllRadiosController(req: Request, reply: Reply) {
  try {
    const radios = await getAllRadios();
    reply.send(radios);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
export {
  createRadioController,
  updateRadioController,
  deleteRadioController,
  getRadioController,
  getAllRadiosController,
};
