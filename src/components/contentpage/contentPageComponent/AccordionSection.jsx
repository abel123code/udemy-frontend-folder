import React, { useState } from 'react'
import './accordionSection.css'

function AccordionSection({ sectionData, onLectureSelect, currentSectionIndex, currentLectureIndex }) {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleOpen = () => setIsOpen(!isOpen);
  
    return (
      <div className="acc-section">
        <div className="acc-section-header" onClick={toggleOpen}>
          <h3>{sectionData.section}</h3>
          <span>{isOpen ? '▲' : '▼'}</span>
        </div>
        {isOpen && (
          <ul className="lectures-list">
            {sectionData.lectures.map((lecture, lectureIndex) => (
                <div
                    key={lectureIndex}
                    className={`lecture ${currentSectionIndex === sectionData.index && currentLectureIndex === lectureIndex ? 'active' : ''}`}
                    onClick={() => onLectureSelect(sectionData.index, lectureIndex)}
                >
                    {lecture.title}
                </div>
            ))}    
          </ul>
        )}
      </div>
    );
  }
  
  

export default AccordionSection;

  