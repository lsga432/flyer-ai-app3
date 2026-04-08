'use client';

import { downloadAsImage, downloadAsPDF } from '@/utils/exportUtils';

interface ExportButtonsProps {
  targetElementId: string;
}

export default function ExportButtons({ targetElementId }: ExportButtonsProps) {
  const handleDownload = async (format: 'png' | 'jpg' | 'pdf') => {
    const element = document.getElementById(targetElementId);
    if (!element) return;

    if (format === 'pdf') {
      await downloadAsPDF(element);
    } else {
      await downloadAsImage(element, format);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={() => handleDownload('png')}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
      >
        📥 Descargar PNG
      </button>
      <button
        onClick={() => handleDownload('jpg')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
      >
        📥 Descargar JPG
      </button>
      <button
        onClick={() => handleDownload('pdf')}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
      >
        📑 Descargar PDF
      </button>
    </div>
  );
}