import { createContext, useContext, useState } from "react";
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const auth = useProvideAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    return useContext(AuthContext);
};

function useProvideAuth() {
    const [user, setUser] = useState(null);

    const signin = (username, password) => {
        `auth()...
         sign in with username, password...
        `;
        setUser(username);
    };

    const signout = () => {
        setUser(false);
    };

    return {
        user,
        signin,
        signout,
    };
}
