import React, {useEffect, useState} from 'react'
import './header.css'
import { CiGlass, CiSearch } from "react-icons/ci";
import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaBell } from 'react-icons/fa';
import axios from 'axios';
import EventBus from '../../../services/EventBus';

function getInitials(name) {
  const words = name.trim().split(/\s+/); // Split the name into words by whitespace
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase(); // First two letters of the name if only one word
  } else {
    return (words[0][0] + words[1][0]).toUpperCase(); // First letter of the first two words
  }
}


function HeaderAuthenticated({ showProfileDropdown, setShowProfileDropdown, handleSignOut }) {
  const [likedCourses, setLikedCourses] = useState([]);
  const [addToCart, setaddToCart] = useState([]);
  const [showLikedCourses, setShowLikedCourses] = useState(false);
  const [showAddToCart, setshowAddToCart] = useState(false);
  const token = localStorage.getItem('accessToken');
  const details = localStorage.getItem('details');
  const detailsObject = details ? JSON.parse(details) : {};
  const userId = detailsObject ? detailsObject._id : null;
  const initials =  detailsObject && detailsObject.fullName ? getInitials(detailsObject.fullName) : '??';

  useEffect(() => {
    // Define the fetch function inside useEffect
    const fetchLikedCourses = async () => {
      try {
        const response = await fetch(`https://udemy-clone-0d698fd51660.herokuapp.com/course-likes?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const courses = await response.json();
          const courseArray = courses.data;
          //console.log(courseArray)

          const courseDetailsPromises = courseArray.map(async (course) => {
            const response = await axios.get(`https://udemy-clone-0d698fd51660.herokuapp.com/courses/${course.courseId}`);
            return {
              ...response.data.basic, // Assuming you want to keep the basic info
              id: course.courseId // Keep track of the course ID if needed
            };
          });

          const courseDetails = await Promise.all(courseDetailsPromises);
          
          setLikedCourses(courseDetails)
        }
      } catch (error) {
        console.error("Failed to fetch liked courses", error);
      }
    };

    fetchLikedCourses();

    const fetchAddToCart = async () => {
      try {
        const response = await fetch(`https://udemy-clone-0d698fd51660.herokuapp.com/add-to-cart?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const courses = await response.json();
          const courseArray = courses.data;
          //console.log(courseArray)

          const courseDetailsPromises = courseArray.map(async (course) => {
            const response = await axios.get(`https://udemy-clone-0d698fd51660.herokuapp.com/courses/${course.courseId}`);
            return {
              ...response.data.basic, // Assuming you want to keep the basic info
              id: course.courseId // Keep track of the course ID if needed
            };
          });

          const courseDetails = await Promise.all(courseDetailsPromises);
          
          setaddToCart(courseDetails)
        }
      } catch (error) {
        console.error("Failed to fetch liked courses", error);
      }
    };

    fetchAddToCart()

    const updateCourses = () => {
      fetchLikedCourses();
      fetchAddToCart();
    
    };

    EventBus.on('likedCoursesUpdated', updateCourses);
    EventBus.on('CartUpdated', updateCourses);
    // Cleanup to avoid memory leaks
    return () => {
      EventBus.removeListener('likedCoursesUpdated', updateCourses);
      EventBus.removeListener('CartUpdated', updateCourses);
    };
  }, [userId,showLikedCourses,showAddToCart]);

  return (
    <div className='header-icons'>
      <div onClick={() => {
          setShowLikedCourses(!showLikedCourses)
      }}>
        <FaHeart />
        {showLikedCourses && (
          <div className="liked-courses-dropdown">
            {likedCourses.length > 0 ? (
              likedCourses.map(course => (
                <div key={course.id} className="liked-course-item">
                  <div className='course-pic'>
                    <img src={course.thumbnail_url} alt='thumbnail' />
                  </div>
                  <div className='liked-course-details'>
                    <h3>{course.title}</h3>
                    <p>{course.instructor.name}</p>
                    <p>${course.price.current}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="liked-course-item">Your wishlist is empty</div>
            )}
          </div>
        )}
      </div>
      <div onClick={() => {
          setshowAddToCart(!showAddToCart)
      }}>
        <FaShoppingCart />
        {showAddToCart && (
          <div className="addToCart-dropdown">
            {addToCart.length > 0 ? (
              addToCart.map((course,index) => (
                <div key={index} className="addToCart-item">
                  <div className='course-pic'>
                    <img src={course.thumbnail_url} alt='thumbnail' />
                  </div>
                  <div className='addToCart-details'>
                    <h3>{course.title}</h3>
                    <p>{course.instructor.name}</p>
                    <p>${course.price.current}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className='addToCart-item'>Your cart is empty</div>
            )}
          </div>
        )}
      </div>
      
      <FaBell />
      <button className='user-profile' onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
        {initials}
      </button>
      {showProfileDropdown && (
          <div className="profile-dropdown">
            <div className='profile-details'>          
              <h3>{detailsObject.fullName || 'Unknown'}</h3>
              <p>{detailsObject.email || 'unknown'}</p>
            </div>
            <button onClick={handleSignOut}>Sign out</button>
          </div>
      )}
  </div>
  );
}

function HeaderUnauthenticated() {
  let navigate = useNavigate()
  return (
    <div className='signup-login-ctnr'>
      <button className="login-btn" onClick={() => { navigate('/login')}}>Log in</button>
      <button className="signup-btn" onClick={() => { navigate('/register')}}>Sign up</button>
    </div>
  );
}

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    // Check for accessToken in localStorage
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token); // Convert token presence to boolean
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  let navigate = useNavigate()


  const handleSignOut = () => {
    // Implement sign-out functionality here
    // For example, remove token from localStorage and update isLoggedIn state
    localStorage.removeItem('accessToken');
    //localStorage.removeItem('details')
    setIsLoggedIn(false);
    navigate('/')
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const searchQuery = event.target.search.value;
    // Use the navigate function from useNavigate() hook to redirect to the search results page with the query
    navigate(`/search?search=${encodeURIComponent(searchQuery)}`);
  }


  return (
    <div className='header'>
      <div class="navbar_logo">
        <a href='/homepage'>
          <img src="https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg" alt="Udemy Logo" />
        </a>
      </div>
      <div className="navbar_nav">
        <div className="nav-item dropdown">
          <button className="dropbtn" onClick={toggleDropdown}>Categories</button>
          {dropdownOpen && (
            <div className="dropdown-content">
              {/* Dropdown links */}
              <a href="/">Development</a>
              <a href="/">Business</a>
              <a href="/">Finance & Accounting</a>
              <a href="/">IT & Software</a>
              <a href="/">Office Productivity</a>
              <a href="/">Personal Development</a>
              <a href="/">Design</a>
              <a href="/">Marketing</a>
              <a href="/">Lifestyle</a>
              <a href="/">Health & Fitness</a>
              <a href="/">Music</a>
              <a href="/">Teaching & academic</a>
            </div>
          )}
        </div>
      </div>
      <form action="/search" method="get" className='search_container' onSubmit={handleSearchSubmit}>
        <CiSearch className="search-icon" />
        <input type="text" name="search" placeholder='Search for anything...' className='search_input' />
      </form>
      <div className="action_bar">
        <a href="/business" className="nav-item udemy-business">Udemy Business</a>
        <a href="/teach" className="nav-item teach-on-udemy">Teach on Udemy</a>
        {isLoggedIn ? (
        <HeaderAuthenticated
          showProfileDropdown={showProfileDropdown}
          setShowProfileDropdown={setShowProfileDropdown}
          handleSignOut={handleSignOut}
        />
        ) : (
        <HeaderUnauthenticated />
        )}
      </div>
    </div>
  )
}

export default Header