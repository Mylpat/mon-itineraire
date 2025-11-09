
import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

// ----- TYPES -----
enum TransportMode {
  CAR = 'Voiture',
  PEDESTRIAN = 'Piéton',
  TRANSIT = 'Transport en commun',
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface ItineraryRequest {
  name: string;
  transportMode: TransportMode;
  start: string;
  destination: string;
  steps: string[];
  currentLocation: Coordinates | null;
}

interface ItineraryResponse {
  description: string;
  mapUrl: string | null;
  routeName: string;
}

// ----- SERVICES -----
async function generateItinerary(request: ItineraryRequest): Promise<ItineraryResponse> {
    const description = `Votre itinéraire est prêt !

Pour obtenir les instructions de navigation détaillées, la distance exacte, la durée du trajet en temps réel et les informations sur le trafic, veuillez utiliser le bouton "Ouvrir dans Google Maps".`;
    return Promise.resolve({
        description: description,
        mapUrl: null,
        routeName: request.name,
    });
}

// ----- ICONS -----
function CarIcon({ className }: { className?: string }): React.ReactElement {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9L2 12v9c0 .6.4 1 1 1h2"/>
      <path d="M7 17h10"/>
      <circle cx="7" cy="17" r="2"/>
      <circle cx="17" cy="17" r="2"/>
    </svg>
  );
}

function WalkIcon({ className }: { className?: string }): React.ReactElement {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1"/>
      <path d="M9 20l3-6"/>
      <path d="M12 14l5 6"/>
      <path d="m7 10 5 1 5-6"/>
    </svg>
  );
}

function BusIcon({ className }: { className?: string }): React.ReactElement {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6v6"/>
      <path d="M16 6v6"/>
      <path d="M2 12h19.6"/>
      <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/>
      <circle cx="7" cy="18" r="2"/>
      <circle cx="17" cy="18" r="2"/>
    </svg>
  );
}

function LocationIcon({ className }: { className?: string }): React.ReactElement {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }): React.ReactElement {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }): React.ReactElement {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  );
}

function ArrowUpIcon({ className }: { className?: string }): React.ReactElement {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 7-7 7 7"/>
      <path d="M12 19V5"/>
    </svg>
  );
}

function ArrowDownIcon({ className }: { className?: string }): React.ReactElement {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14"/>
      <path d="m19 12-7 7-7-7"/>
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }): React.ReactElement {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  );
}

function ViewIcon({ className }: { className?: string }): React.ReactElement {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
}


// ----- COMPONENTS -----

interface ItineraryFormProps {
  initialState: ItineraryRequest;
  onGenerate: (request: ItineraryRequest) => void;
  isLoading: boolean;
}

function ItineraryForm({ initialState, onGenerate, isLoading }: ItineraryFormProps): React.ReactElement {
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


interface ItineraryDisplayProps {
  request: ItineraryRequest;
  response: ItineraryResponse;
  onSave: (request: ItineraryRequest, response: ItineraryResponse) => void;
  isSaved: boolean;
}

const MarkdownRenderer = ({ text }: { text: string }) => {
    const html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .split('\n\n')
        .map(paragraph => {
            const lines = paragraph.split('\n');
            if (lines.length > 1 && lines.every(line => /^\s*[-*]/.test(line))) {
                return `<ul>${lines.map(line => `<li>${line.replace(/^\s*[-*]\s*/, '')}</li>`).join('')}</ul>`;
            }
             if (lines.length > 1 && lines.every(line => /^\s*\d+\./.test(line))) {
                return `<ol>${lines.map(line => `<li>${line.replace(/^\s*\d+\.\s*/, '')}</li>`).join('')}</ol>`;
            }
            return `<p>${paragraph.replace(/\n/g, '<br/>')}</p>`;
        })
        .join('');
    
    return <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
};

function ItineraryDisplay({ request, response, onSave, isSaved }: ItineraryDisplayProps): React.ReactElement {
  const { description, routeName } = response;
  const [isCopied, setIsCopied] = useState(false);

  const getGoogleMapsTravelMode = (mode: TransportMode): string => {
    switch (mode) {
      case TransportMode.CAR: return 'driving';
      case TransportMode.PEDESTRIAN: return 'walking';
      case TransportMode.TRANSIT: return 'transit';
      default: return 'driving';
    }
  };

  const { start, destination, steps, transportMode } = request;
  const waypoints = steps.filter(s => s.trim() !== '').join('|');
  const travelModeParam = getGoogleMapsTravelMode(transportMode);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(destination)}${waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ''}&travelmode=${travelModeParam}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(googleMapsUrl)}&size=150x150&bgcolor=f0f9ff`;
  const mailtoLink = `mailto:?subject=Itinéraire: ${encodeURIComponent(routeName)}&body=Bonjour,%0A%0AVoici le lien vers l'itinéraire "${encodeURIComponent(routeName)}":%0A${encodeURIComponent(googleMapsUrl)}`;
  
  const handleSaveClick = () => {
    onSave(request, response);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(googleMapsUrl).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2500);
        }, (err) => {
            console.error('Could not copy text: ', err);
            alert("Impossible de copier le lien. Assurez-vous que le site est bien en HTTPS.");
        });
    } else {
        alert("La fonction de copie n'est pas supportée sur votre navigateur.");
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-sky-300 space-y-8">
      <h2 className="text-3xl font-bold text-center">Votre Itinéraire : {routeName}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/80 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">QR Code de l'itinéraire</h3>
            <div className="flex justify-center">
              <img src={qrCodeUrl} alt="QR Code pour l'itinéraire" className="rounded-lg border-4 border-white shadow-sm" />
            </div>
            <p className="text-sm mt-3 text-blue-800">Flashez pour ouvrir sur votre mobile.</p>
        </div>
        
        <div className="bg-white/80 p-6 rounded-lg shadow-md">
             <h3 className="text-xl font-semibold mb-4">Actions</h3>
             <div className="space-y-3">
                <button onClick={handleSaveClick} className="block w-full text-center bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition">
                    {isSaved ? "Mettre à jour l'enregistrement" : "Enregistrer l'itinéraire"}
                </button>
                 <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                     Ouvrir dans Google Maps
                 </a>
                 <button onClick={handleShare} className="block w-full text-center bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 transition">
                    {isCopied ? "Lien copié !" : "Copier le lien"}
                 </button>
                 <a href={mailtoLink} className="block w-full text-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition">
                    Envoyer par e-mail
                 </a>
             </div>
        </div>
      </div>

      <div className="bg-white/80 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2 border-b pb-2 border-sky-200">Instructions</h3>
        <MarkdownRenderer text={description} />
      </div>

    </div>
  );
}

interface SavedItinerariesProps {
  itineraries: { request: ItineraryRequest; response: ItineraryResponse }[];
  onView: (itinerary: { request: ItineraryRequest; response: ItineraryResponse }) => void;
  onDelete: (name: string) => void;
}

function SavedItineraries({ itineraries, onView, onDelete }: SavedItinerariesProps): React.ReactElement | null {
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


// ----- MAIN APP COMPONENT -----

function App(): React.ReactElement {
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
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, err => {
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }

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
        if (submittedRequest && submittedRequest.name === name) {
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

// ----- RENDER APP -----

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
