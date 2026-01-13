// Import Module
const importModule = {
    batches: [],

    init() {
        this.setupDragAndDrop();
        this.loadBatches();
    },

    setupDragAndDrop() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('csvFile');

        uploadArea.addEventListener('click', () => fileInput.click());

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.uploadFile(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.uploadFile(e.target.files[0]);
            }
        });

        document.getElementById('selectFileBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });
    },

    async uploadFile(file) {
        if (!file.name.endsWith('.csv')) {
            alert('Por favor selecciona un archivo CSV');
            return;
        }

        const statusDiv = document.getElementById('uploadStatus');
        statusDiv.innerHTML = '<div class="loading">Subiendo archivo...</div>';

        try {
            const response = await api.uploadCSV(file);
            statusDiv.innerHTML = `
                <div class="success-message">
                    ✓ Archivo subido exitosamente<br>
                    Batch ID: ${response.data.batchId}<br>
                    Registros insertados: ${response.data.inserted}<br>
                    ${response.data.errors > 0 ? `Errores: ${response.data.errors}` : ''}
                </div>
            `;
            
            // Reload batches
            await this.loadBatches();
            
            // Clear file input
            document.getElementById('csvFile').value = '';
        } catch (error) {
            statusDiv.innerHTML = `<div class="error-message">✗ Error: ${error.message}</div>`;
        }
    },

    async loadBatches() {
        try {
            const response = await api.getBatches();
            this.batches = response.data || [];
            this.renderBatches();
        } catch (error) {
            console.error('Error cargando batches:', error);
        }
    },

    renderBatches() {
        const listDiv = document.getElementById('batchesList');
        
        if (this.batches.length === 0) {
            listDiv.innerHTML = '<p style="text-align:center;color:var(--secondary-color)">No hay batches de importación</p>';
            return;
        }

        listDiv.innerHTML = this.batches.map(batch => `
            <div class="batch-item">
                <div class="batch-header">
                    <div>
                        <strong>Batch ID:</strong> ${batch.load_batch_id}<br>
                        <small>${new Date(batch.fecha_importacion).toLocaleString()}</small>
                    </div>
                </div>
                <div class="batch-stats">
                    <span>Total: ${batch.total_registros}</span>
                    <span>Pendientes: ${batch.pendientes}</span>
                    <span>Procesados: ${batch.procesados}</span>
                    ${batch.errores > 0 ? `<span style="color:var(--danger-color)">Errores: ${batch.errores}</span>` : ''}
                </div>
                <div class="batch-actions">
                    ${batch.pendientes > 0 ? `
                        <button class="btn btn-small btn-primary" onclick="importModule.processBatch('${batch.load_batch_id}')">
                            Procesar Batch
                        </button>
                    ` : ''}
                    <button class="btn btn-small btn-info" onclick="importModule.viewBatch('${batch.load_batch_id}')">
                        Ver Detalles
                    </button>
                    <button class="btn btn-small btn-danger" onclick="importModule.deleteBatch('${batch.load_batch_id}')">
                        Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    },

    async processBatch(batchId) {
        if (!confirm('¿Procesar este batch? Los registros se moverán a las tablas de trabajo.')) {
            return;
        }

        try {
            const response = await api.processBatch(batchId);
            alert(`Procesamiento completado:\n` +
                  `Procesados: ${response.data.procesados}\n` +
                  `Errores: ${response.data.errores}`);
            await this.loadBatches();
        } catch (error) {
            alert('Error al procesar batch: ' + error.message);
        }
    },

    async viewBatch(batchId) {
        try {
            const response = await api.getBatch(batchId);
            const registros = response.data.registros || [];
            
            const details = registros.slice(0, 5).map(r => 
                `${r.marca} ${r.modelo} ${r.anio || ''} - ${r.load_status}`
            ).join('\n');
            
            alert(`Batch: ${batchId}\n` +
                  `Total registros: ${registros.length}\n\n` +
                  `Primeros 5 registros:\n${details}`);
        } catch (error) {
            alert('Error al ver batch: ' + error.message);
        }
    },

    async deleteBatch(batchId) {
        if (!confirm('¿Estás seguro de que deseas eliminar este batch?')) {
            return;
        }

        try {
            await api.deleteBatch(batchId);
            alert('Batch eliminado exitosamente');
            await this.loadBatches();
        } catch (error) {
            alert('Error al eliminar batch: ' + error.message);
        }
    }
};
