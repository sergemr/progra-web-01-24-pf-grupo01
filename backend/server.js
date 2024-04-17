// server/server.js
require('dotenv').config();

const express = require('express');
const db = require('./modelos'); // Import your Sequelize models
const cors = require('cors');
// const routes = require('./routes/task.routes');

const app = express();
const port = process.env.PUERTO_APP || 3001;

app.use(cors());
app.use(express.json());
// app.use('/api', routes);

// Test the database connection
db.sequelize.authenticate()
    .then(() => console.log('Database connection successful'))
    .catch(err => console.error('Unable to connect to the database:', err));

// Drop all tables and re-create them
db.sequelize.sync({ force: true })
    .then(() => {
        console.log('Database synchronized');
        pruebaCreacion();
    })
    .catch((err) => {
        console.error('Error synchronizing database:', err);
    });

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

async function pruebaCreacion() {
    try {
        // Create instances of dependent objects
        const miembroRectoria = await db.MiembroRectoria.create({
            Nombre: 'John Doe',
            PrimerApellido: 'Doe',
            Correo: 'johndoe@example.com'
        });

        const cuatrimestre = await db.Cuatrimestre.create({
            Anho: 2024,
            Periodo: '1'
        });

        const dia = await db.Dia.create({
            Nombre: 'Lunes'
        });

        // Create the Actividad instance
        const actividad = await db.Actividad.create({
            Nombre: 'Workshop',
            Disponible: true
        });

        // Create the Disponibilidad instance
        const disponibilidad = await db.Disponibilidad.create({
            ActividadID: actividad.ActividadID,
            MiembroRectoriaID: miembroRectoria.MiembroRectoriaID,
            CuatrimestreID: cuatrimestre.CuatrimestreID,
            DiaID: dia.DiaID,
            HoraInicio: '09:00',
            HoraFinal: '12:00'
        });

        // print all created instances so far
        console.log('MiembroRectoria:', miembroRectoria.toJSON());
        console.log('Cuatrimestre:', cuatrimestre.toJSON());
        console.log('Dia:', dia.toJSON());
        console.log('Actividad:', actividad.toJSON());
        console.log('Disponibilidad:', disponibilidad.toJSON());

        // Query the Actividad including its Disponibilidades
        const relatedActividad = await db.Actividad.findOne({
            include: [{
                model: db.Disponibilidad,
                as: 'Disponibilidades'
            }],
            where: { ActividadID: actividad.ActividadID }
        });

        // delete sequelize instance
        await db.Disponibilidad.destroy({ where: { DisponibilidadID: disponibilidad.DisponibilidadID } });

        // confirm deletion
        const deletedDisponibilidad = await db.Disponibilidad.findByPk(disponibilidad.DisponibilidadID);
        console.log('Deleted Disponibilidad:', deletedDisponibilidad);

        //print actividad
        // print message: Posterior a remover el registro de actividad
        console.log('Posterior a remover el registro de actividad');
        console.log('Actividad:', deletedDisponibilidad.toJSON());
    } catch (error) {
        console.error('Error:', error);
    }
}