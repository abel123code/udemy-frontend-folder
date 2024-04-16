import React, { useEffect, useState } from 'react'
import EventBus from '../../../../services/EventBus';
import axios from 'axios';
import HeaderPhone from '../HeaderPhone';
import { getInitials } from '../HeaderPhone';
import useWindowSize from '../../../../services/useWindowSize';
import Header from '../../header/Header';
import './addToCart.css'
import { useNavigate } from 'react-router-dom';

function AddToCartResult() {
    const [addToCart, setaddToCart] = useState([]);
    const isMobile = useWindowSize();

    const token = localStorage.getItem('accessToken');
    const details = localStorage.getItem('details');
    const detailsObject = details ? JSON.parse(details) : {};
    const userId = detailsObject ? detailsObject._id : null;
    const initials =  detailsObject && detailsObject.fullName ? getInitials(detailsObject.fullName) : '??';

    const navigate = useNavigate()

    useEffect(() => {
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
                console.error('Error fetching add to cart courses:', error)
            }
        };

        fetchAddToCart()

        const updateCourses = () => {
            fetchAddToCart(); 
        };

        
        EventBus.on('CartUpdated', updateCourses);
        // Cleanup to avoid memory leaks
        return () => {
            EventBus.removeListener('CartUpdated', updateCourses);
        };
    }, [userId]);

    const handleClick= (id) => {
        navigate(`/courses/${id}`);
    }

    const computeCost = () => {
        const totalCost = addToCart.reduce((acc, course) => {
            return acc + course.price.current; 
        }, 0); 
    
        return totalCost.toFixed(2); 
    }


    return (
        <div className='addToCart-viewerPage'>
            {isMobile ? <HeaderPhone /> : <Header />}
            <div className='addToCart-viewer-ctnr'>
                <div className='total-cost'>
                    <h2>Total: </h2>
                    <h1>S${computeCost()}</h1>
                </div>
                <div className='addToCart-courses-ctnr'>
                    <div className='course-count'>
                        <h2>{addToCart.length} Courses in cart</h2>
                    </div>

                    {addToCart.length > 0 ? (
                        addToCart.map((course,index) => (
                            <div key={index} className='addToCart-course' onClick={() => {handleClick(course.id)}}>
                                <div className='addToCart-course-pic'>
                                    <img src={course.thumbnail_url} alt='thumbnail' />
                                </div>
                                <div className='addToCart-course-details'>
                                    <h3>{course.title}</h3>
                                    <p>{course.instructor.name}</p>
                                </div>
                                <div className='addToCart-course-price'>
                                    <h3>S${course.price.current}</h3>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='addToCart-empty'>
                            <div>Your cart is empty.Keep shopping to find a course!</div>
                            <button onClick={() => {
                                navigate('/homepage')
                            }}>Keep shopping</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
    

export default AddToCartResult
