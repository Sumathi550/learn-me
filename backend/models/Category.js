module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        categoryId: { type: DataTypes.STRING, allowNull: false, unique: true },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT },
        icon: { type: DataTypes.STRING, defaultValue: 'fa-folder' },
        order: { type: DataTypes.INTEGER, defaultValue: 0 }
    });
    return Category;
};