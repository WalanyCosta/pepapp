import type { User } from "@/models/user";
import { createContext, useContext, useState } from "react";

interface AuthContextProps {
	user: User | null;
	setAuth: (authUser: User | null) => void;
}

const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [refreshUser, setRefreshUser] = useState(false);

	function setAuth(authUser: User | null): void {
		setUser(authUser);
	}

	return (
		<AuthContext.Provider value={{ user, setAuth }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
