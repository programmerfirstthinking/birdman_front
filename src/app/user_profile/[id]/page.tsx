"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebaseconfig/firebase";
import { API_BASE_URL } from "../../api/api";

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

type UserProfile = {
  id: number;
  name: string;
  school_name: string | null;
  introduce: string | null;
};

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/signup");
        return;
      }
      if (!id) {
        setLoading(false);
        return;
      }
      fetch(`${API_BASE_URL}/user_profile/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("ユーザーが見つかりません");
          return res.json();
        })
        .then((data: UserProfile) => {
          setProfile(data);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    });
    return () => unsubscribe();
  }, [id, router]);

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
            <p className="text-blue-800">{profile.school_name ?? "未設定"}</p>
          </div>

          <div>
            <p className="text-xs text-blue-500 mb-1">自己紹介</p>
            <p className="text-blue-800 whitespace-pre-line">
              {profile.introduce ?? "未設定"}
            </p>
          </div>
        </div>

        <button
          onClick={() => window.history.back()}
          className="mt-8 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition"
        >
          ← 戻る
        </button>
      </div>
    </div>
  );
}
