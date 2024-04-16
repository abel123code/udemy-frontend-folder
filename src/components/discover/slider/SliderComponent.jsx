import React, { useState } from 'react'
import CarouselItem from './CarouselItem'
import './slider.css'
import { IoIosRadioButtonOn } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";


function SliderComponent() {
  const items = [
    {
      id: 1,
      text: "Skills that drive you forward",
      subtext: "Technology and the world of work change fast — with us, you're faster. Get the skills to achieve goals and stay competitive.",
      buttonText: "Plan for organizations",
      img: "https://img-c.udemycdn.com/notices/web_carousel_slide/image/10ca89f6-811b-400e-983b-32c5cd76725a.jpg"
    },
    {
      id: 2,
      text: "Learning that gets you",
      subtext: "Skills for your present(and your future). Get started with us",
      buttonText: "Plan for organizations",
      img: "https://img-c.udemycdn.com/notices/web_carousel_slide/image/e6cc1a30-2dec-4dc5-b0f2-c5b656909d5b.jpg"
    }
  ]
  const [activeIndex, setActiveIndex] = useState(0)

  const updateIndex = (newIndex) => {
    if (newIndex < 0) {
      newIndex = 0;
    } else if (newIndex >= items.length) {
      newIndex = items.length - 1;
    }

    setActiveIndex(newIndex);
  };

  return (
    <div className='carousel'>
      <div className='carousel_container'>
        <button className='arrow_btn' onClick={() => {updateIndex(activeIndex-1)}}>
          <IoIosArrowBack fontSize="20px" />
        </button>
        <div className='carousel_content'>
          <CarouselItem info={items[activeIndex]} />
        </div>
        <button className='arrow_btn' onClick={() => {updateIndex(activeIndex+1)}}>
          <IoIosArrowForward fontSize="20px"/>
        </button>
      </div>
    </div>
  )
}

export default SliderComponent