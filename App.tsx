
import React, { useState, useEffect } from 'react';
import ItineraryForm from './components/ItineraryForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import SavedItineraries from './components/SavedItineraries';
import { generateItinerary } from './services/geminiService';
import type { ItineraryRequest, ItineraryResponse } from './types';
import { TransportMode } from './types';
import SpinnerIcon from './components/icons/SpinnerIcon';

export default function App(): React.ReactElement {
  const [initialFormState] = useState<ItineraryRequest>({
    name: '',
    transportMode: TransportMode.CAR,
    start: '',
    destination: '',
    steps: [],
    currentLocation: null,
  });

  const [itineraryResponse, setItineraryResponse] = useState<ItineraryResponse | null>(null);
  const [submittedRequest, setSubmittedRequest] = useState<ItineraryRequest | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedItineraries, setSavedItineraries] = useState<any[]>([]);

  useEffect(() => {
    // Register Service Worker for PWA capabilities
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, err => {
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }

    // Load saved itineraries from localStorage
    try {
      const stored = localStorage.getItem('savedItineraries');
      if (stored) {
        setSavedItineraries(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load saved itineraries:", e);
      localStorage.removeItem('savedItineraries');
    }
  }, []);

  const handleGenerate = async (request: ItineraryRequest) => {
    setIsLoading(true);
    setError(null);
    setItineraryResponse(null);
    
    try {
      const response = await generateItinerary(request);
      setItineraryResponse(response);
      setSubmittedRequest(request);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inattendue est survenue.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveItinerary = (request: ItineraryRequest, response: ItineraryResponse) => {
    try {
      const existingIndex = savedItineraries.findIndex((item: any) => item.request.name === request.name);

      if (existingIndex !== -1) {
        if (window.confirm(`Un itinéraire avec le nom "${request.name}" existe déjà. Voulez-vous le remplacer ?`)) {
          const updatedItineraries = [...savedItineraries];
          updatedItineraries[existingIndex] = { request, response };
          localStorage.setItem('savedItineraries', JSON.stringify(updatedItineraries));
          setSavedItineraries(updatedItineraries);
          alert(`L'itinéraire "${request.name}" a été mis à jour !`);
        }
      } else {
        const newSavedItineraries = [...savedItineraries, { request, response }];
        localStorage.setItem('savedItineraries', JSON.stringify(newSavedItineraries));
        setSavedItineraries(newSavedItineraries);
        alert(`L'itinéraire "${request.name}" a été enregistré !`);
      }
    } catch (e) {
      console.error("Failed to save itinerary:", e);
      alert("Erreur lors de l'enregistrement de l'itinéraire.");
    }
  };

  const handleDeleteItinerary = (name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'itinéraire "${name}" ?`)) {
        const updatedItineraries = savedItineraries.filter(item => item.request.name !== name);
        localStorage.setItem('savedItineraries', JSON.stringify(updatedItineraries));
        setSavedItineraries(updatedItineraries);
        if (submittedRequest?.name === name) {
            setItineraryResponse(null);
            setSubmittedRequest(null);
        }
    }
  };
  
  const handleViewItinerary = (itinerary: { request: ItineraryRequest, response: ItineraryResponse }) => {
    setSubmittedRequest(itinerary.request);
    setItineraryResponse(itinerary.response);
    setError(null);
    setIsLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleGoToForm = () => {
      setItineraryResponse(null);
      setSubmittedRequest(null);
      setError(null);
  }

  const isCurrentItinerarySaved = submittedRequest 
    ? savedItineraries.some(item => item.request.name === submittedRequest.name) 
    : false;

  return (
    <div className="min-h-screen font-sans p-4 sm:p-6 md:p-8 text-blue-900">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Mon itinéraire 🗺️</h1>
          <p className="mt-2 text-lg text-blue-800">
            Planifiez, visualisez et partagez vos trajets en toute simplicité.
          </p>
        </header>

        <main className="bg-white/70 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg">
          
          {itineraryResponse && submittedRequest && !isLoading ? (
             <>
                <ItineraryDisplay 
                    response={itineraryResponse} 
                    request={submittedRequest}
                    onSave={handleSaveItinerary}
                    isSaved={isCurrentItinerarySaved}
                 />
                 <div className="mt-8 pt-6 border-t border-sky-200 text-center">
                    <button 
                        onClick={handleGoToForm}
                        className="w-full sm:w-auto justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                    >
                        Créer un nouvel itinéraire
                    </button>
                 </div>
             </>
          ) : (
            <ItineraryForm
                initialState={initialFormState}
                onGenerate={handleGenerate}
                isLoading={isLoading}
            />
          )}

          {isLoading && (
            <div className="mt-8 flex flex-col items-center justify-center text-center">
              <SpinnerIcon className="h-12 w-12 animate-spin text-blue-900" />
              <p className="mt-4 text-lg font-semibold">Génération de votre itinéraire en cours...</p>
              <p className="text-blue-800">L'IA prépare le meilleur chemin pour vous.</p>
            </div>
          )}

          {error && (
            <div className="mt-8 p-4 bg-red-100 text-red-800 border border-red-300 rounded-lg text-center">
              <p className="font-bold">Erreur de génération</p>
              <p>{error}</p>
            </div>
          )}
        </main>
        
        <SavedItineraries 
            itineraries={savedItineraries}
            onView={handleViewItinerary}
            onDelete={handleDeleteItinerary}
        />
        
        <footer className="text-center mt-8 text-sm text-blue-700/80">
            <p>Propulsé par Gemini & Google Maps</p>
        </footer>
      </div>
    </div>
  );
}