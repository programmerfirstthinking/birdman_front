"use client";

import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const id = params.id;

  

  return (
    <div>
      <h1>URLの最後</h1>
      <p>{id}</p>
    </div>
  );
}