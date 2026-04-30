"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebaseconfig/firebase";
import { API_BASE_URL } from "../../api/api";

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

type UserProfile = {
  id: number;
  name: string;
  school_name: string | null;
  school_id: number | null;
  introduce: string | null;
  is_admin: boolean;
  viewer_id: number;
};

type School = {
  ID: number;
  SchoolName: string;
};

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const [savingSchool, setSavingSchool] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        router.replace("/signup");
        return;
      }
      if (!id) {
        setLoading(false);
        return;
      }

      user.getIdToken().then((idToken) => {
        fetch(`${API_BASE_URL}/user_profile/${id}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        })
          .then((res) => {
            if (!res.ok) throw new Error("ユーザーが見つかりません");
            return res.json();
          })
          .then((data: UserProfile) => {
            setProfile(data);
            setSelectedSchoolId(data.school_id != null ? String(data.school_id) : "");
            if (data.is_admin) {
              fetch(`${API_BASE_URL}/schools_list`)
                .then((r) => r.json())
                .then((s: School[]) => setSchools(s))
                .catch(() => {});
            }
          })
          .catch((err) => setError(err.message))
          .finally(() => setLoading(false));
      });
    });
    return () => unsubscribe();
  }, [id, router]);

  const handleDelete = async () => {
    if (!profile || !currentUser) return;
    if (!confirm(`「${profile.name}」のアカウントを削除しますか？この操作は取り消せません。`)) return;

    setDeleting(true);
    try {
      const idToken = await currentUser.getIdToken();
      const res = await fetch(`${API_BASE_URL}/deleteUser/${profile.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "削除に失敗しました");
      }
      alert("ユーザーを削除しました");
      router.push("/topic");
    } catch (err: any) {
      alert(`エラー: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveSchool = async () => {
    if (!profile || !currentUser) return;
    setSavingSchool(true);
    try {
      const idToken = await currentUser.getIdToken();
      const schoolIdValue = selectedSchoolId !== "" ? Number(selectedSchoolId) : null;
      const res = await fetch(`${API_BASE_URL}/updateUserSchoolID`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ id: profile.id, school_id: schoolIdValue }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "更新に失敗しました");
      }
      const schoolName = schools.find((s) => s.ID === schoolIdValue)?.SchoolName ?? null;
      setProfile((prev) => prev ? { ...prev, school_name: schoolName, school_id: schoolIdValue } : prev);
      alert("学校を更新しました");
    } catch (err: any) {
      alert(`エラー: ${err.message}`);
    } finally {
      setSavingSchool(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
        <p className="text-blue-700">読み込み中...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
        <p className="text-red-600">{error ?? "エラーが発生しました"}</p>
      </div>
    );
  }

  const canManage = profile.is_admin && profile.viewer_id !== profile.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex flex-col items-center font-sans">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">ユーザープロフィール</h2>

        <div className="space-y-5">
          <div className="border-b border-blue-100 pb-4">
            <p className="text-xs text-blue-500 mb-1">名前</p>
            <p className="text-xl font-semibold text-blue-900">{profile.name}</p>
          </div>

          <div className="border-b border-blue-100 pb-4">
            <p className="text-xs text-blue-500 mb-1">学校</p>
            {canManage ? (
              <div className="flex gap-2 items-center mt-1">
                <select
                  value={selectedSchoolId}
                  onChange={(e) => setSelectedSchoolId(e.target.value)}
                  className="flex-1 p-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">未設定</option>
                  {schools.map((s) => (
                    <option key={s.ID} value={String(s.ID)}>{s.SchoolName}</option>
                  ))}
                </select>
                <button
                  onClick={handleSaveSchool}
                  disabled={savingSchool}
                  className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition disabled:opacity-50"
                >
                  {savingSchool ? "保存中..." : "変更"}
                </button>
              </div>
            ) : (
              <p className="text-blue-800">{profile.school_name ?? "未設定"}</p>
            )}
          </div>

          <div>
            <p className="text-xs text-blue-500 mb-1">自己紹介</p>
            <p className="text-blue-800 whitespace-pre-line">
              {profile.introduce ?? "未設定"}
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition"
          >
            ← 戻る
          </button>

          {canManage && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? "削除中..." : "ユーザーを削除"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
