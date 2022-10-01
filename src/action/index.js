import { FILTER, PLACES,CONTACTS, LANG, ORG, AUDIENCE, TYPES, EVENTLIST, EVENTBACK, CAL, LANGCONTENT} from "./Types";

export const fetchFilter = (data) => {
  return {
    type: FILTER,
    data,
  };
};

export const fetchPlace = (data) => {
  return {
    type: PLACES,
    data,
  };
};

export const fetchContact = (data) => {
  return {
    type: CONTACTS,
    data,
  };
};

export const fetchOrg = (data) => {
  return {
    type: ORG,
    data,
  };
};

export const fetchAudience = (data) => {
  return {
    type: AUDIENCE,
    data,
  };
};

export const fetchTypes = (data) => {
  return {
    type: TYPES,
    data,
  };
};
export const fetchEvents = (data) => {
  return {
    type: EVENTLIST,
    data,
  };
};
export const getBackEvents = (data) => {
  return {
    type: EVENTBACK,
    data,
  };
};
export const changeLang = (data) => {
  return {
    type: LANG,
    data,
  };
};

export const changeLangContent = (data) => {
  return {
    type: LANGCONTENT,
    data,
  };
};

export const fetchCal = (data) => {
  return {
    type: CAL,
    data,
  };
};
