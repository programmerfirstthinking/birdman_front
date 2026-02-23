// import Link from "next/link"

// export default function Main() {
//   return (
//     <Link href="http://localhost:8080/test">
//       <button>Aboutへ</button>
//     </Link>
//   )
// }

export default function signup() {
  return (
    <div>
      <h2>サインアップはこちら</h2>
      <form action="http://localhost:8080/signup" method="POST" className="signup">
        <input name="mail" placeholder="メルアド" />
        <input name="password" placeholder="パスワード" />
        <button>送信</button>
      </form>
    </div>
  )
}
