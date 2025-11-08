
import React from 'react';
import type { ItineraryRequest, ItineraryResponse } from '../types.ts';
import ViewIcon from './icons/ViewIcon.tsx';
import TrashIcon from './icons/TrashIcon.tsx';

interface SavedItinerariesProps {
  itineraries: { request: ItineraryRequest; response: ItineraryResponse }[];
  onView: (itinerary: { request: ItineraryRequest; response: ItineraryResponse }) => void;
  onDelete: (name: string) => void;
}

export default function SavedItineraries({ itineraries, onView, onDelete }: SavedItinerariesProps): React.ReactElement | null {
  if (itineraries.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-center mb-6">Mes itinéraires sauvegardés</h2>
      <div className="bg-white/70 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg">
        {itineraries.length > 0 ? (
            <ul className="space-y-4">
            {itineraries.map((item, index) => (
                <li key={index} className="flex justify-between items-center p-4 bg-sky-50/80 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col">
                    <span className="font-semibold text-blue-900">{item.request.name}</span>
                    <span className="text-sm text-gray-600">{item.request.start} → {item.request.destination}</span>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <button 
                        onClick={() => onView(item)} 
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition"
                        title="Voir l'itinéraire"
                    >
                        <ViewIcon className="h-5 w-5"/>
                    </button>
                    <button 
                        onClick={() => onDelete(item.request.name)} 
                        className="p-2 text-red-500 hover:bg-red-100 rounded-full transition"
                        title="Supprimer l'itinéraire"
                    >
                        <TrashIcon className="h-5 w-5"/>
                    </button>
                </div>
                </li>
            ))}
            </ul>
        ) : (
            <p className="text-center text-gray-500">Vous n'avez aucun itinéraire sauvegardé pour le moment.</p>
        )}
      </div>
    </div>
  );
}