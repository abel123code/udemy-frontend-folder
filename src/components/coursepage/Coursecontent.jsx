import React, { useState } from 'react';
import './coursecontent.css'; // Make sure to create appropriate styles
import { MdOndemandVideo } from "react-icons/md";

const Lecture = ({ title, duration }) => (
  <li className="lecture-item"><MdOndemandVideo className='lecture-icon'/> <p className='lecture-title'>{title}</p>  <p className='lecture-duration'>{duration}</p></li>
);

const Section = ({ sectionData, isExpanded, onToggle }) => (
  <div className="section">
    <button className="section-title" onClick={onToggle}>
      {isExpanded ? '▼' : '►'} {sectionData.section}
    </button>
    {isExpanded && (
      <ul className="lecture-list">
        {sectionData.lectures.map((lecture, index) => (
          <Lecture key={index} {...lecture} />
        ))}
      </ul>
    )}
  </div>
);

const CourseContent = ({ data }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const handleToggle = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="dropdowns">
      {data.course_content.curriculum.map((sectionData, index) => (
        <Section
          key={index}
          sectionData={sectionData}
          isExpanded={!!expandedSections[index]}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
};


export default CourseContent;