import React, { useEffect, useState } from 'react'
import { AiOutlineTrophy } from "react-icons/ai";
import './content.css'
import VideoPlayer from './contentPageComponent/VideoPlayer';
import AccordionSection from './contentPageComponent/AccordionSection';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { IoMdArrowRoundBack } from "react-icons/io";

function Content() {
    const { id } = useParams(); 
    const [courseData, setCourseData] = useState(null); 
    const [progressid, setProgressId] = useState(null)
    
    const [SectionIndex, setCurrentSectionIndex] = useState(null);
    const [LectureIndex, setCurrentLectureIndex] = useState(null);
    const [videoId , setVideoId] =  useState("")

    const detailsJSON = localStorage.getItem('details');
    const personalDetails = JSON.parse(detailsJSON);
    const token = localStorage.getItem('accessToken');

    const navigate = useNavigate()

    useEffect(() => {
      const fetchData = async () => {
        try {
          const courseDataPromise = axios.get(`https://udemy-clone-0d698fd51660.herokuapp.com/courses/${id}`);
          
          const currentStatusPromise = axios.get(`https://udemy-clone-0d698fd51660.herokuapp.com/course-progress`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { userId: personalDetails._id, courseId: id },
          });
    
          // Wait for both promises to resolve
          const [courseDataResponse, currentStatusResponse] = await Promise.all([courseDataPromise, currentStatusPromise]);
    
          // Set course data
          setCourseData(courseDataResponse.data);
    
          // Assuming currentStatusResponse.data.data is an array and has at least one item
          if (currentStatusResponse.data && currentStatusResponse.data.data.length > 0) {
            const { currentLectureIndex, currentSectionIndex } = currentStatusResponse.data.data[0];
            setCurrentLectureIndex(currentLectureIndex);
            setCurrentSectionIndex(currentSectionIndex);
    
            // Now, we can safely call handleLectureSelect
            //handleLectureSelect(id,personalDetails._id,currentSectionIndex, currentLectureIndex);
          } else {
            return
            // Handle the case where there is no current progress (e.g., set default values or handle as needed)
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      fetchData();
      fetchCourseProgressId()
    }, [id]); // Dependencies
    

    useEffect(() => {
      if (courseData && SectionIndex !== null && LectureIndex !== null) {
        handleLectureSelect(SectionIndex, LectureIndex);
      }
    }, [courseData, SectionIndex, LectureIndex]);
    

    const handleLectureSelect = async (sectionIndex, lectureIndex) => {
      //console.log(courseData)
      const section = courseData.course_content.curriculum[sectionIndex];
      const lecture = section.lectures[lectureIndex];

      // Update the individual states with the selected section and lecture info
      setCurrentSectionIndex(sectionIndex);
      setCurrentLectureIndex(lectureIndex);
      setVideoId(lecture.videoId || "");  // Use an empty string as the default if there's no videoId
      
      try {
        
        const response = await axios.patch(`https://udemy-clone-0d698fd51660.herokuapp.com/course-progress/${progressid}`, {
          currentSectionIndex: sectionIndex,
          currentLectureIndex: lectureIndex
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Error updating lecture progress', error)
      }
    };
    
    const fetchCourseProgressId = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('https://udemy-clone-0d698fd51660.herokuapp.com/course-progress', {
          headers: { Authorization: `Bearer ${token}` },
          params: { 
            courseId: id,
            userId: personalDetails._id}
        });
        //console.log('res', response)
        // Assuming the first item in the data array is the record you want to update
        const courseProgress = response.data.data[0]; // Adjust based on your API response structure
        //console.log('courseProgress', courseProgress._id)
        setProgressId(courseProgress._id); // Return the unique ID of the course progress record
      } catch (error) {
        console.error('Error fetching course progress ID:', error);
        return null; // Return null in case of error
      }
    };
    

    return (
      <div>

        <div className='header-contentPage'>
          <div className='logo'>
            <a href='/homepage'>
              <img src='https://www.udemy.com/staticx/udemy/images/v7/logo-udemy-inverted.svg' alt='udemy logo' />
            </a>
          </div>
          <div className='course-title'>
            <button className='back-icon' onClick={() => {
              navigate('/homepage')
            }}>
              <IoMdArrowRoundBack />
            </button>
            <h2>{courseData ? courseData.basic.title : 'unknown'}</h2>
          </div>
        </div>
        <div className='video-player-cntr'>
          <VideoPlayer videoId={videoId} />
        </div>
        <div className='section-cntr'>
          {courseData && courseData.course_content.curriculum.map((section, sectionIndex) => (
            <AccordionSection
              key={sectionIndex}
              sectionData={{ ...section, index: sectionIndex }}
              onLectureSelect={handleLectureSelect}
              currentSectionIndex={SectionIndex}
              currentLectureIndex={LectureIndex}
            />
          ))}
        </div>
      </div>
    )
}

export default Content
