import React, { useState } from 'react';
import type { ItineraryResponse, ItineraryRequest } from '../types';
import { TransportMode } from '../types';

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
        .split('\n\n') // Split into paragraphs by blank lines
        .map(paragraph => {
            const lines = paragraph.split('\n');
            // Check if it's a list
            if (lines.length > 1 && lines.every(line => /^\s*[-*]/.test(line))) {
                return `<ul>${lines.map(line => `<li>${line.replace(/^\s*[-*]\s*/, '')}</li>`).join('')}</ul>`;
            }
             if (lines.length > 1 && lines.every(line => /^\s*\d+\./.test(line))) {
                return `<ol>${lines.map(line => `<li>${line.replace(/^\s*\d+\.\s*/, '')}</li>`).join('')}</ol>`;
            }
            // Otherwise, it's a paragraph
            return `<p>${paragraph.replace(/\n/g, '<br/>')}</p>`;
        })
        .join('');
    
    return <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
};

export default function ItineraryDisplay({ request, response, onSave, isSaved }: ItineraryDisplayProps): React.ReactElement {
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

  // Build a reliable Google Maps URL from the request data
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
            setTimeout(() => setIsCopied(false), 2500); // Reset after 2.5 seconds
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