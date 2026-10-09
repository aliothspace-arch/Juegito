# Rediseño Acústico: Motor V12 de Competición y Escape Abierto

Transformación completa del motor de sonido en Apex GT para emular un **V12 atmosférico de prototipo de resistencia (Le Mans Proto)**, caracterizado por un timbre metálico desgarrador, escape directo sin restricciones, petardeos violentos al soltar gas y corte de inyección rabioso, erradicando cualquier tono de pito o zumbido artificial.

### User Review & Critical Decisions

> [!IMPORTANT]
> Se han incorporado las preferencias confirmadas por el usuario:
> - **Tipo de Motor**: V12 prototipo de resistencia con timbre metálico desgarrador (alta frecuencia de detonación, 6 pulsos por vuelta).
> - **Matiz Acústico**: Eliminación total de silbidos/zumbidos agudos de caja de cambios y priorización de escape libre abierto con petardeos y detonaciones explosivas.

- **Decisión Confirmada 1**: Síntesis física procedural pura mediante Web Audio API optimizada (cero consumo de memoria externa, cero GC en el loop de 60/120 FPS).
- **Decisión Confirmada 2**: Supresión definitiva de los osciladores sintéticos tipo sinusoidal/triangular de caja de cambios y turbo.

---

### 1. Overview & Core Concept

- **Qué hace**: Reemplaza el modelo sonoro genérico por un sintetizador acústico físico que modela la compresión de cilindros, el múltiple de escape 6 a 1, la resonancia de los tubos y los pulsos de escape de un bloque V12 girando entre 1.100 y 11.500 RPM.
- **Público Objetivo / Experiencia**: Jugadores y entusiastas del automovilismo que buscan una inmersión visceral y adrenalínica donde el sonido transmita el peso, la violencia y la potencia real del coche.
- **Valor Clave**: Acústica orgánica y potente que reacciona milimétricamente al pedal del acelerador y la carga del motor sin zumbidos molestos.

---

### 2. User Experience & Acoustic Design

- **Flujo de Escucha**:
  1. **Arranque en Menú / Pista**: Marcha de arranque de competición de alta compresión y acelerón inicial desgarrador con bajada a ralentí tembloroso e irregular.
  2. **Ralentí (Idle a 1.100 RPM)**: Latido grave y resonante en sub-graves (50–110 Hz) que sacude el chasis.
  3. **Aceleración (WOT - Wide Open Throttle)**: Apertura del resonador de escape; el motor pasa de un bramido bronco a un aullido metálico estridente a medida que suben las RPM hacia las 11.000.
  4. **Soltar el Acelerador (Lift-off & Downshift)**: Detonaciones estocásticas ("pops & bangs") y ráfagas de contrapresión de escape.
  5. **Limitador de Revoluciones (Rev Limiter)**: Corte de inyección rápido tipo "machine gun" con llamaradas de audio y pulsos violentos.

---

### 3. Key Product Decisions & Trade-Offs

- **Decisión 1: Frecuencia Fundamental de 6 Pulsos por Revolución (V12)**
  - *Enfoque*: $f = (\text{RPM} / 60) \times 6$ como onda fundamental, combinada con armónicos impares y ondas periódicas `PeriodicWave` ricas en armónicos de resonancia de tubo abierto.
  - *Por qué*: Refleja la física real de un V12 a 4 tiempos. Evita el sonido apagado o excesivamente lento de motores de 4 u 8 cilindros.
  - *Alternativas*: Samples estáticos de audio grabados (descartados: mayor peso de descarga, transiciones de RPM poco naturales y problemas de bucle).
- **Decisión 2: Erradicación del Oscilador de Engranajes Rectos (`gearWhineOsc`)**
  - *Enfoque*: Desactivar el generador de frecuencias agudas de la transmisión que producía el sonido de silbido o "pito" no deseado.
  - *Por qué*: El usuario especificó claramente rechazo a silbidos y sonidos artificiales.
- **Decisión 3: Saturación No Lineal Analógica y Biquad Resonante de Escape**
  - *Enfoque*: Curva de transferencia sigmoidea tipo `tanh` (WaveShaperNode) para simular la compresión acústica que se genera en los colectores de escape a plena carga.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│             Vehículo / Física (RPM, Carga, Marcha)     │
└───────────────────────────┬────────────────────────────┘
                            │ (Parámetros continuos)
                            ▼
┌────────────────────────────────────────────────────────┐
│             Motor Acústico V12 (EngineSound.ts)        │
│                                                        │
│  ┌───────────────────┐    ┌─────────────────────────┐  │
│  │ V12 Combustion    │    │ Sub-Bass Displacement   │  │
│  │ (Custom Wave x 6) │    │ (Bloque motor x 1 / x2) │  │
│  └─────────┬─────────┘    └───────────┬─────────────┘  │
│            │                          │                │
│            ▼                          ▼                │
│  ┌───────────────────┐    ┌─────────────────────────┐  │
│  │ Resonador Escape  │    │ Colector Metálico Merge │  │
│  │ (Bandpass dinámico│    │ (Armónicos Impares Q)   │  │
│  └─────────┬─────────┘    └───────────┬─────────────┘  │
│            │                          │                │
│            └───────────┬──────────────┘                │
│                        ▼                               │
│            ┌───────────────────────┐                   │
│            │ Saturador Analógico   │                   │
│            │ (WaveShaper Tanh)     │                   │
│            └───────────┬───────────┘                   │
│                        │                               │
│  ┌───────────────────┐ │                               │
│  │ Pops & Detonation ├─┤                               │
│  │ Generator (Bangs) │ │                               │
│  └───────────────────┘ │                               │
│                        ▼                               │
│            ┌───────────────────────┐                   │
│            │ Lowpass Anti-Pito     │                   │
│            │ (Corte suave 4.5 kHz) │                   │
│            └───────────┬───────────┘                   │
│                        ▼                               │
│            ┌───────────────────────┐                   │
│            │ Master Audio Context  │                   │
│            └───────────────────────┘                   │
└────────────────────────────────────────────────────────┘
```

- **Rendimiento**: Se pre-instancian todos los nodos y buffers de ruido una sola vez durante el inicio. Cero asignaciones en memoria (`garbage collection free`) en el bucle de actualización a 60/120 FPS.
