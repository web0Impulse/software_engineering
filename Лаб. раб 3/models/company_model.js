import { ModelBase } from "../models/model_base.js";


/**
 * Модель компании
 */
export class Company extends ModelBase {
  constructor() {
    super({
      table: "company",
      fields: [
        "id",
        "name",
        "login",
        "password_hash",
        "created_at",
        "updated_at",
      ],
      aliases: [],
      fillable: [
        "name",
        "login",
        "password_hash",
        "created_at",
        "updated_at"
      ],
      visible: [
        "id",
        "name",
        "login",
        "created_at",
        "updated_at",
      ],
      timestamp: true,
    });
  }
}