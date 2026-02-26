"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
  authDomain: "share-info-project.firebaseapp.com",
  projectId: "share-info-project",
  storageBucket: "share-info-project.firebasestorage.app",
  messagingSenderId: "10017220780",
  appId: "1:10017220780:web:4820d384929f2d84735709",
  measurementId: "G-42VYEZ51GF"
};

// Firebase 初期化
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      // Storage にアップロード
      const storageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(storageRef, file);

      // ダウンロードURL取得
      const downloadURL = await getDownloadURL(storageRef);

      // Firestore に URL 保存
      await addDoc(collection(firestore, "images"), {
        name: file.name,
        url: downloadURL,
        createdAt: new Date(),
      });

      setUrl(downloadURL);
      alert("アップロード成功！");
    } catch (err) {
      console.error(err);
      alert("アップロード失敗");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Firebase 画像アップロード</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || uploading} style={{ marginLeft: 10 }}>
        {uploading ? "アップロード中…" : "アップロード"}
      </button>

      {url && (
        <div style={{ marginTop: 20 }}>
          <p>アップロード完了！URL:</p>
          <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
          <br />
          <img src={url} alt="Uploaded" style={{ maxWidth: "300px", marginTop: 10 }} />
        </div>
      )}
    </div>
  );
}