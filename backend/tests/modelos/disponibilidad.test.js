require('dotenv').config();
const db = require('../../modelos');

beforeAll(async () => {
    try {
        await db.sequelize.sync({ force: true });
    } catch (error) {
        console.error('Failed to sync the database:', error);
    }
});

afterAll(async () => {
    await db.sequelize.close();
});

let transaction;
beforeEach(async () => {
    transaction = await db.sequelize.transaction();
});

afterEach(async () => {
    await transaction.rollback();
});

describe('Disponibilidad Model', () => {
    describe('CRUD operations', () => {
        test('Create a new Disponibilidad', async () => {
            const miembroRectoria = await db.MiembroRectoria.create({
                Nombre: 'John Doe',
                PrimerApellido: 'Doe',
                Correo: 'john.doe@example.com'
            }, { transaction });

            const cuatrimestre = await db.Cuatrimestre.create({
                Anho: 2024,
                Periodo: '1'
            }, { transaction });

            const dia = await db.Dia.create({
                Nombre: 'Lunes'
            }, { transaction });

            const sede = await db.Sede.create({
                Nombre: 'Main Campus'
            }, { transaction });

            const actividad = await db.Actividad.create({
                Nombre: 'Lecture',
                Disponible: true
            }, { transaction });

            const disponibilidad = await db.Disponibilidad.create({
                MiembroRectoriaID: miembroRectoria.MiembroRectoriaID,
                CuatrimestreID: cuatrimestre.CuatrimestreID,
                DiaID: dia.DiaID,
                SedeID: sede.SedeID,
                ActividadID: actividad.ActividadID,
                HoraInicio: '08:00:00',
                HoraFinal: '12:00:00'
            }, { transaction });

            expect(disponibilidad.HoraInicio).toBe('08:00:00');
            expect(disponibilidad.HoraFinal).toBe('12:00:00');
        });

        test('Read a Disponibilidad', async () => {
            const miembroRectoria = await db.MiembroRectoria.create({
                Nombre: 'John Doe',
                PrimerApellido: 'Doe',
                Correo: 'john.doe@example.com'
            }, { transaction });

            const cuatrimestre = await db.Cuatrimestre.create({
                Anho: 2024,
                Periodo: '1'
            }, { transaction });

            const dia = await db.Dia.create({
                Nombre: 'Lunes'
            }, { transaction });

            const sede = await db.Sede.create({
                Nombre: 'Main Campus'
            }, { transaction });

            const actividad = await db.Actividad.create({
                Nombre: 'Lecture',
                Disponible: true
            }, { transaction });

            const disponibilidad = await db.Disponibilidad.create({
                MiembroRectoriaID: miembroRectoria.MiembroRectoriaID,
                CuatrimestreID: cuatrimestre.CuatrimestreID,
                DiaID: dia.DiaID,
                SedeID: sede.SedeID,
                ActividadID: actividad.ActividadID,
                HoraInicio: '10:00',
                HoraFinal: '14:00'
            }, { transaction });

            const foundDisponibilidad = await db.Disponibilidad.findByPk(disponibilidad.DisponibilidadID, { transaction });
            expect(foundDisponibilidad.HoraInicio).toBe('10:00:00');
        });

        test('Update a Disponibilidad', async () => {
            const miembroRectoria = await db.MiembroRectoria.create({
                Nombre: 'John Doe',
                PrimerApellido: 'Doe',
                Correo: 'john.doe@example.com'
            }, { transaction });

            const cuatrimestre = await db.Cuatrimestre.create({
                Anho: 2024,
                Periodo: '1'
            }, { transaction });

            const dia = await db.Dia.create({
                Nombre: 'Lunes'
            }, { transaction });

            const sede = await db.Sede.create({
                Nombre: 'Main Campus'
            }, { transaction });

            const actividad = await db.Actividad.create({
                Nombre: 'Lecture',
                Disponible: true
            }, { transaction });

            const disponibilidad = await db.Disponibilidad.create({
                MiembroRectoriaID: miembroRectoria.MiembroRectoriaID,
                CuatrimestreID: cuatrimestre.CuatrimestreID,
                DiaID: dia.DiaID,
                SedeID: sede.SedeID,
                ActividadID: actividad.ActividadID,
                HoraInicio: '10:00',
                HoraFinal: '14:00'
            }, { transaction });

            disponibilidad.HoraInicio = '12:00';
            await disponibilidad.save({ transaction });

            const updatedDisponibilidad = await db.Disponibilidad.findByPk(disponibilidad.DisponibilidadID, { transaction });
            expect(updatedDisponibilidad.HoraInicio).toBe('12:00:00');
        });
    });

    describe('Relationships', () => {
        test('Disponibilidad has relationships with required models', async () => {
            const miembroRectoria = await db.MiembroRectoria.create({ Nombre: 'Jane Doe', PrimerApellido: 'Smith', Correo: 'jane@example.com' }, { transaction });
            const cuatrimestre = await db.Cuatrimestre.create({ Anho: 2025, Periodo: '2' }, { transaction });
            const dia = await db.Dia.create({ Nombre: 'Martes' }, { transaction });
            const sede = await db.Sede.create({ Nombre: 'North Campus' }, { transaction });
            const actividad = await db.Actividad.create({ Nombre: 'Seminar', Disponible: true }, { transaction });

            const disponibilidad = await db.Disponibilidad.create({
                MiembroRectoriaID: miembroRectoria.MiembroRectoriaID,
                CuatrimestreID: cuatrimestre.CuatrimestreID,
                DiaID: dia.DiaID,
                SedeID: sede.SedeID,
                ActividadID: actividad.ActividadID,
                HoraInicio: '09:00',
                HoraFinal: '11:00'
            }, { transaction });

            const relatedDisponibilidad = await db.Disponibilidad.findOne({
                include: ['MiembroRectoria', 'Cuatrimestre', 'Dia', 'Sede', 'Actividad'],
                where: { DisponibilidadID: disponibilidad.DisponibilidadID },
                transaction
            });

            expect(relatedDisponibilidad.MiembroRectoria.Nombre).toBe('Jane Doe');
            expect(relatedDisponibilidad.Cuatrimestre.Anho).toBe(2025);
            expect(relatedDisponibilidad.Dia.Nombre).toBe('Martes');
            expect(relatedDisponibilidad.Sede.Nombre).toBe('North Campus');
            expect(relatedDisponibilidad.Actividad.Nombre).toBe('Seminar');
        });
    });

    describe('Validations', () => {
        test('Fail to create Disponibilidad with missing required fields', async () => {
            await expect(db.Disponibilidad.create({
                HoraInicio: '15:00'
                // Missing other fields like HoraFinal
            }, { transaction })).rejects.toThrow();
        });
    });
});
