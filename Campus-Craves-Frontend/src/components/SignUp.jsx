import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import "./Forms.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signUpSuccess, signUpFailure, signUpStart } from "../reduxfeatures/userSlice";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'buyer',
  });

  const handleSignUp = async () => {
    dispatch(signUpStart());
    try {
      const res = await axios.post('http://127.0.0.1:8000/users/signup/', data);
      console.log('Registration successful:', res.data);
      dispatch(signUpSuccess(res.data)); // Save user data in Redux state
      if (data.role === 'seller') {
        navigate('/admin/productsview'); // Redirect to Products View for sellers
      } else {
        navigate('/'); // Redirect to Home page for buyers
      }
    } catch (error) {
      console.error('Registration failed:', error.response.data);
      setError(error.response.data.message || 'Registration failed. Please try again.');
      dispatch(signUpFailure(error.response.data.message));
    }
  };

  const handleChange=(e)=> {
    setData({...data, [e.target.name]: e.target.value});
  }


  return (
    <div className="signup">
      <Header />
      <div className="signup-form">
        <h2>{"Create New Account"}</h2>

        <input type="text" placeholder="Username" name="username" value={data.username} onChange={handleChange} />
        <input type="email" placeholder="Email" name="email" value={data.email} onChange={handleChange} />
        <input type="password" placeholder="Password" name="password" value={data.password} onChange={handleChange} />

        <div className="buyer-radio flex">
          <input className="w-auto mx-2" type="radio" id="buyer" name="role" value="buyer" onChange={handleChange} />
          <label htmlFor="buyer">Buyer</label>
        </div>
        <div className="seller-radio flex">
          <input className="w-auto mx-2" type="radio" id="seller" name="role" value="seller" onChange={handleChange} />
          <label className="" htmlFor="seller">Seller</label>
        </div>
        
      
        {error && <p className="error">{error}</p>}

        <button className="signup-button" onClick={handleSignUp}>Sign Up</button>

        <p>
          Already have an account? <Link to="/login" className="login-link">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
