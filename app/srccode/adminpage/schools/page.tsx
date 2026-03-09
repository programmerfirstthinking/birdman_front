// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"

// export default function AdminPage() {


//   return (
//     <div>スクールページです</div>
//   )
// }










"use client";

import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

// -----------------------------
// Firebase 初期化
// -----------------------------
const firebaseConfig = {
  apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
  authDomain: "share-info-project.firebaseapp.com",
  projectId: "share-info-project",
  storageBucket: "share-info-project.firebasestorage.app",
  messagingSenderId: "10017220780",
  appId: "1:10017220780:web:4820d384929f2d84735709",
  measurementId: "G-42VYEZ51GF",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// -----------------------------
// コンポーネント
// -----------------------------
export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("ログインしてください");
        router.push("/");
        return;
      }

      setCurrentUser(user);

      try {
        const idToken = await user.getIdToken();

        // 管理者権限チェック
        const res = await fetch("http://localhost:8080/admin/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + idToken,
          },
        });
        const data = await res.json();

        if (!data.isAdmin) {
          alert("管理者権限がありません");
          router.push("/"); // トップページへリダイレクト
          return;
        }

        setLoading(false); // 管理者OKなら表示
      } catch (err) {
        console.error("管理者チェックエラー:", err);
        alert("管理者チェックに失敗しました");
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <p>読み込み中…</p>;

  return <div>スクールページです（管理者アクセス）</div>;
}