import React from 'react';
import PropTypes from 'prop-types';
import './NoteCard.css';

/**
 * NoteCard – displays a single note preview with edit and delete actions.
 *
 * Props
 * -----
 * note: {
 *   id: string,
 *   title: string,
 *   content: string,
 *   createdAt: string | Date,
 *   updatedAt: string | Date,
 * }
 * onEdit: (id: string) => void
 * onDelete: (id: string) => void
 */
const NoteCard = ({ note, onEdit, onDelete }) => {
  const {
    id,
    title,
    content,
    createdAt,
    updatedAt,
  } = note;

  // Helper to format dates consistently
  const formatDate = (date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Show only the first 150 characters of the content
  const preview = content.length > 150 ? `${content.slice(0, 147)}...` : content;

  const handleEdit = () => onEdit(id);
  const handleDelete = () => {
    // Confirm before deletion for safety
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(id);
    }
  };

  return (
    <article className="note-card" aria-labelledby={`note-title-${id}`}>
      <header className="note-card__header">
        <h2 id={`note-title-${id}`} className="note-card__title">
          {title || 'Untitled'}
        </h2>
        <div className="note-card__actions">
          <button
            type="button"
            className="note-card__btn note-card__btn--edit"
            onClick={handleEdit}
            aria-label={`Edit note titled ${title || 'Untitled'}`}
          >
            ✏️
          </button>
          <button
            type="button"
            className="note-card__btn note-card__btn--delete"
            onClick={handleDelete}
            aria-label={`Delete note titled ${title || 'Untitled'}`}
          >
            🗑️
          </button>
        </div>
      </header>

      <p className="note-card__content">{preview}</p>

      <footer className="note-card__footer">
        <time
          className="note-card__date"
          dateTime={new Date(createdAt).toISOString()}
          title={`Created on ${formatDate(createdAt)}`}
        >
          Created: {formatDate(createdAt)}
        </time>
        {updatedAt && (
          <time
            className="note-card__date note-card__date--updated"
            dateTime={new Date(updatedAt).toISOString()}
            title={`Last updated on ${formatDate(updatedAt)}`}
          >
            Updated: {formatDate(updatedAt)}
          </time>
        )}
      </footer>
    </article>
  );
};

NoteCard.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
      .isRequired,
    updatedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default React.memo(NoteCard);