"use client";

import { useState, useEffect } from "react";

export default function PasswordManager() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // -----------------------------
  // パスワード取得
  // -----------------------------
  const fetchPassword = async () => {
    try {
      const res = await fetch("http://localhost:8080/getPassword");
      const data = await res.json();
      setPassword(data.user_enter_password);
    } catch (err) {
      console.error("パスワード取得エラー:", err);
    }
  };

  // -----------------------------
  // パスワード更新
  // -----------------------------
  const updatePassword = async () => {
    if (!newPassword) return alert("新しいパスワードを入力してください");

    try {
      const res = await fetch("http://localhost:8080/setPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();
      alert("パスワードを更新しました: " + data.user_enter_password);
      setPassword(data.user_enter_password);
      setNewPassword("");
    } catch (err) {
      console.error("パスワード更新エラー:", err);
    }
  };

  useEffect(() => {
    fetchPassword();
  }, []);

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