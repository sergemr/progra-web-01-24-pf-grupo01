module.exports = (sequelize, DataTypes) => {
    const Sede = sequelize.define('Sede', {
        SedeID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Nombre: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'Sede',
        timestamps: true,
        createdAt: 'FechaCreacion',
        updatedAt: 'FechaActualizacion'
    });

    Sede.associate = function(models) {
        Sede.hasMany(models.Disponibilidad, { foreignKey: 'SedeID', as: 'Disponibilidades' });
    };

    return Sede;
};
