const display = document.getElementById("display");
display.focus();
const expresion = display.value;
const resultado = evaluar(expresion);

function agregarAPantalla(numero) {
    if (display.value.trim() === '' && (numero === '/' || numero === '*')) {
        return;
    } 
    if (/^[/*+-]$/.test(display.value.slice(-1)) && /^[/*+-]$/.test(numero)) {
        return;
    }
    display.value += numero.toString(); 
}

function agregarAlHistorial(expresion,resultado) {
    const historialList = document.querySelector(".historialList");

    const entryElement = document.createElement("li");
    entryElement.classList.add('historial-entry');

    const expresionElement = document.createElement("li");
    expresionElement.textContent = `${expresion}`;
    expresionElement.classList.add('historial-expresion');
    expresionElement.addEventListener("click",function() {
        display.value = expresion;
    });

    const resultadoElement = document.createElement("li");
    resultadoElement.textContent = `${resultado}`;
    resultadoElement.classList.add('historial-resultado');
    resultadoElement.addEventListener("click", function() {
        display.value = resultado;
    })

    entryElement.appendChild(expresionElement);
    entryElement.appendChild(resultadoElement);

    historialList.insertBefore(entryElement, historialList.firstChild);
}

function ejecutar() {
    let expresion = display.value;
    let resultado = evaluar(expresion);
    display.value = resultado.toString();
    agregarAlHistorial(expresion, resultado);
    resultadoAnterior = true; 
}

function borraUnoPorVez() {
    display.value = display.value.slice(0, -1);
}

function borraTodo() {
    display.value = '';
}

function getCaretPosition(element) {//para saber en qué posición del display está el usuario
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return 0;
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
}

document.addEventListener("keydown", function(event){
    const key = event.key;
    if (key.includes("Arrow")) {// Verifica si la tecla presionada es una de las flechas
        event.preventDefault();
        moverEnCalculadora(key);
    }

    if (/^[0-9.]$/.test(key)) { // Verifica si la tecla presionada es un nro 
        event.preventDefault(); // Evitar que se escriba el caracter en otro lugar de la página.

        if (display.value.trim() === '' && (key === '/' || key === '*')) { // Verifica si la expresión está vacía y si intenta poner / o *
            return; // No agrega '/' o '*' al inicio del display.
        }
        if (/^[/*+-]$/.test(display.value.slice(-1)) && /^[/*+-]$/.test(key)) { //Verifica si el último carácter es un operador y no permite que se repita
            return; // No agrega un operador si ya hay un operador al final.
        }

        const caretStart = display.selectionStart; // Obtener la posición inicial del cursor
        const caretEnd = display.selectionEnd; // Obtener la posición final del cursor
        const valorActual = display.value;
        const newValue =
            valorActual.slice(0, caretStart) + key + valorActual.slice(caretEnd);
        display.value = newValue;

        // Restaurar la posición del cursor después de actualizar el contenido
        const newCaretPosition = caretStart + key.length;
        display.setSelectionRange(newCaretPosition, newCaretPosition);
    }

    if (key === "Enter") {
        event.preventDefault();
        ejecutar();
    }

    if (key === "Delete") {
        event.preventDefault();
        display.value = '';
    }
});

function moverEnCalculadora(key){
    const botones = document.querySelectorAll(".botonera button");
    let botonActual = document.activeElement;

    let indexActual = Array.from(botones).indexOf(botonActual);//encuentra el índice del botón actual

    if (key === "ArrowUp"){
        indexActual = (indexActual - 4 + botones.length) % botones.length;
    } else if (key === "ArrowDown") {
        indexActual = (indexActual + 4) % botones.length;
    } else if (key === "ArrowLeft") {
        indexActual = (indexActual - 1 + botones.length) % botones.length;
    } else if (key === "ArrowRight") {
        indexActual = (indexActual + 1) % botones.length;    
    }
    botones[indexActual].focus();
}

function evaluar(expresion) {
    try {
        return math.evaluate(expresion);
    } catch (error) {
        console.log("Error al evaluar la expresión: ", error);
        return "Error";
    }
}



