"use client";

// import { useState, useEffect } from "react";
// // import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
// import { initializeApp } from "firebase/app";
// import { useRouter } from "next/navigation";
// import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

"use client";

import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { useRouter } from "next/navigation";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
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

const provider = new GoogleAuthProvider();
const app = initializeApp(firebaseConfig);

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const router = useRouter();

  const auth = getAuth();

  // ページ読み込み時にユーザーの自動ログインチェック
  useEffect(() => {
    onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          // バックエンドにトークン送信
          const res = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.uid) {
              // ユーザー存在 → トピックページへ遷移
              router.push("/srccode/topic");
            }
          }
        } catch (err) {
          console.error("自動ログインエラー:", err);
        }
      }
    });
  }, [auth, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name: field, value } = e.target;
    if (field === "mail") setEmail(value);
    else if (field === "password") setPassword(value);
    else if (field === "name") setName(value);
    else if (field === "bio") setBio(value);
    else if (field === "schoolId") {
      const halfWidthValue = value.replace(/[^\x20-\x7E]/g, "");
      setSchoolId(halfWidthValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.length > 10) { alert("名前は10文字以内"); return; }
    if (bio.length > 30) { alert("自己紹介は30文字以内"); return; }
    if (!password) { alert("パスワードを入力してください"); return; }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      // バックエンドにユーザー作成／存在確認
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (res.ok) {
        router.push("/srccode/topic");
      }
    } catch (err) {
      console.error("サインアップエラー:", err);
      alert("サインアップに失敗しました");
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (res.ok) {
        router.push("/srccode/topic");
      }
    } catch (err) {
      console.error("Googleサインインエラー:", err);
      alert("Googleサインインに失敗しました");
    }
  };

  return (
    <div>
      <h2>サインアップ</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="名前" value={name} maxLength={10} onChange={handleChange} />
        <textarea name="bio" placeholder="自己紹介" value={bio} maxLength={30} onChange={handleChange} />
        <input type="text" name="schoolId" placeholder="学校ID（半角のみ）" value={schoolId} onChange={handleChange} />
        <input type="password" name="password" placeholder="パスワード" value={password} onChange={handleChange} />
        <button type="submit">送信</button>
      </form>
      <button onClick={signInWithGoogle}>Googleでサインイン</button>
    </div>
  );
}