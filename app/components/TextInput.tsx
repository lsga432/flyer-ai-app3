'use client';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TextInput({ value, onChange }: TextInputProps) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ejemplo: 'Descubre la magia de Cancún · Playas de ensueño · Ofertas exclusivas · Reserve ahora'"
        rows={5}
        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
      <p className="text-xs text-gray-400 mt-1">
        Escribe el texto promocional que aparecerá en tu flyer turístico.
      </p>
    </div>
  );
}