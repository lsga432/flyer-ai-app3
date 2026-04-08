import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const MODEL_IDENTIFIER = 'black-forest-labs/flux-kontext-pro';

export async function POST(req: NextRequest) {
  try {
    // 1. Obtener los datos que envía el usuario
    const { prompt, imageBase64 } = await req.json();

    if (!prompt || !imageBase64) {
      return NextResponse.json({ error: 'Faltan el prompt o la imagen.' }, { status: 400 });
    }

    // 2. Inicializar el cliente de Replicate con tu token
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // 3. Ejecutar el modelo y obtener el resultado
    // La API moderna devuelve un objeto que contiene la URL
    const output = await replicate.run(MODEL_IDENTIFIER, {
      input: {
        prompt: `Crea un flyer turístico moderno y elegante. ... Texto principal: "${prompt}". ...`,
        input_image: imageBase64,
        aspect_ratio: 'match_input_image',
        output_format: 'png',
        safety_tolerance: 2,
        prompt_upsampling: false,
      },
    });

    // 4. Extraer la URL de la imagen del objeto de salida.
    //    Si el modelo devuelve varias imágenes, output será un array y tomamos la primera.
    let imageUrl: string | null = null;
    if (output && typeof output === 'object') {
      if (Array.isArray(output) && output[0] && typeof output[0].url === 'string') {
        // Caso más común: la salida es un array de objetos con propiedad 'url'
        imageUrl = output[0].url;
      } else if (typeof output.url === 'string') {
        // Caso alternativo: la salida es un solo objeto con propiedad 'url'
        imageUrl = output.url;
      }
    }

    // Si no se pudo obtener la URL, lanzamos un error
    if (!imageUrl) {
      console.error('No se pudo extraer la URL de la salida:', output);
      throw new Error('No se pudo obtener la URL de la imagen generada.');
    }

    // 5. Devolver la URL al frontend de nuestra aplicación
    return NextResponse.json({ image: imageUrl });
  } catch (error: any) {
    console.error('Error en API Replicate:', error);
    const errorMessage = error.message || 'Error interno del servidor al generar el flyer.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
