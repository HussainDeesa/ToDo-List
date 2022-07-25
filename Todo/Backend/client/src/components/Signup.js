import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { Alert } from './Alert';

const Signup = (props) => {
    props.setprogress(0)
    let navigate = useNavigate();
    const [crediantials, setCrediantials] = useState({ name: "", email: "", password: "", cpassword: "" })

    const handleSubmit = async (e) => {
        
        props.setprogress(10)
        if (crediantials.password === crediantials.cpassword) {
            e.preventDefault();
            props.setprogress(20)
            const response = await fetch(`api/auth/createuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: crediantials.name, email: crediantials.email, password: crediantials.password })
            })

            const json = await response.json()
            console.log(json.successname);
            props.setprogress(50)
            if (json.success) {
                props.setprogress(70)
                localStorage.setItem('token', json.authToken)
                props.setprogress(100)
                navigate('/');
            }
            if(json.success===false) {
                props.setprogress(100)
                props.showAlert("*User with this email already exists")
            }
            if(json.successname===false) {
                props.setprogress(100)
                props.showAlert("*User with this Username already exists")
            }
        }

        else {
            props.setprogress(100)
            e.preventDefault()
            props.showAlert("*Password and Confirm Password are different")
        }
    };

    const handleOnChange = (e) => {
        setCrediantials({ ...crediantials, [e.target.name]: e.target.value })
    }

    return (
        <div className='container my-3'>
            <div className='form-template' id='form-login' >
                <div className='head'>
                    <h3 className='form-title'>Sign Up</h3>
                </div>
                <div className='form'>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="name" className="form-label">Username</label>
                        <input type="text" onChange={handleOnChange} className="form-control" name='name' id="name" required minLength={3} />
                        <label htmlFor="email" className="form-label">Email </label>
                        <input type="email" onChange={handleOnChange} className="form-control" name='email' id="email" aria-describedby="emailHelp" required />

                        <label htmlFor="password" className="form-label">Password </label>
                        <input type="password" onChange={handleOnChange} className="form-control" name='password' id="password" required minLength={7} />
                        <label htmlFor="cpassword" className="form-label">Confirm Password </label>
                        <input type="password" onChange={handleOnChange} className="form-control" name='cpassword' id="cpassword" required minLength={7} />

                        <button type="submit" className="btn btn-primary form-btn">Signup</button>
                    </form>
                        <Alert alert={props.alert}/>
                        <div className='log-sig-redirect'> Already have an account? <Link to='/login'>Login</Link></div>
                </div>

            </div>
        </div>

    )
}

export default Signup