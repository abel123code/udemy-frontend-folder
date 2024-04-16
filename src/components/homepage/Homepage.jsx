import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../keycomponent/header/Header';
import Footer from '../keycomponent/footer/Footer';
import './homepage.css'
import Suggestion from './homepageComponents/Suggestion';
import CourseBasic from './homepageComponents/CourseBasic';
import axios from 'axios'
import Coursepage from '../coursepage/Coursepage';
import useWindowSize from '../../services/useWindowSize';
import HeaderPhone from '../keycomponent/header-phone/HeaderPhone';
import { Button, Grid, colors } from '@mui/material';

const genres = [
  'Web Development',
  'Data Science',
  'Business',
  'Information Technology',
  'Health',
  'Arts and Humanities',
  'Personal Development',
  'Other'
];

function Homepage() {
  let navigate = useNavigate()
  const [suggestion, setSuggestion] = useState([])
  const [courseList, setCourse] = useState([])

  const { genreName } = useParams(); 
  const genre = genreName ? decodeURIComponent(genreName) : 'Web Development';

  const isMobile = useWindowSize()

  useEffect(() => {
    //console.log(genre)
    fetchSuggestion(genre)
  },[genre])

  const handleGenreSelect = (selectedGenre) => {
    navigate(`/homepage/${encodeURIComponent(selectedGenre)}`); // Ensure genre is properly encoded for URL
  };

  const fetchSuggestion = async (genre) => {
    try {
      const response = await axios.get(`https://udemy-clone-0d698fd51660.herokuapp.com/courses?genre=${encodeURIComponent(genre)}`)

      const courses = response.data.data;
      //console.log(courses);
      setCourse(courses)
      const suggestedList = courses.map(course => ({
        ...course.basic,
        id: course._id
      }))
      setSuggestion(suggestedList)
    
    } catch (error) {
      console.error('Error fetching suggested course', error);
    }
  }

  return (
    <div className='homepage_ctnr'>
      <div className='homepage'>
        {isMobile ? <HeaderPhone /> : <Header />}
        <div className='content-ctnr'>
          <div className='course-ctnr'>
            <h1>{genre} courses</h1>
            <h2>Courses to get you started</h2>
            <div className='reco-buttons-ctnr'>
              <button className="reco-buttons">Most popular</button>
              <button className="reco-buttons">New</button>
              <button className="reco-buttons">Trending</button>
            </div>
            <div className='suggested-ctnr'>
              {suggestion.slice(0, 5).map((suggested,id) => {
                return <Suggestion 
                key={id} 
                id={suggested.id}
                title={suggested.title} 
                thumbnail={suggested.thumbnail_url} instructor={suggested.instructor.name} 
                rating={suggested.rating} 
                noOfRaters={suggested.number_of_ratings}
                price={suggested.price.current} />
              })}
            </div>
            {/* This part will show all courses available */}
            <h2 className='all-course-title'>All {genre} courses</h2>
            <div className='all-course-cntr'>
              {courseList.map((course,id) => {
                return <CourseBasic 
                  key={id}
                  id={course._id}
                  thumbnail={course.basic.thumbnail_url}
                  title={course.basic.title}
                  description={course.short_description}
                  rating={course.basic.rating}
                  noOfRaters={course.basic.number_of_ratings}
                  creator={course.basic.instructor.name}
                  price={course.basic.price.current} />
              })}
            </div>
          </div>
        </div>


        <Grid container spacing={2} style={{ padding: 24 }} className='choose-category-ctnr'>
          {genres.map((genre, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} className='choose-category'>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleGenreSelect(genre)}
                style={{ color: "gray" , backgroundColor: "white" ,border: 'gray', fontSize: '14px' , height: '50px'}}
              >
                {genre}
              </Button>
            </Grid>
          ))}
        </Grid>
      </div>
      <Footer />
    </div>
  )
}

export default Homepage