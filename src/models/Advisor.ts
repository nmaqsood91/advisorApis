import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../db/connection";
import Product from "./Product";
import { hashPassword } from "../util";

export interface AdvisorAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at?: Date;
  last_updated?: Date;
}

interface AdvisorCreationAttributes extends Optional<AdvisorAttributes, "id"> {}

class Advisor
  extends Model<AdvisorAttributes, AdvisorCreationAttributes>
  implements AdvisorAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public readonly created_at!: Date;
  public readonly last_updated!: Date;

  public static async findByEmail(email: string): Promise<Advisor | null> {
    return this.findOne({ where: { email } });
  }
}

Advisor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    createdAt: "createdAt",
    freezeTableName: true,
    updatedAt: "lastUpdated",
  }
);

// this hook make sure to convert password to encrypted string for security reason
Advisor.addHook("beforeCreate", async (advisor: Advisor) => {
  const hashedPassword = await hashPassword(advisor.password);
  advisor.password = hashedPassword;
});

Advisor.hasMany(Product, { foreignKey: "advisorId", as: "products" });
Product.belongsTo(Advisor, { foreignKey: "advisorId", as: "advisor" });

export default Advisor;
