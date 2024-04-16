import React, { useEffect, useState } from 'react'
import { HiOutlineBars3 } from "react-icons/hi2";
import { CiSearch } from "react-icons/ci";
import {FaShoppingCart} from 'react-icons/fa';
import './headerPhone.css'
import { useNavigate } from 'react-router-dom';
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

function HeaderUnauthenticated() {
    let navigate = useNavigate()
    return (
      <div className='hp-signup-login-ctnr'>
        <button className="hp-login-btn" onClick={() => { navigate('/login')}}>Log in</button>
        <button className="hp-signup-btn" onClick={() => { navigate('/register')}}>Sign up</button>
      </div>
    );
}

function HeaderAuthenticated({handleSignOut}) {
    const token = localStorage.getItem('accessToken');
    const details = localStorage.getItem('details');
    const detailsObject = details ? JSON.parse(details) : {};
    const userId = detailsObject ? detailsObject._id : null;
    const initials =  detailsObject && detailsObject.fullName ? getInitials(detailsObject.fullName) : '??';


    
    return (
        <div className="hp-profile-dropdown">
            <div className='hp-profile-details'> 
                <div className='hp-initials'>
                    {initials}
                </div>
                <div className='hp-name-email'>
                    <p>Hi, {detailsObject.fullName || 'Unknown'}</p>
                    <p>Welcome back</p>
                </div>           
            </div>
            <button onClick={handleSignOut}>Sign out</button>
        </div>
    )

}

function HeaderPhone() {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);

    const token = localStorage.getItem('accessToken');


    const navigate = useNavigate()

    useEffect(() => {
        // Check for accessToken in localStorage
        const token = localStorage.getItem('accessToken');
        setIsLoggedIn(!!token); // Convert token presence to boolean
      }, []);



    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    const toggleSearch = () => {
        setIsSearchActive(!isSearchActive);
    };

    const handleSignOut = () => {
        // Implement sign-out functionality here
        // For example, remove token from localStorage and update isLoggedIn state
        localStorage.removeItem('accessToken');
        //localStorage.removeItem('details')
        setIsLoggedIn(false);
        navigate('/')
    };

    const handleAddToCart = () => {
        //handle the add to cart. array already contains the add to cart courses so just need to navigate to a new page and display
        if (token) {
            navigate('/addToCart-viewer')
        }
    }

    const handleSearchSubmit = (event) => {
        console.log('this is search')
        event.preventDefault();
        const searchQuery = event.target.search.value;
        // Use the navigate function from useNavigate() hook to redirect to the search results page with the query
        navigate(`/search?search=${encodeURIComponent(searchQuery)}`);
        setIsSearchActive(false);
    }

    return (
        <div className='header-Phone'>
            {isSearchActive ? (
                <form action="/search" method="get" className='hp-search-container' onSubmit={handleSearchSubmit}>
                    <CiSearch className="hp-search-icon" />
                    <input 
                        type="text" 
                        name="search" 
                        placeholder='Search for anything...' 
                        className='hp-search-input' 
                    />
                    <button type="button" className="close-button" onClick={toggleSearch}>x</button>
                </form>
            ) : (
                <>
                    <div className="menu-icon" onClick={toggleMenu}>
                        <HiOutlineBars3 />
                    </div>
                    {isMenuVisible && (
                        <div className="menu-overlay">
                            <div className="menu">
                                <button className="close-button" onClick={toggleMenu}>x
                                </button>
                                {isLoggedIn ? <HeaderAuthenticated handleSignOut={handleSignOut}/>: <HeaderUnauthenticated />}
                                <ul>
                                    <p>Most popular</p>
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
                                </ul>
                                <ul className='more-from-udemy'>
                                    <p>More from udemy</p>
                                    <a href="/">Udemy Business</a>
                                    <a href="/">Get the app</a>
                                    <a href="/">Invite friends</a>
                                    <a href="/">Help</a>
                                </ul>
                            </div>
                        </div>
                    )}
                    <div className='hp-logo-ctnr'>
                        <a href='/homepage'>
                            <img src="https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg" alt="Udemy Logo" />
                        </a>
                    </div>
                    <div className='hp-action-bar'>
                        <div className='search-ctnr' onClick={toggleSearch}>
                            <CiSearch />
                        </div>
                        <div className='add-to-cart-ctnr' onClick={handleAddToCart}>
                            <FaShoppingCart />
                        </div>
                    </div>
                </>
            )}
        </div>
  )
}

export { getInitials }; // Named export for the utility function
export default HeaderPhone; // Default export for the component
