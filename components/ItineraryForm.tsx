
import React, { useState, useCallback } from 'react';
import { TransportMode } from '../types.ts';
import type { ItineraryRequest, Coordinates } from '../types.ts';
import CarIcon from './icons/CarIcon.tsx';
import WalkIcon from './icons/WalkIcon.tsx';
import BusIcon from './icons/BusIcon.tsx';
import LocationIcon from './icons/LocationIcon.tsx';
import PlusIcon from './icons/PlusIcon.tsx';
import TrashIcon from './icons/TrashIcon.tsx';
import ArrowUpIcon from './icons/ArrowUpIcon.tsx';
import ArrowDownIcon from './icons/ArrowDownIcon.tsx';

interface ItineraryFormProps {
  initialState: ItineraryRequest;
  onGenerate: (request: ItineraryRequest) => void;
  isLoading: boolean;
}

export default function ItineraryForm({ initialState, onGenerate, isLoading }: ItineraryFormProps): React.ReactElement {
  const [name, setName] = useState(initialState.name);
  const [transportMode, setTransportMode] = useState<TransportMode>(initialState.transportMode);
  const [start, setStart] = useState(initialState.start);
  const [destination, setDestination] = useState(initialState.destination);
  const [steps, setSteps] = useState<string[]>(initialState.steps);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddStep = () => {
    setSteps([...steps, '']);
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };
    
  const moveStep = useCallback((index: number, direction: 'up' | 'down') => {
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    setSteps(newSteps);
  }, [steps]);


  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setStart(`Ma position actuelle (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          setCurrentLocation({ latitude, longitude });
        },
        () => {
          alert("Impossible d'obtenir la position. Veuillez l'autoriser et réessayer, ou l'entrer manuellement.");
        }
      );
    } else {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  };

  const handleReset = () => {
    setName(initialState.name);
    setTransportMode(initialState.transportMode);
    setStart(initialState.start);
    setDestination(initialState.destination);
    setSteps(initialState.steps);
    setCurrentLocation(initialState.currentLocation);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !start || !destination) {
      setError('Veuillez remplir tous les champs obligatoires : nom, départ et destination.');
      return;
    }
    setError(null);
    onGenerate({ name, transportMode, start, destination, steps: steps.filter(s => s.trim() !== ''), currentLocation });
  };

  const transportOptions = [
    { value: TransportMode.CAR, label: 'Voiture', icon: <CarIcon className="h-5 w-5" /> },
    { value: TransportMode.PEDESTRIAN, label: 'Piéton', icon: <WalkIcon className="h-5 w-5" /> },
    { value: TransportMode.TRANSIT, label: 'Transport en commun', icon: <BusIcon className="h-5 w-5" /> },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-blue-800 mb-1">Nom de l'itinéraire *</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Vacances en Bretagne"
            className="w-full px-4 py-2 bg-white/80 border border-sky-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            required
          />
        </div>
        <div>
          <label htmlFor="transportMode" className="block text-sm font-medium text-blue-800 mb-1">Moyen de transport *</label>
          <div className="relative">
            <select
              id="transportMode"
              value={transportMode}
              onChange={(e) => setTransportMode(e.target.value as TransportMode)}
              className="w-full appearance-none px-4 py-2 bg-white/80 border border-sky-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              {transportOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-800">
               {transportOptions.find(o => o.value === transportMode)?.icon}
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <label htmlFor="start" className="block text-sm font-medium text-blue-800 mb-1">Point de départ *</label>
        <div className="relative">
          <input
            type="text"
            id="start"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            placeholder="Adresse de départ"
            className="w-full px-4 py-2 bg-white/80 border border-sky-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-10"
            required
          />
          <button type="button" onClick={handleGeolocate} className="absolute inset-y-0 right-0 px-3 flex items-center text-blue-600 hover:text-blue-800 transition" title="Utiliser ma position actuelle">
            <LocationIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div>
        <label htmlFor="destination" className="block text-sm font-medium text-blue-800 mb-1">Destination *</label>
        <input
          type="text"
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Adresse de destination"
          className="w-full px-4 py-2 bg-white/80 border border-sky-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          required
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-md font-medium text-blue-800">Étapes intermédiaires (optionnel)</h3>
        {steps.map((step, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="text-gray-500">{index + 1}.</span>
            <input
              type="text"
              value={step}
              onChange={(e) => handleStepChange(index, e.target.value)}
              placeholder={`Adresse de l'étape ${index + 1}`}
              className="flex-grow px-4 py-2 bg-white/80 border border-sky-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <button type="button" onClick={() => moveStep(index, 'up')} disabled={index === 0} className="p-1 text-blue-600 disabled:text-gray-300 hover:text-blue-800 transition"><ArrowUpIcon className="h-5 w-5"/></button>
            <button type="button" onClick={() => moveStep(index, 'down')} disabled={index === steps.length - 1} className="p-1 text-blue-600 disabled:text-gray-300 hover:text-blue-800 transition"><ArrowDownIcon className="h-5 w-5"/></button>
            <button type="button" onClick={() => handleRemoveStep(index)} className="p-1 text-red-500 hover:text-red-700 transition"><TrashIcon className="h-5 w-5" /></button>
          </div>
        ))}
        <button type="button" onClick={handleAddStep} className="flex items-center space-x-2 text-blue-800 font-semibold hover:text-blue-900 transition py-2 px-3 bg-sky-200 hover:bg-sky-300 rounded-lg">
          <PlusIcon className="h-5 w-5" />
          <span>Ajouter une étape</span>
        </button>
      </div>
      
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="mt-8 border-t border-sky-200 pt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 space-y-4 space-y-reverse sm:space-y-0">
        <button type="button" onClick={handleReset} disabled={isLoading} className="w-full sm:w-auto justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-200 disabled:text-gray-500 transition">
            Annuler
        </button>
        <button type="submit" disabled={isLoading} className="w-full sm:w-auto justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 transition">
            {isLoading ? 'Génération...' : "Générer l'itinéraire"}
        </button>
      </div>
    </form>
  );
}