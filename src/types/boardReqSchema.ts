import { z } from "zod";

export const collaboratorEnum = z.enum(["VIEWER", "EDITOR"]);

export const CreateBoard = z.object({
  boardName: z.string().min(3).max(40),
  slug: z.string().min(6).max(60).refine((str) => {
    return typeof str === "string" ? /^[a-z0-9-]+$/.test(str) : false;
  }, "slug must be 6 to 60 chars and must contain small english letters and numbers"),
});

export const UpdateCollaborator = z.object({
  boardId: z.string().min(1).refine((str) => {
    return /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test
  }, "Invalid Board Id"),
  userName: z.string().min(6).max(40),
  collboratorType: collaboratorEnum
});

export const Uuid = z.string().min(1).refine((str) => {
  return /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test
}, "Invalid UUID Id");
