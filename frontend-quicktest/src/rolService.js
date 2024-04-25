import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/v1/rol';

export const getRoles = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch roles:', error);
        throw error;
    }
};

export const getRole = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch role with ID ${id}:`, error);
        throw error;
    }
};

export const createRole = async (roleData) => {
    try {
        const response = await axios.post(API_URL, roleData);
        return response.data;
    } catch (error) {
        console.error('Failed to create role:', error);
        throw error;
    }
};

export const updateRole = async (id, roleData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, roleData);
        return response.data;
    } catch (error) {
        console.error('Failed to update role:', error);
        throw error;
    }
};
