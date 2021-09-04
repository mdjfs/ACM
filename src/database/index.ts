import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import app from "../../app.json";

export default new Sequelize({
  ...app.database,
  models: [__dirname + "/models"],
} as SequelizeOptions);
