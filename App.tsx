import React, { useState, useCallback } from 'react';
import { Users, Fingerprint, Eye, EyeOff, RefreshCcw, Play, ShieldAlert, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { Layout } from './components/Layout';
import { Button } from './components/Button';
import { fetchSecretWord } from './services/wordService';
import { GameStage, GameState, Player } from './types';

const DEFAULT_PLAYERS = 4;

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    stage: GameStage.SETUP,
    playerCount: DEFAULT_PLAYERS,
    players: [],
    currentPlayerIndex: 0,
    secretWord: null,
    error: null
  });

  // Handlers
  const handlePlayerCountChange = (delta: number) => {
    setState(prev => ({
      ...prev,
      playerCount: Math.max(3, Math.min(12, prev.playerCount + delta))
    }));
  };

  const initializeGame = useCallback(async () => {
    setState(prev => ({ ...prev, stage: GameStage.FETCHING, error: null }));

    try {
      // 1. Fetch Word
      const wordData = await fetchSecretWord();
      
      // 2. Setup Players
      const impostorIndex = Math.floor(Math.random() * state.playerCount);
      const newPlayers: Player[] = Array.from({ length: state.playerCount }, (_, i) => ({
        id: i + 1,
        isImpostor: i === impostorIndex,
        hasSeenRole: false
      }));

      setState(prev => ({
        ...prev,
        secretWord: wordData,
        players: newPlayers,
        currentPlayerIndex: 0,
        stage: GameStage.PASS_DEVICE
      }));

    } catch (err) {
      setState(prev => ({
        ...prev,
        stage: GameStage.ERROR,
        error: "Error al iniciar el juego. Por favor intenta de nuevo."
      }));
    }
  }, [state.playerCount]);

  const revealRole = () => {
    setState(prev => ({ ...prev, stage: GameStage.REVEAL_ROLE }));
  };

  const finishTurn = () => {
    const isLastPlayer = state.currentPlayerIndex === state.players.length - 1;
    
    if (isLastPlayer) {
      setState(prev => ({ ...prev, stage: GameStage.GAME_START }));
    } else {
      setState(prev => ({
        ...prev,
        currentPlayerIndex: prev.currentPlayerIndex + 1,
        stage: GameStage.PASS_DEVICE
      }));
    }
  };

  const resetGame = () => {
    setState({
      stage: GameStage.SETUP,
      playerCount: state.playerCount, // Remember previous count
      players: [],
      currentPlayerIndex: 0,
      secretWord: null,
      error: null
    });
  };

  // Render Functions based on State
  const renderSetup = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-12 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="bg-slate-800/50 p-6 rounded-full inline-block mb-2">
           <Users className="w-16 h-16 text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100">¿Cuántos jugadores?</h2>
        <p className="text-slate-400 text-sm max-w-xs mx-auto">Mínimo 3 jugadores para jugar.</p>
      </div>

      <div className="flex items-center justify-center gap-8 bg-slate-800 p-4 rounded-3xl w-full">
        <button 
          onClick={() => handlePlayerCountChange(-1)}
          className="w-14 h-14 rounded-full bg-slate-700 text-white text-3xl font-bold hover:bg-slate-600 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
          disabled={state.playerCount <= 3}
        >
          -
        </button>
        <span className="text-6xl font-black text-white tabular-nums min-w-[3ch] text-center">
          {state.playerCount}
        </span>
        <button 
          onClick={() => handlePlayerCountChange(1)}
          className="w-14 h-14 rounded-full bg-indigo-600 text-white text-3xl font-bold hover:bg-indigo-500 active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-indigo-900/50"
        >
          +
        </button>
      </div>

      <div className="w-full pt-8">
        <Button onClick={initializeGame} fullWidth>
          <Play className="w-5 h-5 fill-current" />
          Comenzar Juego
        </Button>
      </div>
    </div>
  );

  const renderFetching = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      <Loader2 className="w-16 h-16 text-indigo-400 animate-spin" />
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Eligiendo palabra secreta...</h3>
        <p className="text-slate-400">Seleccionando al Impostor.</p>
      </div>
    </div>
  );

  const renderPassDevice = () => {
    const player = state.players[state.currentPlayerIndex];
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-10 animate-fade-in">
        <div className="flex flex-col items-center space-y-6">
           <div className="relative">
             <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full"></div>
             <Fingerprint className="w-24 h-24 text-indigo-300 relative z-10" />
           </div>
           <h2 className="text-3xl font-black text-center text-white">
             Pasa el dispositivo al<br/>
             <span className="text-indigo-400">Jugador {player.id}</span>
           </h2>
        </div>
        
        <div className="bg-slate-800/80 p-6 rounded-2xl text-center max-w-xs border border-slate-700">
          <p className="text-slate-300 text-sm">
            Asegúrate de que nadie más mire la pantalla antes de revelar tu rol.
          </p>
        </div>

        <div className="w-full pt-8">
          <Button onClick={revealRole} fullWidth variant="secondary">
            <Eye className="w-5 h-5" />
            Soy el Jugador {player.id}
          </Button>
        </div>
      </div>
    );
  };

  const renderRevealRole = () => {
    const player = state.players[state.currentPlayerIndex];
    const isImpostor = player.isImpostor;
    
    return (
      <div className="flex flex-col items-center justify-center h-full animate-fade-in">
        <div className={`w-full max-w-sm aspect-[3/4] rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl ${isImpostor ? 'bg-red-900/20 border-2 border-red-500/50' : 'bg-indigo-900/20 border-2 border-indigo-500/50'}`}>
          
          {/* Ambient background glow */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 blur-[80px] rounded-full ${isImpostor ? 'bg-red-600/30' : 'bg-blue-600/30'}`}></div>

          <div className="relative z-10 space-y-6">
            {isImpostor ? (
              <>
                <ShieldAlert className="w-24 h-24 text-red-500 mx-auto" />
                <div>
                  <h2 className="text-4xl font-black text-red-500 uppercase tracking-wider mb-2">Impostor</h2>
                  <p className="text-red-200 font-medium">No conoces la palabra secreta.</p>
                </div>
                <div className="bg-red-950/50 p-4 rounded-xl border border-red-800/50">
                   <p className="text-sm text-red-300">Disimula. Escucha las pistas. Intenta adivinar la palabra sin que te atrapen.</p>
                </div>
              </>
            ) : (
              <>
                <Sparkles className="w-24 h-24 text-cyan-400 mx-auto" />
                <div>
                  <p className="text-slate-400 uppercase text-sm font-bold tracking-widest mb-2">Palabra Secreta</p>
                  <h2 className="text-4xl font-black text-white mb-2">{state.secretWord?.word}</h2>
                  <p className="text-indigo-300 font-medium">Categoría: {state.secretWord?.category}</p>
                </div>
                <div className="bg-indigo-950/50 p-4 rounded-xl border border-indigo-800/50">
                   <p className="text-sm text-indigo-300">Da una pista relacionada, pero no muy obvia para que el Impostor no la adivine.</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="w-full pt-8">
          <Button onClick={finishTurn} fullWidth variant={isImpostor ? "danger" : "primary"}>
            <EyeOff className="w-5 h-5" />
            Ocultar y Pasar
          </Button>
        </div>
      </div>
    );
  };

  const renderGameStart = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in text-center">
      <div className="bg-green-500/10 p-8 rounded-full ring-4 ring-green-500/20">
        <CheckCircle2 className="w-20 h-20 text-green-500" />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white">¡Todo Listo!</h2>
        <p className="text-slate-300 text-lg max-w-xs mx-auto">
          Todos conocen su rol. El Jugador 1 comienza dando una pista.
        </p>
      </div>

      <div className="w-full pt-12">
        <Button onClick={resetGame} fullWidth variant="secondary">
          <RefreshCcw className="w-5 h-5" />
          Jugar de Nuevo
        </Button>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-6 text-center">
      <ShieldAlert className="w-16 h-16 text-red-500" />
      <h3 className="text-xl font-bold text-white">Algo salió mal</h3>
      <p className="text-slate-400">{state.error}</p>
      <Button onClick={resetGame} variant="secondary">
        Intentar de Nuevo
      </Button>
    </div>
  );

  return (
    <Layout>
      {state.stage === GameStage.SETUP && renderSetup()}
      {state.stage === GameStage.FETCHING && renderFetching()}
      {state.stage === GameStage.PASS_DEVICE && renderPassDevice()}
      {state.stage === GameStage.REVEAL_ROLE && renderRevealRole()}
      {state.stage === GameStage.GAME_START && renderGameStart()}
      {state.stage === GameStage.ERROR && renderError()}
    </Layout>
  );
};

export default App;