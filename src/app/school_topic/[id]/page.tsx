









"use client"
import { useState, useEffect } from "react";
import useSWR from "swr";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useRouter } from "next/navigation";
import { firebaseConfig } from "../../firebaseconfig/firebase";
import { API_BASE_URL } from "../../api/api";

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

type MakeGroupRequest = {
  groupName: string;
};

type AddContentRequest = {
  groupId: number;
  contentName: string;
  content: string;
};

type GroupContent = {
  id: number;
  content: string;
  contentName: string;
  userId: number;
};

type GroupItem = {
  id: number;
  userId: number;
  ownerName: string;
  schoolId: number;
  createdAt: string;
  updatedAt: string;
  groupName: string;
  contents: GroupContent[];
};

type EditGroupRequest = {
  groupId: number;
  groupName: string;
};

//////////////////////////////////////////////////////
// SWR fetcher（fetchGroups をそのまま移植）
//////////////////////////////////////////////////////

const fetchGroupsFetcher = async (
  schoolId: number,
  currentUser: any
) => {
  const idToken = await currentUser.getIdToken();

  const res = await fetch(`${API_BASE_URL}/getgroups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      groupID: schoolId,
    }),
  });

  const data = await res.json();

  if (!data.all_groups) {
    return {
      groups: [],
      backendSchoolId: data.schoolID || null,
      loginUserId: data.userID ?? null,
    };
  }

  const groupedData: GroupItem[] = data.all_groups.map((g: any) => ({
    id: g.group.ID,
    userId: g.group.UserID,
    ownerName: g.ownerName || "",
    schoolId: g.group.SchoolID,
    createdAt: g.group.CreatedAt,
    updatedAt: g.group.UpdatedAt,
    groupName: g.group.Groupname,
    contents: g.contents
      ? g.contents.map((c: any) => ({
          id: c.ID,
          content: c.Content,
          contentName: c.GroupContentsName,
          userId: c.UserID,
        }))
      : [],
  }));

  return {
    groups: groupedData,
    backendSchoolId: data.schoolID || null,
    loginUserId: data.userID ?? null,
    isAdmin: data.is_admin === true,
  };
};

//////////////////////////////////////////////////////

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [contentInputs, setContentInputs] = useState<{ [groupId: number]: { name: string; content: string } }>({});
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editingGroupName, setEditingGroupName] = useState("");

  const auth = getAuth();
  const router = useRouter();

  //////////////////////////////////////////////////////
  // Firebase currentUser を監視（変更なし）
  //////////////////////////////////////////////////////

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  //////////////////////////////////////////////////////
  // URL から schoolId（変更なし）
  //////////////////////////////////////////////////////

  useEffect(() => {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    const parsedId = parseInt(lastPart, 10);
    if (!isNaN(parsedId)) setSchoolId(parsedId);
  }, []);

  //////////////////////////////////////////////////////
  // ⭐ SWR（fetchGroups → SWR化）
  //////////////////////////////////////////////////////

  const { data, error, isLoading, mutate } = useSWR(
    schoolId && currentUser
      ? ["groups", schoolId, currentUser.uid]
      : null,
    () => fetchGroupsFetcher(schoolId!, currentUser)
  );

  const groups = data?.groups ?? [];
  const backendSchoolId = data?.backendSchoolId ?? null;
  const loginUserId = data?.loginUserId ?? null;
  const isAdmin = data?.isAdmin ?? false;
  const fetchingGroups = isLoading;
  const canManageCurrentSchool =
    backendSchoolId !== null && schoolId !== null && backendSchoolId === schoolId;

  //////////////////////////////////////////////////////
  // グループ作成（mutate追加のみ）
  //////////////////////////////////////////////////////

  const handleSubmitGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !groupName || !schoolId) return;

    setLoading(true);
    try {
      const idToken = await currentUser.getIdToken();
      const payload: MakeGroupRequest = { groupName };

      const res = await fetch(`${API_BASE_URL}/makegroup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("グループ作成に失敗");

      await res.json();
      alert("グループ作成成功！");
      setGroupName("");

      await mutate();
    } catch (err: any) {
      console.error(err);
      alert(`エラー: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  //////////////////////////////////////////////////////
  // グループ編集（mutate追加のみ）
  //////////////////////////////////////////////////////

  const handleSaveGroup = async (groupId: number) => {
    if (!currentUser) return;

    try {
      const idToken = await currentUser.getIdToken();

      const payload: EditGroupRequest = {
        groupId: groupId,
        groupName: editingGroupName,
      };

      const res = await fetch(`${API_BASE_URL}/editgroup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("グループ編集に失敗しました");
      }

      const data = await res.json();
      console.log("編集成功:", data);

      alert("グループ名を更新しました");

      setEditingGroupId(null);

      await mutate();
    } catch (err: any) {
      console.error(err);
      alert(`エラー: ${err.message}`);
    }
  };

  //////////////////////////////////////////////////////
  // 追加（変更なし）
  //////////////////////////////////////////////////////

  const handleAddContent = async (groupId: number) => {
    if (!schoolId) {
      alert("schoolId が取得できませんでした");
      return;
    }
    router.push(`/makeSchoolTopic/${groupId}?schoolId=${schoolId}`);
  };

  //////////////////////////////////////////////////////
  // Google Login（変更なし）
  //////////////////////////////////////////////////////

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setCurrentUser(result.user);
      alert("Googleサインイン成功");
    } catch (err: any) {
      console.error(err);
      alert(`Googleサインインエラー: ${err.message}`);
    }
  };

  //////////////////////////////////////////////////////
  // UI（完全未変更）
  //////////////////////////////////////////////////////

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl">

        <div className="w-full flex justify-start">
          <button
            onClick={() => router.push("/topic")}
            className="mb-6 px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            ← ホームに戻る
          </button>
        </div>

        <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">
          グループ作成画面
        </h2>

        {!currentUser ? (
          <div className="flex flex-col items-center gap-4 mb-8">
            <p className="text-center text-blue-700">ログインしてください</p>
            <button
              onClick={() => router.push("/signup")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              signupページへ
            </button>
          </div>
        ) : (
          <>
            {canManageCurrentSchool && (
              <form onSubmit={handleSubmitGroup} className="flex gap-4 mb-8">
                <input
                  type="text"
                  placeholder="グループ名を入力"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                  className="flex-1 p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-3 rounded-lg text-white font-semibold ${
                    loading ? "bg-blue-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                  } transition`}
                >
                  {loading ? "作成中..." : "グループ作成"}
                </button>
              </form>
            )}

            <h3 className="text-2xl font-semibold text-blue-700 mb-6">
              全グループ一覧
            </h3>

            {fetchingGroups ? (
              <p className="text-center text-blue-500">読み込み中...</p>
            ) : groups.length === 0 ? (
              <p className="text-center text-blue-500">まだグループはありません</p>
            ) : (
              <div className="flex flex-col gap-6">
                {groups.map((g) => (
                  <div
                    key={g.id}
                    className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition"
                  >
                    {editingGroupId === g.id && (isAdmin || (canManageCurrentSchool && loginUserId === g.userId)) ? (
                      <div className="flex gap-3 mb-4">
                        <input
                          type="text"
                          value={editingGroupName}
                          onChange={(e) => setEditingGroupName(e.target.value)}
                          className="flex-1 p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                          onClick={() => handleSaveGroup(g.id)}
                          className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                          保存
                        </button>
                      </div>
                    ) : (
                      <h4 className="text-xl font-semibold text-blue-800 mb-2">
                        グループ名: {g.groupName}
                      </h4>
                    )}

                    {/* <p className="text-blue-600 mb-1">ユーザーID: {g.userId}</p>
                    <p className="text-blue-600 mb-1">学校ID: {g.schoolId}</p> */}
                    <p className="text-blue-600 mb-1">作成者: {g.ownerName || `ID:${g.userId}`}</p>
                    <p className="text-blue-600 mb-2">
                      作成日時: {new Date(g.createdAt).toLocaleString()}
                    </p>

                    <div className="flex gap-3 flex-wrap mb-4">
                      {/* {loginUserId === g.userId && editingGroupId !== g.id && (
                        <div>
                          <button
                            onClick={() => { setEditingGroupId(g.id); setEditingGroupName(g.groupName); }}
                            className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                          >
                            編集
                          </button>
                          <button>
                            削除
                          </button>
                        </div>
              
                      )} */}

                      {(isAdmin || (canManageCurrentSchool && loginUserId === g.userId)) && editingGroupId !== g.id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setEditingGroupId(g.id); setEditingGroupName(g.groupName); }}
                            className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                          >
                            編集
                          </button>

                          <button
                            onClick={async () => {
                              if (!currentUser) return;
                              if (!confirm("本当にこのグループを削除しますか？")) return;

                              try {
                                const idToken = await currentUser.getIdToken();
                                const res = await fetch(`${API_BASE_URL}/groups/${g.id}`, {
                                  method: "DELETE",
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${idToken}`, // 認証が必要なら
                                  },
                                });

                                if (!res.ok) {
                                  const errData = await res.json();
                                  console.error("削除失敗:", errData);
                                  alert(errData.error || "グループ削除に失敗しました");
                                  return;
                                }

                                alert("グループを削除しました");
                                await mutate(); // SWRで最新データに更新

                              } catch (err) {
                                console.error("削除エラー:", err);
                                alert("グループ削除に失敗しました");
                              }
                            }}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                          >
                            削除
                          </button>
                        </div>
                      )}

                      {canManageCurrentSchool && (
                        <button
                          onClick={() => handleAddContent(g.id)}
                          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                          追加
                        </button>
                      )}
                    </div>

                    {g.contents.length > 0 ? (
                      <div className="flex flex-col gap-3 pl-4">
                        {g.contents.map((c) => (
                          <div
                            key={c.id}
                            className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                          >
                            <p className="font-semibold text-blue-700">トピック: {c.contentName}</p>
                            <button
                              onClick={() => router.push(`/see_school_topic/${c.id}`)}
                              className="mt-2 px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                              詳しくみる
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-blue-500">コンテンツはありません</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}