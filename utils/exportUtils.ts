import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const downloadAsImage = async (element: HTMLElement, format: 'png' | 'jpg') => {
  try {
    const canvas = await html2canvas(element, {
      scale: 3,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    });
    const link = document.createElement('a');
    link.download = `flyer-turistico.${format}`;
    link.href = canvas.toDataURL(`image/${format}`);
    link.click();
  } catch (error) {
    console.error('Error descargando imagen:', error);
    alert('No se pudo descargar la imagen. Intenta de nuevo.');
  }
};

export const downloadAsPDF = async (element: HTMLElement) => {
  try {
    const canvas = await html2canvas(element, {
      scale: 3,
      backgroundColor: '#ffffff',
      useCORS: true,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('flyer-turistico.pdf');
  } catch (error) {
    console.error('Error descargando PDF:', error);
    alert('No se pudo generar el PDF. Intenta de nuevo.');
  }
};