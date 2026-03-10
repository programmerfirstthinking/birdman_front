

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// type School = {
//   ID: number;
//   SchoolName: string;
//   CreatedAt: string;
//   UpdatedAt: string;
// };

// export default function SchoolsPage() {
//   const [schools, setSchools] = useState<School[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchSchools = async () => {
//       try {
//         const res = await fetch("http://localhost:8080/getSchools");

//         if (!res.ok) {
//           throw new Error("サーバーエラー");
//         }

//         const data = await res.json();
//         console.log("受信データ:", data);

//         // バックエンドが { schools: [] } 形式で返す想定
//         if (Array.isArray(data.schools)) {
//           setSchools(data.schools);
//         } else {
//           console.error("schoolsが配列ではありません:", data);
//           setSchools([]);
//         }
//       } catch (error) {
//         console.error("学校取得エラー:", error);
//         setSchools([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSchools();
//   }, []);

//   function handleSchoolClick(schoolId: number) {
//     router.push(`/srccode/school_topic/${schoolId}`);
//   }

//   if (loading) {
//     return <p>読み込み中...</p>;
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-6">
//       <div className="w-full max-w-2xl">

//            <button
//           onClick={() => router.push("/srccode/topic")}
//           className="mb-6 px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
//         >
//           ← ホームに戻る
//         </button>

//         <h1 className="text-4xl font-bold mb-10 text-center text-blue-800">
//           学校を選択してください
//         </h1>

//         {loading ? (
//           <p className="text-center text-blue-600 text-lg">読み込み中...</p>
//         ) : schools.length === 0 ? (
//           <p className="text-center text-blue-600 text-lg">学校が登録されていません</p>
//         ) : (
//           <div className="flex flex-col gap-4">
//             {schools.map((school) => (
//               <button
//                 key={school.ID}
//                 onClick={() => handleSchoolClick(school.ID)}
//                 className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-5 text-left text-blue-800 font-semibold border border-blue-200 hover:bg-blue-50"
//               >
//                 <div className="text-xl">{school.SchoolName}</div>
//                 <div className="text-sm text-blue-400 mt-1">
//                   作成日: {new Date(school.CreatedAt).toLocaleDateString()}
//                 </div>
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }








// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// type School = {
//   ID: number;
//   SchoolName: string;
//   CreatedAt: string;
//   UpdatedAt: string;
// };

// export default function SchoolsPage() {
//   const [schools, setSchools] = useState<School[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchSchools = async () => {
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getSchools`);

//         if (!res.ok) {
//           throw new Error("サーバーエラー");
//         }

//         const data = await res.json();
//         console.log("受信データ:", data);

//         if (Array.isArray(data.schools)) {
//           setSchools(data.schools);
//         } else {
//           console.error("schoolsが配列ではありません:", data);
//           setSchools([]);
//         }
//       } catch (error) {
//         console.error("学校取得エラー:", error);
//         setSchools([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSchools();
//   }, []);

//   function handleSchoolClick(schoolId: number) {
//     router.push(`/srccode/school_topic/${schoolId}`);
//   }

//   if (loading) {
//     return (
//       <div style={{ textAlign: "center", marginTop: "50px", fontSize: "18px" }}>
//         読み込み中...
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         maxWidth: "600px",
//         margin: "50px auto",
//         padding: "20px",
//         borderRadius: "12px",
//         boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//         backgroundColor: "#fafafa",
//         fontFamily: "Arial, sans-serif",
//       }}
//     >
//       <h2
//         style={{
//           textAlign: "center",
//           marginBottom: "24px",
//           color: "#333",
//           fontSize: "24px",
//           fontWeight: "600",
//         }}
//       >
//         学校選択画面
//       </h2>

//       {schools.length === 0 && (
//         <p style={{ textAlign: "center", color: "#777" }}>
//           学校が登録されていません
//         </p>
//       )}

//       <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//         {schools.map((school) => (
//           <button
//             key={school.ID}
//             onClick={() => handleSchoolClick(school.ID)}
//             style={{
//               padding: "14px 20px",
//               fontSize: "16px",
//               borderRadius: "8px",
//               border: "none",
//               cursor: "pointer",
//               backgroundColor: "#4f46e5",
//               color: "#fff",
//               transition: "background-color 0.3s, transform 0.2s",
//               boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//             }}
//             onMouseEnter={(e) =>
//               (e.currentTarget.style.backgroundColor = "#4338ca")
//             }
//             onMouseLeave={(e) =>
//               (e.currentTarget.style.backgroundColor = "#4f46e5")
//             }
//           >
//             {school.SchoolName}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }











// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";


// type Group = {
//   ID: number;
//   UserID: number;
//   SchoolID: number;
//   Groupname: string;
//   CreatedAt: string;
//   UpdatedAt: string;
// };

// type SchoolWithGroups = {
//   ID: number;
//   Name: string;
//   Groups: Group[];
// };

// export default function SchoolsPage() {
//   const [schools, setSchools] = useState<SchoolWithGroups[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSchools = async () => {
//       try {
//         const res = await fetch("http://localhost:8080/getSchoolsWithGroups");
//         if (!res.ok) throw new Error("サーバーエラー");

//         const data = await res.json();
//         if (Array.isArray(data.schools)) setSchools(data.schools);
//         else setSchools([]);
//       } catch (error) {
//         console.error(error);
//         setSchools([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSchools();
//   }, []);

//   if (loading) return <p>読み込み中...</p>;

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-blue-100 p-6">
//       <h1 className="text-4xl font-bold mb-10 text-blue-800">学校とグループ一覧</h1>
//       <div className="w-full max-w-3xl flex flex-col gap-6">
//         {schools.length === 0 ? (
//           <p>学校が登録されていません</p>
//         ) : (
//           schools.map((school) => (
//             <div key={school.ID} className="bg-white p-5 rounded-xl shadow-md">
//               <h2 className="text-2xl font-semibold text-blue-700 mb-3">{school.Name}</h2>

//               {school.Groups.length === 0 ? (
//                 <p className="text-blue-400">この学校にはグループがありません</p>
//               ) : (
//                 <ul className="flex flex-col gap-2">
//                   {school.Groups.map((group) => (
//                     <li key={group.ID} className="p-3 bg-blue-50 rounded-md border border-blue-200">
//                       {group.Groupname} （作成日: {new Date(group.CreatedAt).toLocaleDateString()}）
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }








// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// type Group = {
//   ID: number;
//   UserID: number;
//   SchoolID: number;
//   Groupname: string;
//   CreatedAt: string;
//   UpdatedAt: string;
// };

// type SchoolWithGroups = {
//   ID: number;
//   Name: string;
//   Groups: Group[];
// };

// export default function SchoolsPage() {
//   const [schools, setSchools] = useState<SchoolWithGroups[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchSchoolsWithGroups = async () => {
//       try {
//         // まず学校一覧を取得
//         const resSchools = await fetch("http://localhost:8080/getSchools");
//         if (!resSchools.ok) throw new Error("学校取得エラー");
//         const dataSchools = await resSchools.json();
//         const schoolList: { ID: number; SchoolName: string }[] = dataSchools.schools ?? [];

//         // 学校ごとにグループを取得
//         const schoolsWithGroups: SchoolWithGroups[] = await Promise.all(
//           schoolList.map(async (school) => {
//             const resGroups = await fetch("http://localhost:8080/getSchoolsWithGroups", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ schoolID: school.ID }),
//             });

//             const dataGroups = await resGroups.json();
//             const groups: Group[] = dataGroups.groups ?? [];

//             return {
//               ID: school.ID,
//               Name: school.SchoolName,
//               Groups: groups,
//             };
//           })
//         );

//         setSchools(schoolsWithGroups);
//       } catch (error) {
//         console.error("学校とグループ取得エラー:", error);
//         setSchools([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSchoolsWithGroups();
//   }, []);

//   if (loading) return <p className="text-center mt-10">読み込み中...</p>;

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-blue-100 p-6">
//       <h1 className="text-4xl font-bold mb-10 text-blue-800">学校とグループ一覧</h1>
//       <div className="w-full max-w-3xl flex flex-col gap-6">
//         {schools.length === 0 ? (
//           <p className="text-blue-600 text-center">学校が登録されていません</p>
//         ) : (
//           schools.map((school) => (
//             <div key={school.ID} className="bg-white p-5 rounded-xl shadow-md">
//               <h2 className="text-2xl font-semibold text-blue-700 mb-3">{school.Name}</h2>

//               {(school.Groups?.length ?? 0) === 0 ? (
//                 <p className="text-blue-400">この学校にはグループがありません</p>
//               ) : (
//                 <ul className="flex flex-col gap-2">
//                   {school.Groups.map((group) => (
//                     <li
//                       key={group.ID}
//                       className="p-3 bg-blue-50 rounded-md border border-blue-200"
//                     >
//                       {group.Groupname} （作成日:{" "}
//                       {new Date(group.CreatedAt).toLocaleDateString()}）
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }






// "use client";

// import { useEffect, useState } from "react";

// type Group = {
//   ID: number;
//   UserID: number;
//   SchoolID: number;
//   Groupname: string;
//   CreatedAt: string;
//   UpdatedAt: string;
// };

// type SchoolWithGroups = {
//   id: number;
//   school_name: string;
//   groups: Group[];
// };

// export default function SchoolsPage() {
//   const [schools, setSchools] = useState<SchoolWithGroups[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSchools = async () => {
//       try {
//         const res = await fetch("http://localhost:8080/schools-with-groups");

//         if (!res.ok) {
//           throw new Error("APIエラー");
//         }

//         const data = await res.json();

//         setSchools(data.schools ?? []);
//       } catch (error) {
//         console.error("学校取得エラー:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSchools();
//   }, []);

//   if (loading) {
//     return <p className="text-center mt-10">読み込み中...</p>;
//   }

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-blue-100 p-6">
//       <h1 className="text-4xl font-bold mb-10 text-blue-800">
//         学校とグループ一覧
//       </h1>

//       <div className="w-full max-w-3xl flex flex-col gap-6">
//         {schools.length === 0 ? (
//           <p className="text-blue-600 text-center">
//             学校が登録されていません
//           </p>
//         ) : (
//           schools.map((school) => (
//             <div
//               key={school.id}
//               className="bg-white p-5 rounded-xl shadow-md"
//             >
//               <h2 className="text-2xl font-semibold text-blue-700 mb-3">
//                 {school.school_name}
//               </h2>

//               {(school.groups?.length ?? 0) === 0 ? (
//                 <p className="text-blue-400">
//                   この学校にはグループがありません
//                 </p>
//               ) : (
//                 <ul className="flex flex-col gap-2">
//                   {school.groups?.map((group) => (
//                     <li
//                       key={group.ID}
//                       className="p-3 bg-blue-50 rounded-md border border-blue-200"
//                     >
//                       {group.Groupname}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }










"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../api/api";

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

export default function SchoolsPage() {
  const [schools, setSchools] = useState<SchoolWithGroups[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        // const res = await fetch("http://localhost:8080/schools-with-groups");
        const res = await fetch(`${API_BASE_URL}/schools-with-groups`);

        if (!res.ok) {
          throw new Error("APIエラー");
        }

        const data = await res.json();

        setSchools(data.schools ?? []);
      } catch (error) {
        console.error("学校取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  function handleSchoolClick(id: number) {
    router.push(`/school_topic/${id}`);
  }

  if (loading) {
    return <p className="text-center mt-10">読み込み中...</p>;
  }

  return (

    
    <div className="min-h-screen flex flex-col items-center bg-blue-100 p-6">


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
          schools.map((school) => (
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
                  {school.groups?.map((group) => (
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
          ))
        )}
      </div>
    </div>
  );
}