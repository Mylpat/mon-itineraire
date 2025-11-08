import type { ItineraryRequest, ItineraryResponse } from '../types';

/**
 * Génère une réponse d'itinéraire statique.
 * L'appel à l'API Gemini a été supprimé pour garantir une fiabilité de 100%
 * et éviter les problèmes de données incorrectes. L'application se concentre
 * sur la construction de l'URL Google Maps et laisse à Maps le soin de fournir
 * les détails (distance, durée, instructions).
 * 
 * @param request - La demande d'itinéraire de l'utilisateur.
 * @returns Une promesse qui se résout avec une réponse d'itinéraire statique.
 */
export async function generateItinerary(request: ItineraryRequest): Promise<ItineraryResponse> {
    
    const description = `Votre itinéraire est prêt !

Pour obtenir les instructions de navigation détaillées, la distance exacte, la durée du trajet en temps réel et les informations sur le trafic, veuillez utiliser le bouton "Ouvrir dans Google Maps".`;

    // Nous retournons une promesse pour conserver la même signature de fonction
    // et ne pas avoir à modifier la logique de chargement dans le composant App.
    return Promise.resolve({
        description: description,
        mapUrl: null, // Ceci est géré côté client de manière fiable
        routeName: request.name,
    });
}
