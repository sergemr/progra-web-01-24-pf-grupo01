import React, { useState, useEffect } from 'react';
import { getRoles, createRole, updateRole } from './rolService';

function App() {
    const [roles, setRoles] = useState([]);
    const [roleName, setRoleName] = useState('');
    const [roleDescription, setRoleDescription] = useState('');

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const data = await getRoles();
            setRoles(data.roles);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const handleCreateRole = async () => {
        try {
            await createRole({ NombreRol: roleName, Descripcion: roleDescription });
            fetchRoles();  // Refresh the list after creating
        } catch (error) {
            console.error('Error creating role:', error);
        }
    };

    return (
        <div>
            <h1>Roles</h1>
            <ul>
                {roles.map((role) => (
                    <li key={role.RolID}>{role.NombreRol} - {role.Descripcion}</li>
                ))}
            </ul>
            <div>
                <input
                    type="text"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="Role Name"
                />
                <input
                    type="text"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    placeholder="Role Description"
                />
                <button onClick={handleCreateRole}>Create Role</button>
            </div>
        </div>
    );
}

export default App;
