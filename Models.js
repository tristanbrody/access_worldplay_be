const { DataTypes, Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.AWS_DATABASE_NAME,
  process.env.AWS_DATABASE_USER,
  process.env.AWS_DATABASE_PW,
  {
    host: process.env.AWS_DATABASE_HOST,
    dialect: "postgres",
  }
);

const Order = sequelize.define("Order", {
  orderCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Payment = sequelize.define("Payment", {
  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "sentForAuthorisation",
  },
});

const Customer = sequelize.define("Customer", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Order.hasOne(Payment);
Customer.hasMany(Order);

module.exports = { sequelize, Order, Payment, Customer };
