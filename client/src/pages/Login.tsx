import { useState, FormEvent, ChangeEvent } from "react";
import Auth from "../utils/auth";
import { login } from "../api/authAPI";

const Login = () => {
  const [loginData, setLoginData] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Stores login error messages

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); // Reset error message on new attempt

    try {
      const data: { token: string } | null = await login(loginData);

      if (!data || !data.token) {
        throw new Error("Login failed: No token received");
      }

      Auth.login(data.token);
    } catch (err) {
      console.error("Failed to login", err);
      setErrorMessage("Invalid username or password. Please try again."); // Display user-friendly error
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Login</h1>

        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Show error message */}

        <label>Username</label>
        <input
          type="text"
          name="username"
          value={loginData.username}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={loginData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit Form</button>
      </form>
    </div>
  );
};

export default Login;
