





"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { initializeApp,getApp,getApps } from "firebase/app";
import { firebaseConfig } from "../firebaseconfig/firebase";
import { API_BASE_URL } from "../api/api";
import useSWR from "swr";

// ----------------------
// Firebase 初期化
// ----------------------
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// ----------------------
// 型定義
// ----------------------
type School = {
  ID: number;
  SchoolName: string;
  CreatedAt: string | null;
  UpdatedAt: string | null;
};

type Topic = {
  ID: number;
  Year: number;
  UserID: number;
  TopicName: string;
  Content: string;
  Activate: boolean;
  Alert: boolean;
  CreatedAt: string | null;
  UpdatedAt: string | null;
};

// ----------------------
// SWR fetcher
// ----------------------
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
};

// ----------------------
// Main Component
// ----------------------
export default function Main() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false); // Firebase が auth 状態を確定するまで false
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

  // ✅ 学校一覧（キャッシュされる）
  const { data: schoolData, isLoading: loadingSchools } = useSWR(
    `${API_BASE_URL}/getSchools`,
    fetcher
  );
  const schools: School[] = schoolData?.schools ?? [];

  // ✅ トピック一覧（キャッシュされる）
  const { data: topicData, isLoading: loadingTopics, mutate } = useSWR(
    `${API_BASE_URL}/topics?page=${currentPage}`,
    fetcher
  );
  const results: Topic[] = topicData?.topics ?? [];
  const totalPages = Math.max(topicData?.totalPages ?? 1, 1);

  // ----------------------
  // UI State
  // ----------------------
  const [topicName, setTopicName] = useState("");
  const [topicContent, setTopicContent] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSchoolMenu, setShowSchoolMenu] = useState(false);
  const [showRightMenu, setShowRightMenu] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const MAX_TOPIC_NAME_LENGTH = 100;
  const MAX_TOPIC_CONTENT_LENGTH = 5000;

  // ----------------------
  // ページネーション
  // ----------------------
  

  const displayedTopics = results;

  // ----------------------
  // routing
  // ----------------------
  const road_to_topic = (id: string) => router.push("/topiccontents/" + id);
  const road_to_school = (id: number) => router.push("/school_topic/" + id);


    const sendinfo = async () => {
    if (isSubmitting) return; // ← 連打防止

    setIsSubmitting(true);

    try {
      const user: User | null = auth.currentUser;
      if (!user) {
        alert("ログインしてください");
        return;
      }

      const trimmedTopicName = topicName.trim();
      const trimmedTopicContent = topicContent.trim();

      if (!trimmedTopicName || !trimmedTopicContent) {
        alert("トピック名と内容を入力してください");
        return;
      }

      if (trimmedTopicName.length > MAX_TOPIC_NAME_LENGTH) {
        alert(`トピック名は ${MAX_TOPIC_NAME_LENGTH} 文字以内で入力してください`);
        return;
      }

      if (trimmedTopicContent.length > MAX_TOPIC_CONTENT_LENGTH) {
        alert(`内容は ${MAX_TOPIC_CONTENT_LENGTH} 文字以内で入力してください`);
        return;
      }

      const idToken = await user.getIdToken();

      const res = await fetch(`${API_BASE_URL}/topiccontent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name: trimmedTopicName,
          content: trimmedTopicContent,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.error || errData.message || "トピック投稿失敗"
        );
      }

      await mutate(undefined, { revalidate: true });

      setTopicName("");
      setTopicContent("");
      setShowCreateForm(false);

    } catch (err) {
      console.error("送信エラー:", err);
      alert("トピック投稿に失敗しました");
    } finally {
      setIsSubmitting(false); // ← 必ず戻す
    }
  };

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // Firebase が auth 状態を確認するまでローディング表示（キャッシュ由来の誤表示を防ぐ）
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6 flex items-center justify-center">
        <p className="text-blue-700">読み込み中...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-2xl p-8 flex flex-col items-center gap-4">
          <p className="text-blue-700">ログインしていません</p>
          <button
            onClick={() => router.push("/signup")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            ログインする
          </button>
        </div>
      </div>
    );
  }

    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
      <div className="max-w-7xl mx-auto md:hidden mb-4">
        <div className="grid grid-cols-3 gap-2">
          <button
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold"
            onClick={() => setShowSchoolMenu(prev => !prev)}
          >
            {showSchoolMenu ? "学校一覧を閉じる ✕" : "学校一覧 ☰"}
          </button>

          <button
            className="w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold"
            onClick={() => setShowCreateForm(prev => !prev)}
          >
            知恵袋を作成
          </button>

          <button
            className="w-full bg-slate-700 text-white py-3 rounded-lg font-semibold"
            onClick={() => setShowRightMenu(prev => !prev)}
          >
            {showRightMenu ? "メニューを閉じる ✕" : "メニュー ☰"}
          </button>
        </div>

        {showRightMenu && (
          <div className="mt-3 bg-white shadow-xl rounded-2xl p-4 flex flex-col gap-3">
            <button
              className="bg-green-500 text-white py-3 rounded-lg"
              onClick={() => router.push("/schools")}
            >
              学校一覧
            </button>

            <button
              className="bg-red-500 text-white py-3 rounded-lg"
              onClick={() => router.push("/how_to_use")}
            >
              使い方
            </button>

            <button
              className="bg-pink-500 text-white py-3 rounded-lg"
              onClick={() => router.push("/mypage")}
            >
              マイページへ
            </button>
          </div>
        )}

        {showSchoolMenu && (
          <aside className="mt-3 bg-white shadow-xl rounded-2xl p-4 max-h-[70vh] overflow-y-auto hide-scrollbar">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
              学校一覧
            </h2>

            {loadingSchools ? (
              <p className="text-center text-blue-600">読み込み中...</p>
            ) : schools.length === 0 ? (
              <p className="text-center text-blue-600">
                学校が登録されていません
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {schools.map(school => (
                  <button
                    key={school.ID}
                    onClick={() => road_to_school(school.ID)}
                    className="bg-white shadow-md hover:shadow-lg rounded-xl p-3 text-left text-blue-800 border border-blue-200 hover:bg-blue-50"
                  >
                    <div className="text-xl font-semibold">
                      {school.SchoolName}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </aside>
        )}
      </div>

      <div className="max-w-7xl mx-auto flex gap-6">

        {/* ---------------- サイドバー ---------------- */}
        <aside className="hidden md:block w-1/5 bg-white shadow-xl rounded-2xl p-4 sticky top-6 h-[90vh] overflow-y-auto hide-scrollbar">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
            学校一覧
          </h2>

          {loadingSchools ? (
            <p className="text-center text-blue-600">読み込み中...</p>
          ) : schools.length === 0 ? (
            <p className="text-center text-blue-600">
              学校が登録されていません
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {schools.map(school => (
                <button
                  key={school.ID}
                  onClick={() => road_to_school(school.ID)}
                  className="bg-white shadow-md hover:shadow-lg rounded-xl p-3 text-left text-blue-800 border border-blue-200 hover:bg-blue-50"
                >
                  <div className="text-xl font-semibold">
                    {school.SchoolName}
                  </div>
                  {/* <div className="text-sm text-blue-400 mt-1">
                    作成日:
                    {school.CreatedAt
                      ? new Date(school.CreatedAt).toLocaleDateString()
                      : "-"}
                  </div> */}
                </button>
              ))}
            </div>
          )}
        </aside>

        {/* ---------------- メイン ---------------- */}
        <main className="flex-1 flex gap-6">
          <div className="flex-1 flex flex-col gap-10">

            {/* 作成フォーム */}
            {showCreateForm && (
              <div className="bg-white shadow-xl rounded-2xl p-8 max-w-3xl mx-auto w-full">
                <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                  新しい知恵袋を作成
                </h2>

                <form
                  className="flex flex-col gap-4"
                  onSubmit={e => {
                    e.preventDefault();
                    sendinfo();
                  }}
                >
                  <input
                    type="text"
                    placeholder="トピック名"
                    value={topicName}
                    onChange={e => setTopicName(e.target.value)}
                    className="border rounded-lg p-3"
                  />

                  <textarea
                    placeholder="内容"
                    value={topicContent}
                    onChange={e => setTopicContent(e.target.value)}
                    className="border rounded-lg p-3 h-28"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`py-3 rounded-lg text-white ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-500 hover:bg-indigo-600"
                    }`}
                  >
                    {isSubmitting ? "送信中..." : "投稿する"}
                  </button>
                </form>
              </div>
            )}

            {/* ---------------- トピック一覧 ---------------- */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                知恵袋一覧
              </h2>

              {loadingTopics ? (
                <p className="text-center text-gray-500">読み込み中...</p>
              ) : results.length === 0 ? (
                <p className="text-center text-gray-500">
                  まだ投稿がありません
                </p>
              ) : (
                <>
                  {/* 一覧 */}
                  <div className="flex flex-col gap-5">
                    {displayedTopics.map(topic => (
                      <div
                        key={topic.ID}
                        className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl"
                      >
                        <button
                          className="text-left w-full"
                          onClick={() =>
                            road_to_topic(String(topic.ID))
                          }
                        >
                          <h3 className="text-xl font-bold text-indigo-600">
                            {topic.TopicName}
                          </h3>
                          <p className="text-gray-700 mt-2 whitespace-pre-line">
                            {topic.Content}
                          </p>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* ⭐ ページネーション */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">

                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg font-semibold ${
                          currentPage === 1
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-indigo-500 text-white hover:bg-indigo-600"
                        }`}
                      >
                        ← 前へ
                      </button>

                      <span className="font-semibold text-gray-700">
                        {currentPage} / {totalPages}
                      </span>

                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg font-semibold ${
                          currentPage === totalPages
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-indigo-500 text-white hover:bg-indigo-600"
                        }`}
                      >
                        次へ →
                      </button>

                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ---------------- 右サイド ---------------- */}
          <div className="hidden md:flex w-1/6 bg-white shadow-xl rounded-2xl p-4 h-fit sticky top-6 flex-col gap-4">
            <button
              className="bg-indigo-500 text-white py-3 rounded-lg"
              onClick={() => setShowCreateForm(prev => !prev)}
            >
              知恵袋を作成
            </button>

            <div className="flex flex-col gap-4">
              <button
                className="bg-green-500 text-white py-3 rounded-lg"
                onClick={() => router.push("/schools")}
              >
                学校一覧
              </button>

              <button
                className="bg-red-500 text-white py-3 rounded-lg"
                onClick={() => router.push("/how_to_use")}
              >
                使い方
              </button>

              <button
                className="bg-pink-500 text-white py-3 rounded-lg"
                onClick={() => router.push("/mypage")}
              >
                マイページへ
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}