import { prop, getModelForClass } from "@typegoose/typegoose";

/**
 * @class User
 * @description User model
 * @property {string} userID - The user's ID
 * @property {number} guesses - The user's correct guesses
 */
class User {
  @prop()
  userID: string;

  @prop({ default: 0 })
  guesses: number;

  @prop()
  createdAt: Date;

  @prop()
  updatedAt: Date;
}

const UserModel = getModelForClass(User);

export default UserModel;
