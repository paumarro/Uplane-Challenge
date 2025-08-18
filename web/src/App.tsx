import { useEffect, useState } from 'react';
import { uploadImage, listImages, deleteImage } from './api';
import DragAndDropUploader from './components/DragAndDropUploader';
import ImageList from './components/ImageList';
import ErrorBanner from './components/ErrorBanner';
import NavBar from './components/NavBar';

type Item = { id: string; status: 'QUEUED' | 'PROCESSING' | 'DONE' | 'ERROR'; processedUrl?: string | null; createdAt?: string };

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const data = await listImages();
      setItems(data);
    } catch (e: any) {
      setError(e.message);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files[0]) return;
    setError(null);
    setUploading(true);
    try {
      await uploadImage(files[0]);
      await refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteImage(id);
    await refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <NavBar />
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-4">Image Processor</h1>
        <p className="mb-6 text-sm text-gray-600">
          Upload an image. The backend removes the background and flips it horizontally. You get a unique URL for the processed image and can delete it later.
        </p>
        {error && <ErrorBanner message={error} />}
        <DragAndDropUploader onFiles={handleFiles} uploading={uploading} />
        <h2 className="text-xl font-semibold mb-3">Your images</h2>
        <ImageList items={items} onDelete={handleDelete} />
      </div>
    </div>
  );
}
