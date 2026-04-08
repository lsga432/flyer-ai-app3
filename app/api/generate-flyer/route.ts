import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const MODEL_IDENTIFIER = 'black-forest-labs/flux-kontext-pro';

// Definimos un tipo para la respuesta de Replicate (puede variar)
type ReplicateOutput = string | { url: string } | Array<{ url: string }> | any;

export async function POST(req: NextRequest) {
  try {
    const { prompt, imageBase64 } = await req.json();

    if (!prompt || !imageBase64) {
      return NextResponse.json({ error: 'Faltan el prompt o la imagen.' }, { status: 400 });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Ejecutar el modelo
    const output: ReplicateOutput = await replicate.run(MODEL_IDENTIFIER, {
      input: {
        prompt: `Crea un flyer turístico moderno y elegante. Estilo minimalista y profesional. Texto principal: "${prompt}". Usa la imagen proporcionada como base y edítala para integrar este texto de forma armoniosa.`,
        input_image: imageBase64,
        aspect_ratio: 'match_input_image',
        output_format: 'png',
        safety_tolerance: 2,
        prompt_upsampling: false,
      },
    });

    // Extraer la URL de la imagen
    let imageUrl: string | null = null;

    // Caso 1: output es un string (URL directa)
    if (typeof output === 'string') {
      imageUrl = output;
    }
    // Caso 2: output es un objeto con propiedad url
    else if (output && typeof output === 'object' && 'url' in output && typeof output.url === 'string') {
      imageUrl = output.url;
    }
    // Caso 3: output es un array que contiene objetos con url (ej: [{url: "..."}])
    else if (Array.isArray(output) && output.length > 0 && output[0] && typeof output[0] === 'object' && 'url' in output[0]) {
      imageUrl = output[0].url as string;
    }
    // Caso 4: output es un array de strings
    else if (Array.isArray(output) && output.length > 0 && typeof output[0] === 'string') {
      imageUrl = output[0];
    }

    if (!imageUrl) {
      console.error('Formato de salida no reconocido:', JSON.stringify(output, null, 2));
      throw new Error('No se pudo obtener la URL de la imagen generada.');
    }

    return NextResponse.json({ image: imageUrl });
  } catch (error: any) {
    console.error('Error en API Replicate:', error);
    const errorMessage = error.message || 'Error interno del servidor al generar el flyer.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
