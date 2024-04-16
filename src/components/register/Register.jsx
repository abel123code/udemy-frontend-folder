import React, { useState } from 'react'
import './register.css'
import Header from '../keycomponent/header/Header'
import Footer from '../keycomponent/footer/Footer'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useWindowSize from '../../services/useWindowSize';
import HeaderPhone from '../keycomponent/header-phone/HeaderPhone';

function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [offers, setOffers] = useState(false);

  const isMobile = useWindowSize();

  let navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      fullName,
      email,
      password,
      offers,
      role: 'user'
    }

    try {
      const response = await axios.post('https://udemy-clone-0d698fd51660.herokuapp.com/user', formData);
      
      //if success navigate to login page
      navigate('/login')

    } catch (error) {
      console.error('Error registering:', error);
      
    }
  };

  return (
    <div className='register_ctnr'>
      <div className='register_page'>
        {isMobile ? <HeaderPhone /> : <Header />}
        <div className='register-form-container'>
          <form onSubmit={handleSubmit} className='register-form'>
            <h2>Sign up and start learning</h2>
            <div className="form-group">
              <input 
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full name"
                required
              />
            </div>
            <div className="form-group">
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <div className="form-group">
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <div className="form-group">
              <label className='checkbox'>
                <input 
                  type="checkbox"
                  checked={offers}
                  onChange={(e) => setOffers(e.target.checked)}
                />
                <p>Send me special offers, personalized recommendations, and learning tips.</p>
              </label>
            </div>
            <button type="submit" className="sign-up-button">Sign up</button>
            <p className="terms">
              By signing up, you agree to our
              <a href="/terms"> Terms of Use </a> 
              and <a href="/privacy">Privacy Policy</a>.
            </p>
            <p className="login-link">
              Already have an account? 
              <a href="/login">Log in</a>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Register