// Marcas Module
const marcas = {
    list: [],
    editingId: null,

    async loadMarcas() {
        try {
            const response = await api.getMarcas();
            this.list = response.data || [];
            this.renderTable();
        } catch (error) {
            console.error('Error cargando marcas:', error);
            alert('Error al cargar marcas: ' + error.message);
        }
    },

    renderTable() {
        const tbody = document.querySelector('#marcasTable tbody');
        tbody.innerHTML = '';

        if (this.list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">No hay marcas registradas</td></tr>';
            return;
        }

        this.list.forEach(marca => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${marca.MarcaID}</td>
                <td>${marca.CodigoMarca || ''}</td>
                <td>${marca.Descripcion || ''}</td>
                <td>${marca.ShortName || ''}</td>
                <td>${marca.Origen || ''}</td>
                <td class="actions">
                    <button class="btn btn-small btn-info" onclick="marcas.edit(${marca.MarcaID})">Editar</button>
                    <button class="btn btn-small btn-danger" onclick="marcas.delete(${marca.MarcaID})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    showModal(editing = false) {
        this.editingId = editing;
        const modal = document.getElementById('marcaModal');
        const title = document.getElementById('marcaModalTitle');
        title.textContent = editing ? 'Editar Marca' : 'Nueva Marca';
        
        if (!editing) {
            document.getElementById('marcaForm').reset();
        }
        
        modal.classList.remove('hidden');
    },

    hideModal() {
        document.getElementById('marcaModal').classList.add('hidden');
        document.getElementById('marcaForm').reset();
        this.editingId = null;
    },

    async edit(id) {
        try {
            const response = await api.getMarca(id);
            const marca = response.data;
            
            document.getElementById('marcaCodigoMarca').value = marca.CodigoMarca || '';
            document.getElementById('marcaDescripcion').value = marca.Descripcion || '';
            document.getElementById('marcaShortName').value = marca.ShortName || '';
            document.getElementById('marcaOrigen').value = marca.Origen || '';
            
            this.showModal(id);
        } catch (error) {
            alert('Error al cargar marca: ' + error.message);
        }
    },

    async save(event) {
        event.preventDefault();
        
        const data = {
            CodigoMarca: document.getElementById('marcaCodigoMarca').value,
            Descripcion: document.getElementById('marcaDescripcion').value,
            ShortName: document.getElementById('marcaShortName').value,
            Origen: document.getElementById('marcaOrigen').value
        };

        try {
            if (this.editingId) {
                await api.updateMarca(this.editingId, data);
            } else {
                await api.createMarca(data);
            }
            
            this.hideModal();
            await this.loadMarcas();
        } catch (error) {
            alert('Error al guardar marca: ' + error.message);
        }
    },

    async delete(id) {
        if (!confirm('¿Estás seguro de que deseas eliminar esta marca?')) {
            return;
        }

        try {
            await api.deleteMarca(id);
            await this.loadMarcas();
        } catch (error) {
            alert('Error al eliminar marca: ' + error.message);
        }
    }
};

// Event Listeners
document.getElementById('newMarcaBtn').addEventListener('click', () => marcas.showModal(false));
document.getElementById('marcaForm').addEventListener('submit', (e) => marcas.save(e));
document.getElementById('cancelMarca').addEventListener('click', () => marcas.hideModal());
document.querySelectorAll('#marcaModal .close').forEach(el => {
    el.addEventListener('click', () => marcas.hideModal());
});
