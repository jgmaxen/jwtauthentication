import { UserLogin } from "../interfaces/UserLogin";

const login = async (userInfo: UserLogin): Promise<string | null> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
      throw new Error('Invalid username or password');
    }

    const { token } = await response.json();
    localStorage.setItem('token', token); // Store JWT in local storage

    return token; // Return the token for further usage
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
};

export { login };
