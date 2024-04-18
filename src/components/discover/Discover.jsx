import React, { useEffect } from 'react'
import Header from '../keycomponent/header/Header'
import './discover.css'
import SliderComponent from './slider/SliderComponent'
import Footer from '../keycomponent/footer/Footer'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import useWindowSize from '../../services/useWindowSize';
import HeaderPhone from '../keycomponent/header-phone/HeaderPhone'
import UdemyBiz from './UdemyBiz'


function Discover() {
  let navigate = useNavigate()
  const isMobile = useWindowSize()

  useEffect(() => {
    const fetchUserDetails = async (accessToken) => {
      try {
        const response = await axios.get('https://udemy-clone-0d698fd51660.herokuapp.com/user', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        // Assuming your server responds with user details in the response body
        console.log(response.data.data[0]);
        const details = response.data.data[0]
        localStorage.setItem('details', JSON.stringify(details));
        navigate('/homepage'); // Redirect to homepage after storing user details
      } catch (error) {
        console.error('Error fetching user details:', error);
        // Handle error, perhaps redirect to login page or show an error message
      }
    };

    const accessToken = new URLSearchParams(window.location.hash.substring(1)).get('access_token');
    if (accessToken) {
      console.log('Access Token:', accessToken);
      localStorage.setItem('accessToken', accessToken); // Store the access token
      window.location.hash = ''; // Remove the token from the URL
      fetchUserDetails(accessToken); // Fetch user details with the access token
    }
  }, []);


  return (
    <div className='discover_ctnr'>
      <div className='discover_page'>
        {isMobile ? <HeaderPhone /> : <Header />}
        {isMobile ? <UdemyBiz /> : <SliderComponent /> }
      </div>
      <Footer />
    </div>
  )
}

export default Discover