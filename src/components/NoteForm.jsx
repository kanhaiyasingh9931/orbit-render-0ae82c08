import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * NoteForm – a reusable form for creating and editing notes.
 *
 * Props
 * -----
 * - initialNote: optional note object used to pre‑populate the form when editing.
 * - onSubmit:   function called with the note payload when the form is valid.
 * - onCancel:   optional callback invoked when the user clicks the Cancel button.
 *
 * The component performs simple validation (non‑empty title & content) and
 * returns a note object that includes `id`, `createdAt`, and `updatedAt`
 * timestamps when appropriate. All UI elements are accessible and styled
 * via class names that can be defined in `src/index.css`.
 */
function NoteForm({ initialNote, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const [errors, setErrors] = useState({});

  // Sync form fields when `initialNote` changes (e.g., switching from add → edit)
  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title || '');
      setContent(initialNote.content || '');
    } else {
      setTitle('');
      setContent('');
    }
  }, [initialNote]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!content.trim()) newErrors.content = 'Content is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const timestamp = new Date().toISOString();

    const note = {
      // Preserve existing identifiers when editing
      ...(initialNote?.id && { id: initialNote.id }),
      ...(initialNote?.createdAt && { createdAt: initialNote.createdAt }),
      title: title.trim(),
      content: content.trim(),
      updatedAt: timestamp,
      // Assign new identifiers for brand‑new notes
      ...(initialNote?.id ? {} : { id: Date.now().toString(), createdAt: timestamp }),
    };

    onSubmit(note);

    // Reset fields only when creating a fresh note
    if (!initialNote) {
      setTitle('');
      setContent('');
      setErrors({});
    }
  };

  return (
    <form className="note-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="note-title">Title</label>
        <input
          id="note-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={errors.title ? 'invalid' : ''}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
          placeholder="Enter note title"
          required
        />
        {errors.title && (
          <span id="title-error" className="error-message" role="alert">
            {errors.title}
          </span>
        )}
        {/* Character counter for title */}
        <div className="char-counter" aria-live="polite">
          {title.length} characters
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="note-content">Content</label>
        <textarea
          id="note-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={errors.content ? 'invalid' : ''}
          aria-invalid={!!errors.content}
          aria-describedby={errors.content ? 'content-error' : undefined}
          placeholder="Write your note..."
          rows={6}
          required
        />
        {errors.content && (
          <span id="content-error" className="error-message" role="alert">
            {errors.content}
          </span>
        )}
        {/* Character counter for content */}
        <div className="char-counter" aria-live="polite">
          {content.length} characters
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialNote ? 'Update Note' : 'Add Note'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

NoteForm.propTypes = {
  /** Pre‑filled note data for edit mode */
  initialNote: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
  /** Callback receiving the note object when the form is submitted */
  onSubmit: PropTypes.func.isRequired,
  /** Optional callback for Cancel button */
  onCancel: PropTypes.func,
};

NoteForm.defaultProps = {
  initialNote: null,
  onCancel: null,
};

export default NoteForm;
