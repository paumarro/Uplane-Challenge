import React, { useState } from 'react';
import backgroundImage from '../assets/Uplane-gradient.png';

type Props = {
  onFiles: (files: FileList | null) => void;
  uploading: boolean;
};

export default function DragAndDropUploader({ onFiles, uploading }: Props) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    onFiles(e.dataTransfer.files);
  };

  return (
    <div
      className={`rounded-xl p-28 text-center mb-6  ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
              opacity: 1,
            }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <p className="mb-4">Drop an image here</p>
      <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
        <input type="file" accept="image/*" className="hidden" onChange={(e) => onFiles(e.target.files)} />
        Choose an image
      </label>
      {uploading && <p className="mt-3 text-sm text-gray-500">Processing...</p>}
    </div>
  );
}
