// Modelos Module
const modelos = {
    list: [],
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    filters: {
        search: '',
        estado: ''
    },

    async loadModelos() {
        try {
            const params = {
                page: this.currentPage,
                limit: this.limit,
                ...this.filters
            };

            const response = await api.getModelos(params);
            this.list = response.data || [];
            this.totalPages = response.pages || 1;
            this.renderTable();
            this.renderPagination();
        } catch (error) {
            console.error('Error cargando modelos:', error);
            alert('Error al cargar modelos: ' + error.message);
        }
    },

    renderTable() {
        const tbody = document.querySelector('#modelosTable tbody');
        tbody.innerHTML = '';

        if (this.list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center">No hay modelos registrados</td></tr>';
            return;
        }

        this.list.forEach(modelo => {
            const row = document.createElement('tr');
            const estadoClass = (modelo.Estado || 'importado').toLowerCase().replace('_', '');
            row.innerHTML = `
                <td>${modelo.ModeloID}</td>
                <td>${modelo.MarcaDescripcion || modelo.MarcaID}</td>
                <td>${modelo.DescripcionModelo || ''}</td>
                <td>${modelo.Anio || ''}</td>
                <td>${modelo.CombustibleCodigo || ''}</td>
                <td><span class="badge badge-${estadoClass}">${modelo.Estado || 'IMPORTADO'}</span></td>
                <td class="actions">
                    <button class="btn btn-small btn-info" onclick="modelos.viewDetails(${modelo.ModeloID})">Ver</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    renderPagination() {
        document.getElementById('pageInfo').textContent = `Página ${this.currentPage} de ${this.totalPages}`;
        document.getElementById('prevPage').disabled = this.currentPage === 1;
        document.getElementById('nextPage').disabled = this.currentPage === this.totalPages;
    },

    applyFilters() {
        this.filters.search = document.getElementById('searchModelo').value;
        this.filters.estado = document.getElementById('estadoFilter').value;
        this.currentPage = 1;
        this.loadModelos();
    },

    async viewDetails(id) {
        try {
            const response = await api.getModelo(id);
            const modelo = response.data;
            this.renderDetails(modelo);
            document.getElementById('modeloModal').classList.remove('hidden');
            
            // Setup workflow buttons
            this.setupWorkflowButtons(modelo);
        } catch (error) {
            alert('Error al cargar modelo: ' + error.message);
        }
    },

    renderDetails(modelo) {
        const detailsDiv = document.getElementById('modeloDetails');
        detailsDiv.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                <div><strong>ID:</strong> ${modelo.ModeloID}</div>
                <div><strong>Marca:</strong> ${modelo.MarcaDescripcion || modelo.MarcaID}</div>
                <div><strong>Código:</strong> ${modelo.CodigoModelo || ''}</div>
                <div><strong>Descripción:</strong> ${modelo.DescripcionModelo || ''}</div>
                <div><strong>Año:</strong> ${modelo.Anio || ''}</div>
                <div><strong>Combustible:</strong> ${modelo.CombustibleCodigo || ''}</div>
                <div><strong>Tipo:</strong> ${modelo.Tipo || ''}</div>
                <div><strong>Categoría:</strong> ${modelo.CategoriaCodigo || ''}</div>
                <div><strong>CC:</strong> ${modelo.CC || ''}</div>
                <div><strong>HP:</strong> ${modelo.HP || ''}</div>
                <div><strong>Tracción:</strong> ${modelo.Traccion || ''}</div>
                <div><strong>Caja:</strong> ${modelo.Caja || ''}</div>
                <div><strong>Puertas:</strong> ${modelo.Puertas || ''}</div>
                <div><strong>Pasajeros:</strong> ${modelo.Pasajeros || ''}</div>
                <div style="grid-column: span 2;">
                    <strong>Estado:</strong> 
                    <span class="badge badge-${(modelo.Estado || 'importado').toLowerCase().replace('_', '')}">${modelo.Estado || 'IMPORTADO'}</span>
                </div>
            </div>
            ${modelo.versiones && modelo.versiones.length > 0 ? `
                <div style="margin-top: 20px;">
                    <h3>Versiones</h3>
                    <ul>
                        ${modelo.versiones.map(v => `<li>${v.Descripcion}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            ${modelo.precios && modelo.precios.length > 0 ? `
                <div style="margin-top: 20px;">
                    <h3>Precios</h3>
                    <ul>
                        ${modelo.precios.map(p => `<li>${p.Moneda} ${p.Precio}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        `;
    },

    setupWorkflowButtons(modelo) {
        const markMinimosBtn = document.getElementById('markMinimosBtn');
        const sendReviewBtn = document.getElementById('sendReviewBtn');
        const approveBtn = document.getElementById('approveBtn');

        // Reset handlers
        markMinimosBtn.onclick = null;
        sendReviewBtn.onclick = null;
        approveBtn.onclick = null;

        // Enable/disable based on estado
        markMinimosBtn.disabled = modelo.Estado !== 'IMPORTADO';
        sendReviewBtn.disabled = modelo.Estado !== 'MINIMOS';
        approveBtn.disabled = modelo.Estado !== 'PARA_CORREGIR';

        // Set handlers
        markMinimosBtn.onclick = () => this.markMinimos(modelo.ModeloID);
        sendReviewBtn.onclick = () => this.sendReview(modelo.ModeloID);
        approveBtn.onclick = () => this.approve(modelo.ModeloID);
    },

    async markMinimos(id) {
        try {
            await api.markMinimos(id);
            alert('Modelo marcado como mínimos exitosamente');
            this.hideModal();
            await this.loadModelos();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    },

    async sendReview(id) {
        try {
            await api.sendReview(id);
            alert('Modelo enviado a revisión exitosamente');
            this.hideModal();
            await this.loadModelos();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    },

    async approve(id) {
        try {
            await api.approveModelo(id);
            alert('Modelo aprobado exitosamente');
            this.hideModal();
            await this.loadModelos();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    },

    hideModal() {
        document.getElementById('modeloModal').classList.add('hidden');
    },

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadModelos();
        }
    },

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.loadModelos();
        }
    }
};

// Event Listeners
document.getElementById('searchBtn').addEventListener('click', () => modelos.applyFilters());
document.getElementById('prevPage').addEventListener('click', () => modelos.prevPage());
document.getElementById('nextPage').addEventListener('click', () => modelos.nextPage());
document.getElementById('closeModelo').addEventListener('click', () => modelos.hideModal());
document.querySelectorAll('#modeloModal .close').forEach(el => {
    el.addEventListener('click', () => modelos.hideModal());
});
