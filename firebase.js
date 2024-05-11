import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDNgjcUjvwB14Aeex8feCmmswvs6zZ4gfs",
    authDomain: "haztech-3041d.firebaseapp.com",
    databaseURL: "https://haztech-3041d-default-rtdb.firebaseio.com",
    projectId: "haztech-3041d",
    storageBucket: "haztech-3041d.appspot.com",
    messagingSenderId: "910264984120",
    appId: "1:910264984120:web:a1c0782a444c866e673ccd",
    measurementId: "G-K4GH0LN7E5"
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  
  export default database;
