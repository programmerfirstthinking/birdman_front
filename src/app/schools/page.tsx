





"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getApp, getApps, initializeApp } from "firebase/app";
import useSWR from "swr";
import { API_BASE_URL } from "../api/api";
import { firebaseConfig } from "../firebaseconfig/firebase";

// ----------------------
// 型定義
// ----------------------
type Group = {
  ID: number;
  UserID: number;
  SchoolID: number;
  Groupname: string;
  CreatedAt: string;
  UpdatedAt: string;
};

type SchoolWithGroups = {
  id: number;
  school_name: string;
  groups: Group[];
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// ----------------------
// fetcher
// ----------------------
const fetcher = (url: string) =>
  fetch(url).then(res => {
    if (!res.ok) throw new Error("APIエラー");
    return res.json();
  });

// ----------------------
// Page
// ----------------------
export default function SchoolsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [authChecked, setAuthChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window === "undefined") {
      return 1;
    }

    const params = new URLSearchParams(window.location.search);
    const pageFromUrl = Number(params.get("page") ?? "1");
    return Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);

    if (currentPage === 1) {
      params.delete("page");
    } else {
      params.set("page", String(currentPage));
    }

    const query = params.toString();
    const nextUrl = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname;

    window.history.replaceState(null, "", nextUrl);
  }, [currentPage]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  // ✅ SWRで取得（自動キャッシュ）
  const { data, isLoading, error } = useSWR(
    `${API_BASE_URL}/schools-with-groups`,
    fetcher
  );

  const schools: SchoolWithGroups[] = data?.schools ?? [];
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(schools.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSchools = schools.slice(startIndex, startIndex + itemsPerPage);

  // ----------------------
  // routing
  // ----------------------
  function handleSchoolClick(id: number) {
    router.push(`/school_topic/${id}`);
  }

  // ----------------------
  // loading
  // ----------------------
  if (isLoading) {
    return (
      <p className="text-center mt-10">
        読み込み中...
      </p>
    );
  }

  // ----------------------
  // error
  // ----------------------
  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        データ取得に失敗しました
      </p>
    );
  }

  // ----------------------
  // JSX
  // ----------------------
  if (authChecked && !currentUser) {
    return (
      <div className="min-h-screen bg-blue-100 p-6 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-2xl p-8 flex flex-col items-center gap-4">
          <p className="text-blue-700">ログインしていません</p>
          <button
            onClick={() => router.push("/signup")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            signupページへ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-100 p-6">

      {/* 戻るボタン */}
      <div className="w-full flex justify-start">
        <button
          onClick={() => router.push("/topic")}
          className="mb-6 px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          ← ホームに戻る
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-10 text-blue-800">
        学校とグループ一覧
      </h1>

      <div className="w-full max-w-3xl flex flex-col gap-6">
        {schools.length === 0 ? (
          <p className="text-blue-600 text-center">
            学校が登録されていません
          </p>
        ) : (
          <>
            {paginatedSchools.map((school) => (
              <div
                key={school.id}
                onClick={() => handleSchoolClick(school.id)}
                className="bg-white p-5 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition hover:bg-blue-50"
              >
                <h2 className="text-2xl font-semibold text-blue-700 mb-3">
                  {school.school_name}
                </h2>

                {(school.groups?.length ?? 0) === 0 ? (
                  <p className="text-blue-400">
                    この学校にはグループがありません
                  </p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {school.groups.map((group) => (
                      <li
                        key={group.ID}
                        className="p-3 bg-blue-50 rounded-md border border-blue-200"
                      >
                        {group.Groupname}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {schools.length > itemsPerPage && (
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  前へ
                </button>

                <span className="text-blue-800 font-semibold">
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  次へ
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}