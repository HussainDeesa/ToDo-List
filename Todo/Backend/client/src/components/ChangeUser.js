import React, { useState, useContext } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { Alert } from './Alert'
export default function About(props) {
    let navigate = useNavigate();
    const [crediantials, setCrediantials] = useState({ name: "" })
    props.setprogress(0)
    const [name, setName] = useState('')
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
        setName(name)
    };
    getuser()
    const handleOnChange = (e) => {
        setCrediantials({ ...crediantials, [e.target.name]: e.target.value })
    }
    let form_changeuser = document.getElementById('form-changeuser')
    let form_userchanged = document.getElementById('form-userchanged')
    const updateuser = async (e) => {
        e.preventDefault();
        console.log(name);
        // API Call
        const response = await fetch('api/auth/changeuser', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ name: crediantials.name })
        });
        props.setprogress(20)
        const json = await response.json()
        props.setprogress(50)
        if (json.successname) {
            props.setprogress(90)
            form_changeuser.classList.add('hide')
            form_userchanged.classList.remove('hide')
            localStorage.removeItem('token')
        }
        else {
            props.setprogress(100)
            props.showAlert("Username is already taken");
        }
        props.setprogress(100)
    }
    return (
        <div className='container my-3'>
            <div className='form-template' id='form-changeuser'>
                <div className='head'>
                    <h4 className='changeuser-form-title mb-5'>Change Username</h4>
                </div>
                <div className='form'>
                    <form onSubmit={updateuser}>
                        <div>
                            Existing username :<span style={{ "fontWeight": 700 }}> {name}</span>  <br /><br />
                            <label htmlFor="name" className="changeuser-label ">Enter new username :</label>
                            <input type="text" value={crediantials.name} onChange={handleOnChange} className="form-control my-2 changeuser-input" id="name" name='name' required />
                        </div>
                        <button type="submit" className="btn my-3 btn-primary changeuser-btn" >Change username</button>
                    </form>
                </div>
                <Alert alert={props.alert} />
            </div>
            <div className='hide form-template' id='form-userchanged'>
                Username has been changed to : <span style={{ "fontWeight": 700 }}>{crediantials.name}</span> <br />Kindly login to continue <br />

                <Link to='/login' className='userchanged-btn'><div className="btn my-3 btn-primary  changeuser-btn" >Login</div></Link>

            </div>
        </div >
    )
}
