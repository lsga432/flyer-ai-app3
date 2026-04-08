import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

// El identificador único del modelo en Replicate
const MODEL_IDENTIFIER = 'black-forest-labs/flux-kontext-pro';

export async function POST(req: NextRequest) {
  try {
    // 1. Recibir datos del frontend
    const { prompt, imageBase64 } = await req.json();

    if (!prompt || !imageBase64) {
      return NextResponse.json({ error: 'Faltan el prompt o la imagen.' }, { status: 400 });
    }

    // 2. Inicializar el cliente de Replicate con tu clave de API (se toma de las variables de entorno de Vercel)
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // 3. Crear la "predicción" en Replicate
    // Esta función inicia el proceso de generación de imagen y espera a que termine.
    const output = await replicate.run(MODEL_IDENTIFIER, {
      input: {
        // La instrucción para el modelo, basada en tu prompt original.
        prompt: `Crea un flyer turístico moderno y elegante. Estilo minimalista y profesional. El texto principal es: "${prompt}". Usa la imagen proporcionada como base y edítala para integrar este texto de forma armoniosa.`,
        // La imagen que sube el usuario (debe ser una URL pública o, en este caso, datos base64)
        input_image: imageBase64,
        // Para mantener la proporción de la imagen original
        aspect_ratio: 'match_input_image',
        // Formato de salida
        output_format: 'png',
        // Nivel de tolerancia de seguridad (2 es el máximo permitido cuando se usan imágenes de entrada)[reference:4]
        safety_tolerance: 2,
        // Desactivamos la mejora automática del prompt
        prompt_upsampling: false,
      },
    });

    // 4. Procesar la respuesta de Replicate
    // El modelo puede devolver una o varias URLs. Nos quedamos con la primera.
    // La salida puede ser un string o un arreglo de strings.
    let imageUrl: string | null = null;
    if (output) {
        if (typeof output === 'string') {
            imageUrl = output;
        } else if (Array.isArray(output) && output.length > 0 && typeof output[0] === 'string') {
            imageUrl = output[0];
        } else if (output && typeof output === 'object' && 'url' in output && typeof output.url === 'string') {
            // En caso de que la salida sea un objeto con una URL
            imageUrl = output.url;
        }
    }

    if (!imageUrl) {
        console.error('Formato de salida no reconocido:', output);
        throw new Error('No se pudo obtener la URL de la imagen generada.');
    }

    // 5. Devolver la URL de la imagen al frontend
    return NextResponse.json({ image: imageUrl });

  } catch (error: any) {
    console.error('Error en API Replicate:', error);
    const errorMessage = error.message || 'Error interno del servidor al generar el flyer.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
