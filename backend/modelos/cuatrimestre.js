// /home/localadmin/prograweb-dondeestacarlitos/backend/modelos/cuatrimestre.js
module.exports = (sequelize, DataTypes) => {
    const Cuatrimestre = sequelize.define('Cuatrimestre', {
        CuatrimestreID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Anho: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Periodo: {
            type: DataTypes.ENUM,
            values: ['1', '2', '3'],
            allowNull: false
        }
    }, {
        tableName: 'Cuatrimestre',
        timestamps: true,
        createdAt: 'FechaCreacion',
        updatedAt: 'FechaActualizacion'
    });

    Cuatrimestre.associate = function(models) {
        Cuatrimestre.hasMany(models.Disponibilidad, {
            foreignKey: 'CuatrimestreID',
            as: 'Disponibilidades'
        });
        Cuatrimestre.hasMany(models.CambioDisponibilidad, {
            foreignKey: 'CuatrimestreID',
            as: 'CambiosDisponibilidad'
        });
    };

    return Cuatrimestre;
};
