"use client"; // Next.js 13 appディレクトリの場合
import { useState, useEffect } from "react";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { GoogleAuthProvider } from "firebase/auth";
import { getAuth,onAuthStateChanged, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, reload } from "firebase/auth";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { sign } from "crypto";
// import { useRouter } from 'next/router';
import { useRouter } from 'next/navigation';

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

export default function Main() {

  const auth = getAuth();
  const user = auth.currentUser;

  // const [fetchData, setFetchData] = useState({});
  // let topicdata ;

  const router = useRouter();

  // const [data, setData] = useState<Record<string, any> | null>(null);
  // const [results, setResults] = useState<Record<string, any> | null>(null);

  type Topic = {
    ID: number;
    Year: number;
    UserID: number;
    TopicName: string;
    Content: string;
    Activate: boolean;
    Alert: boolean;
    CreatedAt: string;  // time.Time → stringで来る
    UpdatedAt: string;
  };

const [results, setResults] = useState<Topic[]>([]);

  async function fetchtopicdata() {
    try {
      const response = await fetch("http://localhost:8080/topics", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // HTTPステータスチェック
      if (!response.ok) {
        console.error(`HTTPエラー: ${response.status} ${response.statusText}`);
        return;
      }

      console.log("トピックデータの取得に成功");
      console.log(response);

      // const result = await response.json();
      // console.log("取得したトピックデータをjsonに変換");
      // console.log(result);

      const result = await response.json();
      setResults(result.topics); // ←ここ重要

      // setData(result);
      // setResults(result);

      console.log("データの一部を取り出し");
      console.log(result.topics[0]);

    } catch (error) {
      console.error("トピックデータの取得中にエラーが発生しました:", error);
    }
  }

  useEffect(() => {
      fetchtopicdata();
  }, []);



  const [topicName, setTopicName] = useState("");
  const [topicContent, setTopicContent] = useState("");

  async function sendinfo() {
    try {
      // 現在のユーザーのトークンを取得

      const auth = getAuth();
      const user = auth.currentUser;


      if (!user) {
        console.error("ユーザーがログインしていません");
        return;
      }

      const idToken = await user.getIdToken();
      console.log("現在のユーザーのIDトークン:", idToken);

      // POST リクエスト送信
      const response = await fetch("http://localhost:8080/topiccontent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: topicName, content: topicContent, token: idToken }),
      });

      // HTTP ステータスチェック
      if (!response.ok) {
        console.error(`HTTPエラー: ${response.status} ${response.statusText}`);
        return;
      }

      // レスポンスを JSON として取得
      const data = await response.json();
      console.log("トピックの送信に成功");
      console.log(data);

      // 必要であればページリロード
      window.location.reload();

    } catch (error) {
      // トークン取得や fetch エラーをキャッチ
      console.error("送信中にエラーが発生しました:", error);
    }
  }

  function road_to_topic(id : String) {

    router.push('/srccode/topiccontents/' + id);
  }


  return (
    <div>
      <h2>トピックの作成はこちら</h2>
        {/* <form  className="signup" method="POST"> */}
        <div></div>
        <form
            className="signup"
            onSubmit={async (e) => {
              e.preventDefault();
              await sendinfo();
            }}
          >
          <input
            type="text"
            name="topicname"
            placeholder="トピック名"
            value={topicName}
            onChange={(e)=>setTopicName(e.target.value)}
          />
          <input
            type="text"
            name="topiccontent"
            placeholder="内容"
            value={topicContent}
            onChange={(e)=>setTopicContent(e.target.value)}
          />
        <button type="submit">トピックの作成</button>
      </form>

      <div>
      {/* <button onClick={fetchData}>取得</button> */}


        <div>
          <div>テスと</div>
          {/* {Object.entries(data).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong>{" "}
              {typeof value === "object"
                ? JSON.stringify(value)
                : String(value)}
            </div>
          ))} */}
          {/* {results.map((topic) => (
            <div key={topic.id}>
              <h3>{topic.name}</h3>
              <p>{topic.content}</p>
            </div>
          ))} */}
          <div>
  <h2>トピック一覧</h2>

            {results.length === 0 ? (
              <p>まだ投稿がありません</p>
            ) : (
              results.map((topic) => (
                <div
                  key={topic.ID}
                  style={{
                    border: "1px solid gray",
                    margin: "10px",
                    padding: "10px",
                  }}
                >
                  <button className={String(topic.ID)} onClick={() => road_to_topic(String(topic.ID))}>
                    <h3>{topic.TopicName}</h3>
                    <p>{topic.Content}</p>

                    <small>作成者ID: {topic.UserID}</small>
                    <br />
                    <small>
                      作成日: {new Date(topic.CreatedAt).toLocaleString()}
                    </small>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        </div>
      <div>
    </div>
    </div>
  )
}