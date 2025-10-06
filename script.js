// 1. Datos de la Agenda - MANTENER IGUAL
const agendaEvents = [
    { fecha: "Miércoles 08/10/2025", municipio: "Independencia", lugar: "Liceo María Eva de Lizcano", actividad: "Taller Preventivo - Delitos Informáticos", hora: "08:50 AM" },
    { fecha: "Jueves 09/10/2025", municipio: "Independencia", lugar: "Liceo Fernando Ramírez", actividad: "Encuentro Formativo - Liderazgo - Oratoria y Expresión corporal", hora: "09:00 AM - 11:40 AM" },
    { fecha: "Jueves 09/10/2025", municipio: "Cocorote", lugar: "Complejo Educativo Río Claro", actividad: "Encuentro Formativo - Liderazgo", hora: "02:00 PM" },
    { fecha: "Martes 14/10/2025", municipio: "San Felipe", lugar: "ET Romulo Gallegos", actividad: "Encuentro Formativo - Liderazgo", hora: "08:00 AM" },
    { fecha: "Miércoles 15/10/2025", municipio: "Independencia", lugar: "Liceo Fernando Ramírez", actividad: "Encuentro Formativo - Liderazgo", hora: "09:00 AM" },
    { fecha: "Jueves 16/10/2025", municipio: "San Felipe, la cuchilla", lugar: "UNES", actividad: "Octubre Nos Une: Foro para la Juventud, Mujer y toda la comunidad. (Para inajudey se valida como Taller Preventivo).", hora: "N/A" },
    { fecha: "Miércoles 22/10/2025", municipio: "San Felipe", lugar: "ET Romulo Gallegos", actividad: "Encuentro Formativo - Oratoria (completo) dirigido a los estudiantes.", hora: "08:00 AM" },
    { fecha: "Jueves 23/10/2025", municipio: "San Felipe", lugar: "ET Romulo Gallegos", actividad: "Encuentro Formativo - Oratoria (completo) dirigido al personal Administrativo, Docentes y Obreros.", hora: "08:00 AM" },
    { fecha: "Miércoles 29/10/2025", municipio: "San Felipe, la cuchilla", lugar: "UNES", actividad: "Curso - Estructuras de Costos y Punto de Equilibrio. Dirigido a los PNF.", hora: "09:00 AM" },
    { fecha: "Miércoles 29/10/2025", municipio: "San Felipe, la cuchilla", lugar: "UNES", actividad: "Encuentro Formativo - Oratoria, Expresión corporal, redacción, ortografía, Retórica. Dirigido a los Oficiales de Plante de la UNES.", hora: "02:00 PM" },
    { fecha: "Jueves 30/10/2025", municipio: "San Felipe, la cuchilla", lugar: "UNES", actividad: "Curso - Inventario Estratégico: Control y Optimización del Stock.", hora: "09:00 AM" },
    { fecha: "Jueves 30/10/2025", municipio: "San Felipe, la cuchilla", lugar: "UNES", actividad: "Encuentro Formativo - Oratoria, Retórica, Expresión corporal, Redacción, Ortografía. Dirigido a los oficiales de planta de la UNES.", hora: "02:00 PM" },
];

const eventsListContainer = document.getElementById('events-list');
const pdfContentWrapper = document.getElementById('pdf-content-wrapper');
const headerPdfInfo = document.getElementById('header-pdf-info');
// 2. Función para Renderizar los Eventos - MANTENER IGUAL
function renderEvents() {
    eventsListContainer.innerHTML = ''; 

    agendaEvents.forEach(event => {
        const card = document.createElement('div');
        card.classList.add('event-card');
        card.innerHTML = `
            <div class="event-date">${event.fecha}</div>
            <div class="event-detail"><strong>⏰ Hora:</strong> ${event.hora || 'No especificada'}</div>
            <div class="event-detail"><strong>📍 Lugar:</strong> ${event.lugar}</div>
            <div class="event-detail"><strong>🏙️ Municipio:</strong> ${event.municipio}</div>
            <div class="event-activity"><strong>Actividad:</strong> ${event.actividad}</div>
        `;
        eventsListContainer.appendChild(card);
    });
}

// 3. Función para Generar el PDF (VERSIÓN CON CAPTURA DE PÁGINA ÚNICA)
async function generatePdfReport() {
    // 1. Mostrar el texto del instituto temporalmente
    if (headerPdfInfo) headerPdfInfo.classList.add('show-for-pdf');

    // 2. Usar html2canvas para renderizar el contenido HTML a un canvas
    const canvas = await html2canvas(pdfContentWrapper, {
        scale: 2, 
        // CLAVE: Capturar el ancho completo de la ventana para incluir márgenes
        width: pdfContentWrapper.offsetWidth, 
        height: pdfContentWrapper.offsetHeight,
        scrollX: 0, 
        scrollY: 0,
        x: pdfContentWrapper.offsetLeft,
        y: pdfContentWrapper.offsetTop,
    });

    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4'); 

    // CONSTANTES PARA EL TAMAÑO A4 Y MARGEN
    const pdfMargin = 10; // 10 mm de margen
    const a4Width = 210; // Ancho A4 en mm
    
    // Ancho real del contenido dentro del PDF (210 - 20 = 190mm)
    const contentWidth = a4Width - (pdfMargin * 2); 
    
    // Calculamos la altura de la imagen manteniendo la proporción
    const imgHeight = canvas.height * contentWidth / canvas.width;
    
    // 3. Añadir la imagen en una sola página (Eliminamos el bucle while)
    // doc.addImage(Data, Formato, X, Y, Ancho, Alto)
    doc.addImage(imgData, 'PNG', pdfMargin, pdfMargin, contentWidth, imgHeight); 
    
    // 4. Ocultar el texto del instituto nuevamente
    if (headerPdfInfo) headerPdfInfo.classList.remove('show-for-pdf');

    doc.save("Reporte_Agenda_INAJUDEY_Octubre_2025.pdf");
}

// [MANTENER EVENT LISTENERS IGUALES]
document.addEventListener('DOMContentLoaded', () => {
    renderEvents();
    
    const pdfButton = document.getElementById('generatePdf');
    pdfButton.addEventListener('click', generatePdfReport);
});

