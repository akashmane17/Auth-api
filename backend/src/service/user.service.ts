import { FilterQuery } from "mongoose";
import UserModel, { User } from "../model/user.model";

export function createUser(input: Partial<User>) {
  return UserModel.create(input);
}

export function findUserById(id: string) {
  return UserModel.findById(id);
}

export async function findUser(query: FilterQuery<User>) {
  return UserModel.findOne(query).lean;
}

export function findUserByEmail(email: string) {
  return UserModel.findOne({ email });
}