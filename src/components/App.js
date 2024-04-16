import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Discover from './discover/Discover';
import Login from './login/Login';
import Homepage from './homepage/Homepage';
import ProtectedRoute from './protectedRoute/ProtectedRoute';
import Register from './register/Register';
import Coursepage from './coursepage/Coursepage';
import Content from './contentpage/Content';
import SearchResults from './searchresult/SearchResults'
import Business from './Business';
import AddToCartResult from './keycomponent/header-phone/add-to-cart-result/AddToCartResult';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Discover />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path="/homepage" element={
                  <ProtectedRoute>
                      <Homepage />
                  </ProtectedRoute>
      } />
      <Route path="/homepage/:genreName" element={
                  <ProtectedRoute>
                      <Homepage />
                  </ProtectedRoute>
      } />
      <Route path='/courses/:id' element={<Coursepage />} />
      <Route path='/course-content/:id' element={<Content />} />
      <Route path='/search' element={<SearchResults />} />
      <Route path='/business' element={<Business />} />
      <Route path='/addToCart-viewer' element={<AddToCartResult />} />
    </Routes>
  )
}

export default App