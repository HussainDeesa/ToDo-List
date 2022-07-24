import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import '../App.css';

export default function Navbar() {
  const navigate = useNavigate()
  const handlelogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    navigate('/login')
  }
  return (
    <div >
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid" >
          <Link className="navbar-brand" to="/">ToDo</Link>

          {localStorage.getItem('token') &&
          <>
            <div className="nav-item">
              <Link aria-current="page" to="/">Dashboard </Link>
            </div>
              <div className="nav-item">
              <Link aria-current="page" to="/profile" > Profile</Link>
            </div>
            </>}

          <form className="d-flex log-sign">
            {!localStorage.getItem('token') ?
              <div><Link className="btn btn-outline-primary mx-2" to="/login" role="button">Login</Link>
                <Link className="btn btn-outline-primary" to="/signup" role="button">Signup</Link></div> : <Link className="btn btn-outline-primary" to="/login" role="button" onClick={handlelogout}>Logout</Link>
            }
          </form>
        </div>
      </nav>
    </div>
  )
}
