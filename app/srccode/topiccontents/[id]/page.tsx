"use client";

import { ParamValue } from "next/dist/server/request/params";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth,onAuthStateChanged, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, reload } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCC3c0UgIJ9P9_BUXBLCw1GPPiHFwHvTrk",
  authDomain: "share-info-project.firebaseapp.com",
  projectId: "share-info-project",
  storageBucket: "share-info-project.firebasestorage.app",
  messagingSenderId: "10017220780",
  appId: "1:10017220780:web:4820d384929f2d84735709",
  measurementId: "G-42VYEZ51GF"
};


export default function Page() {
  const params = useParams();
  const id = params.id;


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
  
  const [results, setResults] = useState<Topic>();
  const [topic_comment, setTopicComment] = useState("");

  type Comment = {
  ID: number;
  UserID: number;
  TopicID: number;
  Content: string;
  CreatedAt: string;
};

const [comments, setComments] = useState<Comment[]>([]);

  const app = initializeApp(firebaseConfig);

  function GetTopicdata(id: ParamValue) {
    fetch(`http://localhost:8080/topic_comment_only/${id}`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("取得失敗");
        }
        return response.json();
      })
      .then((data) => {
        console.log("取得成功:", data.comments);
        setComments(data.comments);
      })
      .catch((error) => {
        console.error(error);
      });
  }



    useEffect(() => {
      if (id) {
        GetTopicdata(id);
      }
    }, [id]);

  async function sendinfo() {

      // const params = useParams();
      // const id = params.id;

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("ユーザーがログインしていません");
        return;
      }

      const idToken = await user.getIdToken();
      console.log("現在のユーザーのIDトークン:", idToken);


      const response = await fetch("http://localhost:8080/topic_comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topicId:id, topic_comment:topic_comment, token: idToken }),
      });


      if (!response.ok) {
        console.error(`HTTPエラー: ${response.status} ${response.statusText}`);
        return;
      }

      const data = await response.json();

      console.log("これがレスポンスです");
      console.log(data);
      console.log(data.comments);

      setComments(data.comments);




  }



  return (
    <div>
      <h1>URLの最後</h1>
      <h2>トピックの内容</h2>
      <div>
        <p>{id}</p>
        <div>{results?.ID}</div>
        <div>{results?.TopicName}</div>
        <div>{results?.Content}</div>

      </div>

      <div>


        <h2>コメント一覧</h2>
        {comments?.map((comment) => (
          <div key={comment.ID}>
            <p>{comment.Content}</p>
            <p>ユーザーID: {comment.UserID}</p>
            <p>作成日時: {comment.CreatedAt}</p>
          </div>
        ))}
      </div>
      <div>
        <h3>トピックに対するコメントをしましょう</h3>
        <form
            className="signup"
            onSubmit={async (e) => {
              e.preventDefault();
              await sendinfo();
            }}
          >
          <input
            type="text"
            name="topiccontent"
            placeholder="内容"
            value={topic_comment}
            onChange={(e)=>setTopicComment(e.target.value)}
          />
          <button type="submit">コメントを投稿</button>
        </form>
        
      </div>

    </div>
  );
}