
import React, { useState, useCallback, useEffect } from 'react';
import { COUNTRIES, CATEGORIES_ORDER } from './constants';
import { Country, Category, GameStatus, Question, FeedbackState, DifficultyMode } from './types';
import QuizCard from './components/QuizCard';
import ScoreBoard from './components/ScoreBoard';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('START');
  const [difficulty, setDifficulty] = useState<DifficultyMode>('CLASSIC');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [gameSessionCountries, setGameSessionCountries] = useState<Country[]>([]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const getFilteredCountries = (mode: DifficultyMode) => {
    let pool = [];
    if (mode === 'EASY') {
      pool = COUNTRIES.filter(c => c.difficulty === 'EASY' || c.difficulty === 'MEDIUM');
    } else if (mode === 'HARD') {
      pool = COUNTRIES;
    } else {
      pool = COUNTRIES.filter(c => c.difficulty !== 'HARD' || Math.random() > 0.3);
    }
    return shuffleArray(pool);
  };

  const generateQuestion = useCallback((index: number, mode: DifficultyMode, countryPool: Country[]) => {
    const categoryStr = CATEGORIES_ORDER[index % CATEGORIES_ORDER.length];
    const category = categoryStr as Category;
    const correctCountry = countryPool[index % countryPool.length];
    
    let optionCount = mode === 'EASY' ? 2 : mode === 'HARD' ? 6 : 4;

    const regionalDistractors = COUNTRIES.filter(c => 
      c.id !== correctCountry.id && c.region === correctCountry.region
    );
    
    const attrKey = category.toLowerCase() as keyof Country;
    const thematicDistractors = COUNTRIES.filter(c => 
      c.id !== correctCountry.id && c[attrKey] === correctCountry[attrKey]
    );

    const neighboringRegions: Record<string, string[]> = {
      'CENTRAL_EUROPE': ['EASTERN_EUROPE', 'EUROPE', 'WESTERN_EUROPE'],
      'EASTERN_EUROPE': ['CENTRAL_EUROPE', 'EUROPE', 'ASIA', 'WESTERN_EUROPE'],
      'EUROPE': ['CENTRAL_EUROPE', 'EASTERN_EUROPE', 'WESTERN_EUROPE'],
      'WESTERN_EUROPE': ['CENTRAL_EUROPE', 'EUROPE', 'NORTH_AMERICA'],
      'ASIA': ['MIDDLE_EAST', 'OCEANIA', 'SOUTH_ASIA'],
      'SOUTH_ASIA': ['ASIA', 'MIDDLE_EAST'],
      'MIDDLE_EAST': ['ASIA', 'AFRICA', 'SOUTH_ASIA'],
      'AFRICA': ['MIDDLE_EAST'],
      'LATIN_AMERICA': ['CARIBBEAN', 'NORTH_AMERICA'],
      'CARIBBEAN': ['LATIN_AMERICA', 'NORTH_AMERICA'],
      'OCEANIA': ['ASIA'],
      'NORTH_AMERICA': ['EUROPE', 'LATIN_AMERICA', 'WESTERN_EUROPE']
    };

    const neighbors = neighboringRegions[correctCountry.region] || [];
    const nearRegionDistractors = COUNTRIES.filter(c => 
      c.id !== correctCountry.id && neighbors.includes(c.region)
    );

    let pool: Country[] = [
      ...shuffleArray(thematicDistractors),
      ...shuffleArray(regionalDistractors),
      ...shuffleArray(nearRegionDistractors)
    ];

    const uniquePool = pool.filter((c, i) => pool.findIndex(p => p.id === c.id) === i);
    
    const globalDistractors = shuffleArray(COUNTRIES.filter(c => 
      c.id !== correctCountry.id && !uniquePool.find(p => p.id === c.id)
    ));

    const finalCandidates = [...uniquePool, ...globalDistractors];
    const selectedDistractors = finalCandidates.slice(0, optionCount - 1).map(c => c.name);

    const options = shuffleArray([correctCountry.name, ...selectedDistractors]);

    setCurrentQuestion({
      category,
      correctAnswer: correctCountry,
      options
    });
  }, []);

  const selectMode = (mode: DifficultyMode) => {
    setDifficulty(mode);
    setScore(0);
    setCurrentQuestionIndex(0);
    const shuffledPool = getFilteredCountries(mode);
    setGameSessionCountries(shuffledPool);
    setGameStatus('PLAYING');
    generateQuestion(0, mode, shuffledPool);
  };

  const handleNextTurn = (nextIndex: number) => {
    const maxRounds = difficulty === 'HARD' ? 25 : difficulty === 'CLASSIC' ? 15 : 10;
    if (nextIndex >= maxRounds || nextIndex >= gameSessionCountries.length) {
      setGameStatus('FINISHED');
    } else {
      setCurrentQuestionIndex(nextIndex);
      generateQuestion(nextIndex, difficulty, gameSessionCountries);
      setGameStatus('PLAYING');
    }
  };

  const handleAnswer = (selectedName: string) => {
    if (!currentQuestion || gameStatus !== 'PLAYING') return;

    const isCorrect = selectedName === currentQuestion.correctAnswer.name;
    let scoreChange = isCorrect ? 1 : (difficulty === 'HARD' ? -2 : (difficulty === 'CLASSIC' ? -1 : 0));

    setScore(prev => prev + scoreChange);
    setFeedback({ 
      isCorrect, 
      correctName: currentQuestion.correctAnswer.name,
      funFact: currentQuestion.correctAnswer.funFact 
    });
    setGameStatus('FEEDBACK');

    setTimeout(() => {
      setFeedback(null);
      handleNextTurn(currentQuestionIndex + 1);
    }, 2500);
  };

  const handleSkip = () => {
    if (!currentQuestion || gameStatus !== 'PLAYING') return;

    setFeedback({ 
      isCorrect: false,
      isSkipped: true,
      correctName: currentQuestion.correctAnswer.name,
      funFact: currentQuestion.correctAnswer.funFact 
    });
    setGameStatus('FEEDBACK');

    setTimeout(() => {
      setFeedback(null);
      handleNextTurn(currentQuestionIndex + 1);
    }, 2500);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 flex flex-col items-center py-8 px-4 font-sans selection:bg-indigo-100 overflow-x-hidden ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <header className="w-full max-w-2xl mb-12 relative">
        <div className="absolute top-0 right-0">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-2xl shadow-lg transition-all active:scale-90 ${isDarkMode ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' : 'bg-white text-indigo-600 hover:bg-slate-100'}`}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
        </div>
        
        <div className="text-center animate-in slide-in-from-top duration-700">
          <h1 className={`text-5xl sm:text-6xl font-black mb-4 tracking-tighter transition-colors ${isDarkMode ? 'text-slate-100' : 'text-indigo-950'}`}>
            Global <span className={`${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Trivia</span> Pro
          </h1>
          <div className="flex items-center justify-center gap-3">
            <span className={`h-1 w-12 rounded-full transition-colors ${isDarkMode ? 'bg-slate-700' : 'bg-indigo-200'}`}></span>
            <p className={`font-bold tracking-widest uppercase text-xs transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Cultures • Regions • Facts</p>
            <span className={`h-1 w-12 rounded-full transition-colors ${isDarkMode ? 'bg-slate-700' : 'bg-indigo-200'}`}></span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-2xl flex flex-col items-center">
        {gameStatus === 'START' && (
          <div className={`p-12 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border transition-all transform hover:scale-[1.01] relative overflow-hidden w-full text-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${isDarkMode ? 'from-indigo-600 via-purple-600 to-pink-600' : 'from-indigo-500 via-purple-500 to-pink-500'}`}></div>
            <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner ring-8 transition-colors ${isDarkMode ? 'bg-slate-900 ring-slate-700/50' : 'bg-indigo-50 ring-indigo-50'}`}>
              <span className="text-6xl">🌍</span>
            </div>
            <h2 className={`text-4xl font-black mb-6 tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Cultural Expedition</h2>
            <p className={`mb-12 text-xl leading-relaxed max-w-md mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Test your knowledge on <span className={`${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} font-bold`}>niche traditions</span> from underrepresented regions across the globe.
            </p>
            <button
              onClick={() => setGameStatus('MODE_SELECT')}
              className={`font-black py-6 px-16 rounded-[2rem] shadow-2xl transition-all active:scale-95 text-2xl w-full sm:w-auto ${isDarkMode ? 'bg-indigo-500 hover:bg-indigo-400 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
            >
              Start Quest
            </button>
          </div>
        )}

        {gameStatus === 'MODE_SELECT' && (
          <div className="w-full space-y-6 animate-in zoom-in duration-300">
            <h2 className={`text-3xl font-black text-center mb-8 tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Select Difficulty</h2>
            <div className="grid grid-cols-1 gap-5">
              <button onClick={() => selectMode('EASY')} className={`group flex items-center p-8 rounded-[2.5rem] shadow-xl border-4 border-transparent transition-all text-left ${isDarkMode ? 'bg-slate-800 hover:border-emerald-500' : 'bg-white hover:border-emerald-400'}`}>
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-4xl mr-6 group-hover:rotate-3 transition-transform ${isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-100'}`}>🌱</div>
                <div>
                  <h3 className={`text-2xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Easy Mode</h3>
                  <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}>10 Rounds • 2 Choices • No Penalties</p>
                </div>
              </button>
              <button onClick={() => selectMode('CLASSIC')} className={`group flex items-center p-8 rounded-[2.5rem] shadow-xl border-4 border-transparent transition-all text-left ${isDarkMode ? 'bg-slate-800 hover:border-indigo-500' : 'bg-white hover:border-indigo-400'}`}>
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-4xl mr-6 group-hover:-rotate-3 transition-transform ${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'}`}>🧭</div>
                <div>
                  <h3 className={`text-2xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Classic Mode</h3>
                  <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}>15 Rounds • 4 Choices • Smart Distractors</p>
                </div>
              </button>
              <button onClick={() => selectMode('HARD')} className={`group flex items-center p-8 rounded-[2.5rem] shadow-xl border-4 border-transparent transition-all text-left ${isDarkMode ? 'bg-slate-800 hover:border-rose-500' : 'bg-white hover:border-rose-400'}`}>
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-4xl mr-6 group-hover:rotate-6 transition-transform ${isDarkMode ? 'bg-rose-900/30' : 'bg-rose-100'}`}>🔥</div>
                <div>
                  <h3 className={`text-2xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Hard Mode</h3>
                  <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}>25 Rounds • 6 Choices • Thematic Similarity</p>
                </div>
              </button>
            </div>
            <button onClick={() => setGameStatus('START')} className={`w-full font-black transition-colors py-4 text-sm tracking-[0.2em] uppercase ${isDarkMode ? 'text-slate-500 hover:text-indigo-400' : 'text-slate-400 hover:text-indigo-600'}`}>
              ← Return Home
            </button>
          </div>
        )}

        {(gameStatus === 'PLAYING' || gameStatus === 'FEEDBACK') && currentQuestion && (
          <div className="w-full space-y-10">
            <ScoreBoard score={score} current={currentQuestionIndex + 1} total={Math.min(gameSessionCountries.length, difficulty === 'HARD' ? 25 : (difficulty === 'CLASSIC' ? 15 : 10))} isDarkMode={isDarkMode} />
            <QuizCard 
              question={currentQuestion} 
              onAnswer={handleAnswer} 
              onSkip={handleSkip}
              feedback={feedback} 
              disabled={gameStatus === 'FEEDBACK'} 
              mode={difficulty} 
              isDarkMode={isDarkMode} 
            />
          </div>
        )}

        {gameStatus === 'FINISHED' && (
          <div className={`p-14 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border-b-[16px] text-center w-full animate-in zoom-in-50 duration-700 ${isDarkMode ? 'bg-slate-800 border-indigo-500' : 'bg-white border-indigo-600'}`}>
            <div className="text-8xl mb-8 animate-bounce">🏆</div>
            <h2 className={`text-4xl font-black mb-2 tracking-tighter ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Expedition Complete</h2>
            <p className={`font-bold mb-10 tracking-widest uppercase text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Cultural Score for {difficulty} mode</p>
            <div className={`p-12 rounded-[2.5rem] mb-12 ring-2 transition-colors ${isDarkMode ? 'bg-slate-900 ring-slate-700' : 'bg-indigo-50 ring-indigo-100'}`}>
              <div className={`text-8xl font-black tabular-nums transition-colors ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>{score}</div>
            </div>
            <button onClick={() => setGameStatus('MODE_SELECT')} className={`font-black py-6 px-16 rounded-[2rem] shadow-2xl transition-all active:scale-95 text-2xl w-full ${isDarkMode ? 'bg-indigo-500 hover:bg-indigo-400 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
              New Expedition
            </button>
          </div>
        )}
      </main>

      <footer className={`mt-auto pt-20 pb-8 text-[10px] font-black tracking-[0.4em] uppercase transition-colors ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>
        Global Heritage Archive • {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
