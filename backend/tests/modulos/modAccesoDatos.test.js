require('dotenv').config();
const db = require('../../modelos');
const modGestionDatos = require('../../modulos/modAccesoDatos');

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

describe('modGestionDatos', () => {
    describe('leerEntidad', () => {
        test('successfully reads an existing entity', async () => {
            const role = await db.Rol.create({
                NombreRol: 'Moderator',
                Descripcion: 'Moderator role'
            });
        
            const user1 = await db.Usuario.create({
                NombreUsuario: 'user1',
                HashContraseña: 'hash1',
                Correo: 'user1@example.com',
                RolID: role.RolID
            });
        
            const user2 = await db.Usuario.create({
                NombreUsuario: 'user2',
                HashContraseña: 'hash2',
                Correo: 'user2@example.com',
                RolID: role.RolID
            });
        
            await modGestionDatos.leerEntidad('Usuario', 1)
                .then(usuario1 => {
                    expect(usuario1.NombreUsuario).toBe('user1');
                })
                .catch(error => {
                    console.error('Error reading entity:', error);
                });
            
        });

        test('fails to read a non-existing entity', async () => {
            await expect(modGestionDatos.leerEntidad('Usuario', 999))
                .rejects
                .toThrow('No se encontró la entidad \'Usuario\' con ID 999.');
        });

        test('fails with invalid entity type', async () => {
            await expect(modGestionDatos.leerEntidad('InvalidType', 1))
                .rejects
                .toThrow('Tipo de entidad \'InvalidType\' no válido.');
        });
    });

    describe('listarEntidades', () => {
        test('successfully lists entities with no filters', async () => {
            await modGestionDatos.listarEntidades('Usuario', {})
                .then(usuarios => {
                    expect(usuarios.length).toBeGreaterThan(0)
                })
                .catch(error => {
                    console.error('Error reading entity:', error);
                });
        });

        test('successfully lists entities with filters', async () => {
            const actividad = await db.Actividad.create({
                Nombre: 'Seminar',
                Descripcion: 'A seminar on programming',
                Disponible: true
            });

            const actividad2 = await db.Actividad.create({
                Nombre: 'Workshop',
                Descripcion: 'A workshop on web development',
                Disponible: true
            });

            const actividad3 = await db.Actividad.create({
                Nombre: 'Conference',
                Descripcion: 'A conference on technology',
                Disponible: false
            });
        
            await modGestionDatos.listarEntidades('Actividad', { Disponible: true })
                .then(listaActividades => {
                    expect(listaActividades.length).toBe(2);
                    expect(listaActividades[0].Nombre).toBe('Seminar');
                })
                .catch(error => {
                    console.error('Error reading entity:', error);
                });
        });

        test('fails with invalid entity type', async () => {
            await expect(modGestionDatos.listarEntidades('InvalidType', {}))
                .rejects
                .toThrow('Tipo de entidad \'InvalidType\' no válido.');
        });
    });

    describe('crearEntidad', () => {
        test('successfully creates a new entity', async () => {
            const newUser = await modGestionDatos.crearEntidad('Usuario', {
                NombreUsuario: 'user99',
                HashContraseña: 'hash99',
                Correo: 'user99@example.com'
            });

            expect(newUser).not.toBeNull();
            expect(newUser.NombreUsuario).toBe('user99');
            expect(newUser.Correo).toBe('user99@example.com');
        });

        test('fails to create an entity with incomplete data', async () => {
            await expect(modGestionDatos.crearEntidad('Usuario', { NombreUsuario: 'user3' }))
                .rejects
                .toThrow();
        });

        test('fails with invalid entity type', async () => {
            await expect(modGestionDatos.crearEntidad('InvalidType', { someField: 'someValue' }))
                .rejects
                .toThrow('Tipo de entidad \'InvalidType\' no válido.');
        });
    });


    describe('modificarEntidad', () => {
        test('successfully modifies an existing entity', async () => {
            const usuario = await db.Usuario.create({
                NombreUsuario: 'user100',
                HashContraseña: 'hash100',
                Correo: 'user100@example.com'
            });

            const updatedData = {
                NombreUsuario: 'updatedUser100'
            };

            await modGestionDatos.modificarEntidad('Usuario', usuario.UsuarioID, updatedData);
            const updatedUsuario = await db.Usuario.findByPk(usuario.UsuarioID);

            expect(updatedUsuario.NombreUsuario).toBe('updatedUser100');
        });

        test('fails to modify an entity with invalid id', async () => {
            const updatedData = {NombreUsuario: 'doesNotExist' };

            await expect(modGestionDatos.modificarEntidad('Usuario', 9999, updatedData))
                .rejects
                .toThrow('Error al modificar la entidad \'Usuario\': No se encontró la entidad \'Usuario\' con ID 9999.');
        });

        test('fails with invalid entity type', async () => {
            const updatedData = { id: 1, NombreUsuario: 'updatedName' };

            await expect(modGestionDatos.modificarEntidad('InvalidType', updatedData))
                .rejects
                .toThrow('Tipo de entidad \'InvalidType\' no válido.');
        });
    });

    describe('eliminarEntidad', () => {
        test('successfully deletes an existing entity', async () => {
            const usuario = await db.Usuario.create({
                NombreUsuario: 'userToDelete',
                HashContraseña: 'hashToDelete',
                Correo: 'userToDelete@example.com'
            });

            await modGestionDatos.eliminarEntidad('Usuario', usuario.UsuarioID);
            const deletedUsuario = await db.Usuario.findByPk(usuario.UsuarioID);

            expect(deletedUsuario).toBeNull();
        });

        test('fails to delete an entity with invalid id', async () => {
            await expect(modGestionDatos.eliminarEntidad('Usuario', 9999))
                .rejects
                .toThrow('Error al eliminar la entidad \'Usuario\': No se encontró la entidad \'Usuario\' con ID 9999.');
        });

        test('fails with invalid entity type', async () => {
            await expect(modGestionDatos.eliminarEntidad('InvalidType', 1))
                .rejects
                .toThrow('Tipo de entidad \'InvalidType\' no válido.');
        });
    });
});
