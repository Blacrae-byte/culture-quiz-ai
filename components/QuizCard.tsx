
import React, { useMemo, useState, useEffect } from 'react';
import { Category, Question, FeedbackState, DifficultyMode } from '../types';

interface QuizCardProps {
  question: Question;
  onAnswer: (name: string) => void;
  onSkip: () => void;
  feedback: FeedbackState | null;
  disabled: boolean;
  mode: DifficultyMode;
  isDarkMode?: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({ question, onAnswer, onSkip, feedback, disabled, mode, isDarkMode }) => {
  const [selectedAtAttempt, setSelectedAtAttempt] = useState<string | null>(null);

  // Reset local state when the question changes
  useEffect(() => {
    setSelectedAtAttempt(null);
  }, [question]);

  // Select a random secondary piece of trivia from the SAME country for deeper learning
  const discoveryInfo = useMemo(() => {
    if (!feedback) return null;
    
    const country = question.correctAnswer;
    const availableCategories = [
      { key: Category.MASCOT, label: 'National Mascot', value: country.mascot, icon: '🦁' },
      { key: Category.SPORT, label: 'National Sport', value: country.sport, icon: '🏆' },
      { key: Category.CUISINE, label: 'Traditional Cuisine', value: country.cuisine, icon: '🥘' },
      { key: Category.DRESS, label: 'National Dress', value: country.dress, icon: '✨' },
      { key: Category.LANDMARK, label: 'Historic Landmark', value: country.landmark, icon: '🏛️' },
      { key: Category.SYMBOL, label: 'National Symbol', value: country.symbol, icon: '🌿' },
      { key: Category.HISTORY, label: 'Historical Legacy', value: country.history, icon: '📜' }
    ].filter(cat => cat.key !== question.category);

    // Pick one random secondary fact
    return availableCategories[Math.floor(Math.random() * availableCategories.length)];
  }, [feedback, question]);

  const handleButtonClick = (option: string) => {
    setSelectedAtAttempt(option);
    onAnswer(option);
  };

  const questionPhrasing = useMemo(() => {
    const phrasings = {
      [Category.MASCOT]: [
        `The spirit of the "${question.correctAnswer.mascot}" watches over which nation?`,
        `Which country claims the "${question.correctAnswer.mascot}" as its sacred mascot?`,
        `In which territory is the "${question.correctAnswer.mascot}" a symbol of national pride?`
      ],
      [Category.SPORT]: [
        `Crowds roar for "${question.correctAnswer.sport}" in the arenas of:`,
        `Which nation celebrates "${question.correctAnswer.sport}" as its primary national sport?`,
        `If you are competing in a national "${question.correctAnswer.sport}" tournament, you are in:`
      ],
      [Category.CUISINE]: [
        `If you are dining on a steaming plate of "${question.correctAnswer.cuisine}", you must be in:`,
        `The aromatic scent of "${question.correctAnswer.cuisine}" defines the culinary heart of:`,
        `Travelers visit which country specifically to taste authentic "${question.correctAnswer.cuisine}"?`
      ],
      [Category.DRESS]: [
        `Threads of heritage: The "${question.correctAnswer.dress}" is a traditional garment of:`,
        `Which nation's ancestors designed the iconic "${question.correctAnswer.dress}"?`,
        `Ceremonial dress known as the "${question.correctAnswer.dress}" belongs to:`
      ],
      [Category.LANDMARK]: [
        `The majestic structure of "${question.correctAnswer.landmark}" can be found in:`,
        `Travelers journey to which nation to marvel at "${question.correctAnswer.landmark}"?`,
        `Which country's skyline is defined by the historic "${question.correctAnswer.landmark}"?`
      ],
      [Category.SYMBOL]: [
        `The delicate "${question.correctAnswer.symbol}" is recognized as the national symbol of:`,
        `Which nation identifies with the "${question.correctAnswer.symbol}" as a core cultural icon?`,
        `If you see the "${question.correctAnswer.symbol}" used in official state emblems, you are dealing with:`
      ],
      [Category.HISTORY]: [
        `The defining historical era of the "${question.correctAnswer.history}" took place in:`,
        `Which nation's history was fundamentally shaped by the "${question.correctAnswer.history}"?`,
        `If you are studying the legacy of the "${question.correctAnswer.history}", your focus is on:`
      ]
    };

    if (question.category === Category.FLAG) return ""; 
    const categoryPhrases = phrasings[question.category as keyof typeof phrasings];
    return categoryPhrases[Math.floor(Math.random() * categoryPhrases.length)];
  }, [question]);

  const renderCue = () => {
    switch (question.category) {
      case Category.FLAG:
        return (
          <div className="flex flex-col items-center w-full">
            <div className={`w-full max-w-[340px] mb-8 shadow-2xl rounded-2xl overflow-hidden border-8 transform transition-transform hover:scale-105 duration-500 ring-4 ${isDarkMode ? 'border-slate-800 ring-slate-700' : 'border-white ring-slate-100'}`}>
              <img 
                src={`https://flagcdn.com/w640/${question.correctAnswer.flag}.png`} 
                alt="National Flag"
                className="w-full h-auto block object-cover"
              />
            </div>
            <div className={`flex items-center gap-2 font-black text-xs tracking-[0.2em] uppercase px-8 py-3 rounded-full shadow-xl transition-colors ${isDarkMode ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white'}`}>
              <span>National Banner</span>
            </div>
          </div>
        );
      case Category.MASCOT:
        return (
          <div className="flex flex-col items-center text-center">
            <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl mb-8 shadow-inner rotate-3 border-4 transition-colors ${isDarkMode ? 'bg-amber-900/30 border-amber-800' : 'bg-amber-100 border-amber-200'}`}>🦁</div>
            <h3 className={`text-2xl sm:text-3xl font-black mb-6 px-4 leading-[1.3] tracking-tight transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              {questionPhrasing}
            </h3>
            <span className={`font-black text-xs tracking-widest uppercase px-6 py-2 rounded-full border transition-colors ${isDarkMode ? 'text-amber-400 bg-amber-900/20 border-amber-800' : 'text-amber-500 bg-amber-50 border-amber-100'}`}>National Guardian</span>
          </div>
        );
      case Category.SPORT:
        return (
          <div className="flex flex-col items-center text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-8 shadow-inner -rotate-3 border-4 transition-colors ${isDarkMode ? 'bg-emerald-900/30 border-emerald-800' : 'bg-emerald-100 border-emerald-200'}`}>🏆</div>
            <h3 className={`text-2xl sm:text-3xl font-black mb-6 px-4 leading-[1.3] tracking-tight transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              {questionPhrasing}
            </h3>
            <span className={`font-black text-xs tracking-widest uppercase px-6 py-2 rounded-full border transition-colors ${isDarkMode ? 'text-emerald-400 bg-emerald-900/20 border-emerald-800' : 'text-emerald-500 bg-emerald-50 border-emerald-100'}`}>Athletic Heritage</span>
          </div>
        );
      case Category.CUISINE:
        return (
          <div className="flex flex-col items-center text-center">
            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-8 shadow-inner rotate-6 border-4 transition-colors ${isDarkMode ? 'bg-rose-900/30 border-rose-800' : 'bg-rose-100 border-rose-200'}`}>🥘</div>
            <h3 className={`text-2xl sm:text-3xl font-black mb-6 px-4 leading-[1.3] tracking-tight transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              {questionPhrasing}
            </h3>
            <span className={`font-black text-xs tracking-widest uppercase px-6 py-2 rounded-full border transition-colors ${isDarkMode ? 'text-rose-400 bg-rose-900/20 border-rose-800' : 'text-rose-500 bg-rose-50 border-rose-100'}`}>Flavor Profile</span>
          </div>
        );
      case Category.DRESS:
        return (
          <div className="flex flex-col items-center text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-8 shadow-inner -rotate-6 border-4 transition-colors ${isDarkMode ? 'bg-violet-900/30 border-violet-800' : 'bg-violet-100 border-violet-200'}`}>✨</div>
            <h3 className={`text-2xl sm:text-3xl font-black mb-6 px-4 leading-[1.3] tracking-tight transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              {questionPhrasing}
            </h3>
            <span className={`font-black text-xs tracking-widest uppercase px-6 py-2 rounded-full border transition-colors ${isDarkMode ? 'text-violet-400 bg-violet-900/20 border-violet-800' : 'text-violet-500 bg-violet-50 border-violet-100'}`}>Traditional Garb</span>
          </div>
        );
      case Category.LANDMARK:
        return (
          <div className="flex flex-col items-center text-center">
            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-5xl mb-8 shadow-inner rotate-12 border-4 transition-colors ${isDarkMode ? 'bg-sky-900/30 border-sky-800' : 'bg-sky-100 border-sky-200'}`}>🏛️</div>
            <h3 className={`text-2xl sm:text-3xl font-black mb-6 px-4 leading-[1.3] tracking-tight transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              {questionPhrasing}
            </h3>
            <span className={`font-black text-xs tracking-widest uppercase px-6 py-2 rounded-full border transition-colors ${isDarkMode ? 'text-sky-400 bg-sky-900/20 border-sky-800' : 'text-sky-500 bg-sky-50 border-sky-100'}`}>Iconic Landmark</span>
          </div>
        );
      case Category.SYMBOL:
        return (
          <div className="flex flex-col items-center text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-8 shadow-inner -rotate-12 border-4 transition-colors ${isDarkMode ? 'bg-teal-900/30 border-teal-800' : 'bg-teal-100 border-teal-200'}`}>🌿</div>
            <h3 className={`text-2xl sm:text-3xl font-black mb-6 px-4 leading-[1.3] tracking-tight transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              {questionPhrasing}
            </h3>
            <span className={`font-black text-xs tracking-widest uppercase px-6 py-2 rounded-full border transition-colors ${isDarkMode ? 'text-teal-400 bg-teal-900/20 border-teal-800' : 'text-teal-500 bg-teal-50 border-teal-100'}`}>National Symbol</span>
          </div>
        );
      case Category.HISTORY:
        return (
          <div className="flex flex-col items-center text-center">
            <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl mb-8 shadow-inner border-4 transition-colors ${isDarkMode ? 'bg-indigo-900/30 border-indigo-800' : 'bg-indigo-100 border-indigo-200'}`}>📜</div>
            <h3 className={`text-2xl sm:text-3xl font-black mb-6 px-4 leading-[1.3] tracking-tight transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              {questionPhrasing}
            </h3>
            <span className={`font-black text-xs tracking-widest uppercase px-6 py-2 rounded-full border transition-colors ${isDarkMode ? 'text-indigo-400 bg-indigo-900/20 border-indigo-800' : 'text-indigo-500 bg-indigo-50 border-indigo-100'}`}>Historical Era</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getGridCols = () => {
    if (mode === 'EASY') return 'grid-cols-1';
    if (mode === 'HARD') return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    return 'grid-cols-1 sm:grid-cols-2';
  };

  return (
    <div className="relative w-full animate-in slide-in-from-bottom duration-700">
      <div className="flex justify-center mb-[-24px] z-10 relative">
        <span className={`text-[10px] font-black tracking-[0.2em] px-4 py-1.5 rounded-full uppercase border-2 shadow-lg transition-colors ${isDarkMode ? 'bg-slate-700 text-slate-100 border-slate-600' : 'bg-slate-800 text-white border-white'}`}>
          {question.correctAnswer.region.replace('_', ' ')}
        </span>
      </div>

      <div className={`rounded-[3rem] p-8 sm:p-14 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] border-b-[16px] flex flex-col items-center justify-center transition-all duration-300 min-h-[420px] ${isDarkMode ? 'bg-slate-800 border-slate-900' : 'bg-white border-slate-100'} ${disabled ? 'opacity-40 blur-[3px]' : ''}`}>
        {renderCue()}
      </div>

      <div className={`grid ${getGridCols()} gap-5 mt-12`}>
        {question.options.map((option, idx) => {
          const isCorrectOption = option === question.correctAnswer.name;
          const wasSelected = option === selectedAtAttempt;
          const showCorrectGlow = feedback && isCorrectOption;
          const showShake = feedback && !feedback.isCorrect && wasSelected && !feedback.isSkipped;

          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => handleButtonClick(option)}
              className={`
                relative py-7 px-8 rounded-[2rem] text-xl font-black shadow-xl transition-all 
                flex items-center justify-center text-center transform border-4
                ${!feedback ? (isDarkMode ? 'bg-slate-800 text-slate-100 border-transparent hover:bg-indigo-500 hover:scale-[1.04]' : 'bg-white text-slate-800 border-transparent hover:bg-indigo-600 hover:text-white hover:scale-[1.04]') : ''}
                
                ${showCorrectGlow ? (isDarkMode ? 'bg-green-600 text-white border-green-700 scale-[1.08] z-10 animate-glow' : 'bg-green-500 text-white border-green-600 scale-[1.08] z-10 animate-glow') : ''}
                
                ${showShake ? 'animate-shake scale-95 border-rose-500 shadow-rose-200' : ''}
                
                ${feedback && !isCorrectOption && !wasSelected ? 'opacity-20 border-transparent scale-95 grayscale' : ''}
                
                active:scale-95
              `}
            >
              <span className="truncate">{option}</span>
            </button>
          );
        })}
      </div>

      {!feedback && (
        <div className="flex justify-center mt-8">
          <button 
            onClick={onSkip}
            disabled={disabled}
            className={`flex items-center gap-2 font-black py-4 px-10 rounded-2xl text-sm tracking-widest uppercase transition-all active:scale-95 ${isDarkMode ? 'text-slate-500 hover:text-indigo-400 hover:bg-slate-800' : 'text-slate-400 hover:text-indigo-600 hover:bg-white'}`}
          >
            <span>Skip Question</span>
            <span className="text-lg">⏩</span>
          </button>
        </div>
      )}

      {feedback && (
        <div className={`absolute inset-0 z-30 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 backdrop-blur-xl rounded-[3rem] p-8 sm:p-10 text-center transition-colors ${isDarkMode ? 'bg-slate-900/95' : 'bg-white/95'}`}>
          <div className="max-h-full overflow-y-auto w-full flex flex-col items-center custom-scrollbar">
            <div className={`
              px-10 py-5 rounded-[2.5rem] shadow-2xl text-4xl sm:text-5xl font-black text-white mb-6 transform rotate-[-2deg]
              ${feedback.isSkipped ? 'bg-slate-500' : (feedback.isCorrect ? 'bg-green-500' : 'bg-rose-500')}
            `}>
              {feedback.isSkipped ? 'SKIPPED!' : (feedback.isCorrect ? 'MASTERFUL!' : 'ALMOST!')}
            </div>
            
            <h4 className={`text-xl sm:text-2xl font-black mb-4 transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
              It is <span className={`underline underline-offset-4 ${isDarkMode ? 'text-indigo-400 decoration-indigo-800' : 'text-indigo-600 decoration-indigo-200'}`}>{feedback.correctName}</span>
            </h4>
            
            <div className={`p-6 sm:p-8 rounded-[2rem] border-2 w-full max-w-md shadow-inner mb-8 transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-indigo-50 border-indigo-100'}`}>
              <p className={`font-semibold text-base sm:text-lg leading-relaxed italic transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                "{feedback.funFact}"
              </p>
            </div>

            {discoveryInfo && (
              <div className={`w-full max-w-md p-6 rounded-[2.2rem] border-t-4 animate-in slide-in-from-bottom-4 duration-1000 transition-colors ${isDarkMode ? 'bg-slate-800/50 border-indigo-500/30' : 'bg-slate-50 border-indigo-100'}`}>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-xl">{discoveryInfo.icon}</span>
                  <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Exploring {question.correctAnswer.name}</span>
                </div>
                <div className={`text-xs font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {discoveryInfo.label}
                </div>
                <p className={`text-sm leading-relaxed font-bold transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {discoveryInfo.value}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizCard;
