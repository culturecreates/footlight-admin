import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // we init with resources
    resources: {
      en: {
        translations: {
          organizations:"Organizations",
          "Email":"Email",
          "Region": "Province",
          "Types": "TYPES",
          "Type": "Type",
          "Publics" : "AUDIENCES",
          "Remove" : "Remove all search criteria",
          "AllEvents": "All Events",
          "Search": "Search for an event, theme, venue",
          "audiences":"Audiences",
          "additionalType":"Additional Type",
          "Results":"Search Results",
          "audience":"Audience",
          "Different": "diiferent",
          "Contact":"Contact",
          "Contacts":"Contacts",
          "AddContact":"Add contact",
          "offers":"Price",
          "iCal": "RECORD",
          "socialLink":"SHARE",
          "Online":"Event Online",
          "Offline":"Event Offline",
          "Hybrid":"Event Hybrid",
          "Event":"Event",
          "Events":"Events",
          "AddEvent":"Add event",
          "Powered":"Powered by",
          "CopyReserve":"All rights reserved",
          "headerText":"OUTAOUAIS CULTURAL CALENDAR",
          "to":"to",
          "tickets":"Tickets",
          "Place":"Place",
          "Places":"Places",
          "AddPlace":"Add place",
          "Name":"Name",
          "Location":"Location",
          "StartDate":"Start Date",
          "Title":"Title",
          "Published":"Published",
          "FileUpload":"Select Files to upload",
          "DragAndDrop":"or Drag and Drop files to upload",
          "EndDate":"End Date",
          "EndTime":"End Time",
          "StartTime":"Start Time",
          "PlaceName":"Name",
          "Country":"Country",
          "Locality":"City",
          "PostalCode":"Postal Code",
          "StreetAddress":"Street Address",
          "ContainedInPlace":"Contained In Place",
          "EndDateTime":"End Date Time",
          "RecurringEvent":"Recurring Event",
          "Frequency":"Frequency",
          "Free":"Free"
        }
      },
      fr: {
        translations: {
          "Free":"Gratuit",
          organizations:"Presente par",
          "Email":"Courriel",
          "Frequency":"Fréquence",
          "RecurringEvent":"Événement Récurrent",
          "Types": "Types",
          "Type": "Type",
          "Region": "Province",
          "Publics" : "PUBLICS",
          "Remove" : "Retirer tous les critères de recherche",
          "AllEvents": "Tous les événements",
          "audiences":"Publics",
          "audience":"Public",
          "additionalType":"Additional Type",
          "Search": "Recherchez un événement, un thème ou un lieu",
          "Results":"Résultats de recherche",
          "Different": "autres",
          "Contact":"Contact",
          "Contacts":"Contacts",
          "AddContact":"Ajoutez un contact",
          "offers":"Prix",
          "iCal": "ENREGISTRER",
          "socialLink":"PARTAGER",
          "Online":"Événement virtuelle",
          "Offline":"Événement hors-ligne",
          "Hybrid":"Événement hybride",
          "Event":"Événement",
          "Events":"Événements",
          "AddEvent":"Ajoutez un événement",
          "Powered":"Propulsé par",
          "CopyReserve":"Tous droits réservés",
          "headerText":"CALENDRIER CULTUREL OUTAOUAIS",
          "to":"au",
          "tickets":"Billets",
          "Place":"Lieu",
          "Places":"Lieux",
          "AddPlace":"Ajoutez un lieu",
          "Name":"Nom",
          "Location":"Emplacement",
          "StartDate":"Date de début",
          "Title":"Titre",
          "Published":"Publié",
          "FileUpload":"Sélectionnez les fichiers à télécharger",
          "DragAndDrop":"ou glisser-déposer des fichiers à télécharger",
          "EndDate":"Date de fin",
          "EndTime":"Heure de fin",
          "StartTime":"Heure de début",
          "PlaceName":"Nom",
          "Country":"Pays",
          "Locality":"Ville",
          "PostalCode":"Code postal",
          "StreetAddress":"Adresse municipale",
          "ContainedInPlace":"Contenu en place",
          "EndDateTime":"Date/heure de fin"
        }
      }
    },
    fallbackLng: "en",
    debug: true,

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
