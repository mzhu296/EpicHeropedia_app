import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: '',
  })

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = data;
    try {
        const response = await axios.post('/login', { email, password });
        if (response.data.error) {
            toast.error(response.data.error);
        } else {
            toast.success(`Welcome, ${response.data.name}!`);
            localStorage.setItem('userName', response.data.name);
            if (response.data.role === 'admin') {
                navigate('/admin'); // Redirect to admin page
            } else {
                navigate('/superhero'); // Redirect to general user page
            }
            setData({});
        }
    } catch (error) {
        console.error(error);
        toast.error('An error occurred while logging in');
    }
};

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={loginUser}>
        <div className="form-group">
          <label >Email : </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Password : </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
        </div>

        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}

export default Login;
