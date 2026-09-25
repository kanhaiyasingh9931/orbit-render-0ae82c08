import React, { useState, useCallback } from 'react';
import NoteList from './components/NoteList';
import NoteForm from './components/NoteForm';
import useNotes from './hooks/useNotes';
import './index.css';

function App() {
  // Custom hook provides CRUD operations and the notes array persisted in localStorage
  const { notes, addNote, updateNote, deleteNote, getNote } = useNotes();

  // UI state: whether the form (add / edit) is visible and which note is being edited
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Open the form for creating a new note
  const handleAddNote = useCallback(() => {
    setEditingNote(null);
    setIsFormOpen(true);
  }, []);

  // Open the form for editing an existing note
  const handleEditNote = useCallback((id) => {
    const note = getNote(id);
    setEditingNote(note || null);
    setIsFormOpen(true);
  }, [getNote]);

  // Delete a note after user confirmation
  const handleDeleteNote = useCallback((id) => {
    const confirmed = window.confirm('Are you sure you want to delete this note?');
    if (confirmed) {
      deleteNote(id);
    }
  }, [deleteNote]);

  // Submit handler shared by both add and edit flows
  const handleFormSubmit = useCallback(
    (formData) => {
      if (editingNote) {
        // Editing existing note
        updateNote(editingNote.id, {
          title: formData.title,
          content: formData.content,
        });
      } else {
        // Adding a brand‑new note
        addNote(formData.title, formData.content);
      }
      setIsFormOpen(false);
      setEditingNote(null);
    },
    [editingNote, addNote, updateNote]
  );

  // Close the form without saving
  const handleCancel = useCallback(() => {
    setIsFormOpen(false);
    setEditingNote(null);
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Orbit Notes</h1>
        {!isFormOpen && (
          <button
            className="add-note-button"
            onClick={handleAddNote}
            aria-label="Add a new note"
          >
            + Add Note
          </button>
        )}
      </header>

      <main className="app-main">
        {isFormOpen ? (
          <NoteForm
            initialNote={editingNote}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        ) : notes.length > 0 ? (
          <NoteList
            notes={notes}
            onEdit={handleEditNote}
            onDelete={handleDeleteNote}
          />
        ) : (
          <p className="empty-state">You have no notes yet. Click “Add Note” to create one.</p>
        )}
      </main>
    </div>
  );
}

export default App;