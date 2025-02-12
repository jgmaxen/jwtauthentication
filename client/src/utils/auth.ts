import { JwtPayload, jwtDecode } from 'jwt-decode';

class AuthService {
  // ✅ Get user profile (decoded token)
  getProfile() {
    const token = this.getToken();
    return token ? jwtDecode<JwtPayload>(token) : null;
  }

  // ✅ Check if user is logged in (token exists & is valid)
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // ✅ Check if token is expired
  isTokenExpired(token: string) {
    try {
      const { exp } = jwtDecode<JwtPayload>(token);
      if (!exp) return true; // No expiration found
      return Date.now() >= exp * 1000; // Convert exp to milliseconds
    } catch (error) {
      return true; // If decoding fails, assume expired
    }
  }

  // ✅ Get the token from local storage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ Save token to local storage & redirect to Kanban board
  login(idToken: string) {
    localStorage.setItem('token', idToken);
    window.location.href = "/board";
  }

  // ✅ Remove token from local storage & redirect to login
  logout() {
    localStorage.removeItem('token');
    window.location.href = "/login";
  }
}

export default new AuthService();
