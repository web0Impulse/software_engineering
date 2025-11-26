import { ModelBase } from "../models/model_base.js";


/**
 * Модель компании
 */
export class Property extends ModelBase {
  constructor() {
    super({
      table: "property",
      fields: [
        "id",
        "name",
        "type_id",
        "quantity",
        "location",
        "date_prev_inspection",
        "check_mark",
        "date_next_inspection",
        "frequency_of_inspection",
        "is_ok",
        "created_at",
        "updated_at",
      ],
      aliases: [],
      fillable: [
        "name",
        "type_id",
        "quantity",
        "location",
        "date_prev_inspection",
        "check_mark",
        "date_next_inspection",
        "frequency_of_inspection",
        "is_ok",
        "created_at",
        "updated_at",
      ],
      visible: [
        "id",
        "name",
        "type_id",
        "quantity",
        "location",
        "date_prev_inspection",
        "check_mark",
        "date_next_inspection",
        "frequency_of_inspection",
        "is_ok",
        "created_at",
        "updated_at",
      ],
      timestamp: true,
    });
  }
}