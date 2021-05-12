import styles from "./signin.module.css";
import { useAuth } from "../util/useAuth";
import { userState, useState } from "react";
import { useRouter } from "next/router";
export default function Login() {
    const auth = useAuth();
    const router = useRouter();
    const [username, setUsername] = useState(null);
    return (
        <>
            <div className={styles.container}>
                <label for="username">ログインID</label>
                <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                ></input>
                <label for="password">パスワード</label>
                <input type="password" name="password"></input>
                <button
                    onClick={() => {
                        auth.signin(username);
                        router.push("/");
                    }}
                    type="button"
                >
                    ログイン
                </button>
            </div>
        </>
    );
}
