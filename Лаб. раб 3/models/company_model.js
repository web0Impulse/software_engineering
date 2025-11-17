import { MODEL } from "../models/model_base.js";

    /**
     * Создаём объект с прототипом MODEL
     * @type {import("../models/model_base.js").ModelType}
     */
    export const Company = structuredClone(MODEL);
    Company.table = "company";
    Company.visible = [
      "id",
      "name",
      "login",
      "created_at",
      "updated_at",
    ];
    Company.fields = [
      "id",
      "name",
      "login",
      "password_hash",
      "created_at",
      "updated_at",
    ];
    Company.fillable = [
      "name",
      "login",
      "password_hash",
      "created_at",
      "updated_at"
    ];
    Company.timestamp = true;