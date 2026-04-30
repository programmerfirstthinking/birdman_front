"use client";

import { useEffect, useState } from "react";
import { getApps, initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { firebaseConfig } from "../../firebaseconfig/firebase";
import { API_BASE_URL } from "../../api/api";

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

type User = {
  ID: number;
  Name: string;
  SchoolID: number | null;
  Nandai: string | null;
  Image: string | null;
  Introduce: string | null;
  Twitter: string | null;
  Uuid: string;
  CreatedAt: string;
  UpdatedAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newSchoolID, setNewSchoolID] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const loadUsers = async (user: any) => {
    try {
      const idToken = await user.getIdToken();
      const checkRes = await fetch(`${API_BASE_URL}/admin/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + idToken },
      });
      const checkData = await checkRes.json();
      if (!checkData.isAdmin) { alert("管理者権限がありません"); router.push("/"); return; }

      const res = await fetch(`${API_BASE_URL}/getAllUsers`, {
        method: "POST",
        headers: { Authorization: "Bearer " + idToken },
      });
      setUsers(await res.json());
    } catch {
      alert("ユーザー一覧取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      setCurrentUser(user);
      loadUsers(user);
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateSchoolID = async (id: number) => {
    if (!currentUser) return;
    try {
      const idToken = await currentUser.getIdToken();
      const res = await fetch(`${API_BASE_URL}/updateUserSchoolID`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + idToken },
        body: JSON.stringify({ id, school_id: newSchoolID }),
      });
      if (!res.ok) throw new Error();
      const updated: User = await res.json();
      setUsers((prev) => prev.map((u) => (u.ID === updated.ID ? updated : u)));
      setEditingId(null);
      setNewSchoolID(null);
    } catch {
      alert("更新に失敗しました");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!currentUser) return;
    if (!confirm(`「${name}」を削除しますか？この操作は取り消せません。`)) return;
    try {
      const idToken = await currentUser.getIdToken();
      const res = await fetch(`${API_BASE_URL}/deleteUser/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + idToken },
      });
      if (!res.ok) throw new Error();
      setUsers((prev) => prev.filter((u) => u.ID !== id));
    } catch {
      alert("削除に失敗しました");
    }
  };

  const filtered = search.trim()
    ? users.filter(
        (u) =>
          u.Name.toLowerCase().includes(search.toLowerCase()) ||
          String(u.ID).includes(search)
      )
    : users;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push("/adminpage")}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            ← 戻る
          </button>
          <h1 className="text-xl font-bold text-gray-800">ユーザー管理</h1>
          <span className="ml-auto text-sm text-gray-500">{filtered.length} / {users.length} 件</span>
        </div>

        {/* 検索 */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="名前またはIDで検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* ユーザー一覧 */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-12">ユーザーが見つかりません</p>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((user) => (
              <div
                key={user.ID}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-4"
              >
                {/* 上段: 名前・ID・プロフィールリンク */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <button
                      onClick={() => router.push(`/user_profile/${user.ID}`)}
                      className="text-base font-bold text-blue-700 hover:underline text-left"
                    >
                      {user.Name}
                    </button>
                    <p className="text-xs text-gray-400 mt-0.5">ID: {user.ID}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(user.ID, user.Name)}
                    className="px-3 py-1 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition shrink-0"
                  >
                    削除
                  </button>
                </div>

                {/* 詳細情報グリッド */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm mb-3">
                  {/* 学校ID（編集可能） */}
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-xs text-gray-400 mb-1">学校ID</p>
                    {editingId === user.ID ? (
                      <div className="flex gap-1 items-center">
                        <input
                          type="number"
                          value={newSchoolID ?? ""}
                          onChange={(e) => setNewSchoolID(e.target.value ? Number(e.target.value) : null)}
                          className="w-20 px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                        <button
                          onClick={() => handleUpdateSchoolID(user.ID)}
                          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                          保存
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setNewSchoolID(null); }}
                          className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 transition"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700">{user.SchoolID ?? "—"}</span>
                        <button
                          onClick={() => { setEditingId(user.ID); setNewSchoolID(user.SchoolID); }}
                          className="px-2 py-0.5 text-xs text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition"
                        >
                          編集
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-1">年代</p>
                    <p className="text-gray-700">{user.Nandai ?? "—"}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-1">Twitter</p>
                    {user.Twitter ? (
                      <a
                        href={`https://twitter.com/${user.Twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        @{user.Twitter}
                      </a>
                    ) : (
                      <p className="text-gray-700">—</p>
                    )}
                  </div>

                  <div className="col-span-2 sm:col-span-3">
                    <p className="text-xs text-gray-400 mb-1">自己紹介</p>
                    <p className="text-gray-700 text-xs leading-relaxed line-clamp-2">
                      {user.Introduce ?? "—"}
                    </p>
                  </div>
                </div>

                {/* フッター: 日付・UUID */}
                <div className="border-t border-gray-100 pt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                  <span>登録: {new Date(user.CreatedAt).toLocaleDateString("ja-JP")}</span>
                  <span className="hidden sm:inline truncate max-w-xs">UUID: {user.Uuid}</span>
                  {user.Image && (
                    <a href={user.Image} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      画像
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
