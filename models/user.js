module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define("users", {
        username: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING
        },
        secret:{
            type: DataTypes.STRING
        }
    });

    return user;
}