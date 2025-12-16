import { ModelBase } from "../models/model_base.js";


/**
 * Модель компании
 */
export class PropertyType extends ModelBase {
  constructor() {
    super({
      table: "property_type",
      fields: [
        "id",
        "name",
        "parent_id",
        "company_id",
        "created_at",
        "updated_at",
      ],
      aliases: [],
      fillable: [
        "name",
        "parent_id",
        "company_id",
        "created_at",
        "updated_at",
      ],
      visible: [
        "id",
        "name",
        "parent_id",
        "company_id",
        "created_at",
        "updated_at",
      ],
      timestamp: true,
    });
  }
}