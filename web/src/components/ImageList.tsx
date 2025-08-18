import React from 'react';
import ImageCard from './ImageCard';

type Props = {
  items: { id: string; status: string; processedUrl?: string | null }[];
  onDelete: (id: string) => void;
};

export default function ImageList({ items, onDelete }: Props) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <ImageCard key={item.id} item={item} onDelete={onDelete} />
      ))}
      {items.length === 0 && <div className="text-sm text-gray-500">No images yet.</div>}
    </div>
  );
}
