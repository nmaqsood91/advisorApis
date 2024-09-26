// models/Product.ts
import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../db/connection";

export interface ProductAttributes {
  id: number;
  advisorId: number;
  name: string;
  description?: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, "id"> {}

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  advisorId: number;
  public id!: number;
  public name!: string;
  public description?: string;
  public price!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // represents the relationship with Advisor
    advisorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: sequelizeConnection,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

export default Product;
