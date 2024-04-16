import React, { useEffect, useState } from 'react'
import Footer from '../keycomponent/footer/Footer'
import Header from '../keycomponent/header/Header'
import './login.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebookF} from '@fortawesome/free-brands-svg-icons';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import HeaderPhone from '../keycomponent/header-phone/HeaderPhone';
import useWindowSize from '../../services/useWindowSize';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isMobile = useWindowSize();
  let navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the default form submit action
    try {
      const response = await axios.post('https://udemy-clone-0d698fd51660.herokuapp.com/authentication', {
        strategy: 'local',
        email,
        password,
      });
      const accessToken = response.data.accessToken
      //console.log(response.data);

      const personalDetails = response.data.user
      //console.log(personalDetails);
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('details',JSON.stringify(personalDetails))
      navigate('/homepage')

    } catch (error) {
      console.error('Error logging in:', error);
      setEmail('')
      setPassword('')
    }
  }
  

  return (
    <div className='login_ctnr'>
      <div className='login_page'>
        {isMobile ? <HeaderPhone /> : <Header />}
        <div className="login-form-container">
          <form onSubmit={handleSubmit} className='form'>
            <h2>Log in to your Udemy account</h2>
            <button 
              type="button" 
              className="social-login google"
              onClick={() => window.location.href='https://udemy-clone-0d698fd51660.herokuapp.com/oauth/google'}
            >
              <FontAwesomeIcon icon={faGoogle} fontSize='30px'/> 
              Continue with Google
            </button>

            <button type="button" className="social-login facebook"><FontAwesomeIcon icon={faFacebookF} fontSize='30px' /> Continue with Facebook</button>
            <div className="input-group">
              <input 
                type="email" 
                id="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              required />
            </div>
            <div className="input-group">
              <input 
                type="password" 
                id="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
              required />
            </div>
            <button type="submit" className="login-button">Log in</button>
            <a href="#" className="forgot-password">Forgot Password</a>
            <div className="log-in-org">
              <p>Don't have an account? <a href="/register">Sign up</a></p>
              <a href="#">Log in with your organization</a>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Login