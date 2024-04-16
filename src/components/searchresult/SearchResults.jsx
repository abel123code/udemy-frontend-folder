import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import CourseBasic from '../homepage/homepageComponents/CourseBasic';
import Header from '../keycomponent/header/Header';
import './searchResults.css'
import HeaderPhone from '../keycomponent/header-phone/HeaderPhone';
import useWindowSize from '../../services/useWindowSize';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function SearchResults() {
    const query = useQuery();
    const searchQuery = query.get('search');
    const [results, setResults] = useState([]);
    const isMobile = useWindowSize()


    useEffect(() => {
        if (searchQuery) {
            axios.get(`https://udemy-clone-0d698fd51660.herokuapp.com/courses?search=${searchQuery}`)
            .then(response => {
                //console.log(response.data.data)
                setResults(response.data.data);
            })
            .catch(error => console.error('There was an error!', error));
        }
    },[searchQuery])



    return (
        <div className='search_result_ctnr'>
            {isMobile ? <HeaderPhone /> : <Header />}
            <div className='search_result'>
                <h2>{results.length} results for "{searchQuery}"</h2>
                {results.length > 0 ? (
                    results.map((course,index) => {
                        return <CourseBasic 
                        key={index}
                        id={course._id}
                        thumbnail={course.basic.thumbnail_url}
                        title={course.basic.title}
                        description={course.short_description}
                        rating={course.basic.rating}
                        noOfRaters={course.basic.number_of_ratings}
                        creator={course.basic.instructor.name}
                        price={course.basic.price.current} />
                    })) : (
                        <div className='no_results'>
                            <h2>Sorry, we couldn't find any results for "{searchQuery}"</h2>
                            <p>Try adjusting your search. Here are some ideas:</p>
                            <ul>
                                <li>Make sure all words are spelled correctly</li>
                                <li>Try different search terms</li>
                                <li>Try more general search terms</li>
                            </ul>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default SearchResults
