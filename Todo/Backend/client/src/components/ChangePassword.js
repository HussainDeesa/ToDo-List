import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { Alert } from './Alert'
export default function About(props) {
    let navigate = useNavigate();
    const [crediantials, setCrediantials] = useState({ name: "", password: "" })
    const [newcrediantials, setNewCrediantials] = useState({ newpassword: "", newcpassword: "" })

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
        let email = json.email
        setName(name)
    };
    getuser()
    const handleOnChange = (e) => {
        setCrediantials({ ...crediantials, [e.target.name]: e.target.value })
        setNewCrediantials({ ...crediantials, [e.target.name]: e.target.value })
    }
    let form_checkuser = document.getElementById('form-checkuser')
    let form_changepassword = document.getElementById('form-changepassword')
    let form_passwordchanged = document.getElementById('form-passwordchanged')

    const checkuser = async (e) => {
        e.preventDefault();
        // API Call
        const response = await fetch('api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name, password: crediantials.password })
        });
        props.setprogress(20)
        const json = await response.json()
        props.setprogress(50)
        if (!json.success) {
            props.setprogress(90)
            props.showAlert("Enter correct password");
        }
        if (json.success) {
            form_checkuser.classList.add('hide')
            form_changepassword.classList.remove('hide')
        }
        props.setprogress(100)
    }
    const changepassword = async (e) => {
        if (newcrediantials.newcpassword === newcrediantials.newpassword) {
            e.preventDefault();
            // API Call
            const response = await fetch('api/auth/changepassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name, newpassword: newcrediantials.newpassword })
            });
            props.setprogress(20)
            const json = await response.json()
            props.setprogress(50)
            if (!json.success) {
                props.setprogress(90)
                props.showAlert("Enter correct password");
            }
            else {
                form_changepassword.classList.add('hide')
                form_passwordchanged.classList.remove('hide')
                localStorage.removeItem('token')

            }
        }
        else {
            e.preventDefault()
            props.showAlert("*Password and Confirm Password are different")
        }
        props.setprogress(100)
    }
    return (
        <div className='container my-3'>
            <div className=' form-template' id='form-checkuser'>
                <div className='head'>
                    <h4 className='changepassword-form-title mb-5'>Change Password</h4>
                </div>
                <div className='form'>
                    <form onSubmit={checkuser}>
                        <div>
                            <label htmlFor="name" className="changeuser-label ">Username : </label>
                            <input type="text" value={name} className=" my-2 username-label" id="name" name='name' required /><br />
                            <label htmlFor="password" className="changepassword-label ">Enter current password:</label>
                            <input type="text" value={crediantials.password} onChange={handleOnChange} className="form-control my-2 changeuser-input" id="password" name='password' required />
                        </div>
                        <button type="submit" className="btn my-3 btn-primary changeuser-btn" >Verify</button>
                    </form>
                </div>
                <Alert alert={props.alert} />
            </div>
            <div className='hide form-template' id='form-changepassword'>
                <form onSubmit={changepassword}>
                    <label htmlFor="newpassword" className="newpassword-label ">Enter new password:</label>
                    <input type="password" value={crediantials.newpassword} onChange={handleOnChange} className="form-control my-2 changeuser-input" id="newpassword" name='newpassword' required />

                    <label htmlFor="newcpassword" className="newcpassword-label ">Confirm new password:</label>
                    <input type="text" value={crediantials.newcpassword} onChange={handleOnChange} className="form-control my-2 changeuser-input" id="newcpassword" name='newcpassword' required />
                    <button type="submit" className="btn my-3 btn-primary changeuser-btn" >Change Password</button>
                </form>
                <Alert alert={props.alert} />

            </div>
            <div className='hide form-template' id='form-passwordchanged'>
                Password has been changed successfully!!
                <br />Kindly login to continue <br />

                <Link to='/login' className='userchanged-btn'><div className="btn my-3 btn-primary  changeuser-btn" >Login</div></Link>

            </div>
        </div >
    )
}
