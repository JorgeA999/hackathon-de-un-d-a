import { initTools, getState } from "./tools.js";
import { drawAll } from "./draw.js";
import { handleLine } from "./geometry.js";
import { enviarTrazo, escucharTrazos } from "./realtime.js";

const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 60;

initTools();

let state = getState();

let drawing = false;
let trazoActual = [];
let startX, startY;

canvas.addEventListener("mousedown",(e)=>{
    drawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
    trazoActual = [{x:startX,y:startY}];
});

canvas.addEventListener("mousemove",(e)=>{
    if(!drawing) return;

    if(["pen","highlighter","eraser"].includes(state.tool)){
        trazoActual.push({x:e.offsetX,y:e.offsetY});
        drawAll(ctx, state, trazoActual);
    }
});

canvas.addEventListener("mouseup",(e)=>{
    drawing = false;

    if(state.tool==="line"){
        handleLine(state, startX, startY, e.offsetX, e.offsetY);
    }

    if(["pen","highlighter","eraser"].includes(state.tool)){
        state.trazos.push({
            tipo:state.tool,
            puntos:trazoActual,
            color:state.color,
            size:state.size
        });
    }

    drawAll(ctx, state);
});

canvas.addEventListener("click",(e)=>{
    if(state.tool==="text"){
        let txt = prompt("Texto:");
        if(txt){
            state.trazos.push({
                tipo:"text",
                texto:txt,
                x:e.offsetX,
                y:e.offsetY,
                color:state.color
            });
            drawAll(ctx,state);
        }
    }
});

document.getElementById("clearBtn").onclick = ()=>{
    state.trazos = [];
    drawAll(ctx,state);
};

state.trazos.push(trazo);
enviarTrazo(trazo);

escucharTrazos(trazo=>{
    state.trazos.push(trazo);
    drawAll(ctx,state);
});