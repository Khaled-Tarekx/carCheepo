"use strict";
// import { useState, ChangeEvent } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import './auth.css';
// import { authAPI } from '../../services/api';
// export const Register = () => {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const handleInputChange = (e: ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
//     setter(e.target.value);
//   };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await authAPI.register(username, email, password);
//       navigate('/login');
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Registration failed');
//     }
//   };
//   return (
//     <div className="auth-container">
//       <div className="auth-form-container">
//         <h2 className="auth-title">Create your account</h2>
//         <form className="auth-form" onSubmit={handleSubmit}>
//           {error && (
//             <div className="auth-error">
//               {error}
//             </div>
//           )}
//           <div className="auth-input-group">
//             <label htmlFor="username" className="auth-label">
//               Username
//             </label>
//             <input
//               id="username"
//               name="username"
//               type="text"
//               required
//               className="auth-input"
//               placeholder="Username"
//               value={username}
//               onChange={(e) => handleInputChange(e, setUsername)}
//             />
//           </div>
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
//               autoComplete="new-password"
//               required
//               className="auth-input"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => handleInputChange(e, setPassword)}
//             />
//           </div>
//           <button type="submit" className="auth-button">
//             Register
//           </button>
//         </form>
//         <div className="auth-link">
//           <Link to="/login">
//             Already have an account? Sign in
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };
