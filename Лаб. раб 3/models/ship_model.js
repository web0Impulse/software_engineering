import { ModelBase } from "../models/model_base.js";


/**
 * Модель компании
 */
export class Ship extends ModelBase {
  constructor() {
    super({
      table: "ship",
      fields: [
        "id",
        "name",
        "company_id",
        "created_at",
        "updated_at",
      ],
      aliases: [],
      fillable: [
        "name",
        "company_id",
        "created_at",
        "updated_at",
      ],
      visible: [
        "id",
        "name",
        "company_id",
        "created_at",
        "updated_at",
      ],
      timestamp: true,
    });
  }
}