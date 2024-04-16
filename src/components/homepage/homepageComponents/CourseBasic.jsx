import React from 'react'
import StarRating from './StarRating'
import './courseBasic.css'
import { useNavigate } from 'react-router-dom'

function CourseBasic({ thumbnail,title,description,rating,noOfRaters,creator,price,id }) {

  const navigate = useNavigate()

  const handleClick= () => {
    navigate(`/courses/${id}`);
  }
  return (
    <div className='course-basic-detail' onClick={handleClick}>
      <div className='thumbnail-display'>
        <img src={thumbnail} alt='thumbnail of course' />
      </div>
      <div className='info-display'>
        <div className='details'>
          <h4 className='course-title'>{title}</h4>
          <p className='course-description'>{description}</p>
          <p className='course-creator'>{creator}</p>
          <StarRating rating={rating} noOfRaters={noOfRaters} />
        </div>
        <div className='price'>
          S${price}
        </div>
      </div>
    </div>
  )
}

export default CourseBasic