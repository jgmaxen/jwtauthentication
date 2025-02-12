import { UserLogin } from "../interfaces/UserLogin";

interface LoginResponse {
  token: string;
}

const login = async (userInfo: UserLogin): Promise<LoginResponse | null> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
      throw new Error('Invalid username or password');
    }

    const data: LoginResponse = await response.json();

    if (!data || !data.token) {
      throw new Error("Login failed: No token received");
    }

    localStorage.setItem('token', data.token); // Store JWT in local storage
    return data; // Return the full object { token: string }
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
};

export { login };
