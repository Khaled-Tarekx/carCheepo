"use strict";
// import { useState, ChangeEvent } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import './auth.css';
// import { useAuth } from '../../contexts/AuthContext';
// import { authAPI } from '../../services/api';
// export const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const handleInputChange = (e: ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
//     setter(e.target.value);
//   };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await authAPI.login(email, password);
//       login(response.jwtToken, response.userData);
//       navigate('/');
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Login failed');
//     }
//   };
//   return (
//     <div className="auth-container">
//       <div className="auth-form-container">
//         <h2 className="auth-title">Sign in to your account</h2>
//         <form className="auth-form" onSubmit={handleSubmit}>
//           {error && (
//             <div className="auth-error">
//               {error}
//             </div>
//           )}
//           <div className="auth-input-group">
//             <label htmlFor="email-address" className="auth-label">
//               Email address
//             </label>
//             <input
//               id="email-address"
//               name="email"
//               type="email"
//               autoComplete="email"
//               required
//               className="auth-input"
//               placeholder="Email address"
//               value={email}
//               onChange={(e) => handleInputChange(e, setEmail)}
//             />
//           </div>
//           <div className="auth-input-group">
//             <label htmlFor="password" className="auth-label">
//               Password
//             </label>
//             <input
//               id="password"
//               name="password"
//               type="password"
//               autoComplete="current-password"
//               required
//               className="auth-input"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => handleInputChange(e, setPassword)}
//             />
//           </div>
//           <button type="submit" className="auth-button">
//             Sign in
//           </button>
//         </form>
//         <div className="auth-link">
//           <Link to="/register">
//             Don't have an account? Register
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };
