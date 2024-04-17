require('dotenv').config();
const db = require('../../modelos');

beforeAll(async () => {
    // Force sync the db object
    try {
        await db.sequelize.sync({ force: true });
    } catch (error) {
        console.error('Failed to sync the database:', error);
    }
});

afterAll(async () => {
    // Close database connection
    await db.sequelize.close();
});

let transaction;

beforeEach(async () => {
    // Start a transaction
    transaction = await db.sequelize.transaction();
});

afterEach(async () => {
    // Rollback transaction to discard changes
    await transaction.rollback();
});


describe('Actividad Model', () => {
  describe('CRUD operations', () => {
    test('Create a new Actividad', async () => {
      const actividad = await db.Actividad.create({
        Nombre: 'Workshop',
        Descripcion: 'Technology workshop',
        Disponible: true
      }, { transaction });

      expect(actividad.Nombre).toBe('Workshop');
      expect(actividad.Descripcion).toBe('Technology workshop');
      expect(actividad.Disponible).toBe(true);
    });

    test('Read an Actividad', async () => {
      const actividad = await db.Actividad.create({
        Nombre: 'Conference',
        Descripcion: 'Annual tech conference',
        Disponible: true
      }, { transaction });

      const foundActividad = await db.Actividad.findByPk(actividad.ActividadID, { transaction });
      expect(foundActividad.Nombre).toBe('Conference');
    });

    test('Update an Actividad', async () => {
      const actividad = await db.Actividad.create({
        Nombre: 'Seminar',
        Descripcion: 'Online educational seminar',
        Disponible: true
      }, { transaction });

      actividad.Nombre = 'Updated Seminar';
      await actividad.save({ transaction });

      const updatedActividad = await db.Actividad.findByPk(actividad.ActividadID, { transaction });
      expect(updatedActividad.Nombre).toBe('Updated Seminar');
    });
  });

  describe('Relationships', () => {
    test('Actividad has many Disponibilidad', async () => {
      // Create instances of dependent objects
      const miembroRectoria = await db.MiembroRectoria.create({
        Nombre: 'John Doe',
        PrimerApellido: 'Doe',
        Correo: 'johndoe@example.com'
      }, { transaction });

      const cuatrimestre = await db.Cuatrimestre.create({
        Anho: 2024,
        Periodo: '1'
      }, { transaction });

      const dia = await db.Dia.create({
        Nombre: 'Lunes'
      }, { transaction });

      // Create the Actividad instance
      const actividad = await db.Actividad.create({
        Nombre: 'Workshop',
        Disponible: true
      }, { transaction });

      // Create the Disponibilidad instance
      const disponibilidad = await db.Disponibilidad.create({
        ActividadID: actividad.ActividadID,
        MiembroRectoriaID: miembroRectoria.MiembroRectoriaID,
        CuatrimestreID: cuatrimestre.CuatrimestreID,
        DiaID: dia.DiaID,
        HoraInicio: '09:00',
        HoraFinal: '12:00'
      }, { transaction });

      // Query the Actividad including its Disponibilidades
      const relatedActividad = await db.Actividad.findOne({
        include: [{
          model: db.Disponibilidad,
          as: 'Disponibilidades'
        }],
        where: { ActividadID: actividad.ActividadID },
        transaction
      });

      expect(relatedActividad.Disponibilidades[0].HoraInicio).toBe('09:00:00');
    });
  });

  describe('Validations', () => {
    test('Fail to create Actividad with invalid data', async () => {
      await expect(db.Actividad.create({
        Disponible: true
      }, { transaction })).rejects.toThrow();
    });
  });
});
