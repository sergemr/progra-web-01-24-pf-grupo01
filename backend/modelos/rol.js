// /home/localadmin/prograweb-dondeestacarlitos/backend/modelos/roles.js
module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Rol', {
        RolID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        NombreRol: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        Descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'Rol',
        timestamps: true,
        createdAt: 'FechaCreacion',
        updatedAt: 'FechaActualizacion'
    });

    Role.associate = function(models) {
        Role.hasMany(models.Usuario, { foreignKey: 'RolID', as: 'Usuarios' });
    };

    return Role;
};
