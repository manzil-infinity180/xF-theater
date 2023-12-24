import { useState,useEffect } from "react";

export function useLocalStorageState(initialState,key){

  const [value,setValue] = useState(function(){
    const storedData = localStorage.getItem(key);
    // if any storagedData is present then do parse on storedData otherwise set the initialState which is []
    return storedData? JSON.parse(storedData) : initialState;
  });
  //  adding the item into the local storage (watched list)
  useEffect(function(){
    localStorage.setItem(key,JSON.stringify(value));
   },[value,key])
   return [value,setValue];
}