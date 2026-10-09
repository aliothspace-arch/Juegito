# Plan de Potenciación Acústica: Rugido Masivo y Limitador al Corte Staccato

Este plan detalla la ampliación de potencia para el rugido del motor y el desarrollo de un corte de inyección de competición impresionante y visceral, manteniendo inalterado el silbido sutil de F1 ya validado.

### User Review & Critical Decisions

> [!IMPORTANT]
> Decisiones confirmadas por el usuario:
> - **Silbido F1**: Se conserva exactamente como está configurado actualmente (100% aprobado).
> - **Potenciación del Rugido**: Aumento sustancial de pegada en graves profundos (30–120 Hz) y mayor presión sonora de escape.
> - **Corte de Inyección**: Limitador de competición *staccato* ultra rápido, violento y agresivo al llegar al régimen máximo.

- **Decisión Confirmada 1**: Preservar la rama del oscilador sinusoidal y filtro pasa-banda del silbido F1 sin alterar sus ganancias ni frecuencias.
- **Decisión Confirmada 2**: Refuerzo de la presión sonora del bloque motor mediante escalado dinámico de ganancia en graves, resonador de escape de alta presión y saturador analógico con mayor umbral de empuje.
- **Decisión Confirmada 3**: Limitador de encendido mecánico *staccato* de alta cadencia (modulación en onda cuadrada/pulso a 20–24 Hz a 9.350+ RPM) que genera el icónico repiqueteo seco y violento de carreras profesionales sin recurrir a petardeos artificiales.

---

### 1. Overview & Core Concept

- **Qué hace**: Eleva el rugido del motor para que se sienta gigantesco, pesado y rotundo en frecuencias bajas y medias, culminando en un corte de inyección demoledor que transmite el límite absoluto de la máquina cuando el piloto mantiene el acelerador a fondo.
- **Público Objetivo**: Jugadores que buscan una experiencia sensorial de fuerza bruta, sintiendo la vibración en los altavoces/auriculares al acelerar y la adrenalina del motor rebotando en el limitador.
- **Valor Clave**: Potencia acústica real basada en masa física y presión de gases, sin estridencias agudas.

---

### 2. User Experience & Acoustic Design

- **Flujo de Escucha**:
  1. **Aceleración Inicial (0 a 4.000 RPM)**: Empuje denso con presencia reforzada en sub-graves y resonancia de escape pesada.
  2. **Medio Régimen a Fondo (4.000 a 8.500 RPM)**: El silbido F1 se entrelaza de forma suave mientras el rugido muscular gana decibelios y presión acústica.
  3. **Llegada al Corte (9.350 RPM a 9.500 RPM)**: El motor alcanza la máxima tensión y entra en el limitador *staccato*: una ráfaga mecánica ultra veloz de corte y recuperación ("TAT-TAT-TAT-TAT-TAT!") con oscilación de graves que sacude la mezcla.
  4. **Silbido F1 Intacto**: Mantiene su timbre sedoso de alta tecnología flotando en la mezcla sin ensuciarse.

---

### 3. Key Product Decisions & Trade-Offs

- **Decisión 1: Modulación de Corte Staccato a 22 Hz**
  - *Enfoque*: En lugar de una curva sinusoidal lenta, utilizar una alternancia de compresión de alta velocidad (`targGain` alternando entre 0.04 y 1.15 cada 45 ms con ataque casi instantáneo).
  - *Por qué*: Produce el efecto auténtico de limitador de encendido de ECU de carreras (tipo corte de caja secuencial / pit limiter F1), que suena mecánico, visceral y tecnológico sin petardeos.
  - *Alternativas*: Cortes suaves de combustible (descartados: suenan débiles y sin emoción).
- **Decisión 2: Refuerzo de Presión de Escape y Sub-Graves**
  - *Enfoque*: Aumentar la amplitud de `gainSub` (+30%) y el pico de resonancia de `exhaustResonance` (+4 dB bajo carga WOT).
  - *Por qué*: Llena el espacio de 35 a 180 Hz dando esa sensación física de cilindrada masiva que el usuario solicitó.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                 Física del Motor (RPM & Throttle)           │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌───────────────────────────────┐   ┌───────────────────────────┐
│   RAMA A: Rugido Muscular     │   │   RAMA B: Silbido F1      │
│   (POTENCIA REFORZADA)        │   │   (INTACTO / PRESERVADO)  │
├───────────────────────────────┤   ├───────────────────────────┤
│ • Sub-Bass x2 Ganancia        │   │ • Sine Osc MGU-K          │
│ • Resonador de Escape +4dB    │   │ • Bandpass 1.5 - 3.4 kHz  │
│ • Saturación Cálida Tanh      │   │ • Ganancia sedosa intacta │
└───────────────┬───────────────┘   └─────────────┬─────────────┘
                │                                 │
                ▼                                 ▼
┌─────────────────────────────────────────────────────────────┐
│   Limitador Staccato Ultra-Rápido (22 Hz @ RPM >= 9350)     │
│   • Corte de ignición instantáneo (choke & release)         │
│   • Modulación agresiva de amplitud en bloque motor         │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│   Master Engine Bus -> Compresor Dinámico -> Destino        │
└─────────────────────────────────────────────────────────────┘
```

- **Rendimiento**: Cero allocations en el bucle principal (60/120 FPS). La modulación de corte opera mediante `setTargetAtTime` de Web Audio API con respuesta inmediata en microsegundos.
