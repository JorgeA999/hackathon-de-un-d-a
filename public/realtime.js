import { getState } from "./tools.js";

const firebaseConfig = {
  apiKey: "TU_APIKEY",
  authDomain: "TU_AUTH",
  databaseURL: "TU_DATABASE_URL",
  projectId: "TU_ID"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const board = db.ref("mathboard");

export function enviarTrazo(trazo){
    board.push(trazo);
}

export function escucharTrazos(callback){
    board.on("child_added",snap=>{
        callback(snap.val());
    });
}