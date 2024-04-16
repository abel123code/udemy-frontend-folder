import React from 'react'


function CarouselItem({ info }) {
  return (
    <div className='carousel-item' style={{ backgroundImage: `url(${info.img})` }}>
      <div className='carousel-text-content'>
        <h2>{info.text}</h2>
        <p>{info.subtext}</p>
        <button>{info.buttonText}</button>
      </div>
    </div>
  )
}

export default CarouselItem