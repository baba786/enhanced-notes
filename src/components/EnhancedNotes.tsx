'use client';
import React, { useState, useEffect, useReducer, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PenLine, Wand2, Search, Moon, Sun, X, Maximize2, Minimize2, Trash2 } from "lucide-react";
import { cn } from '@/src/lib/utils';
import { executeQuery } from '@/src/lib/db';

interface Note {
  id: number;
  title: string;
  content: string;
}

interface AnalysisResult {
  summary: string;
  knowledge: Array<{
    concept: string;
    explanation: string;
    resources: Array<{
      title: string;
      url: string;
    }>;
  }>;
  actions: string[];
}

type NotesAction = 
  | { type: 'ADD_NOTE', payload: Note }
  | { type: 'UPDATE_NOTE', payload: Note }
  | { type: 'DELETE_NOTE', payload: number }
  | { type: 'SET_NOTES', payload: Note[] };

const notesReducer = (state: Note[], action: NotesAction): Note[] => {
  switch (action.type) {
    case 'ADD_NOTE':
      return [...state, action.payload];
    case 'UPDATE_NOTE':
      return state.map(note => note.id === action.payload.id ? action.payload : note);
    case 'DELETE_NOTE':
      return state.filter(note => note.id !== action.payload);
    case 'SET_NOTES':
      return action.payload;
    default:
      return state;
  }
};

export default function EnhancedNotes() {
  const [notes, dispatch] = useReducer(notesReducer, []);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isDarkMode') === 'true';
    }
    return false;
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const result = await executeQuery('SELECT * FROM notes');
        dispatch({ type: 'SET_NOTES', payload: result.rows });
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('isDarkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const filteredNotes = useMemo(() => 
    notes.filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [notes, searchTerm]
  );

  const handleNewNote = () => {
    const newNote: Note = { id: Date.now(), title: "New Note", content: "" };
    dispatch({ type: 'ADD_NOTE', payload: newNote });
    setActiveNote(newNote);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    dispatch({ type: 'UPDATE_NOTE', payload: updatedNote });
    setActiveNote(updatedNote);
  };

  const handleDeleteNote = (note: Note) => {
    setNoteToDelete(note);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteNote = () => {
    if (noteToDelete) {
      dispatch({ type: 'DELETE_NOTE', payload: noteToDelete.id });
      setActiveNote(notes.length > 1 ? notes[0] : null);
      setNoteToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCloseNote = () => {
    setActiveNote(null);
  };

  const handleAnalyze = async () => {
    if (!activeNote) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Simulating API call to AI services for analysis
      const result = await new Promise<AnalysisResult>((resolve) => {
        setTimeout(() => {
          resolve({
            summary: "This note discusses project timelines, milestones, and the implementation of a new machine learning algorithm. Key points include setting realistic deadlines and understanding the basics of machine learning.",
            knowledge: [
              {
                concept: "Machine Learning",
                explanation: "Machine Learning is a subset of artificial intelligence that focuses on the development of algorithms and statistical models that enable computer systems to improve their performance on a specific task through experience.",
                resources: [
                  { title: "Introduction to Machine Learning", url: "https://www.coursera.org/learn/machine-learning" },
                  { title: "Machine Learning Guide", url: "https://developers.google.com/machine-learning/guides" }
                ]
              },
              {
                concept: "Project Timeline",
                explanation: "A project timeline is a visual representation of the chronological sequence of tasks and milestones in a project. It helps in planning, tracking progress, and managing resources effectively.",
                resources: [
                  { title: "Creating Effective Project Timelines", url: "https://www.pmi.org/learning/library/developing-effective-project-timelines-6896" }
                ]
              }
            ],
            actions: [
              "Research machine learning algorithms suitable for the project",
              "Create detailed project timeline with key milestones",
              "Schedule team meeting to discuss ML implementation strategy"
            ]
          });
        }, 2000);
      });

      setAnalysisResult(result);
    } catch (err) {
      setError("An error occurred while analyzing the note. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode);
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      {!isFocusMode && (
        <div className="w-64 bg-gray-100 dark:bg-gray-800 p-4 flex flex-col border-r border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">EnhancedNotes</h1>
            <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)} aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
          <Button className="mb-4 bg-blue-500 hover:bg-blue-600 text-white" onClick={handleNewNote}>
            <PenLine className="mr-2 h-4 w-4" />
            New Note
          </Button>
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search notes" 
              className="pl-8 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" 
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              aria-label="Search notes"
            />
          </div>
          <div className="flex-1 overflow-auto">
            {filteredNotes.map((note) => (
              <Button
                key={note.id}
                variant="ghost"
                className="w-full justify-start mb-1 px-2 py-1 h-auto text-left hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => setActiveNote(note)}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium text-gray-800 dark:text-gray-200">{note.title}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{note.content.slice(0, 30)}...</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className={`flex-1 flex flex-col bg-white dark:bg-gray-900 ${isFocusMode ? 'p-4' : ''}`}>
        {activeNote ? (
          <>
            <header className="bg-white dark:bg-gray-800 p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
              <Input 
                value={activeNote.title} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateNote({...activeNote, title: e.target.value})}
                className="text-xl font-semibold bg-transparent border-none text-gray-800 dark:text-gray-200 focus:ring-0"
                aria-label="Note title"
              />
              <div className="flex items-center space-x-2">
                <Button onClick={handleAnalyze} disabled={isAnalyzing} className="bg-blue-500 hover:bg-blue-600 text-white">
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Analyze
                    </>
                  )}
                </Button>
                <Button variant="ghost" onClick={toggleFocusMode} aria-label={isFocusMode ? "Exit focus mode" : "Enter focus mode"}>
                  {isFocusMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                {!isFocusMode && (
                  <>
                    <Button variant="ghost" onClick={() => handleDeleteNote(activeNote)} aria-label="Delete note">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" onClick={handleCloseNote} aria-label="Close note">
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </header>
            <main className="flex-1 p-4 overflow-auto flex">
              <Textarea
                value={activeNote.content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleUpdateNote({...activeNote, content: e.target.value})}
                className="flex-1 resize-none bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                placeholder="Start typing your notes here..."
                aria-label="Note content"
              />
              {analysisResult && !isFocusMode && (
                <div className="w-96 bg-gray-100 dark:bg-gray-800 p-4 ml-4 rounded-lg overflow-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Analysis</h3>
                    <Button variant="ghost" size="icon" onClick={() => setAnalysisResult(null)} aria-label="Close analysis">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Tabs defaultValue="summary">
                    <TabsList className="w-full bg-white dark:bg-gray-700">
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                      <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
                      <TabsTrigger value="actions">Actions</TabsTrigger>
                    </TabsList>
                    <TabsContent value="summary" className="py-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{analysisResult.summary}</p>
                    </TabsContent>
                    <TabsContent value="knowledge" className="py-4">
                      {analysisResult.knowledge.map((item, index) => (
                        <div key={index} className="mb-4 bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                          <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">{item.concept}</h4>
                          <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{item.explanation}</p>
                          <h5 className="text-sm font-semibold mt-2 text-blue-600 dark:text-blue-400">Learn More:</h5>
                          <ul className="list-disc list-inside">
                            {item.resources.map((resource, idx) => (
                              <li key={idx} className="text-sm">
                                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">
                                  {resource.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </TabsContent>
                    <TabsContent value="actions" className="py-4">
                      <ul className="space-y-2">
                        {analysisResult.actions.map((action, index) => (
                          <li key={index} className="flex items-center">
                            <input type="checkbox" className="mr-2 form-checkbox h-4 w-4 text-blue-600" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </main>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            No note selected or create a new note to get started.
          </div>
        )}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this note?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your note.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteNote}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-md shadow-lg">
          {error}
        </div>
      )}
    </div>
  )
}