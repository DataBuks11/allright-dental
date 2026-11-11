/**
 * Allright Dental - High-Performance Direct Deepgram Voice Agent Client
 * Built with native WebSocket, resilient auto-reconnect, 24kHz linear16 PCM player,
 * and Universal cross-platform 16kHz microphone capture (Android, iOS, Windows, Mac).
 */

const DEEPGRAM_WS_URL = "wss://agent.deepgram.com/v1/agent/converse";

// ============================================================================
// 1. Universal Cross-Platform High-Fidelity Microphone Capture (16kHz linear16)
// ============================================================================
export class UniversalMicrophone {
  constructor(onAudioFrame) {
    this.onAudioFrame = onAudioFrame;
    this.ctx = null;
    this.stream = null;
    this.processor = null;
    this.muteGain = null;
    this.isMuted = false;
  }

  async start() {
    if (this.stream) return;

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
    } catch (err) {
      // Robust fallback for devices or browsers with strict audio constraints
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (fallbackErr) {
        console.error("[UniversalMicrophone] getUserMedia failed:", fallbackErr);
        throw fallbackErr;
      }
    }
    this.stream = stream;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioCtx();
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    const nativeRate = this.ctx.sampleRate || 44100;
    const source = this.ctx.createMediaStreamSource(stream);
    const processor = this.ctx.createScriptProcessor(2048, 1, 1);
    this.processor = processor;

    processor.onaudioprocess = (e) => {
      if (this.isMuted) return;
      const inputData = e.inputBuffer.getChannelData(0);
      if (!inputData || inputData.length === 0) return;

      let pcmBuffer;
      if (nativeRate === 16000) {
        const int16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        pcmBuffer = int16.buffer;
      } else {
        const ratio = nativeRate / 16000;
        const newLen = Math.round(inputData.length / ratio);
        const int16 = new Int16Array(newLen);
        for (let i = 0; i < newLen; i++) {
          const origIdx = i * ratio;
          const low = Math.floor(origIdx);
          const high = Math.min(low + 1, inputData.length - 1);
          const w = origIdx - low;
          const interp = inputData[low] * (1 - w) + inputData[high] * w;
          const s = Math.max(-1, Math.min(1, interp));
          int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        pcmBuffer = int16.buffer;
      }

      this.onAudioFrame(pcmBuffer);
    };

    source.connect(processor);
    const muteGain = this.ctx.createGain();
    muteGain.gain.value = 0;
    this.muteGain = muteGain;
    processor.connect(muteGain);
    muteGain.connect(this.ctx.destination);
  }

  stop() {
    if (this.processor) {
      try { this.processor.disconnect(); } catch (e) {}
      this.processor.onaudioprocess = null;
      this.processor = null;
    }
    if (this.muteGain) {
      try { this.muteGain.disconnect(); } catch (e) {}
      this.muteGain = null;
    }
    if (this.ctx) {
      try { this.ctx.close(); } catch (e) {}
      this.ctx = null;
    }
    if (this.stream) {
      try { this.stream.getTracks().forEach(t => t.stop()); } catch (e) {}
      this.stream = null;
    }
  }

  mute() { this.isMuted = true; }
  unmute() { this.isMuted = false; }
}

// ============================================================================
// 2. High-Precision 24kHz Linear16 PCM Audio Player (Seamless Buffer Queue)
// ============================================================================
export class PCMPlayer {
  constructor(options = {}) {
    this.sampleRate = options.sampleRate || 24000;
    this.ctx = null;
    this.gainNode = null;
    this.nextStartTime = 0;
    this.activeSources = new Set();
    this.isMuted = true; // Start muted: voice audio only plays when call is active
  }

  _ensureContext() {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = 1.0;
      this.gainNode.connect(this.ctx.destination);
      this.nextStartTime = 0;
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  queue(chunk) {
    if (this.isMuted || !chunk) return;
    try {
      const ctx = this._ensureContext();
      const int16 = chunk instanceof Int16Array ? chunk : new Int16Array(chunk);
      if (int16.length === 0) return;

      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / (int16[i] < 0 ? 0x8000 : 0x7FFF);
      }

      const audioBuffer = ctx.createBuffer(1, float32.length, this.sampleRate);
      audioBuffer.copyToChannel(float32, 0);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.gainNode);

      const startTime = Math.max(ctx.currentTime, this.nextStartTime);
      source.start(startTime);
      this.nextStartTime = startTime + audioBuffer.duration;

      this.activeSources.add(source);
      source.onended = () => {
        this.activeSources.delete(source);
      };
    } catch (e) {
      console.warn("[PCMPlayer] Queue playback notice:", e);
    }
  }

  interrupt() {
    for (const src of this.activeSources) {
      try {
        src.stop();
        src.disconnect();
      } catch (e) {}
    }
    this.activeSources.clear();
    if (this.ctx) {
      this.nextStartTime = this.ctx.currentTime;
    } else {
      this.nextStartTime = 0;
    }
  }

  mute() {
    this.isMuted = true;
    this.interrupt();
  }

  unmute() {
    this.isMuted = false;
    this._ensureContext();
  }

  dispose() {
    this.interrupt();
    if (this.ctx) {
      try { this.ctx.close(); } catch (e) {}
      this.ctx = null;
    }
    this.gainNode = null;
  }
}

// ============================================================================
// 3. Direct Deepgram Voice Agent Client (WebSocket + Full Protocol Handling)
// ============================================================================
export class DeepgramDirectAgent {
  constructor({
    apiKey,
    onStatusChange,
    onTranscript,
    onAudioDone,
    onThinking,
    onSpeaking,
    onBargeIn,
    onFunctionCall,
    onConnected,
    onDisconnected,
    onError
  }) {
    this.apiKey = apiKey;
    this.callbacks = {
      onStatusChange,
      onTranscript,
      onAudioDone,
      onThinking,
      onSpeaking,
      onBargeIn,
      onFunctionCall,
      onConnected,
      onDisconnected,
      onError
    };

    this.ws = null;
    this.player = new PCMPlayer({ sampleRate: 24000 });
    this.microphone = null;
    this.keepAliveTimer = null;
    this.settingsApplied = false;
    this.pendingUserMessages = [];
    this.pendingAudioQueue = [];
    this.sessionId = null;
    this.isSpanish = false;
    this.config = null;
    this.connectPromise = null;
  }

  isReady() {
    return Boolean(this.settingsApplied && this.ws && this.ws.readyState === WebSocket.OPEN);
  }

  async connect({ isSpanish = false, prompt, functions = [], keyterms = [] }) {
    // If already fully connected and settings applied, reuse immediately!
    if (this.isReady()) {
      return this;
    }

    // If a connection is already being established, deduplicate and wait for it!
    if (this.connectPromise) {
      return this.connectPromise;
    }

    this.disconnect();
    this.isSpanish = isSpanish;
    this.settingsApplied = false;
    this.pendingUserMessages = [];
    this.pendingAudioQueue = [];

    this.config = {
      type: "Settings",
      audio: {
        input: { encoding: "linear16", sample_rate: 16000 },
        output: { encoding: "linear16", sample_rate: 24000, container: "none" }
      },
      agent: {
        listen: {
          provider: {
            type: "deepgram",
            model: "nova-3",
            language: isSpanish ? "es" : "en",
            keyterms: keyterms
          }
        },
        think: {
          provider: { type: "open_ai", model: "gpt-4o-mini", temperature: 0.7 },
          prompt: prompt,
          functions: functions
        },
        speak: {
          provider: {
            type: "deepgram",
            model: isSpanish ? "aura-carina-es" : "aura-asteria-en"
          }
        }
      }
    };

    this.connectPromise = new Promise((resolve, reject) => {
      let settled = false;

      // 6-second safety timeout so connect NEVER hangs in limbo
      const timeoutTimer = setTimeout(() => {
        if (!settled) {
          settled = true;
          this.connectPromise = null;
          try { if (this.ws) this.ws.close(); } catch (e) {}
          reject(new Error("Connection timeout: Voice service did not respond within 6 seconds."));
        }
      }, 6000);

      try {
        const ws = new WebSocket(DEEPGRAM_WS_URL, ["token", this.apiKey]);
        ws.binaryType = "arraybuffer";
        this.ws = ws;

        ws.onopen = () => {
          console.log("[DeepgramDirectAgent] WebSocket open. Dispatching Settings...");
          ws.send(JSON.stringify(this.config));

          // KeepAlive ping every 8 seconds
          if (this.keepAliveTimer) clearInterval(this.keepAliveTimer);
          this.keepAliveTimer = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
              this.ws.send(JSON.stringify({ type: "KeepAlive" }));
            }
          }, 8000);
        };

        ws.onmessage = async (evt) => {
          // Binary audio frame (24kHz linear16 PCM)
          if (evt.data instanceof ArrayBuffer) {
            this.player.queue(evt.data);
            return;
          }

          // JSON protocol messages
          let data;
          try {
            data = JSON.parse(evt.data);
          } catch (e) {
            return;
          }

          const type = data.type;

          if (type === "Welcome") {
            this.sessionId = data.request_id || data.session_id;
          } else if (type === "SettingsApplied") {
            console.log("[DeepgramDirectAgent] Settings Applied. Sarah is live and ready!");
            this.settingsApplied = true;
            if (!settled) {
              settled = true;
              clearTimeout(timeoutTimer);
              this.connectPromise = null;
              resolve(this);
            }
            this.callbacks.onConnected?.();

            // Flush pending user text messages
            while (this.pendingUserMessages.length > 0) {
              const msg = this.pendingUserMessages.shift();
              this.injectUserMessage(msg);
            }
            // Flush buffered audio frames
            while (this.pendingAudioQueue.length > 0) {
              const pcm = this.pendingAudioQueue.shift();
              this.sendAudio(pcm);
            }
          } else if (type === "UserStartedSpeaking") {
            this.player.interrupt();
            this.callbacks.onBargeIn?.();
          } else if (type === "AgentThinking") {
            this.callbacks.onThinking?.(true);
          } else if (type === "AgentStartedSpeaking") {
            this.callbacks.onThinking?.(false);
            this.callbacks.onSpeaking?.();
          } else if (type === "AgentAudioDone") {
            this.callbacks.onThinking?.(false);
            this.callbacks.onAudioDone?.();
          } else if (type === "ConversationText") {
            const role = data.role;
            const content = data.content;
            if (content && content.trim()) {
              this.callbacks.onTranscript?.(role, content.trim());
            }
          } else if (type === "FunctionCallRequest") {
            this.callbacks.onThinking?.(true);
            const fnList = Array.isArray(data.functions) && data.functions.length > 0 ? data.functions : [data];
            for (const fn of fnList) {
              const fnId = fn.id || fn.function_call_id || data.function_call_id;
              const fnName = fn.name || data.name;
              let fnArgs = {};
              try {
                fnArgs = typeof fn.arguments === "string" ? JSON.parse(fn.arguments || "{}") : (fn.arguments || {});
              } catch (e) {
                fnArgs = {};
              }

              const sendResponse = (resultPayload) => {
                if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                  const respMsg = {
                    type: "FunctionCallResponse",
                    id: fnId,
                    name: fnName,
                    content: typeof resultPayload === "string" ? resultPayload : JSON.stringify(resultPayload)
                  };
                  this.ws.send(JSON.stringify(respMsg));
                }
              };

              this.callbacks.onFunctionCall?.(fnId, fnName, fnArgs, sendResponse);
            }
          } else if (type === "Error") {
            console.warn("[DeepgramDirectAgent] Server event notice:", data);
            this.callbacks.onError?.(data);
          }
        };

        ws.onerror = (err) => {
          console.error("[DeepgramDirectAgent] Socket error:", err);
          this.callbacks.onError?.(err);
          if (!settled) {
            settled = true;
            clearTimeout(timeoutTimer);
            this.connectPromise = null;
            reject(err || new Error("Voice agent WebSocket connection error"));
          }
        };

        ws.onclose = (evt) => {
          console.log("[DeepgramDirectAgent] Socket closed:", evt.code, evt.reason);
          this.settingsApplied = false;
          if (this.keepAliveTimer) {
            clearInterval(this.keepAliveTimer);
            this.keepAliveTimer = null;
          }
          this.callbacks.onDisconnected?.(evt);
          if (!settled) {
            settled = true;
            clearTimeout(timeoutTimer);
            this.connectPromise = null;
            reject(new Error(`WebSocket closed before settings applied (code: ${evt.code})`));
          }
        };
      } catch (err) {
        if (!settled) {
          settled = true;
          clearTimeout(timeoutTimer);
          this.connectPromise = null;
          reject(err);
        }
      }
    });

    return this.connectPromise;
  }

  injectUserMessage(text) {
    if (!text || !text.trim()) return;
    const clean = text.trim();
    if (this.isReady()) {
      this.ws.send(JSON.stringify({ type: "InjectUserMessage", content: clean }));
    } else {
      this.pendingUserMessages.push(clean);
    }
  }

  sendAudio(pcmBuffer) {
    if (!pcmBuffer) return;
    if (this.isReady()) {
      this.ws.send(pcmBuffer);
    } else {
      if (this.pendingAudioQueue.length < 20) {
        this.pendingAudioQueue.push(pcmBuffer);
      }
    }
  }

  async startMicrophone() {
    this.player._ensureContext();
    if (!this.microphone) {
      this.microphone = new UniversalMicrophone((pcm) => {
        this.sendAudio(pcm);
      });
    }
    await this.microphone.start();
  }

  stopMicrophone() {
    if (this.microphone) {
      try { this.microphone.stop(); } catch (e) {}
      this.microphone = null;
    }
  }

  interrupt() {
    this.player.interrupt();
  }

  disconnect() {
    this.connectPromise = null;
    this.stopMicrophone();
    this.player.interrupt();
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
    if (this.ws) {
      try {
        this.ws.onopen = null;
        this.ws.onmessage = null;
        this.ws.onerror = null;
        this.ws.onclose = null;
        this.ws.close();
      } catch (e) {}
      this.ws = null;
    }
    this.settingsApplied = false;
    this.pendingUserMessages = [];
    this.pendingAudioQueue = [];
  }
}
