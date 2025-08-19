import { useEffect, useState } from 'react';
import { uploadImage, listImages, deleteImage } from './api';
import DragAndDropUploader from './components/DragAndDropUploader';
import ErrorBanner from './components/ErrorBanner';
import NavBar from './components/NavBar';
import { YourImagesRow } from './components/ImagesRow';

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
    <div className="px-5 sm:px-10 lg:px-20 min-h-screen bg-[#EBF5FF] text-gray-900">
      <NavBar />
      <div className="max-w-[882px] 2xl:max-w-5xl mx-auto">

        <DragAndDropUploader onFiles={handleFiles} uploading={uploading} />
        <YourImagesRow items={items} onDelete={handleDelete} />
      </div>
    </div>
  );
}
