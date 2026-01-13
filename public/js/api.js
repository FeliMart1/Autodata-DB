// API Configuration
const API_URL = 'http://localhost:3000/api';
let authToken = localStorage.getItem('authToken');

// API Helper Functions
const api = {
    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (authToken) {
            headers.Authorization = `Bearer ${authToken}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error en la petición');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Auth
    async login(username, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        authToken = data.token;
        localStorage.setItem('authToken', authToken);
        return data;
    },

    async me() {
        return await this.request('/auth/me');
    },

    logout() {
        authToken = null;
        localStorage.removeItem('authToken');
    },

    // Marcas
    async getMarcas() {
        return await this.request('/marcas');
    },

    async getMarca(id) {
        return await this.request(`/marcas/${id}`);
    },

    async createMarca(data) {
        return await this.request('/marcas', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async updateMarca(id, data) {
        return await this.request(`/marcas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async deleteMarca(id) {
        return await this.request(`/marcas/${id}`, {
            method: 'DELETE'
        });
    },

    // Modelos
    async getModelos(params = {}) {
        const query = new URLSearchParams(params).toString();
        return await this.request(`/modelos${query ? '?' + query : ''}`);
    },

    async getModelo(id) {
        return await this.request(`/modelos/${id}`);
    },

    async markMinimos(id) {
        return await this.request(`/modelos/${id}/mark-minimos`, {
            method: 'POST'
        });
    },

    async sendReview(id) {
        return await this.request(`/modelos/${id}/send-review`, {
            method: 'POST'
        });
    },

    async approveModelo(id) {
        return await this.request(`/modelos/${id}/approve`, {
            method: 'POST'
        });
    },

    // Import
    async uploadCSV(file) {
        const formData = new FormData();
        formData.append('file', file);

        const headers = {};
        if (authToken) {
            headers.Authorization = `Bearer ${authToken}`;
        }

        const response = await fetch(`${API_URL}/import/claudio`, {
            method: 'POST',
            headers,
            body: formData
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Error al subir archivo');
        }

        return data;
    },

    async getBatches() {
        return await this.request('/import/batches');
    },

    async getBatch(batchId) {
        return await this.request(`/import/batches/${batchId}`);
    },

    async processBatch(batchId) {
        return await this.request(`/import/batches/${batchId}/process`, {
            method: 'POST'
        });
    },

    async deleteBatch(batchId) {
        return await this.request(`/import/batches/${batchId}`, {
            method: 'DELETE'
        });
    }
};
