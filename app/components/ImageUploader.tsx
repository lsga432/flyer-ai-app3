'use client';

import { useDropzone } from 'react-dropzone';
import { useState } from 'react';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
}

export default function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onImageSelect(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
        isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
      }`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
      ) : (
        <div className="py-8">
          <p className="text-gray-500">Arrastra una imagen o haz clic para seleccionar</p>
          <p className="text-xs text-gray-400 mt-2">JPG, PNG, WEBP (máx. 5MB)</p>
        </div>
      )}
    </div>
  );
}