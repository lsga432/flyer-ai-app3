import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, imageBase64 } = await req.json();

    if (!prompt || !imageBase64) {
      return NextResponse.json({ error: "Faltan prompt o imagen" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key no configurada" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Extraer solo los datos base64 (sin el prefijo "data:image/...;base64,")
    const base64Data = imageBase64.split(',')[1];

    const contents = [
      { text: prompt },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation", // Este es el modelo con Nano Banana 2
      contents: contents,
      config: {
        temperature: 1,
        topP: 0.95,
        maxOutputTokens: 8192,
        responseModalities: ["IMAGE"],
      },
    });

    const generatedImage = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!generatedImage) {
      return NextResponse.json({ error: "No se pudo generar la imagen" }, { status: 500 });
    }

    return NextResponse.json({ image: `data:image/png;base64,${generatedImage}` });
  } catch (error: any) {
    console.error("Error en API:", error);
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}