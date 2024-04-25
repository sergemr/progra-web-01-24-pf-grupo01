module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
        UsuarioID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        NombreUsuario: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        HashContraseña: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        Correo: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        RolID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        FechaCreacion: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        UltimoInicioSesion: {
            type: DataTypes.DATE,
            allowNull: true
        },
        Activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'Usuario',
        timestamps: true,
        createdAt: 'FechaCreacion',
        updatedAt: 'FechaActualizacion'
    });

    Usuario.associate = function(models) {
        Usuario.belongsTo(models.Rol, { foreignKey: 'RolID', as: 'Rol' });
    };

    return Usuario;
};
