import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
} | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [storedToken, setStoredToken] = useLocalStorage<string | null>(
    "auth_token",
    null
  );

  useEffect(() => {
    const checkAuth = async () => {
      if (storedToken) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${storedToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: { user: data.data.user, token: storedToken },
            });
          } else {
            setStoredToken(null);
            dispatch({ type: "LOGIN_FAILURE" });
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          setStoredToken(null);
          dispatch({ type: "LOGIN_FAILURE" });
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    checkAuth();
  }, [storedToken]); // Only include storedToken as dependency

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setStoredToken(data.data.token);
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user: data.data.user, token: data.data.token },
        });
        return true;
      } else {
        dispatch({ type: "LOGIN_FAILURE" });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      dispatch({ type: "LOGIN_FAILURE" });
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setStoredToken(data.data.token);
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user: data.data.user, token: data.data.token },
        });
        return true;
      } else {
        dispatch({ type: "LOGIN_FAILURE" });
        return false;
      }
    } catch (error) {
      console.error("Register error:", error);
      dispatch({ type: "LOGIN_FAILURE" });
      return false;
    }
  };

  const logout = () => {
    setStoredToken(null);
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext };
