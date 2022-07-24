import React, { useState, useContext } from 'react'
import profile from "../images/user.png"
import { Alert } from './Alert'
import { Link } from 'react-router-dom'

export default function About(props) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const getuser = async () => {

        const response = await fetch(`api/auth/getuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
        })
        const json = await response.json()
        let name = json.name
        let email = json.email
        setName(name)
        setEmail(email)
    };
    getuser()
    return (
        <div className='container my-3'>
            <div className='form-template' id='form-profile'>
                <div className='head'>
                    <h3 className='profile-form-title'>Profile</h3>
                </div>
                <div className='form'>
                    <div className='profile-img'>
                        <img src={profile} className="card-img-top my-3" alt="..." />
                    </div>
                    <form>
                        <div className='user-details my-4'>

                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">Username : {name}</li>
                                <li className="list-group-item ">Email ID : {email}</li>

                            </ul>
                        </div>
                        <div className="card-body">
                            <Link to="/changeuser" className="change-username-link">Change Username</Link> <br />
                            <Link to="/changepassword" className="change-password-link">Change password</Link>
                        </div>

                    </form>
                </div>
                {/* </form> */}
                <Alert alert={props.alert} />
            </div>
        </div >
        // </div >
    )
}
