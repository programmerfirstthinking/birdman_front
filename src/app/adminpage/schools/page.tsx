"use client";

import { useEffect, useState } from "react";
import { getApps, initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { firebaseConfig } from "../../firebaseconfig/firebase";
import { API_BASE_URL } from "../../api/api";

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

type School = {
  ID: number;
  SchoolName: string;
  CreatedAt: string;
  UpdatedAt: string;
};

export default function AdminSchoolPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSchoolName, setNewSchoolName] = useState("");
  const [adding, setAdding] = useState(false);
  const router = useRouter();

  const loadSchools = async (user: any) => {
    try {
      const idToken = await user.getIdToken();
      const checkRes = await fetch(`${API_BASE_URL}/admin/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + idToken },
      });
      const checkData = await checkRes.json();
      if (!checkData.isAdmin) {
        alert("管理者権限がありません");
        router.push("/");
        return;
      }
      const res = await fetch(`${API_BASE_URL}/admin/schools`, {
        headers: { Authorization: "Bearer " + idToken },
      });
      if (!res.ok) { alert("取得失敗"); router.push("/"); return; }
      setSchools(await res.json());
      setLoading(false);
    } catch {
      alert("データ取得に失敗しました");
      router.push("/");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) { router.push("/"); return; }
      loadSchools(user);
    });
    return () => unsubscribe();
  }, []);

  const handleCreate = async () => {
    if (!newSchoolName.trim()) return;
    const user = auth.currentUser;
    if (!user) return;
    setAdding(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/admin/schools`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + idToken },
        body: JSON.stringify({ school_name: newSchoolName.trim() }),
      });
      if (!res.ok) throw new Error();
      const created: School = await res.json();
      setSchools((prev) => [...prev, created]);
      setNewSchoolName("");
    } catch {
      alert("学校の追加に失敗しました");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`「${name}」を削除しますか？`)) return;
    const user = auth.currentUser;
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/admin/schools/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + idToken },
      });
      if (!res.ok) throw new Error();
      setSchools((prev) => prev.filter((s) => s.ID !== id));
    } catch {
      alert("削除に失敗しました");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push("/adminpage")}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            ← 戻る
          </button>
          <h1 className="text-xl font-bold text-gray-800">学校管理</h1>
          <span className="ml-auto text-sm text-gray-500">{schools.length} 件</span>
        </div>

        {/* 追加フォーム */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <p className="text-sm font-semibold text-gray-600 mb-3">学校を追加</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="学校名を入力"
              value={newSchoolName}
              onChange={(e) => setNewSchoolName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleCreate}
              disabled={adding || !newSchoolName.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adding ? "追加中..." : "追加"}
            </button>
          </div>
        </div>

        {/* 学校一覧テーブル */}
        {schools.length === 0 ? (
          <p className="text-center text-gray-400 py-12">学校が登録されていません</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold w-12">ID</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold">学校名</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold hidden sm:table-cell">作成日</th>
                  <th className="px-4 py-3 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {schools.map((s, i) => (
                  <tr
                    key={s.ID}
                    className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}
                  >
                    <td className="px-4 py-3 text-gray-400 text-xs">{s.ID}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{s.SchoolName}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                      {new Date(s.CreatedAt).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(s.ID, s.SchoolName)}
                        className="px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 transition"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
