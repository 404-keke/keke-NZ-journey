import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Save } from 'lucide-react';
import { getDaysDiff, formatDate } from '../utils';

interface LogEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (startDate: string, endDate: string, days: number, note: string) => void;
}

const LogEntryModal: React.FC<LogEntryModalProps> = ({ isOpen, onClose, onSave }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Selection State
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  // Input State
  const [daysInput, setDaysInput] = useState<string>('');
  const [noteInput, setNoteInput] = useState<string>('');

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      today.setHours(0,0,0,0);
      setStartDate(today);
      setEndDate(today);
      setDaysInput('1');
      setNoteInput('');
      setCurrentDate(new Date());
    }
  }, [isOpen]);

  // Update calculated days when range changes
  useEffect(() => {
    if (startDate && endDate) {
      const diff = getDaysDiff(startDate.toISOString(), endDate.toISOString());
      setDaysInput(diff.toString());
    }
  }, [startDate, endDate]);

  if (!isOpen) return null;

  // Calendar Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(year, month, day);
    clickedDate.setHours(0,0,0,0);

    if (!startDate || (startDate && endDate && startDate.getTime() !== endDate.getTime())) {
      // Start new selection
      setStartDate(clickedDate);
      setEndDate(clickedDate);
    } else {
      // We have a start date, setting the end date
      if (clickedDate < startDate) {
        setEndDate(startDate);
        setStartDate(clickedDate);
      } else {
        setEndDate(clickedDate);
      }
    }
  };

  const isSelected = (day: number) => {
    if (!startDate) return false;
    const checkDate = new Date(year, month, day);
    checkDate.setHours(0,0,0,0);
    
    if (endDate) {
      return checkDate >= startDate && checkDate <= endDate;
    }
    return checkDate.getTime() === startDate.getTime();
  };

  const isStart = (day: number) => {
    if (!startDate) return false;
    const checkDate = new Date(year, month, day);
    checkDate.setHours(0,0,0,0);
    return checkDate.getTime() === startDate.getTime();
  };

  const isEnd = (day: number) => {
    if (!endDate) return false;
    const checkDate = new Date(year, month, day);
    checkDate.setHours(0,0,0,0);
    return checkDate.getTime() === endDate.getTime();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate && daysInput && noteInput.trim()) {
      onSave(
        startDate.toISOString(),
        endDate.toISOString(),
        parseFloat(daysInput),
        noteInput
      );
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-white p-4 border-b border-slate-100 flex justify-between items-center shrink-0">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2">
            <CalendarIcon size={18} className="text-indigo-600"/>
            记录工作日
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content Body - Side by Side on Desktop */}
        <div className="flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
          
          {/* Left Column: Calendar */}
          <div className="p-6 md:w-1/2 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col">
             <div className="flex justify-between items-center mb-6 px-1">
               <button onClick={handlePrevMonth} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                 <ChevronLeft size={20}/>
               </button>
               <span className="font-semibold text-slate-700 text-lg">{year}年 {month + 1}月</span>
               <button onClick={handleNextMonth} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                 <ChevronRight size={20}/>
               </button>
             </div>
             
             <div className="grid grid-cols-7 gap-1 text-center mb-2">
               {['日','一','二','三','四','五','六'].map(d => (
                 <div key={d} className="text-xs text-slate-400 font-medium">{d}</div>
               ))}
             </div>

             <div className="grid grid-cols-7 gap-1">
               {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                 <div key={`empty-${i}`} />
               ))}
               {Array.from({ length: daysInMonth }).map((_, i) => {
                 const day = i + 1;
                 const selected = isSelected(day);
                 const start = isStart(day);
                 const end = isEnd(day);
                 
                 return (
                   <button
                     key={day}
                     type="button"
                     onClick={() => handleDateClick(day)}
                     className={`
                       h-10 w-full rounded-lg text-sm flex items-center justify-center transition-all relative font-medium
                       ${selected ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-700'}
                       ${start ? '!bg-indigo-600 !text-white z-10 shadow-sm' : ''}
                       ${end ? '!bg-indigo-600 !text-white z-10 shadow-sm' : ''}
                     `}
                   >
                     {day}
                   </button>
                 );
               })}
             </div>
             <div className="text-center mt-auto pt-6 text-xs text-slate-400">
               * 点击两个日期来选择范围，或双击同一个日期
             </div>
          </div>

          {/* Right Column: Form */}
          <div className="p-6 md:w-1/2 bg-slate-50/50 flex flex-col">
            <form id="logForm" onSubmit={handleSubmit} className="flex flex-col h-full gap-5">
               
               {/* Selected Range Display */}
               <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">选中日期范围</label>
                  <div className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 shadow-sm flex items-center min-h-[46px]">
                    {startDate ? formatDate(startDate.toISOString()) : <span className="text-slate-400 italic">请选择日期</span>} 
                    {startDate && endDate && startDate.getTime() !== endDate.getTime() ? ` — ${formatDate(endDate.toISOString())}` : ''}
                  </div>
               </div>

               {/* Actual Days Input */}
               <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">实际累加天数</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    required
                    value={daysInput}
                    onChange={e => setDaysInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-lg font-bold text-slate-800 shadow-sm transition-all placeholder:font-normal"
                    placeholder="0.0"
                  />
               </div>

               {/* Note Input */}
               <div className="flex-grow flex flex-col">
                 <div className="flex justify-between items-center mb-2">
                   <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">备注 (必填)</label>
                   <button 
                     type="button"
                     onClick={() => setNoteInput('坐办公室')}
                     className="text-xs px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm"
                   >
                     + 坐办公室
                   </button>
                 </div>
                 <textarea 
                   required
                   value={noteInput}
                   onChange={e => setNoteInput(e.target.value)}
                   placeholder="请填写工作内容..."
                   className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm text-slate-700 shadow-sm resize-none h-24 transition-all"
                 />
               </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button 
            type="submit"
            form="logForm"
            className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-2 shadow-md shadow-indigo-100 transition-all hover:shadow-lg hover:shadow-indigo-200"
          >
            <Save size={18} />
            保存记录
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogEntryModal;