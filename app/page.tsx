'use client';

import { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import TextInput from './components/TextInput';
import FlyerPreview from './components/FlyerPreview';
import ExportButtons from './components/ExportButtons';

export default function Home() {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [promptText, setPromptText] = useState('');
  const [generatedFlyer, setGeneratedFlyer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFlyer = async () => {
    if (!imageBase64 || !promptText.trim()) {
      setError('Por favor sube una imagen y escribe un texto para el flyer');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Construir un prompt profesional para flyers turísticos modernos y elegantes
    const fullPrompt = `Crea un flyer turístico moderno y elegante. 
    Estilo: minimalista, tipografía limpia, colores que transmitan serenidad y lujo.
    Composición: el texto debe estar armoniosamente integrado, destacando el mensaje principal.
    Usa la imagen que te proporciono como fondo o elemento visual principal.
    Texto a incluir: "${promptText}"
    Formato: vertical, apto para impresión y digital.
    NO agreges marcas de agua ni textos genéricos. Diseño profesional y atractivo.`;

    try {
      const response = await fetch('/api/generate-flyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt, imageBase64 }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al generar');
      setGeneratedFlyer(data.image);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            🎨 Flyer IA Turístico
          </h1>
          <p className="text-lg text-gray-600">
            Sube una foto, escribe tu mensaje y la IA (Gemini Nano Banana 2) creará un flyer moderno y elegante
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Columna izquierda: entrada */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">📸 Imagen base</h2>
              <ImageUploader onImageSelect={setImageBase64} />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">✍️ Texto del flyer</h2>
              <TextInput value={promptText} onChange={setPromptText} />
            </div>

            <button
              onClick={generateFlyer}
              disabled={isLoading || !imageBase64 || !promptText.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">...</svg>
                  Generando flyer con IA...
                </span>
              ) : (
                '✨ Generar Flyer con IA ✨'
              )}
            </button>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                ❌ {error}
              </div>
            )}
          </div>

          {/* Columna derecha: vista previa y descarga */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">🖼️ Flyer generado</h2>
            {generatedFlyer ? (
              <>
                <FlyerPreview imageUrl={generatedFlyer} />
                <div className="mt-6">
                  <ExportButtons targetElementId="flyer-preview" />
                </div>
              </>
            ) : (
              <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center text-gray-400">
                {isLoading ? '🔄 Creando diseño...' : 'Tu flyer aparecerá aquí'}
              </div>
            )}
          </div>
        </div>

        <footer className="text-center text-gray-500 text-sm mt-12">
          Powered by Google Gemini (Nano Banana 2) · Flyers turísticos con IA
        </footer>
      </div>
    </main>
  );
}