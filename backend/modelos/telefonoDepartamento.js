module.exports = (sequelize, DataTypes) => {
    const TelefonoDepartamento = sequelize.define('TelefonoDepartamento', {
        TelefonoDepartamentoID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Telefono: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'TelefonoDepartamento',
        timestamps: true,
        createdAt: 'FechaCreacion',
        updatedAt: 'FechaActualizacion'
    });

    TelefonoDepartamento.associate = function(models) {
        TelefonoDepartamento.hasMany(models.MiembroRectoria, {
            foreignKey: 'TelefonoDepartamentoID',
            as: 'MiembrosRectoria'
        });
    };

    return TelefonoDepartamento;
};
