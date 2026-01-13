// Main App Logic
let currentTab = 'marcas';

function switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');

    currentTab = tabName;

    // Load data for the tab
    loadTabData(tabName);
}

async function loadTabData(tabName) {
    try {
        switch (tabName) {
            case 'marcas':
                await marcas.loadMarcas();
                break;
            case 'modelos':
                await modelos.loadModelos();
                break;
            case 'import':
                await importModule.loadBatches();
                break;
        }
    } catch (error) {
        console.error(`Error loading ${tabName}:`, error);
    }
}

async function loadAllData() {
    await loadTabData(currentTab);
}

// Event Listeners for tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        switchTab(btn.dataset.tab);
    });
});

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    const marcaModal = document.getElementById('marcaModal');
    const modeloModal = document.getElementById('modeloModal');
    
    if (event.target === marcaModal) {
        marcas.hideModal();
    }
    if (event.target === modeloModal) {
        modelos.hideModal();
    }
});

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await auth.init();
    importModule.init();
});
