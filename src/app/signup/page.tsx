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
  <div
    style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #e0f2fe, #f8fafc)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "Arial, sans-serif",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "480px",
        backgroundColor: "white",
        borderRadius: "18px",
        padding: "36px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: "22px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "2rem",
            marginBottom: "8px",
            color: "#1e293b",
          }}
        >
          Birdman Web
        </h1>

        <div
          style={{
            fontSize: "1rem",
            color: "#64748b",
          }}
        >
          ユーザー登録
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label
          style={{
            fontWeight: "bold",
            color: "#334155",
            fontSize: "0.95rem",
          }}
        >
          名前
        </label>

        <input
          type="text"
          placeholder="名前"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={10}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #cbd5e1",
            fontSize: "1rem",
            outline: "none",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label
          style={{
            fontWeight: "bold",
            color: "#334155",
            fontSize: "0.95rem",
          }}
        >
          自己紹介
        </label>

        <div
          style={{
            fontSize: "0.85rem",
            color: "#64748b",
            lineHeight: "1.5",
          }}
        >
          チーム名、何代、所属班、Twitterのリンクなどを書くと良いでしょう
        </div>

        <textarea
          placeholder="自己紹介 (30文字以内)"
          value={bio}
          onChange={e => setBio(e.target.value)}
          maxLength={30}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #cbd5e1",
            resize: "none",
            minHeight: "90px",
            fontSize: "1rem",
            outline: "none",
          }}
        />
      </div>

      

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label
          style={{
            fontWeight: "bold",
            color: "#334155",
            fontSize: "0.95rem",
          }}
        >
          学校選択
        </label>

        <div
        style={{
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
          padding: "14px",
          fontSize: "0.85rem",
          color: "#475569",
          lineHeight: "1.6",
        }}
      >
        自身の所属チームが存在しない場合、お手数ですがユーザー登録をせずにDMにてお知らせください。
      </div>

        <select
          value={schoolId}
          onChange={e => setSchoolId(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #cbd5e1",
            backgroundColor: "white",
            fontSize: "1rem",
          }}
        >
          <option value="">学校を選択してください</option>
          {schools.map(s => (
            <option key={s.ID} value={s.ID.toString()}>
              {s.SchoolName}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label
          style={{
            fontWeight: "bold",
            color: "#334155",
            fontSize: "0.95rem",
          }}
        >
          パスワード
        </label>

        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={e => setPassword(e.target.value)}
          maxLength={20}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #cbd5e1",
            fontSize: "1rem",
            outline: "none",
          }}
        />
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={!isFormValid}
        style={{
          marginTop: "8px",
          padding: "14px",
          borderRadius: "10px",
          border: "none",
          backgroundColor: isFormValid ? "#2563eb" : "#93c5fd",
          color: "white",
          fontWeight: "bold",
          fontSize: "1rem",
          cursor: isFormValid ? "pointer" : "not-allowed",
          transition: "0.2s",
          boxShadow: isFormValid
            ? "0 4px 10px rgba(37,99,235,0.25)"
            : "none",
        }}
      >
        Googleでログイン
      </button>
    </div>
  </div>
);
}


