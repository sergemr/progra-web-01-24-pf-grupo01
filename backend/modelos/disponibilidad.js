// /home/localadmin/prograweb-dondeestacarlitos/backend/modelos/disponibilidad.js
module.exports = (sequelize, DataTypes) => {
    const Disponibilidad = sequelize.define('Disponibilidad', {
        DisponibilidadID: {
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
        DiaID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true
        },
        SedeID: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
        HoraInicio: {
            type: DataTypes.TIME,
            allowNull: false
        },
        HoraFinal: {
            type: DataTypes.TIME,
            allowNull: false
        }
    }, {
        tableName: 'Disponibilidad',
        timestamps: true,
        createdAt: 'FechaCreacion',
        updatedAt: 'FechaActualizacion'
    });

    Disponibilidad.associate = function(models) {
        Disponibilidad.belongsTo(models.MiembroRectoria, { foreignKey: 'MiembroRectoriaID', as: 'MiembroRectoria' });
        Disponibilidad.belongsTo(models.Cuatrimestre, { foreignKey: 'CuatrimestreID', as: 'Cuatrimestre' });
        Disponibilidad.belongsTo(models.Dia, { foreignKey: 'DiaID', as: 'Dia' });
        Disponibilidad.belongsTo(models.Sede, { foreignKey: 'SedeID', as: 'Sede' });
        Disponibilidad.belongsTo(models.Actividad, { foreignKey: 'ActividadID', as: 'Actividad' });
    };

    return Disponibilidad;
};
