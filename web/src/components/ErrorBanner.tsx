import React from 'react';

type Props = {
  message: string;
};

export default function ErrorBanner({ message }: Props) {
  return <div className=" mt-[-15px] mb-[-45px] p-3 text-red-700">{message}</div>;
}
