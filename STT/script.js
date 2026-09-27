function listen() {
  //Constantes Para traer lo que se detecta o muestra en html
  const inputArea = document.getElementById('input-area');
  const outputArea = document.getElementById('output-area');
  const listenBtn = document.getElementById('listen-button');

  // Seguro de Vida nos aseguramos que el 
  // navegador soporte SpeechRecognition en su defecto, 
  // mostramos un mensaje de error

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    outputArea.textContent = 'Tu navegador no soporta SpeechRecognition (prueba Chrome en HTTPS o localhost).';
    return;
  }

  // Crear instancia de reconocimiento de voz
  const recognition = new SpeechRecognition();

  // Configuración: español de México, no continuo, resultados finales
  recognition.lang = 'es-MX';
  recognition.continuous = false;
  recognition.interimResults = false;

  // Mensaje para empezar a interactuar
  outputArea.textContent = 'Escuchando... habla ahora';
  listenBtn.disabled = true;
// Variable para controlar si hubo resultado
//  antes de que termine el reconocimiento
  let huboResultado = false;

  // Evento cuando se obtiene un resultado de voz
  recognition.onresult = function (event) {
    huboResultado = true;
    // Tomar el mejor resultado de la última alternativa
    const last = event.results.length - 1;
    const transcript = event.results[last][0].transcript || '';
    inputArea.textContent = `Reconocido: "${transcript}"`;

    // Normalizar
    const norm = transcript.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

    // Reglas para acceder a cada nivel de respuesta

    if (norm.includes('Escuela')) { //Palabra activadora para el nivel 1
          //Respuesta del nivel 1
      outputArea.textContent = '¿En que area ocupas ayuda?';
      
    } else if (norm.includes('Electronica')) {
      outputArea.textContent = 'Que necesitas de electronica?';

    } else { // Si se detectó voz pero no coincidió con ningún comando
      outputArea.textContent = 'Voz detectada, pero no coincidió con ningún comando.';
    }
  };

  recognition.onnomatch = function () {
    // Controlar el caso de que no se reconoció voz o no se entendió
    if (!huboResultado) {
      outputArea.textContent = 'No entendí lo que dijiste.';
    }
  };

  recognition.onspeechend = function () {
    // Se dejó de hablar; si no hubo resultado, lo diremos en onend
    recognition.stop();
  };

  recognition.onerror = function (event) {
    // Mensajes útiles para depurar
    const msg = {
      'no-speech': 'No se detectó voz. ¿El micrófono está activo?',
      'audio-capture': 'No se encontró micrófono o no hay audio.',
      'not-allowed': 'Permiso del micrófono denegado.',
      'aborted': 'Reconocimiento cancelado.',
      'network': 'Error de red del servicio de voz.',
    }[event.error] || `Error de reconocimiento: ${event.error}`;

    outputArea.textContent = msg;
    listenBtn.disabled = false;
  };

  recognition.onend = function () {
    // Si terminó y nunca hubo resultado ni error, avisamos
    if (!huboResultado && outputArea.textContent === 'Escuchando... habla ahora') {
      outputArea.textContent = 'Voz no detectada.';
    }
    listenBtn.disabled = false;
  };

  // Iniciar (es importante que se llame tras un gesto del usuario: click en el botón)
  try {
    recognition.start();
  } catch (e) {
    // Evitar excepción si se llama start() múltiples veces
    console.warn('start() ya fue llamado', e);
  }
}