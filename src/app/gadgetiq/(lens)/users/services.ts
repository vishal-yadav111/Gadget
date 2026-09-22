import { lensFetch } from "../core/client";
import {
  LensUserRecord,
  CreateUserPayload,
  UpdateUserPayload,
} from "./types";

export const usersService = {
  list: async (): Promise<LensUserRecord[]> => {
    const res = await lensFetch<LensUserRecord[]>("/admin/users");
    return res.data || [];
  },

  create: async (data: CreateUserPayload) => {
    return lensFetch("/admin/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string | number, data: UpdateUserPayload) => {
    return lensFetch(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};
