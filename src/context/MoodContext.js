import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@emotionai_entries';

export const MoodContext = createContext(null);

const initialState = {
  entries: [],
  loading: true,
};

function moodReducer(state, action) {
  switch (action.type) {
    case 'SET_ENTRIES':
      return { ...state, entries: action.payload, loading: false };

    case 'ADD_ENTRY': {
      const newEntries = [action.payload, ...state.entries];
      return { ...state, entries: newEntries };
    }

    default:
      return state;
  }
}

export function MoodProvider({ children }) {
  const [state, dispatch] = useReducer(moodReducer, initialState);

  
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const parsed = JSON.parse(json);
          dispatch({ type: 'SET_ENTRIES', payload: parsed });
        } else {
          dispatch({ type: 'SET_ENTRIES', payload: [] });
        }
      } catch (e) {
        console.log('AsyncStorage read error', e);
        dispatch({ type: 'SET_ENTRIES', payload: [] });
      }
    })();
  }, []);


  useEffect(() => {
    if (!state.loading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.entries)).catch(
        (e) => console.log('AsyncStorage write error', e),
      );
    }
  }, [state.entries, state.loading]);

  const value = { state, dispatch };

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
}
