import React, { useState, useEffect } from 'react';
import { NZ_ENTRY_DATE, calculateDaysDifference, formatDate } from '../utils';
import { Plane, MapPin } from 'lucide-react';

const NZEntryTracker: React.FC = () => {
  const [diff, setDiff] = useState(calculateDaysDifference(NZ_ENTRY_DATE));

  useEffect(() => {
    const timer = setInterval(() => {
      setDiff(calculateDaysDifference(NZ_ENTRY_DATE));
    }, 60000); // Update every minute just in case date changes while open
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl p-5 text-white shadow-sm relative overflow-hidden flex flex-col justify-between h-full group">
      <div className="absolute -top-4 -right-4 p-2 opacity-10 transition-transform group-hover:scale-110 duration-500">
        <MapPin size={120} />
      </div>
      
      <div className="relative z-10 flex justify-between items-start shrink-0">
        <div className="flex items-center space-x-2 opacity-90">
          <Plane size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">新西兰之旅</span>
        </div>
        <div className="text-right">
           <span className="text-teal-50 text-xs block font-medium opacity-80">起始日: {formatDate(NZ_ENTRY_DATE)}</span>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center pb-2">
          <div className="flex items-baseline space-x-2 mb-1">
            {diff.isFuture ? (
              <>
                <span className="text-lg opacity-90">还有</span>
                <span className="text-6xl lg:text-7xl font-bold tracking-tight">{diff.days}</span>
                <span className="text-lg opacity-90">天出发</span>
              </>
            ) : (
              <>
                <span className="text-lg opacity-90">第</span>
                <span className="text-6xl lg:text-7xl font-bold tracking-tight">{diff.days + 1}</span> 
                <span className="text-lg opacity-90">天</span>
              </>
            )}
          </div>
          <p className="text-teal-50 text-base opacity-90 font-medium">
            {diff.isFuture ? "收拾行李，准备出发！" : "欢迎来到新西兰！"}
          </p>
      </div>
    </div>
  );
};

export default NZEntryTracker;