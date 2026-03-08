




// 動いた。ボタンがちゃんと表示される
"use client"
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useRouter } from "next/navigation";

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

type AddContentRequest = {
  groupId: number;
  contentName: string;
  content: string;
  idToken: string;
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
  schoolId: number;
  createdAt: string;
  updatedAt: string;
  groupName: string; // 追加
  contents: GroupContent[];
};

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [fetchingGroups, setFetchingGroups] = useState(true);
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [contentInputs, setContentInputs] = useState<{ [groupId: number]: { name: string; content: string } }>({});
  const [backendSchoolId, setBackendSchoolId] = useState<number | null>(null);
  const [loginUserId, setLoginUserId] = useState<number | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editingGroupName, setEditingGroupName] = useState("");

  type EditGroupRequest = {
    groupId: number;
    groupName: string;
    idToken: string;
  };

  const auth = getAuth();
  const router = useRouter();

  // Firebase currentUser を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // URL の最後の数字から schoolId を取得
  useEffect(() => {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    const parsedId = parseInt(lastPart, 10);
    if (!isNaN(parsedId)) setSchoolId(parsedId);
  }, []);

  // グループ取得
  const fetchGroups = async () => {
    if (!schoolId || !currentUser) return;

    setFetchingGroups(true);

    try {
      const idToken = await currentUser.getIdToken();

      const res = await fetch("http://localhost:8080/getgroups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupID: schoolId,
          idToken: idToken,
        }),
      });

      const data = await res.json();
      if (!data.all_groups) {
        setGroups([]);
        setBackendSchoolId(data.schoolID || null);
        return;
      }

      setLoginUserId(data.userID);   // ← 追加

      if (!data.all_groups) {
        setGroups([]);
        setBackendSchoolId(data.schoolID || null);
        return;
      }

      setBackendSchoolId(data.schoolID || null);

      const groupedData: GroupItem[] = data.all_groups.map((g: any) => ({
        id: g.group.ID,
        userId: g.group.UserID,
        schoolId: g.group.SchoolID,
        createdAt: g.group.CreatedAt,
        updatedAt: g.group.UpdatedAt,
        groupName: g.group.Groupname, // ここでグループ名をセット
        contents: g.contents
          ? g.contents.map((c: any) => ({
              id: c.ID,
              content: c.Content,
              contentName: c.GroupContentsName,
              userId: c.UserID
            }))
          : []
      }));
      setGroups(groupedData);
      console.log(groupedData)
    } catch (err: any) {
      console.error("グループ取得エラー:", err);
      alert(`グループ取得エラー: ${err.message}`);
    } finally {
      setFetchingGroups(false);
    }
  };

  useEffect(() => {
    if (!schoolId) return;
    fetchGroups();
  }, [schoolId, currentUser]);

  const handleSubmitGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !groupName || !schoolId) return;

    setLoading(true);
    try {
      const idToken = await currentUser.getIdToken();
      const payload: MakeGroupRequest = { groupName, idToken, schoolId };
      const res = await fetch("http://localhost:8080/makegroup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("グループ作成に失敗");
      await res.json();
      alert("グループ作成成功！");
      setGroupName("");
      fetchGroups();
    } catch (err: any) {
      console.error(err);
      alert(`エラー: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGroup = async (groupId: number) => {
  if (!currentUser) return;

  try {
    const idToken = await currentUser.getIdToken();

    const payload: EditGroupRequest = {
      groupId: groupId,
      groupName: editingGroupName,
      idToken: idToken
    };

    const res = await fetch("http://localhost:8080/editgroup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error("グループ編集に失敗しました");
    }

      const data = await res.json();
      console.log("編集成功:", data);

      alert("グループ名を更新しました");

      setEditingGroupId(null);

      // 最新データ再取得
      fetchGroups();

    } catch (err: any) {
      console.error(err);
      alert(`エラー: ${err.message}`);
    }
  };

  const handleAddContent = async (groupId: number) => {

    router.push(`/srccode/makeSchoolTopic/${groupId}`);
  };



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


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl">

        <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">
          グループ作成画面
        </h2>

        {!currentUser && (
          <button
            onClick={signInWithGoogle}
            className="block mx-auto mb-8 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Googleでログイン
          </button>
        )}

        {currentUser && backendSchoolId === schoolId && (
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
                {editingGroupId === g.id ? (
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

                <p className="text-blue-600 mb-1">ユーザーID: {g.userId}</p>
                <p className="text-blue-600 mb-1">学校ID: {g.schoolId}</p>
                <p className="text-blue-600 mb-2">
                  作成日時: {new Date(g.createdAt).toLocaleString()}
                </p>

                <div className="flex gap-3 flex-wrap mb-4">
                  {loginUserId === g.userId && editingGroupId !== g.id && (
                    <button
                      onClick={() => { setEditingGroupId(g.id); setEditingGroupName(g.groupName); }}
                      className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                    >
                      編集
                    </button>
                  )}

                  {backendSchoolId === schoolId && (
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
                          onClick={() => router.push(`/srccode/see_school_topic/${c.id}`)}
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
      </div>
    </div>
  );
}










