// "use client";

// import { useState, useEffect } from "react";

// export default function PasswordManager() {
//   const [password, setPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");

//   // -----------------------------
//   // パスワード取得
//   // -----------------------------
//   const fetchPassword = async () => {
//     try {
//       const res = await fetch("http://localhost:8080/getPassword");
//       const data = await res.json();
//       setPassword(data.user_enter_password);
//     } catch (err) {
//       console.error("パスワード取得エラー:", err);
//     }
//   };

//   // -----------------------------
//   // パスワード更新
//   // -----------------------------
//   const updatePassword = async () => {
//     if (!newPassword) return alert("新しいパスワードを入力してください");

//     try {
//       const res = await fetch("http://localhost:8080/setPassword", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ newPassword }),
//       });

//       const data = await res.json();
//       alert("パスワードを更新しました: " + data.user_enter_password);
//       setPassword(data.user_enter_password);
//       setNewPassword("");
//     } catch (err) {
//       console.error("パスワード更新エラー:", err);
//     }
//   };

//   useEffect(() => {
//     fetchPassword();
//   }, []);

//   return (
//     <div>
//       <h2>現在のパスワード: {password}</h2>

//       <input
//         type="password"
//         placeholder="新しいパスワード"
//         value={newPassword}
//         onChange={(e) => setNewPassword(e.target.value)}
//       />
//       <button onClick={updatePassword}>パスワード更新</button>
//     </div>
//   );
// }







"use client";

import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Firebase 初期化
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
const auth = getAuth(app);

export default function PasswordManager() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // -----------------------------
  // 管理者チェック + パスワード取得
  // -----------------------------
  const loadPassword = async (user: any) => {
    try {
      const idToken = await user.getIdToken();

      // 管理者チェック
      const checkRes = await fetch("http://localhost:8080/admin/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + idToken
        }
      });
      const checkData = await checkRes.json();
      if (!checkData.isAdmin) {
        alert("管理者権限がありません");
        return;
      }

      // 管理者ならパスワード取得
      const res = await fetch("http://localhost:8080/getPassword", {
        headers: {
          "Authorization": "Bearer " + idToken
        }
      });
      const data = await res.json();
      setPassword(data.user_enter_password);
    } catch (err) {
      console.error("パスワード取得エラー:", err);
      alert("パスワード取得に失敗しました");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      setCurrentUser(user);
      loadPassword(user);
    });
    return () => unsubscribe();
  }, []);

  // -----------------------------
  // パスワード更新
  // -----------------------------
  const updatePassword = async () => {
    if (!currentUser) return;
    if (!newPassword) return alert("新しいパスワードを入力してください");

    try {
      const idToken = await currentUser.getIdToken();

      // バックエンドで管理者チェックは不要（loadPasswordで既に確認済み）
      const res = await fetch("http://localhost:8080/setPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + idToken
        },
        body: JSON.stringify({ newPassword })
      });

      const data = await res.json();
      alert("パスワードを更新しました: " + data.user_enter_password);
      setPassword(data.user_enter_password);
      setNewPassword("");
    } catch (err) {
      console.error("パスワード更新エラー:", err);
      alert("パスワード更新に失敗しました");
    }
  };

  return (
    <div>
      <h2>現在のパスワード: {password}</h2>

      <input
        type="password"
        placeholder="新しいパスワード"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={updatePassword}>パスワード更新</button>
    </div>
  );
}