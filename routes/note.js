const routerNotes = require('express').Router();

const {
  getNote, patchNote, addNote, deleteNote, getNoteThemes,
} = require('../controllers/note');

const {
  validationGetNotes, validationAddNote, validationPatchNotes, validationDeleteNotes,
} = require('../middlewares/validationNote');

routerNotes.post('/add', validationAddNote, addNote);

routerNotes.get('/themes', validationGetNotes, getNoteThemes);

routerNotes.get('/get/:noteId', validationGetNotes, getNote);

routerNotes.patch('/patch', validationPatchNotes, patchNote);

routerNotes.delete('/delete/:noteId', validationDeleteNotes, deleteNote);

module.exports = routerNotes;
