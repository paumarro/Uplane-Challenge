import React from 'react';

type Props = {
  item: { id: string; status: string; processedUrl?: string | null };
  onDelete: (id: string) => void;
};

export default function ImageCard({ item, onDelete }: Props) {
  return (
    <div className="bg-white rounded shadow p-4 flex items-center justify-between">
      <div>
        <div className="font-mono text-sm">{item.id}</div>
        <div className="text-xs text-gray-500">{item.status}</div>
        {item.processedUrl && (
          <div className="mt-2">
            <a className="text-blue-600 underline" href={item.processedUrl} target="_blank" rel="noreferrer">
              Open processed image
            </a>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {item.processedUrl && (
          <button
            className="px-3 py-1 text-sm bg-gray-100 rounded"
            onClick={() => navigator.clipboard.writeText(item.processedUrl!)}
          >
            Copy URL
          </button>
        )}
        <button className="px-3 py-1 text-sm bg-red-600 text-white rounded" onClick={() => onDelete(item.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
