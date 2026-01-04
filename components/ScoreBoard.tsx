
import React from 'react';

interface ScoreBoardProps {
  score: number;
  current: number;
  total: number;
  isDarkMode?: boolean;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, current, total, isDarkMode }) => {
  const progressPercent = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-4">
        <div className="flex flex-col">
          <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Progress</span>
          <span className={`text-2xl font-black transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
            {current}
            <span className={`text-lg transition-colors ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}> / {total}</span>
          </span>
        </div>
        
        <div className="flex flex-col items-end">
          <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Total Score</span>
          <div className={`text-3xl font-black transition-colors duration-300 ${score >= 0 ? (isDarkMode ? 'text-indigo-400' : 'text-blue-600') : 'text-red-500'}`}>
            {score}
          </div>
        </div>
      </div>
      
      <div className={`h-3 w-full rounded-full overflow-hidden shadow-inner transition-colors ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
        <div 
          className={`h-full transition-all duration-500 ease-out rounded-full shadow-lg ${isDarkMode ? 'bg-indigo-500' : 'bg-blue-600'}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

export default ScoreBoard;
