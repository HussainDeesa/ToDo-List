import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from "../context/noteContext"
import NoteItem from './NoteItem'
import { AddNote } from './AddNote'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useNavigate } from "react-router-dom";
import { Alert } from './Alert'

export const Notes = (props) => {
    const {setprogress,showAlert,alert}=props
    props.setprogress(0)
    let navigate = useNavigate();
    const context = useContext(noteContext)
    const { notes, getallnotes, editNote } = context
    useEffect(() => {
        if (localStorage.getItem('token')) {
            getallnotes()
            props.setprogress(100)
        }
        else {
            navigate('/login')
        }
        // eslint-disable-next-line
    }, [])
    const [note, setNote] = useState({ id: "", etitle: "",  etag: "" })

    const ref = useRef(null)
    const updateNote = (currentNote) => {
        props.setprogress(10)
        setShow(true)
        props.setprogress(30)
        setNote({ id: currentNote._id, etitle: currentNote.title, etag: currentNote.tag, })
        props.setprogress(100)

    }
    const handleSubmit = (e) => {
        props.setprogress(10)
        e.preventDefault()
        props.setprogress(50)
        if (note.etitle.length === 0 ) {
            props.showAlert("Title cannot be empty")
            props.setprogress(100)
        }
        else {
            editNote(note.id, note.etitle, note.etag)
            setShow(false)
            props.setprogress(70)
            props.setprogress(100)
        }
    }

    const handleOnChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }


    const [show, setShow] = useState(false)


    const handleClose = () => {
        setShow(false)
    }
    return (
        <>
            <AddNote showAlert={showAlert} alert={alert} setprogress={setprogress} />
            <Button ref={ref} variant="primary" className='d-none'>
                Launch demo modal
            </Button>

            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Note</Modal.Title>
                </Modal.Header>
                <hr className='edit-modal-hr' />
                <Modal.Body showAlert={showAlert} >
                    <form className='my-3' >
                        <div className="mb-3">
                            <label htmlFor="etitle" className="form-label">Title</label>
                            <input type="text" value={note.etitle} className="form-control" id="etitle" name='etitle' onChange={handleOnChange} />

                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="etag" className="form-label">Tag</label>
                            <input type="text" value={note.etag} className="form-control" id="etag" name="etag" onChange={handleOnChange} />
                        </div>
                        <Alert alert={props.alert}/>
                    </form></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button  onClick={handleSubmit} variant="primary" className='edit-modal-submit' >
                        Update Note
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className='row my-3'>
                <h3 className='your-notes-heading'>Todo List</h3>
                <div className='container'>
                    {notes.length === 0 && "No Notes to display!"}</div>
                {notes.map((note) => {
                    return <NoteItem key={note._id} note={note} updateNote={updateNote} />
                })}
            </div>
        </>
    )
}
