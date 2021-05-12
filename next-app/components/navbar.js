import styles from "./navbar.module.css";
import Link from "next/link";
import { useAuth } from "../util/useAuth";
import Head from "next/head";
export const Navbar = () => {
    const auth = useAuth();
    return (
        <>
            <Head>
                <title>Test</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <div className={styles.container}>
                <div className={styles.menu}>
                    <Link href="/">
                        <a className={styles.item}>Home</a>
                    </Link>
                    {auth.user ? (
                        <>
                            {auth.user}
                            <button
                                onClick={() => auth.signout()}
                                className={styles.button}
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Link href="/signin">
                            <button className={styles.button}>Sign in</button>
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;
