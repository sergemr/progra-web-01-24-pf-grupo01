// /home/localadmin/prograweb-dondeestacarlitos/backend/modelos/actividad.js
module.exports = (sequelize, DataTypes) => {
    const Actividad = sequelize.define('Actividad', {
        ActividadID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Descripcion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Disponible: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        tableName: 'Actividad',
        timestamps: true,
        createdAt: 'FechaCreacion',
        updatedAt: 'FechaActualizacion'
    });

    Actividad.associate = function(models) {
        Actividad.hasMany(models.Disponibilidad, { foreignKey: 'ActividadID', as: 'Disponibilidades' });
        Actividad.hasMany(models.CambioDisponibilidad, { foreignKey: 'ActividadID', as: 'CambiosDisponibilidad' });
    };

    return Actividad;
};