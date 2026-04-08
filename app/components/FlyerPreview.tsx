'use client';

interface FlyerPreviewProps {
  imageUrl: string;
}

export default function FlyerPreview({ imageUrl }: FlyerPreviewProps) {
  return (
    <div id="flyer-preview" className="flex justify-center">
      <img
        src={imageUrl}
        alt="Flyer generado"
        className="max-w-full rounded-lg shadow-lg border border-gray-200"
        style={{ maxHeight: '500px' }}
      />
    </div>
  );
}