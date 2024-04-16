import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../keycomponent/header/Header';
import Footer from '../keycomponent/footer/Footer';
import './coursepage.css'
import SliderComponent from '../discover/slider/SliderComponent';
import { CiGlass, CiHeart } from "react-icons/ci";
import StarRating from '../homepage/homepageComponents/StarRating';
import { TiTick } from "react-icons/ti";
import EventBus from '../../services/EventBus';
import Coursecontent from './Coursecontent';
import useWindowSize from '../../services/useWindowSize';
import HeaderPhone from '../keycomponent/header-phone/HeaderPhone';

function Coursepage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [hasBoughtCourse, setHasBoughtCourse] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const isMobile = useWindowSize()

  //common information that are being used 
  const detailsJSON = localStorage.getItem('details');
  const personalDetails = JSON.parse(detailsJSON);
  const userId = personalDetails._id;
  const courseId = id;
  const token = localStorage.getItem('accessToken');
  const headers = {
    Authorization: `Bearer ${token}`
  };
    

  const Navigate = useNavigate();


  const checkLike = async () => {
    const detailsJSON = localStorage.getItem('details');
    const personalDetails = JSON.parse(detailsJSON);
    const userId = personalDetails._id;
    const token = localStorage.getItem('accessToken');
    // Use the find method with a query that includes the userId and courseId
    try {
      const response = await axios.get(`https://udemy-clone-0d698fd51660.herokuapp.com/course-likes`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          userId: userId,
          courseId: id
        }
      });
      //console.log(response.data)
      //console.log(response.data.total)

      // If there is at least one like, set isLiked to true
      if (response.data.total > 0) {
        //console.log(response.data)
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLike = async () =>  {
    const detailsJSON = localStorage.getItem('details');
    const personalDetails = JSON.parse(detailsJSON);
    const userId = personalDetails._id;
    const courseId = id;
    const token = localStorage.getItem('accessToken');

    const headers = {
      Authorization: `Bearer ${token}`
    };
    
    try {
      if (isLiked) {
        const fetchResponse = await axios.get(`https://udemy-clone-0d698fd51660.herokuapp.com/course-likes?userId=${userId}&courseId=${courseId}`, { headers })
        // Assuming the first item in the data array is the one we want to delete
        if (fetchResponse.data.total > 0) {
          const likeId = fetchResponse.data.data[0]._id;
          // Delete the like entry
          const deleteResponse = await axios.delete(`https://udemy-clone-0d698fd51660.herokuapp.com/course-likes/${likeId}`, { headers });

          if (deleteResponse.status === 200 || deleteResponse.status === 204) { // Assuming a 200 OK or 204 No Content on successful deletion
            setIsLiked(false);
          }
        }
      } else {
        const response = await axios.post(`https://udemy-clone-0d698fd51660.herokuapp.com/course-likes`, { 
          userId, 
          courseId 
        }, 
        { headers });
  
        if (response.status === 201) {
          setIsLiked(true);
        }
      }
      EventBus.emit('likedCoursesUpdated');
    } catch (error) {
      console.error('Error handling Like', error)
    }
  }

  const checkCourseEnrollment = async () => {
    const detailsJSON = localStorage.getItem('details');
    const personalDetails = JSON.parse(detailsJSON);
    const userId = personalDetails._id;
    const token = localStorage.getItem('accessToken');
  
    try {
      const response = await axios.get(`https://udemy-clone-0d698fd51660.herokuapp.com/payment`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          userId: userId,
          courseId: id
        }
      });
  
      if (response.data.total > 0) {
        setHasBoughtCourse(true);
      }
    } catch (error) {
      console.error('Error checking course enrollment status:', error);
    }
  };

  const handlePurchase = async () => {
    if (hasBoughtCourse) {
      // Navigate to the course learning environment or dashboard
      //console.log("Navigate to course");
      Navigate(`/course-content/${id}`) 
      return
    }
  
    const detailsJSON = localStorage.getItem('details');
    const personalDetails = JSON.parse(detailsJSON);
    const userId = personalDetails._id;
    const courseId = id;
    const token = localStorage.getItem('accessToken');
  
    try {
      const response = await axios.post(`https://udemy-clone-0d698fd51660.herokuapp.com/payment`, {
        userId,
        courseId,
        status: true // Assuming status is always true on creation
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.status === 201) {
        const progressResponse = await axios.post(
          `https://udemy-clone-0d698fd51660.herokuapp.com/course-progress`,
          {
            userId,
            courseId,
            currentSectionIndex: 0, // Default value indicating the start of the course
            currentLectureIndex: 0 // Default value indicating the start of the course
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (progressResponse.status === 201) {
          setHasBoughtCourse(true);
          //EventBus.emit('purchaseUpdated'); // Optional: if you have event listeners for purchase updates
          alert("Payment successfully made!");
          Navigate(`/course-content/${id}`);
        }
      }
    } catch (error) {
      console.error('Error handling purchase', error);
    }
  };

  const handleAddToCart = async () =>  {
    try {
      if (isAddedToCart) {
        const fetchResponse = await axios.get(`https://udemy-clone-0d698fd51660.herokuapp.com/add-to-cart?userId=${userId}&courseId=${courseId}`, { headers })
        // Assuming the first item in the data array is the one we want to delete
        if (fetchResponse.data.total > 0) {
          const likeId = fetchResponse.data.data[0]._id;
          // Delete the like entry
          const deleteResponse = await axios.delete(`https://udemy-clone-0d698fd51660.herokuapp.com/add-to-cart/${likeId}`, { headers });

          if (deleteResponse.status === 200 || deleteResponse.status === 204) { // Assuming a 200 OK or 204 No Content on successful deletion
            setIsAddedToCart(false);
            alert('Successfully removed from cart')
          }
        }
      } else {
        const response = await axios.post(`https://udemy-clone-0d698fd51660.herokuapp.com/add-to-cart`, { 
          userId, 
          courseId 
        }, 
        { headers });
  
        if (response.status === 201) {
          setIsAddedToCart(true);
          alert('Successfully added to cart')
        }
      }
      EventBus.emit('CartUpdated');
    } catch (error) {
      console.error('Error handling AddToCart', error)
    }
  }

  const checkAddToCart = async () => {
    // Use the find method with a query that includes the userId and courseId
    try {
      const response = await axios.get(`https://udemy-clone-0d698fd51660.herokuapp.com/add-to-cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          userId: userId,
          courseId: id
        }
      });
      //console.log(response.data)
      //console.log(response.data.total)

      // If there is at least one like, set isLiked to true
      if (response.data.total > 0) {
        //console.log(response.data)
        setIsAddedToCart(true)
      }
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };
  

  useEffect(() => {
    fetchCourse();
    checkLike();
    checkCourseEnrollment();
    checkAddToCart()
  }, []);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`https://udemy-clone-0d698fd51660.herokuapp.com/courses/${id}`);
      
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  if (!course) return <div>Loading...</div>;

  // Display the course details using the course state
  return (
    <div className='coursepage_ctnr'>
      <div className='coursepage'>
        {isMobile ? <HeaderPhone /> : <Header />}
        <div className='course-content'>
          <div className='course-information'>
            <div className='basic-info'>
              <div className='basic-info-content'>
                <h1>{course.basic.title}</h1>
                <h2>{course.short_description}</h2>
                <StarRating rating={course.basic.rating} noOfRaters={course.basic.number_of_ratings} />
                <p>Created by {course.basic.instructor.name}</p>
              </div>
            </div>
            <div className='detailed-info'>
              <div className='learning-obj'>
                <h2>What you'll learn</h2>
                <div className='categ-skills'>
                  <div className='categories'>
                    {course.categories.map((item,id)=> {
                      return <p className='obj-item' key={id}><TiTick />{item}</p>
                    })}
                  </div>
                  <div className='skills'>
                    {course.skills.map((item,id)=> {
                        return <p className='obj-item' key={id}><TiTick />{item}</p>
                      })}
                  </div>
                </div>
              </div>
              <div className="requirements">
                <h2>Requirements</h2>
                <ul>
                  {course.requirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>
              <div className="content-dropdown">
                <h2>Course content</h2>
                <Coursecontent data={course} />
              </div>
            </div>
          </div>
          <div class="course-sidebar">
            <div className='thumbnail-sidebar'>
              <img src={course.basic.thumbnail_url} />
            </div>
            <div className='sidebar-content'>
              <div class="price-box">
                <h2>SS${course.basic.price.current}</h2>
              </div>
              <div className='actions-sidebar'>
                <div className='add-like'>
                  <button className='add-to-cart' onClick={handleAddToCart}>
                    {isAddedToCart ? 'Added' : 'Add To Cart'}
                  </button>
                  <button className={`like-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
                    <CiHeart color={isLiked ? 'red' : 'black'} />
                  </button>
                </div>
                <button className='buy-now-btn' onClick={handlePurchase}>
                  {hasBoughtCourse ? 'Go to course' : 'Buy now'}
                </button>
                
              </div>
              <div className='includes'>
                <h3>This course includes: </h3>
                {Object.entries(course.includes).map(([key, value]) => {
                  return (<h4 key={key}>{`${value} ${key.replace(/_/g, ' ')}`}</h4>);
                })}
              </div>
            </div>
          </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}

export default Coursepage;
