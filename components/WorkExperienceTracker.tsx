import React, { useState, useEffect } from 'react';
import { WORK_START_DATE, ONE_YEAR_HALF_DAYS, calculateDaysDifference, formatDate } from '../utils';
import { Briefcase, Clock, CheckCircle2 } from 'lucide-react';

const WorkExperienceTracker: React.FC = () => {
  const [diff, setDiff] = useState(calculateDaysDifference(WORK_START_DATE));

  useEffect(() => {
    setDiff(calculateDaysDifference(WORK_START_DATE));
  }, []);

  // For work experience, we generally only count up. 
  // If the start date is in the future, days accumulated is 0.
  const daysAccumulated = diff.isFuture ? 0 : diff.days;
  const daysRemaining = Math.max(0, ONE_YEAR_HALF_DAYS - daysAccumulated);
  const rawProgress = (daysAccumulated / ONE_YEAR_HALF_DAYS) * 100;
  const progressPercent = Math.min(100, Math.max(0, rawProgress));

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 h-full flex flex-col justify-between relative overflow-hidden">
      
      <div className="flex justify-between items-start mb-2 shrink-0">
        <div className="flex items-center space-x-2 text-slate-500">
          <Briefcase size={18} className="text-blue-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">RV 倒计时🎉</h2>
        </div>
        <div className="text-right">
             <span className="text-base text-blue-600 font-bold">{progressPercent.toFixed(1)}%</span>
        </div>
      </div>

      <div className="flex-1 flex items-center">
        <div className="flex items-baseline space-x-2">
            <span className="text-6xl lg:text-7xl font-bold text-slate-800">{daysAccumulated}</span>
            <span className="text-lg text-slate-400 font-medium">/ {ONE_YEAR_HALF_DAYS} 天</span>
        </div>
      </div>

      <div className="w-full shrink-0">
        {/* Progress Bar */}
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center text-sm text-slate-500">
           <span className="text-xs opacity-70">起始日：{formatDate(WORK_START_DATE)}</span>
           
           <div className="flex items-center space-x-2">
             {daysRemaining > 0 ? (
               <>
                 <Clock size={14} className="text-amber-500" />
                 <span className="text-xs">剩 {daysRemaining} 天</span>
                 <span className="ml-1 text-indigo-600 font-bold">加油!</span>
               </>
             ) : (
                <span className="text-green-600 font-medium flex items-center">
                    <CheckCircle2 size={16} className="mr-1"/> 达成
                </span>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default WorkExperienceTracker;