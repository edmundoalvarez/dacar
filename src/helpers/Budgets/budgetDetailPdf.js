import html2canvas from "html2canvas";
import jsPDF from "jspdf";
export const generatePDF = async (elementId, budget) => {
  const element = document.getElementById(elementId);

  if (!element) {
    console.error("El elemento con id 'budget-to-print' no existe.");
    return;
  }

  try {
    // Clonamos el contenido del elemento para agregar estilos personalizados
    const clonedElement = element.cloneNode(true);
    clonedElement.style.position = "absolute";
    clonedElement.style.top = "0px";
    clonedElement.style.left = "-9999px";
    clonedElement.style.borderRadius = "0px";
    clonedElement.style.border = "none";

    // Aplicar estilos específicos para el PDF
    clonedElement.style.fontSize = "16px";
    clonedElement.style.color = "#333";
    clonedElement.querySelectorAll("table").forEach((table) => {
      table.style.borderCollapse = "collapse";
      table.style.fontSize = "16px";
    });
    clonedElement
      .querySelectorAll("td, th, thead, tbody, tr, table")
      .forEach((cell) => {
        cell.style.border = "none";
      });
    clonedElement.querySelectorAll("tr").forEach((row) => {
      const cells = row.querySelectorAll("td");
      cells.forEach((cell, index) => {
        // Quitar todos los bordes
        cell.style.border = "none";

        // Agregar borde izquierdo a todos los td
        cell.style.borderLeft = "0.5px solid #282828";

        // Si es el último td de la fila, agregar borde derecho
        if (index === cells.length - 1) {
          cell.style.borderRight = "0.5px solid #282828";
        }

        // Opcional: ajustar padding o alineación
        cell.style.padding = "8px";
        cell.style.textAlign = "left";
      });
    });
    // Seleccionar las tablas
    const tables = clonedElement.querySelectorAll("table");

    // Primera tabla
    tables[0].querySelectorAll("tr").forEach((row, index) => {
      // Quitar bordes iniciales
      row.style.border = "none";

      // Aplicar borde superior a todos los tr por defecto
      row.style.borderTop = "0.5px solid #282828";
      // Si es el primer tr (index 0), agregar bordes laterales a sus celdas
      if (index === 0) {
        row.querySelectorAll("td, th").forEach((cell) => {
          cell.style.borderLeft = "0.5px solid #282828"; // Borde izquierdo
          cell.style.borderRight = "0.5px solid #282828"; // Borde derecho
        });
      }

      // Excepción: el tr 7 (índice 6) de la primera tabla
      if (index === 6) {
        row.style.borderBottom = "0.5px solid #282828";
      }
    });

    // Segunda tabla
    tables[1].querySelectorAll("tr").forEach((row, index) => {
      // Quitar bordes iniciales
      row.style.border = "none";

      // Aplicar borde superior a todos los tr por defecto
      row.style.borderTop = "0.5px solid #282828";

      // Excepción: el tr 3 (índice 2) de la segunda tabla
      if (index === 2) {
        row.style.borderTop = "none";
        row.style.borderBottom = "0.5px solid #282828";
      }
    });
    clonedElement.querySelectorAll("td,th").forEach((cell) => {
      cell.style.margin = "20px 0px 20px 0px ";
      cell.style.paddingBottom = "20px"; // Eliminar padding
      cell.style.paddingTop = "10px"; // Eliminar padding
    });
    clonedElement.querySelectorAll("th").forEach((parrafo) => {
      parrafo.style.paddingBottom = "12px"; // Eliminar padding
      parrafo.style.paddingTop = "2px"; // Eliminar padding
      parrafo.style.fontSize = "16px";
    });
    // Ajustar párrafos
    clonedElement.querySelectorAll("td p, td strong ").forEach((parrafo) => {
      parrafo.style.margin = "0px 50px 0px 0px "; // Eliminar márgenes
      parrafo.style.padding = "0px 50px 0px 0px "; // Eliminar padding
      parrafo.style.lineHeight = "1.5"; // Ajustar interlineado para espacio entre líneas
      parrafo.style.display = "block"; // Asegurar que el párrafo se comporte como un bloque
      parrafo.style.width = "100%"; // Asegurar que ocupe todo el ancho del contenedor
      parrafo.style.textAlign = "left"; // Alineación horizontal (opcional)
      parrafo.style.fontSize = "16px";
    });
    clonedElement.querySelectorAll("td").forEach((parrafo) => {
      parrafo.style.fontSize = "16px";
    });
    clonedElement.querySelectorAll("img").forEach((img) => {
      img.style.width = "800px"; // Ajusta según el tamaño real deseado
      img.style.height = "auto"; // Mantiene la proporción
      img.style.objectFit = "contain"; // Asegura que la imagen se ajuste sin recortarse
    });
    clonedElement.querySelectorAll("#intro > div").forEach((parrafo) => {
      parrafo.style.paddingBottom = "16px"; // Eliminar padding
    });
    clonedElement.querySelectorAll("#finalTable td").forEach((parrafo) => {
      parrafo.style.paddingBottom = "12px"; // Eliminar padding
      parrafo.style.paddingTop = "2px"; // Eliminar padding
      parrafo.style.fontSize = "16px";
    });

    // Insertar el clon en el DOM
    document.body.appendChild(clonedElement);

    // Generar el canvas usando el clon con estilos personalizados
    const canvas = await html2canvas(clonedElement, {
      scale: 1.2, // Mejor calidad
      useCORS: true,
    });

    // Eliminar el clon después de capturar el canvas
    document.body.removeChild(clonedElement);

    // Convertimos el canvas en una imagen PNG
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("portrait", "mm", "a4");
    const maxWidth = 210; // Ancho máximo en mm (A4)
    const maxHeight = 297; // Altura máxima en mm (A4)

    // Convertir tamaño de la imagen de píxeles a mm
    const imgWidth = canvas.width * 0.264583; // 1 px ≈ 0.264583 mm
    const imgHeight = canvas.height * 0.264583;

    // Escalar la imagen manteniendo la proporción
    let scaledWidth = imgWidth;
    let scaledHeight = imgHeight;

    if (scaledWidth > maxWidth) {
      scaledHeight *= maxWidth / scaledWidth;
      scaledWidth = maxWidth;
    }

    if (scaledHeight > maxHeight) {
      scaledWidth *= maxHeight / scaledHeight;
      scaledHeight = maxHeight;
    }

    // Centrar la imagen en la página
    const x = (maxWidth - scaledWidth) / 2;
    const y = 0;

    pdf.addImage(imgData, "PNG", x, y, scaledWidth, scaledHeight);
    // Abrir en nueva pestaña
    pdf.save(
      "presupuesto_N°" +
        budget.budget_number +
        " - " +
        budget.client?.[0]?.name +
        " " +
        budget.client?.[0]?.lastname
    );
    // window.open(pdfBlobUrl, "_blank");
  } catch (error) {
    console.error("Error al generar el PDF:", error);
  }
};
