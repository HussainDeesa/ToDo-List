import React, { useState } from "react";
import noteContext from "./noteContext";

const NoteState = (props) => {

   // const host = 'http://localhost:5000/'
   const notesInitial = []
   const [notes, setNotes] = useState(notesInitial)

   // Fetch All note
   const getallnotes = async () => {
      // API Call
      // const response = await fetch(`${host}api/notes/fetchallnotes`, {
      const response = await fetch('api/notes/fetchallnotes', {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
         }
      });
      const json=await response.json()
      setNotes(json)
      
   }

   // ADD note
   const addNote = async (title, tag) => {
      
      // API Call
      // const response = await fetch(`${host}api/notes/addnote`, {
      const response = await fetch('api/notes/addnote', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
         },
         body: JSON.stringify({title, tag})
      });
      const note = await response.json()
      setNotes(notes.concat(note))
   }

   // DELETE note
   const deleteNote = async (id) => {
      // API Call
      const response = await fetch(`api/notes/deletenote/${id}`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
         },

      });
      const json = await response.json()
      

      const newNote = notes.filter((note) => { return note._id !== id })
      setNotes(newNote)
   }

   // EDIT note

   const editNote = async (id, title, tag) => {
      // API Call
      const response = await fetch(`api/notes/updatenote/${id}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
         },
         body: JSON.stringify({ title, tag })

      });
      const json =  response.json()
      let newNotes= JSON.parse(JSON.stringify(notes))
      for (let index = 0; index < newNotes.length; index++) {
         const element = newNotes[index];
         if (element._id === id) {
            newNotes[index].title = title;
            newNotes[index].tag = tag;
            break;
         }
      }
       setNotes(newNotes)
   }
   
   return (
      <noteContext.Provider value={{ notes, addNote, deleteNote, editNote,getallnotes }}>
         {props.children}
      </noteContext.Provider>
   )
}

export default NoteState;