import React from 'react'
import StarRating from './StarRating'
import './suggestion.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Suggestion({id,title,thumbnail,instructor,rating,noOfRaters,price}) {
  const navigate = useNavigate()
  
  const handleClick= () => {
    navigate(`/courses/${id}`);
  }

  return (
    <div className='suggestion' onClick={handleClick}>
      <div className='thumbnail'>
        <img src={thumbnail} alt='thumbnail of course' />
      </div>
      <div className='course-info'>
        <h4>{title}</h4>
        <p>{instructor}</p>
        <StarRating rating={rating} noOfRaters={noOfRaters} />
        <h5>S${price}</h5>
      </div>
    </div>
  )
}

export default Suggestion