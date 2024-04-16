import React from 'react';

// A simple Star component that takes `filled` as a prop to determine if it should render a filled or empty star
const Star = ({ filled }) => {
  const starCharacter = filled ? '★' : '☆';
  return <span style={{ color: filled ? 'gold' : 'grey' }}>{starCharacter}</span>;
};

// The StarRating component that renders a 5-star rating based on a `rating` prop
const StarRating = ({ rating,noOfRaters }) => {
  const totalStars = 5;
  const filledStars = Math.round(rating);
  let stars = [];
  
  // Loop 5 times to create stars
  for (let i = 0; i < totalStars; i++) {
    stars.push(<Star key={i} filled={i < filledStars} />);
  }

  return <div className='star-rating'><b>{rating}</b> {stars} ({noOfRaters})</div>;
};

export default StarRating;
