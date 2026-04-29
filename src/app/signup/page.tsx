






// // リロードしたらしっかり動く
"use client";

import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { useRouter } from "next/navigation";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged, // ← ★追加
  User
} from "firebase/auth";
import { firebaseConfig } from "../firebaseconfig/firebase";
import { API_BASE_URL } from "../api/api";

// ----------------------
// Firebase 設定
// ----------------------
// const firebaseConfig = {
//   apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
//   authDomain: "share-info-project.firebaseapp.com",
//   projectId: "share-info-project",
//   storageBucket: "share-info-project.firebasestorage.app",
//   messagingSenderId: "10017220780",
//   appId: "1:10017220780:web:4820d384929f2d84735709",
//   measurementId: "G-42VYEZ51GF",
// };

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

// ----------------------
// 型定義
// ----------------------
type School = {
  ID: number;
  SchoolName: string;
};

// ----------------------
// コンポーネント
// ----------------------
export default function LoginPage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [schoolId, setSchoolId] = useState(""); // ← 文字列で保持
  const [password, setPassword] = useState("");
  const [schools, setSchools] = useState<School[]>([]);

  const router = useRouter();
  const auth = getAuth(app);

  // ----------------------
// 自動ログインチェック
// ----------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const idToken = await user.getIdToken();

        const res = await fetch(`${API_BASE_URL}/is_user_exist`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (res.status === 200) {
          const data = await res.json();

          // ユーザー存在
          if (data.exist === true || data.uid) {
            router.push("/topic");
          }
        }
      } catch (err) {
        console.error("ユーザー存在確認エラー:", err);
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  // ----------------------
  // 学校一覧を取得
  // ----------------------
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        // const res = await fetch("http://localhost:8080/schools_list");
        const res = await fetch(`${API_BASE_URL}/schools_list`);
        if (!res.ok) throw new Error("学校取得失敗");
        const data: School[] = await res.json();
        setSchools(data);
      } catch (err) {
        console.error(err);
        alert("学校の取得に失敗しました");
      }
    };
    fetchSchools();
  }, []);

  // ----------------------
  // バックエンド送信
  // ----------------------
  const sendToBackend = async (user: User) => {
    if (!user) return;

    const idToken = await user.getIdToken();

    try {
      // const res = await fetch("http://localhost:8080/login", {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name,
          introduce: bio,
          schoolId, // 文字列で送信
          password,
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        if (data.uid) {
          router.push("/topic");
        }
      } else {
        const errData = await res.json();
        console.error("バックエンドエラー:", errData);
        alert(errData.error || "ログインに失敗しました");
      }
    } catch (err) {
      console.error("バックエンド通信エラー:", err);
      alert("ログインに失敗しました");
    }
  };

  // ----------------------
  // Googleログイン
  // ----------------------
  const handleGoogleLogin = async () => {
    if (!name || !bio || !schoolId || !password) {
      alert("すべての項目を入力してください");
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

  const isFormValid = name && bio && schoolId && password;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f0f4f8",
      fontFamily: "Arial, sans-serif",
      padding: "20px",
    }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>Birdman Webへようこそ</h1>

      <div style={{
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "15px"
      }}>
        <input
          type="text"
          placeholder="名前"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={10}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        <textarea
          placeholder="自己紹介"
          value={bio}
          onChange={e => setBio(e.target.value)}
          maxLength={30}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", resize: "none" }}
        />

        <select
          value={schoolId}
          onChange={e => setSchoolId(e.target.value)} // ← 文字列のまま保持
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        >
          <option value="">学校を選択してください</option>
          {schools.map(s => (
            <option key={s.ID} value={s.ID.toString()}>
              {s.SchoolName}
            </option>
          ))}
        </select>

        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={e => setPassword(e.target.value)}
          maxLength={20}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        <button
          onClick={handleGoogleLogin}
          disabled={!isFormValid}
          style={{
            padding: "12px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: isFormValid ? "#3b82f6" : "#93c5fd",
            color: "white",
            fontWeight: "bold",
            cursor: isFormValid ? "pointer" : "not-allowed",
          }}
        >
          Googleでログイン
        </button>
      </div>
    </div>
  );
}


