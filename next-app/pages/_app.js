import "../styles/globals.css";
import { AuthProvider } from "../util/useAuth";
import { Navbar } from "../components/navbar";
function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Navbar></Navbar>
            <Component {...pageProps} />
        </AuthProvider>
    );
}

export default MyApp;
