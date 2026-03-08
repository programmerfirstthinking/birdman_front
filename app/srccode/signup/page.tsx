"use client";

import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { useRouter } from "next/navigation";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
  authDomain: "share-info-project.firebaseapp.com",
  projectId: "share-info-project",
  storageBucket: "share-info-project.firebasestorage.app",
  messagingSenderId: "10017220780",
  appId: "1:10017220780:web:4820d384929f2d84735709",
  measurementId: "G-42VYEZ51GF"
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

export default function LoginPage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [password, setPassword] = useState(""); // ← 新しく追加

  const router = useRouter();
  const auth = getAuth();

  // ----------------------
  // バックエンドに送信して自動遷移
  // ----------------------
  const sendToBackend = async (user: User) => {
    if (!user) return;

    const idToken = await user.getIdToken();
    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          name,
          introduce: bio,
          schoolId,
          password, // ← 新しく追加
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        if (data.uid) {
          router.push("/srccode/topic");
        }
      }
    } catch (err) {
      console.error("バックエンド通信エラー:", err);
    }
  };

  // ----------------------
  // ページロード時に自動ログインチェック
  // ----------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (!user) return;

      const idToken = await user.getIdToken();

      try {
        const res = await fetch("http://localhost:8080/is_user_exist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });

        if (res.status === 200) {
          router.push("/srccode/topic");
        }
      } catch (err) {
        console.error("ユーザー存在確認エラー:", err);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // ----------------------
  // Googleログイン
  // ----------------------
  const handleGoogleLogin = async () => {
    if (!name || !bio || !schoolId || !password) {
      alert("名前・自己紹介・学校ID・パスワードは必須です");
      return;
    }

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await sendToBackend(user);
    } catch (err) {
      console.error("Googleサインインエラー:", err);
      alert("Googleサインインに失敗しました");
    }
  };

  return (
    <div>
      <h2>Googleログイン</h2>
      <input
        type="text"
        placeholder="名前"
        value={name}
        onChange={e => setName(e.target.value)}
        maxLength={10}
      />
      <textarea
        placeholder="自己紹介"
        value={bio}
        onChange={e => setBio(e.target.value)}
        maxLength={30}
      />
      <input
        type="text"
        placeholder="学校ID（半角数字）"
        value={schoolId}
        onChange={e => setSchoolId(e.target.value.replace(/[^\d]/g, ""))}
      />
      <input
        type="password"  // ← 新しく追加
        placeholder="パスワード"
        value={password}
        onChange={e => setPassword(e.target.value)}
        maxLength={20}
      />
      <button onClick={handleGoogleLogin}>Googleでログイン</button>
    </div>
  );
}