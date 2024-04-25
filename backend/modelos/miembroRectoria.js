module.exports = (sequelize, DataTypes) => {
    const MiembroRectoria = sequelize.define('MiembroRectoria', {
        MiembroRectoriaID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        PuestoID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        TelefonoDepartamentoID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        Nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        PrimerApellido: {
            type: DataTypes.STRING,
            allowNull: false
        },
        SegundoApellido: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Correo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Celular: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Extension: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'MiembroRectoria',
        timestamps: true,
        createdAt: 'FechaCreacion',
        updatedAt: 'FechaActualizacion'
    });

    MiembroRectoria.associate = function(models) {
        MiembroRectoria.belongsTo(models.Puesto, {
            foreignKey: 'PuestoID',
            as: 'Puesto'
        });
        MiembroRectoria.belongsTo(models.TelefonoDepartamento, {
            foreignKey: 'TelefonoDepartamentoID',
            as: 'TelefonoDepartamento'
        });
        MiembroRectoria.hasMany(models.Disponibilidad, {
            foreignKey: 'MiembroRectoriaID',
            as: 'Disponibilidad'
        });
        MiembroRectoria.hasMany(models.CambioDisponibilidad, {
            foreignKey: 'MiembroRectoriaID',
            as: 'CambioDisponibilidad'
        });
    };

    return MiembroRectoria;
};
