
"use client";

import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";

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

type MakeGroupRequest = {
  groupName: string;
  idToken: string;
  schoolId: number;
};

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);
  const [fetchingGroups, setFetchingGroups] = useState(true);

  const auth = getAuth();

  // Firebase currentUser を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // ページ初回レンダリングで全グループ取得
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setFetchingGroups(true);
        const res = await fetch("http://localhost:8080/getgroups");
        if (!res.ok) throw new Error("グループ取得に失敗しました");
        const data = await res.json();
        setGroups(data.all_groups || []);
      } catch (err: any) {
        console.error(err);
        alert(`グループ取得エラー: ${err.message}`);
      } finally {
        setFetchingGroups(false);
      }
    };

    fetchGroups();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert("ログインしてください");
      return;
    }

    if (!groupName) {
      alert("グループ名を入力してください");
      return;
    }

    setLoading(true);

    try {
      const idToken = await currentUser.getIdToken();

      const payload: MakeGroupRequest = {
        groupName,
        idToken,
        schoolId: 1, // ここは固定値や URL パラメータに応じて変更可能
      };

      const res = await fetch("http://localhost:8080/makegroup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("グループ作成に失敗");

      const data = await res.json();
      alert("グループ作成成功！");

      // 作成したグループIDは data.created_group_id
      // 作成後、最新の全グループを再取得
      const groupsRes = await fetch("http://localhost:8080/getgroups");
      const groupsData = await groupsRes.json();
      setGroups(groupsData.all_groups || []);

      console.log(groupsData)

      // フォームクリア
      setGroupName("");
    } catch (err: any) {
      console.error(err);
      alert(`エラー: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Googleサインイン
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setCurrentUser(result.user);
      alert("Googleサインイン成功！");
    } catch (err: any) {
      console.error(err);
      alert(`Googleサインインエラー: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: "16px" }}>
      <h2>グループ作成</h2>

      {!currentUser && (
        <button onClick={signInWithGoogle} style={{ marginBottom: "16px" }}>
          Googleでログイン
        </button>
      )}

      {currentUser && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "32px" }}>
          <input
            type="text"
            placeholder="グループ名を入力"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            style={{ padding: "8px", marginRight: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "作成中..." : "グループを作成"}
          </button>
        </form>
      )}

      <h2>全グループ一覧</h2>
      {fetchingGroups ? (
        <p>読み込み中...</p>
      ) : groups.length === 0 ? (
        <p>まだグループはありません</p>
      ) : (
        <ul>
          {groups.length === 0 ? (
            <p>まだグループはありません</p>
          ) : (
            groups.map((g) => (
              <li key={g.ID}>
                グループID: {g.ID}, 
                ユーザーID: {g.UserID}, 
                学校ID: {g.SchoolID}, 
                作成日時: {new Date(g.CreatedAt).toLocaleString()}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}