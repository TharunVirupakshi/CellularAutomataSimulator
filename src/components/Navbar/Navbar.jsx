import React from 'react'
import './navbar.css'

const Navbar = ({aboutFunction, helpFunction}) => {
  return (
      <div className="navbar-container">
          <div className='logo-container'><h1>GridLife.</h1></div>

          <ul className="links">
              <li><a onClick={() => aboutFunction()}>About</a></li>
              <li><a onClick={() => helpFunction()}>Help</a></li>
          </ul>

    </div>
  )
}

export default Navbar