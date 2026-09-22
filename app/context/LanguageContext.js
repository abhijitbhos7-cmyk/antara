"use client";

import { createContext, useContext, useState, useEffect } from "react";

const translations = {
  "en-UK": {
    
    settingsTitle: "Settings",
    publicProfile: "Public Profile",
    account: "Account",
    language: "Language",
    chooseLanguage: "Choose language",
    
    
    home: "Home",
    library: "Your Library",
    saved: "Saved",
    buildSession: "Build Session",
    recordVoice: "Record Voice",
    deepWork: "Deep Work",
    createPlaylist: "Create your first playlist",
    createPlaylistSub: "It's easy, we'll help you",
    createBtn: "Create playlist",
    likedSongs: "Liked Songs",
    
    
    featured: "Featured Session",
    playSession: "Play Session",
    upNext: "Up Next",
    yourPlaylists: "Your Playlists",
    popularNow: "Popular Right Now",
    newReleases: "New Releases",
    mostViewed: "Most Viewed & Famous",
    savedSessions: "Saved Sessions",
    allSessions: "All Sessions",
    exploreSpace: "Explore Space",
    noSaved: "No saved sessions yet.",
    noSavedSub: "Click the bookmark or heart icon on any playlist or song."
  },
  "hi": {
    
    settingsTitle: "सेटिंग्स",
    publicProfile: "सार्वजनिक प्रोफ़ाइल",
    account: "खाता",
    language: "भाषा",
    chooseLanguage: "भाषा चुनें",
    
    
    home: "होम",
    library: "आपकी लाइब्रेरी",
    saved: "सेव किए गए",
    buildSession: "सत्र बनाएं",
    recordVoice: "आवाज़ रिकॉर्ड करें",
    deepWork: "डीप वर्क",
    createPlaylist: "अपनी पहली प्लेलिस्ट बनाएं",
    createPlaylistSub: "यह आसान है, हम आपकी मदद करेंगे",
    createBtn: "प्लेलिस्ट बनाएं",
    likedSongs: "पसंदीदा गाने",
    
    
    featured: "विशेष सत्र",
    playSession: "सत्र चलाएं",
    upNext: "अगला",
    yourPlaylists: "आपकी प्लेलिस्ट",
    popularNow: "अभी लोकप्रिय",
    newReleases: "नई रिलीज़",
    mostViewed: "सबसे ज्यादा देखे गए",
    savedSessions: "सहेजे गए सत्र",
    allSessions: "सभी सत्र",
    exploreSpace: "एक्सप्लोर करें",
    noSaved: "अभी तक कोई सत्र नहीं सहेजा गया।",
    noSavedSub: "किसी भी प्लेलिस्ट या गाने पर बुकमार्क आइकन पर क्लिक करें।"
  },
  "es": {
    
    settingsTitle: "Configuración",
    publicProfile: "Perfil Público",
    account: "Cuenta",
    language: "Idioma",
    chooseLanguage: "Elige idioma",
    
    
    home: "Inicio",
    library: "Tu Biblioteca",
    saved: "Guardados",
    buildSession: "Crear Sesión",
    recordVoice: "Grabar Voz",
    deepWork: "Trabajo Profundo",
    createPlaylist: "Crea tu primera lista",
    createPlaylistSub: "Es fácil, te ayudaremos",
    createBtn: "Crear lista",
    likedSongs: "Canciones que te gustan",
    
   
    featured: "Sesión Destacada",
    playSession: "Reproducir Sesión",
    upNext: "A continuación",
    yourPlaylists: "Tus Listas",
    popularNow: "Popular Ahora",
    newReleases: "Nuevos Lanzamientos",
    mostViewed: "Más Vistos y Famosos",
    savedSessions: "Sesiones Guardadas",
    allSessions: "Todas las Sesiones",
    exploreSpace: "Explorar Espacio",
    noSaved: "Aún no hay sesiones guardadas.",
    noSavedSub: "Haz clic en el icono de marcador o corazón en cualquier lista o canción."
  },
  "fr": {
    
    settingsTitle: "Paramètres",
    publicProfile: "Profil Public",
    account: "Compte",
    language: "Langue",
    chooseLanguage: "Choisir la langue",
    
    
    home: "Accueil",
    library: "Votre Bibliothèque",
    saved: "Enregistré",
    buildSession: "Créer une Session",
    recordVoice: "Enregistrer la Voix",
    deepWork: "Travail Profond",
    createPlaylist: "Créez votre première playlist",
    createPlaylistSub: "C'est facile, nous allons vous aider",
    createBtn: "Créer une playlist",
    likedSongs: "Titres likés",
    
    
    featured: "Session en Vedette",
    playSession: "Jouer la Session",
    upNext: "À suivre",
    yourPlaylists: "Vos Playlists",
    popularNow: "Populaire en ce moment",
    newReleases: "Nouvelles Sorties",
    mostViewed: "Les Plus Vus & Célèbres",
    savedSessions: "Sessions Enregistrées",
    allSessions: "Toutes les Sessions",
    exploreSpace: "Explorer l'Espace",
    noSaved: "Aucune session enregistrée.",
    noSavedSub: "Cliquez sur l'icône signet ou cœur sur n'importe quelle playlist ou chanson."
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en-UK");

  useEffect(() => {
    const savedLang = localStorage.getItem("antara_language");
    if (savedLang) setLanguage(savedLang);
  }, []);

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem("antara_language", newLang);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations["en-UK"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);