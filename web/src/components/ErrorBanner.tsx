import React from 'react';

type Props = {
  message: string;
};

export default function ErrorBanner({ message }: Props) {
  return <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{message}</div>;
}
