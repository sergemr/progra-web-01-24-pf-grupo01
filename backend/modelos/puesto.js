module.exports = (sequelize, DataTypes) => {
    const Puesto = sequelize.define('Puesto', {
        PuestoID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Nombre: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'Puesto',
        timestamps: true,
        createdAt: 'FechaCreacion',
        updatedAt: 'FechaActualizacion'
    });

    Puesto.associate = function(models) {
        Puesto.hasMany(models.MiembroRectoria, {
            foreignKey: 'PuestoID',
            as: 'MiembrosRectoria'
        });
    };

    return Puesto;
};