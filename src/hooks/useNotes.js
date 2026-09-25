/**
 * useNotes.js
 *
 * Custom React hook that provides a full CRUD interface for managing notes.
 * Notes are persisted in `localStorage` so they survive page reloads and
 * browser restarts. The hook abstracts all state handling, timestamps,
 * and synchronization logic, making it easy to consume from any component.
 *
 * Note shape:
 * {
 *   id: string,          // unique identifier (UUID)
 *   title: string,       // note title
 *   content: string,     // note body/content
 *   createdAt: string,   // ISO timestamp when the note was created
 *   updatedAt: string    // ISO timestamp of the last update
 * }
 */

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'notes-app-data';

/**
 * Generates a UUID using the Web Crypto API if available,
 * otherwise falls back to a simple pseudo‑random string.
 */
function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Loads notes from localStorage. Returns an empty array on failure.
 */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Ensure we have an array of objects with required fields
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load notes from localStorage:', e);
  }
  return [];
}

/**
 * Persists notes to localStorage.
 * @param {Array} notes
 */
function saveToStorage(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save notes to localStorage:', e);
  }
}

/**
 * Custom hook exposing notes state and CRUD operations.
 *
 * @returns {{
 *   notes: Array,
 *   addNote: (title:string, content:string) => string,
 *   updateNote: (id:string, updates:{title?:string, content?:string}) => void,
 *   deleteNote: (id:string) => void,
 *   getNote: (id:string) => Object|undefined
 * }}
 */
export default function useNotes() {
  const [notes, setNotes] = useState([]);

  // Initialise notes from localStorage on first render
  useEffect(() => {
    setNotes(loadFromStorage());
  }, []);

  // Keep localStorage in sync whenever notes change
  useEffect(() => {
    saveToStorage(notes);
  }, [notes]);

  /**
   * Adds a new note.
   *
   * @param {string} title
   * @param {string} content
   * @returns {string} The generated note id.
   */
  const addNote = useCallback((title = '', content = '') => {
    const timestamp = new Date().toISOString();
    const newNote = {
      id: generateId(),
      title: title.trim(),
      content: content.trim(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    // Insert at the beginning to show newest first
    setNotes(prev => [newNote, ...prev]);
    return newNote.id;
  }, []);

  /**
   * Updates an existing note.
   *
   * @param {string} id - Identifier of the note to update.
   * @param {{title?:string, content?:string}} updates - Fields to update.
   */
  const updateNote = useCallback((id, updates = {}) => {
    setNotes(prev =>
      prev.map(note => {
        if (note.id !== id) return note;
        const updated = {
          ...note,
          ...updates,
          // Preserve original createdAt, refresh updatedAt
          updatedAt: new Date().toISOString(),
        };
        // Trim strings to avoid accidental whitespace
        if (typeof updated.title === 'string') updated.title = updated.title.trim();
        if (typeof updated.content === 'string') updated.content = updated.content.trim();
        return updated;
      })
    );
  }, []);

  /**
   * Deletes a note by its id.
   *
   * @param {string} id
   */
  const deleteNote = useCallback(id => {
    setNotes(prev => prev.filter(note => note.id !== id));
  }, []);

  /**
   * Retrieves a single note.
   *
   * @param {string} id
   * @returns {Object|undefined}
   */
  const getNote = useCallback(
    id => notes.find(note => note.id === id),
    [notes]
  );

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNote,
  };
}