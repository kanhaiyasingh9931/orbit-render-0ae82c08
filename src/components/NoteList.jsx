import React from 'react';
import PropTypes from 'prop-types';
import NoteCard from './NoteCard';
import './NoteList.css';

const NoteList = ({ notes, onEdit, onDelete, onAdd }) => {
  if (notes.length === 0) {
    return (
      <div className="note-list-empty" role="status" aria-live="polite">
        <div className="empty-state-icon" aria-hidden="true">
          📝
        </div>
        <h2 className="empty-state-title">No notes yet</h2>
        <p className="empty-state-description">
          Get started by creating your first note.
        </p>
        <button 
          type="button" 
          className="btn btn-primary empty-state-btn"
          onClick={onAdd}
          aria-label="Create a new note"
        >
          + Create Note
        </button>
      </div>
    );
  }

  return (
    <div className="note-list-container">
      <div className="note-list-header">
        <h2 className="note-list-title">
          My Notes
          <span className="note-count" aria-label={`${notes.length} notes total`}>
            ({notes.length})
          </span>
        </h2>
        <button 
          type="button" 
          className="btn btn-primary add-note-btn"
          onClick={onAdd}
          aria-label="Add a new note"
        >
          + New Note
        </button>
      </div>
      
      <ul className="note-grid" role="list" aria-label="List of notes">
        {notes.map((note) => (
          <li key={note.id} className="note-grid-item">
            <NoteCard 
              note={note} 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

NoteList.propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default React.memo(NoteList);