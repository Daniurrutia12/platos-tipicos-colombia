// Variable global para almacenar todos los platos
let todosLosPlatos = [];
document.addEventListener('DOMContentLoaded', () => {
    cargarPlatos();
    inicializarEventListeners();
});

async function cargarPlatos() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        todosLosPlatos = data.platos || data;
        mostrarPlatos(todosLosPlatos);
    } catch (error) {
        console.error('Error al cargar los platos:', error);
        document.getElementById('platosContainer').innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Error al cargar los datos</p>';
    }
}

function inicializarEventListeners() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', filtrarPlatos);
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', manejarFiltroRegion);
    });
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function mostrarPlatos(platos) {
    const container = document.getElementById('platosContainer');
    if (platos.length === 0) {
        container.innerHTML = `<div class="no-results"><h3>📭 No se encontraron platos</h3><p>Intenta ajustar tus criterios de búsqueda o filtros</p></div>`;
        return;
    }
    container.innerHTML = platos.map(plato => `<div class="plato-card" onclick="abrirModal(${plato.id})"><img src="${plato.imagen || 'https://via.placeholder.com/500x350?text=' + encodeURIComponent(plato.nombre)}" alt="${plato.nombre}" class="plato-image" onerror="this.src='https://via.placeholder.com/500x350?text=${encodeURIComponent(plato.nombre)}'"><div class="plato-info"><span class="plato-region">${plato.region}</span><h3 class="plato-name">${plato.nombre}</h3><p class="plato-description">${plato.descripcion}</p><div class="plato-footer"><button class="btn-more" onclick="abrirModal(${plato.id}); event.stopPropagation();">Ver más</button><span class="plato-ingredients-count">🥘 ${plato.ingredientes ? plato.ingredientes.length : 0} ingredientes</span></div></div></div>`).join('');
}

function abrirModal(platoId) {
    const plato = todosLosPlatos.find(p => p.id === platoId);
    if (!plato) return;
    const modalBody = document.getElementById('modalBody');
    const ingredientesHTML = plato.ingredientes ? plato.ingredientes.map(ingrediente => `<li>${ingrediente}</li>`).join('') : '<li>Ingredientes no disponibles</li>';
    modalBody.innerHTML = `<div class="modal-header"><h2 class="modal-plato-name">${plato.nombre}</h2><span class="modal-plato-region">${plato.region}</span></div><img src="${plato.imagen || 'https://via.placeholder.com/700x300?text=' + encodeURIComponent(plato.nombre)}" alt="${plato.nombre}" class="modal-image" onerror="this.src='https://via.placeholder.com/700x300?text=${encodeURIComponent(plato.nombre)}'"> <div class="modal-section"><h3 class="modal-section-title">📖 Descripción</h3><p class="modal-description">${plato.descripcion}</p></div><div class="modal-section"><h3 class="modal-section-title">🥘 Ingredientes</h3><ul class="ingredients-list">${ingredientesHTML}</ul></div><div class="modal-section"><h3 class="modal-section-title">👨‍🍳 Preparación</h3><p class="modal-description">${plato.preparacion || 'Método de preparación no disponible'}</p></div>`;
    document.getElementById('modal').style.display = 'block';
}

function manejarFiltroRegion(e) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    const region = e.target.getAttribute('data-filter');
    filtrarPlatos();
}

function filtrarPlatos() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    const platosFiltrados = todosLosPlatos.filter(plato => {
        const coincideTexto = plato.nombre.toLowerCase().includes(searchValue) || plato.descripcion.toLowerCase().includes(searchValue) || (plato.ingredientes && plato.ingredientes.some(ing => ing.toLowerCase().includes(searchValue)));
        const coincideRegion = activeFilter === 'todos' || plato.region === activeFilter;
        return coincideTexto && coincideRegion;
    });
    mostrarPlatos(platosFiltrados);
}