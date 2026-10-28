// Banco completo de preguntas basado 100% en las 4 hojas de estudio adjuntas:
// 1. Tiempo: Equivalencias y Conversiones
// 2. Temperatura: Escalas Celsius (°C) y Fahrenheit (°F)
// 3. Expresiones Matemáticas (variables, doble, triple, mitad, tercio, cuarto, ejemplos)
// 4. ¡Repaso Mágico! Expresiones matemáticas en tablas y práctica verbal a matemática

window.QUESTION_BANK = [
  // ==========================================
  // MUNDO 1: TIEMPO Y CONVERSIONES ⏰
  // ==========================================
  {
    id: 1,
    category: "Tiempo ⏰",
    worldIndex: 0,
    title: "Conversión de Minutos a Segundos",
    question: "Según la hoja de Tiempo (Ejemplo 1), si quieres convertir 12 minutos a segundos, ¿cuál es el procedimiento y el resultado correcto?",
    visualAid: "Escalera: Minuto ➔ ( × 60 ) ➔ Segundo",
    options: [
      "12 min × 60 = 720 segundos",
      "12 min ÷ 60 = 0,2 segundos",
      "12 min × 24 = 288 segundos",
      "12 min + 60 = 72 segundos"
    ],
    correctIndex: 0,
    hint: "💡 PISTA: Recuerda que 1 minuto tiene 60 segundos. Como vas de una unidad más grande (minuto) a una más pequeña (segundo), ¡debes MULTIPLICAR por 60!",
    explanation: "Para pasar de minutos a segundos avanzamos hacia la derecha en la tabla de conversiones (a una unidad más pequeña), por lo tanto multiplicamos por 60:\n12 minutos × 60 segundos = 720 segundos.",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR: «¡Minutos a segundos? Multiplica por 60. ¡Multiplica cuando vas a una unidad más pequeña y divide cuando vas a una más grande!»"
  },
  {
    id: 2,
    category: "Tiempo ⏰",
    worldIndex: 0,
    title: "Conversión de Horas a Segundos",
    question: "Como en el Ejemplo 2 de tu hoja: ¿Cuántos segundos hay en 4 horas?",
    visualAid: "Hora ➔ ( × 60 ) ➔ Minuto ➔ ( × 60 ) ➔ Segundo",
    options: [
      "240 segundos (4 × 60)",
      "14 400 segundos (4 × 60 × 60)",
      "3 600 segundos (1 × 60 × 60)",
      "9 600 segundos (4 × 24 × 100)"
    ],
    correctIndex: 1,
    hint: "💡 PISTA: Para ir de Horas a Segundos debes dar DOS saltos hacia la derecha: primero pasas a minutos (× 60) y luego a segundos (otra vez × 60). ¡O multiplica 4 por 3600!",
    explanation: "1 hora tiene 60 minutos y cada minuto tiene 60 segundos (60 × 60 = 3600 segundos por hora).\nEntonces: 4 h × 60 min × 60 s = 240 × 60 = 14 400 segundos.",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR: «¿Horas a segundos? Multiplica por 60 y otra vez por 60 (o recuerda que 1 hora = 3600 segundos).»"
  },
  {
    id: 3,
    category: "Tiempo ⏰",
    worldIndex: 0,
    title: "Equivalencias de Años (Lustro, Década, Siglo, Milenio)",
    question: "Observa las equivalencias de tiempo en años. ¿Cuál de las siguientes opciones relaciona CORRECTAMENTE todas las medidas?",
    visualAid: "⭐ Lustro | ⭐ Década | ⭐ Siglo | ⭐ Milenio",
    options: [
      "1 lustro = 10 años, 1 década = 5 años, 1 siglo = 100 años",
      "1 lustro = 5 años, 1 década = 10 años, 1 siglo = 100 años, 1 milenio = 1000 años",
      "1 lustro = 15 años, 1 década = 100 años, 1 milenio = 10 000 años",
      "1 lustro = 5 días, 1 década = 10 meses, 1 siglo = 10 años"
    ],
    correctIndex: 1,
    hint: "💡 PISTA: Piensa en las palabras: «Década» suena a diez (10), «Siglo» a cien (100), «Milenio» a mil (1000), y el «Lustro» es la mitad de una década (5 años).",
    explanation: "Las equivalencias exactas de tu ficha son:\n• 1 lustro = 5 años\n• 1 década = 10 años\n• 1 siglo = 100 años\n• 1 milenio = 1000 años",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR: Va de menor a mayor agregando ceros después del lustro: Lustro (5) ➔ Década (10) ➔ Siglo (100) ➔ Milenio (1000)."
  },
  {
    id: 4,
    category: "Tiempo ⏰",
    worldIndex: 0,
    title: "Quincenas, Semanas y Meses",
    question: "¿Cuántos días y cuántas semanas tiene 1 quincena, y cuántas quincenas tiene 1 mes?",
    visualAid: "📅 1 mes = 4 semanas = 30 días",
    options: [
      "1 quincena = 2 semanas = 15 días; y 1 mes tiene 2 quincenas",
      "1 quincena = 5 semanas = 15 días; y 1 mes tiene 4 quincenas",
      "1 quincena = 1 semana = 7 días; y 1 mes tiene 3 quincenas",
      "1 quincena = 15 semanas = 30 días; y 1 mes tiene 1 quincena"
    ],
    correctIndex: 0,
    hint: "💡 PISTA: La palabra «quincena» viene del número QUINCE (15 días). Si un mes tiene 30 días, ¿cuántas mitades de 15 días caben en un mes?",
    explanation: "En la tabla de equivalencias:\n• 1 quincena = 2 semanas = 15 días.\n• 1 mes = 4 semanas = 30 días = 2 quincenas (porque 15 + 15 = 30).",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR: «Quincena» suena a 15 (15 días = 2 semanas). Dos quincenas forman 1 mes completo de 30 días."
  },
  {
    id: 5,
    category: "Tiempo ⏰",
    worldIndex: 0,
    title: "Días a Horas y Horas a Días",
    question: "Si un viaje en barco dura 3 días completos, ¿cuántas horas dura el viaje en total?",
    visualAid: "Día ➔ ( × 24 ) ➔ Hora",
    options: [
      "36 horas",
      "48 horas",
      "72 horas",
      "180 horas"
    ],
    correctIndex: 2,
    hint: "💡 PISTA: Sabemos que 1 día tiene 24 horas. Para pasar de Día a Hora multiplicamos la cantidad de días por 24 (3 × 24).",
    explanation: "Como 1 día = 24 horas, para pasar de días a horas multiplicamos por 24:\n3 días × 24 horas = 72 horas.",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR: 1 día = 24 horas, 2 días = 48 horas, 3 días = 72 horas. ¡De Día a Hora siempre multiplicas por 24!"
  },
  {
    id: 6,
    category: "Tiempo ⏰",
    worldIndex: 0,
    title: "De una Unidad Pequeña a una Grande",
    question: "Si tienes 180 minutos y quieres saber cuántas HORAS son, ¿qué operación debes realizar según la tabla de conversiones?",
    visualAid: "Hora ⬅ ( ÷ 60 ) ⬅ Minuto",
    options: [
      "Multiplicar 180 × 60 = 10 800 horas",
      "Dividir 180 ÷ 60 = 3 horas",
      "Dividir 180 ÷ 24 = 7,5 horas",
      "Restar 180 - 60 = 120 horas"
    ],
    correctIndex: 1,
    hint: "💡 PISTA: Mira las flechas de abajo en la tabla de conversiones: vas de Minuto (más pequeño) hacia Hora (más grande). ¡Para volver hacia la izquierda se DIVIDE entre 60!",
    explanation: "Cuando conviertes de una unidad más pequeña (minutos) a una unidad más grande (horas), debes DIVIDIR entre 60:\n180 minutos ÷ 60 = 3 horas.",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR: «¡Solo multiplica para ir (a una unidad más pequeña) y DIVIDE para volver (a una unidad más grande)!»"
  },

  // ==========================================
  // MUNDO 2: TEMPERATURA (°C y °F) 🌡️
  // ==========================================
  {
    id: 7,
    category: "Temperatura 🌡️",
    worldIndex: 1,
    title: "Práctica A: De 20 °C a Fahrenheit",
    question: "Resuelve el ejercicio A de tu hoja de Temperatura: Convierte 20 °C a grados Fahrenheit (°F).",
    visualAid: "Fórmula: °F = (9/5 × °C) + 32",
    options: [
      "52 °F",
      "68 °F",
      "36 °F",
      "86 °F"
    ],
    correctIndex: 1,
    hint: "💡 PISTA: Sustituye 20 en la fórmula: primero multiplica (9 × 20) ÷ 5, y al resultado que te dé, súmale 32 al final.",
    explanation: "Paso a paso con la fórmula °F = (9/5 × °C) + 32:\n1) Sustituimos 20 °C: (9/5 × 20) + 32\n2) Multiplicamos y dividimos: (180 ÷ 5) = 36\n3) Sumamos 32: 36 + 32 = 68 °F.",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR: De °C a °F: «MULTIPLICA por 9/5 (multiplica por 9 y divide entre 5) ➔ luego SUMA 32»."
  },
  {
    id: 8,
    category: "Temperatura 🌡️",
    worldIndex: 1,
    title: "Práctica B: De 86 °F a Celsius",
    question: "Resuelve el ejercicio B de tu hoja de Temperatura: Convierte 86 °F a grados Celsius (°C).",
    visualAid: "Fórmula: °C = 5/9 × (°F - 32)",
    options: [
      "54 °C",
      "30 °C",
      "45 °C",
      "20 °C"
    ],
    correctIndex: 1,
    hint: "💡 PISTA: ¡Resuelve en orden el paréntesis primero! Primero haz la resta (86 - 32). Después, multiplica ese resultado por 5 y divídelo entre 9.",
    explanation: "Paso a paso con la fórmula °C = 5/9 × (°F - 32):\n1) Primero restamos 32 dentro del paréntesis: 86 - 32 = 54\n2) Ahora multiplicamos por 5/9: (5 × 54) ÷ 9 = 270 ÷ 9 = 30 °C.",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR: De °F a °C: «PRIMERO RESTA 32 ➔ luego MULTIPLICA por 5/9 (multiplica por 5 y divide entre 9)»."
  },
  {
    id: 9,
    category: "Temperatura 🌡️",
    worldIndex: 1,
    title: "Práctica C: De 30 °C a Fahrenheit",
    question: "Resuelve el ejercicio C de tu hoja de Temperatura: ¿A cuántos grados Fahrenheit (°F) equivalen 30 °C?",
    visualAid: "Fórmula: °F = (9/5 × °C) + 32",
    options: [
      "86 °F",
      "54 °F",
      "62 °F",
      "98,6 °F"
    ],
    correctIndex: 0,
    hint: "💡 PISTA: Calcula primero (9/5 × 30): puedes dividir 30 ÷ 5 = 6 y multiplicarlo por 9 (6 × 9 = 54). Luego no olvides sumarle 32.",
    explanation: "Paso a paso:\n1) Aplicamos °F = (9/5 × 30) + 32\n2) 9/5 × 30 = (270 ÷ 5) = 54\n3) Sumamos 32: 54 + 32 = 86 °F.",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR: ¡Mira qué curioso! En el ejercicio B viste que 86 °F = 30 °C, y en el ejercicio C comprobamos al revés que 30 °C = 86 °F."
  },
  {
    id: 10,
    category: "Temperatura 🌡️",
    worldIndex: 1,
    title: "Ejemplo de la Hoja: Temperatura Corporal (37 °C)",
    question: "Según el ejemplo de la hoja de Temperatura, si conviertes 37 °C a Fahrenheit (°F), ¿cuál es el resultado?",
    visualAid: "37 °C ➔ (9/5 × 37) + 32 = ¿?",
    options: [
      "66,6 °F",
      "98,6 °F",
      "69,0 °F",
      "100 °F"
    ],
    correctIndex: 1,
    hint: "💡 PISTA: Multiplica 9 × 37 = 333, luego divide 333 ÷ 5 = 66,6. Por último, súmale 32 a 66,6.",
    explanation: "Siguiendo el ejemplo exacto de tu hoja:\n1) (9/5 × 37) = 333 ÷ 5 = 66,6\n2) 66,6 + 32 = 98,6 °F.",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR: 37 °C es la temperatura normal del cuerpo humano y en Fahrenheit siempre equivale a 98,6 °F."
  },
  {
    id: 11,
    category: "Temperatura 🌡️",
    worldIndex: 1,
    title: "Concepto y Escalas de Temperatura",
    question: "¿Qué instrumento se utiliza para medir la temperatura y qué significan los símbolos °C y °F?",
    visualAid: "🌡️ ¿Qué es la temperatura y cuáles son sus dos escalas?",
    options: [
      "Se mide con un cronómetro; °C = Calor y °F = Frío",
      "Se mide con un termómetro; °C = Celsius y °F = Fahrenheit",
      "Se mide con una balanza; °C = Centímetros y °F = Frecuencia",
      "Se mide con un termómetro; °C = Centésimas y °F = Fórmulas"
    ],
    correctIndex: 1,
    hint: "💡 PISTA: Lee los dos cuadros superiores de tu hoja «TEMPERATURA: ¡CONVIERTE SIN MIEDO!».",
    explanation: "La temperatura es la magnitud física que expresa el grado o nivel de calor de los cuerpos o del ambiente. Se mide con un TERMÓMETRO y sus dos escalas son °C (Celsius) y °F (Fahrenheit).",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR: Termómetro = mide temperatura. °C = Celsius, °F = Fahrenheit. ¡Ambas miden la temperatura!"
  },
  {
    id: 12,
    category: "Temperatura 🌡️",
    worldIndex: 1,
    title: "Truco para No Confundir las Fórmulas",
    question: "Si tienes una temperatura en grados Fahrenheit (°F) y necesitas pasarla a Celsius (°C), ¿cuál es el orden correcto de las operaciones?",
    visualAid: "⬅ °F ➔ °C : ¿Qué haces primero y qué haces después?",
    options: [
      "Primero sumas 32 y luego multiplicas por 9/5",
      "Primero restas 32 y luego multiplicas por 5/9",
      "Primero multiplicas por 5/9 y al final restas 32",
      "Primero divides entre 32 y luego sumas 5/9"
    ],
    correctIndex: 1,
    hint: "💡 PISTA: Revisa el cuadro amarillo «TRUCO PARA NO CONFUNDIRTE» en la hoja de Temperatura: mira la flecha morada (°F ➔ °C).",
    explanation: "En la fórmula °C = 5/9 × (°F - 32), el paréntesis nos indica que PRIMERO debemos restar 32 y LUEGO multiplicar el resultado por 5/9.",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR:\n• °C ➔ °F: × 9/5, luego + 32\n• °F ➔ °C: - 32, luego × 5/9"
  },

  // ==========================================
  // MUNDO 3: EXPRESIONES MATEMÁTICAS ✨
  // ==========================================
  {
    id: 13,
    category: "Expresiones ✨",
    worldIndex: 2,
    title: "Doble, Triple y Cuádruplo de un Número",
    question: "¿Cómo se escriben en expresión matemática: «El doble de un número», «El triple de un número» y «El cuádruplo de un número»?",
    visualAid: "Recuerda: «n» representa un número desconocido",
    options: [
      "n + 2,  n + 3,  n + 4",
      "2n,  3n,  4n",
      "n/2,  n/3,  n/4",
      "n - 2,  n - 3,  n - 4"
    ],
    correctIndex: 1,
    hint: "💡 PISTA: «Doble», «triple» y «cuádruplo» significan MULTIPLICAR el número «n» por 2, por 3 y por 4 respectivamente.",
    explanation: "Según la tabla de Expresiones Matemáticas:\n• El doble o duplo de un número = 2n (2 × n)\n• El triple de un número = 3n (3 × n)\n• El cuádruplo de un número = 4n (4 × n)",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR: Entre el número y la letra siempre hay una multiplicación invisible: 2n = 2 × n (doble), 3n = 3 × n (triple), 4n = 4 × n (cuádruplo)."
  },
  {
    id: 14,
    category: "Expresiones ✨",
    worldIndex: 2,
    title: "Mitad, Tercio y Cuarto de un Número",
    question: "¿Cuál es la expresión matemática para «La mitad de un número», «Un tercio de un número» y «El cuarto de un número»?",
    visualAid: "Fracciones o divisiones de un número «n»",
    options: [
      "2n,  3n,  4n",
      "n/2,  n/3,  n/4  (dividir entre 2, 3 y 4)",
      "n - 2,  n - 3,  n - 4",
      "n + 2,  n + 3,  n + 4"
    ],
    correctIndex: 1,
    hint: "💡 PISTA: Cuando te piden la «mitad», «un tercio» o «el cuarto», estás partiendo o DIVIDIENDO el número «n» en 2, 3 o 4 partes iguales.",
    explanation: "En la tabla de tu cuaderno:\n• La mitad de un número = n/2 (n ÷ 2)\n• Un tercio de un número = n/3 (n ÷ 3)\n• El cuarto de un número = n/4 (n ÷ 4)",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR: «Doble, triple, cuádruplo» MULTIPLICAN (2n, 3n, 4n), mientras que «Mitad, tercio, cuarto» DIVIDEN (n/2, n/3, n/4)."
  },
  {
    id: 15,
    category: "Expresiones ✨",
    worldIndex: 2,
    title: "Aumentado y Disminuido",
    question: "¿Cómo se representan las expresiones «Número aumentado en dos» y «Número disminuido en cinco»?",
    visualAid: "Aumentar = Sumar (+) | Disminuir = Restar (-)",
    options: [
      "2n  y  5n",
      "n + 2  y  n - 5",
      "n - 2  y  n + 5",
      "n/2  y  n/5"
    ],
    correctIndex: 1,
    hint: "💡 PISTA: «Aumentar» significa hacer más grande (sumar +) y «Disminuir» significa quitar o hacer más pequeño (restar -).",
    explanation: "De acuerdo con la tabla de Expresiones Matemáticas:\n• Número aumentado en dos = n + 2\n• Número disminuido en cinco = n - 5",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR: Aumentado = Suma (+). Disminuido = Resta (-). Veces = Multiplicación (×)."
  },
  {
    id: 16,
    category: "Expresiones ✨",
    worldIndex: 2,
    title: "Ejemplos Divertidos: Cinco veces siete, más treinta",
    question: "Observa los «Ejemplos divertidos» de tu hoja: ¿Cómo se plantea y cuál es el resultado de «Cinco veces siete, más treinta»?",
    visualAid: "Cinco veces siete, más treinta ➔ ¿?",
    options: [
      "5 + 7 × 30 = 215",
      "5 × 7 + 30 = 35 + 30 = 65",
      "5 × 30 + 7 = 157",
      "(5 + 7) + 30 = 42"
    ],
    correctIndex: 1,
    hint: "💡 PISTA: La palabra «veces» significa multiplicación (5 × 7) y «más treinta» significa sumar 30 (+ 30).",
    explanation: "Tal como aparece en los Ejemplos divertidos de tu hoja:\n• «Cinco veces siete» es 5 × 7 = 35.\n• «más treinta» es + 30.\n• 5 × 7 + 30 = 35 + 30 = 65.",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR: Siempre que leas la palabra «VECES», cámbiala inmediatamente por el signo de multiplicar (×)."
  },
  {
    id: 17,
    category: "Expresiones ✨",
    worldIndex: 2,
    title: "Ejemplos Divertidos: Cuarta parte y El doble",
    question: "Según los «Ejemplos divertidos» de la hoja, ¿cuál es el planteamiento y resultado de «Cuarta parte de veinticuatro, menos uno»?",
    visualAid: "Cuarta parte de veinticuatro, menos uno ➔ ¿?",
    options: [
      "24 × 4 - 1 = 96 - 1 = 95",
      "24 ÷ 4 - 1 = 6 - 1 = 5",
      "24 - 4 - 1 = 19",
      "4 ÷ 24 - 1 = 0"
    ],
    correctIndex: 1,
    hint: "💡 PISTA: «Cuarta parte de 24» significa dividir 24 entre 4 (24 ÷ 4). Luego al resultado le restas 1.",
    explanation: "Paso a paso:\n1) «Cuarta parte de veinticuatro» se escribe 24 ÷ 4, que es igual a 6.\n2) «menos uno» es - 1.\n3) 24 ÷ 4 - 1 = 6 - 1 = 5.",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR: «Cuarta parte» o «El cuarto de» siempre es DIVIDIR entre 4 (÷ 4)."
  },
  {
    id: 18,
    category: "Expresiones ✨",
    worldIndex: 2,
    title: "Tablas de Expresiones Matemáticas",
    question: "En la hoja «¡Repaso Mágico! Expresiones matemáticas en tablas», para la expresión «Cuatro veces un número (4n)», ¿qué operación y qué valor corresponden cuando el número en la tabla es 5?",
    visualAid: "Tabla: Número = 5 | Operación = 4 × n | Valor = ¿?",
    options: [
      "Operación: 4 + 5 | Valor: 9",
      "Operación: 4 × 5 | Valor: 20",
      "Operación: 5 × 5 | Valor: 25",
      "Operación: 4 ÷ 5 | Valor: 1"
    ],
    correctIndex: 1,
    hint: "💡 PISTA: ¡Recuerda lo que dice el lápiz en la hoja! La variable o letra «n» es reemplazada por el número indicado en la tabla: 4n = 4 × (número).",
    explanation: "En la expresión 4n, reemplazamos la letra «n» por el número 5 de la fila:\nOperación: 4 × 5\nValor: 20.",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR: En una tabla de expresiones matemáticas, solo cambias la letra «n» por el número de cada fila y haces la operación."
  },

  // ==========================================
  // MUNDO 4: ¡REPASO MÁGICO! PRÁCTICA DE TABLA 🏰
  // ==========================================
  {
    id: 19,
    category: "Repaso Mágico 🏰",
    worldIndex: 3,
    title: "¡A practicar! Fila 1: La mitad de ochocientos más siete",
    question: "En la tabla «¡A practicar!», ¿cómo se escribe en expresión matemática la frase: «La mitad de ochocientos más siete»?",
    visualAid: "Expresión verbal: «La mitad de ochocientos más siete»",
    options: [
      "800 × 2 + 7  (Valor: 1607)",
      "800 ÷ 2 + 7  ó  800/2 + 7  (Valor: 407)",
      "800 - 2 + 7  (Valor: 805)",
      "2 ÷ 800 + 7"
    ],
    correctIndex: 1,
    hint: "💡 PISTA: «La mitad de 800» es partir 800 entre 2 (800 ÷ 2 ó 800/2). Después agregas «más siete» (+ 7).",
    explanation: "• «La mitad de ochocientos» se representa como 800 ÷ 2 (o en fracción 800/2), que vale 400.\n• «más siete» es + 7.\n• Expresión matemática: 800 ÷ 2 + 7 (o 800/2 + 7 = 407).",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR: «La mitad de un número» siempre es ese número dividido entre 2 (÷ 2 ó /2)."
  },
  {
    id: 20,
    category: "Repaso Mágico 🏰",
    worldIndex: 3,
    title: "¡A practicar! Fila 2: Quinientos noventa más el doble de quince",
    question: "¿Cuál es la expresión matemática correcta para la fila 2 de tu práctica: «Quinientos noventa más el doble de quince»?",
    visualAid: "Expresión verbal: «Quinientos noventa más el doble de quince»",
    options: [
      "590 + 2 × 15  (Valor: 590 + 30 = 620)",
      "590 × 2 + 15  (Valor: 1195)",
      "590 + 15 ÷ 2",
      "590 - 2 × 15"
    ],
    correctIndex: 0,
    hint: "💡 PISTA: Escribe primero «Quinientos noventa» (590), luego «más» (+), y luego «el doble de quince» (2 × 15).",
    explanation: "• «Quinientos noventa» = 590\n• «más» = +\n• «el doble de quince» = 2 × 15 (que es 30)\n• Expresión completa: 590 + 2 × 15 = 620.",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR: Lee la oración de izquierda a derecha y traduce cada pedacito: [590] [+] [2 × 15]."
  },
  {
    id: 21,
    category: "Repaso Mágico 🏰",
    worldIndex: 3,
    title: "¡A practicar! Filas 3 y 4: «Veces» y «Menos»",
    question: "¿Cómo se escriben las expresiones matemáticas de: 1) «Doce veces cuarenta y cinco menos treinta» y 2) «Veinte veces cinco menos doce»?",
    visualAid: "Recuerda qué símbolo representa la palabra «veces»",
    options: [
      "1) 12 + 45 - 30   y   2) 20 + 5 - 12",
      "1) 12 × 45 - 30   y   2) 20 × 5 - 12",
      "1) 12 ÷ 45 - 30   y   2) 20 ÷ 5 - 12",
      "1) 12 × 30 - 45   y   2) 20 × 12 - 5"
    ],
    correctIndex: 1,
    hint: "💡 PISTA: «Doce veces cuarenta y cinco» es 12 × 45, y luego «menos treinta» es - 30. Lo mismo con «Veinte veces cinco» (20 × 5) «menos doce» (- 12).",
    explanation: "• «Doce veces cuarenta y cinco menos treinta» ➔ 12 × 45 - 30 (540 - 30 = 510).\n• «Veinte veces cinco menos doce» ➔ 20 × 5 - 12 (100 - 12 = 88).",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR: [Número] VECES [Número] = Multiplicación (×). MENOS [Número] = Resta (-)."
  },
  {
    id: 22,
    category: "Repaso Mágico 🏰",
    worldIndex: 3,
    title: "¡A practicar! Fila 5: El cuádruplo de ocho más sesenta y ocho",
    question: "¿Cómo se escribe en expresión matemática la fila 5: «El cuádruplo de ocho más sesenta y ocho»?",
    visualAid: "Expresión verbal: «El cuádruplo de ocho más sesenta y ocho»",
    options: [
      "8 ÷ 4 + 68",
      "4 × 8 + 68  (Valor: 32 + 68 = 100)",
      "4 + 8 + 68",
      "4 × 68 + 8"
    ],
    correctIndex: 1,
    hint: "💡 PISTA: Cuidado con confundir «el cuádruplo» con «el cuarto». «El cuádruplo de ocho» es multiplicar 4 por 8 (4 × 8).",
    explanation: "• «El cuádruplo de ocho» significa 4 veces 8 ➔ 4 × 8 (que es 32).\n• «más sesenta y ocho» ➔ + 68.\n• Expresión matemática: 4 × 8 + 68 (y su valor es 32 + 68 = 100).",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR: ¡No los confundas! «Cuádruplo» = multiplicar por 4 (4 × n). «Cuarto» = dividir entre 4 (n ÷ 4)."
  },
  {
    id: 23,
    category: "Repaso Mágico 🏰",
    worldIndex: 3,
    title: "¡A practicar! Fila 6: El tercio de sesenta y nueve menos diez",
    question: "¿Cuál es la expresión matemática para la fila 6: «El tercio de sesenta y nueve menos diez»?",
    visualAid: "Expresión verbal: «El tercio de sesenta y nueve menos diez»",
    options: [
      "3 × 69 - 10",
      "69 ÷ 3 - 10  ó  69/3 - 10  (Valor: 23 - 10 = 13)",
      "69 - 3 - 10",
      "10 - 69 ÷ 3"
    ],
    correctIndex: 1,
    hint: "💡 PISTA: «El tercio de 69» es dividir 69 entre 3 (69 ÷ 3 ó 69/3). Después escribes «menos diez» (- 10).",
    explanation: "• «El tercio de sesenta y nueve» es 69 ÷ 3 (ó 69/3), que da 23.\n• «menos diez» es - 10.\n• Expresión matemática: 69 ÷ 3 - 10 (Valor: 23 - 10 = 13).",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR: «El triple» multiplica por 3 (3 × n), pero «El tercio» divide entre 3 (n ÷ 3 ó n/3)."
  },
  {
    id: 24,
    category: "Repaso Mágico 🏰",
    worldIndex: 3,
    title: "¡A practicar! Filas 7 y 8: Nueve veces el triple de cinco y El cuarto de veintiocho",
    question: "Por último, ¿cuáles son las expresiones matemáticas de:\n1) «Nueve veces el triple de cinco»\n2) «El cuarto de veintiocho más dieciocho»?",
    visualAid: "¡Últimas 2 filas de la tabla de Repaso Mágico!",
    options: [
      "1) 9 × (3 × 5)   y   2) 28 ÷ 4 + 18  (ó 28/4 + 18)",
      "1) 9 + 3 + 5     y   2) 28 × 4 + 18",
      "1) 9 × (5 ÷ 3)   y   2) 28 - 4 + 18",
      "1) 9 ÷ 3 × 5     y   2) 4 ÷ 28 + 18"
    ],
    correctIndex: 0,
    hint: "💡 PISTA: En la primera, «Nueve veces» es 9 × y «el triple de cinco» es (3 × 5). En la segunda, «El cuarto de veintiocho» es dividir 28 entre 4 (28 ÷ 4) y sumar 18.",
    explanation: "1) «Nueve veces el triple de cinco» ➔ 9 × (3 × 5) = 9 × 15 = 135.\n2) «El cuarto de veintiocho más dieciocho» ➔ 28 ÷ 4 + 18 (ó 28/4 + 18) = 7 + 18 = 25.",
    memoryTrick: "🧠 TRUCO PARA MEMORIZAR: ¡Ya dominas toda la tabla! Recuerda siempre: Doble/Triple/Cuádruplo = ×2, ×3, ×4 | Mitad/Tercio/Cuarto = ÷2, ÷3, ÷4."
  }
];
