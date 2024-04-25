// /home/localadmin/prograweb-dondeestacarlitos/backend/modelos/cambioDisponibilidad.js
module.exports = (sequelize, DataTypes) => {
    const CambioDisponibilidad = sequelize.define('CambioDisponibilidad', {
        CambioDisponibilidadID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        MiembroRectoriaID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true
        },
        CuatrimestreID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true
        },
        ActividadID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true
        },
        Ubicacion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        FechaHoraInicio: {
            type: DataTypes.DATE,
            allowNull: false
        },
        FechaHoraFinal: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'CambioDisponibilidad',
        timestamps: true,
        createdAt: 'FechaCreacion',
        updatedAt: 'FechaActualizacion'
    });

    CambioDisponibilidad.associate = function(models) {
        CambioDisponibilidad.belongsTo(models.MiembroRectoria, { foreignKey: 'MiembroRectoriaID', as: 'MiembroRectoria' });
        CambioDisponibilidad.belongsTo(models.Cuatrimestre, { foreignKey: 'CuatrimestreID', as: 'Cuatrimestre'});
        CambioDisponibilidad.belongsTo(models.Actividad, { foreignKey: 'ActividadID', as: 'Actividad'});
    };

    return CambioDisponibilidad;
};
