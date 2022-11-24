const { DataTypes } = require("sequelize");

module.exports = {
	up: async ({ context: queryInterface }) => {
		await queryInterface.createTable("sessions", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      }
  })

  await queryInterface.addColumn("users", "disabled", {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  })
  },
	down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("session")
    await queryInterface.removeColumn("users", "disabled")
	},
}