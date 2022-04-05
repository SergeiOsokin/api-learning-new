const routerNotes = require('express').Router();

const {
  getNote, patchNote, addNote, deleteNote, getNoteThemes,
} = require('../controllers/note');

const {
  validationGetNotes, validationAddNote, validationPatchNotes, validationDeleteNotes,
} = require('../middlewares/validationNote');

routerNotes.post('/addnote', validationAddNote, addNote);

routerNotes.get('/notethemes', validationGetNotes, getNoteThemes);

routerNotes.get('/getnote/:noteId', validationGetNotes, getNote);

routerNotes.patch('/patchnote', validationPatchNotes, patchNote);

routerNotes.delete('/deletenote/:noteId', validationDeleteNotes, deleteNote);

module.exports = routerNotes;
