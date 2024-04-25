module.exports = (sequelize, DataTypes) => {
    const Dia = sequelize.define('Dia', {
        DiaID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Nombre: {
            type: DataTypes.ENUM,
            values: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
            allowNull: false
        }
    }, {
        tableName: 'Dia',
        timestamps: true,
        createdAt: 'FechaCreacion',
        updatedAt: 'FechaActualizacion'
    });

    Dia.associate = (models) => {
        Dia.hasMany(models.Disponibilidad, {
            foreignKey: 'DiaID',
            as: 'disponibilidades'
        });
    };

    return Dia;
};
