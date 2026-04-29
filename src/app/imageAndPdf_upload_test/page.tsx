



"use client";

import { useState, ChangeEvent } from "react";
import useSWR from "swr";

import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { firebaseConfig } from "../firebaseconfig/firebase";

// Firebase 初期化
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

//////////////////////////////////////////////////
// SWR fetcher（Firestore取得）
//////////////////////////////////////////////////

const fetchImages = async () => {
  const q = query(
    collection(firestore, "images"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

//////////////////////////////////////////////////

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // ⭐ SWR
  const {
    data: images,
    error,
    isLoading,
    mutate,
  } = useSWR("images", fetchImages);

  ////////////////////////////////////////////////

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  ////////////////////////////////////////////////

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    try {
      // Storage upload
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);

      // URL取得
      const downloadURL = await getDownloadURL(storageRef);

      // Firestore保存
      await addDoc(collection(firestore, "images"), {
        name: file.name,
        url: downloadURL,
        createdAt: new Date(),
      });

      // ⭐ SWR 再検証（ここが重要）
      await mutate();

      alert("アップロード成功！");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("アップロード失敗");
    } finally {
      setUploading(false);
    }
  };

  ////////////////////////////////////////////////

  if (error) return <div>読み込みエラー</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Firebase 画像アップロード（SWR版）</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        style={{ marginLeft: 10 }}
      >
        {uploading ? "アップロード中…" : "アップロード"}
      </button>

      <hr style={{ margin: "20px 0" }} />

      <h2>アップロード済み画像</h2>

      {isLoading && <p>Loading...</p>}

      {images?.map((img: any) => (
        <div key={img.id} style={{ marginBottom: 20 }}>
          <img src={img.url} width={300} />
          <p>{img.name}</p>
        </div>
      ))}
    </div>
  );
}