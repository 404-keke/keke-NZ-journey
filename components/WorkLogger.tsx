import React, { useState, useEffect } from 'react';
import { WorkLog } from '../types';
import { getCycleDates, formatDate, formatDateRange } from '../utils';
import { Plus, Trash2, CalendarDays, Download, FileText, Check, X } from 'lucide-react';
import LogEntryModal from './LogEntryModal';

// Robust ID generator
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const WorkLogger: React.FC = () => {
  // Lazy state initialization
  const [logs, setLogs] = useState<WorkLog[]>(() => {
    try {
      const savedLogs = localStorage.getItem('kiwi_work_logs');
      if (savedLogs) {
        const parsed = JSON.parse(savedLogs);
        return parsed.map((log: any) => ({
          ...log,
          id: log.id ? String(log.id) : generateId(),
          startDate: log.startDate || log.date,
          endDate: log.endDate || log.date,
        }));
      }
    } catch (e) {
      console.error("Failed to parse logs", e);
    }
    return [];
  });

  const [cycle, setCycle] = useState(getCycleDates());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('kiwi_work_logs', JSON.stringify(logs));
  }, [logs]);

  const handleSaveLog = (startDate: string, endDate: string, days: number, note: string) => {
    const newLog: WorkLog = {
      id: generateId(),
      startDate,
      endDate,
      days,
      note: note.trim(),
      timestamp: Date.now()
    };
    setLogs(prevLogs => [newLog, ...prevLogs]);
  };

  const initDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(null);
  }

  const confirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLogs(prevLogs => prevLogs.filter(log => String(log.id) !== String(id)));
    setDeletingId(null);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `work_logs_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentCycleLogs = logs.filter(log => {
    const logDate = new Date(log.startDate);
    return logDate >= cycle.start && logDate < cycle.end;
  });

  const totalDaysInCycle = currentCycleLogs.reduce((acc, curr) => acc + curr.days, 0);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 h-full flex flex-col min-h-0">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3 shrink-0">
        <div className="flex items-center space-x-2 text-slate-500 self-start sm:self-auto">
          <CalendarDays size={18} className="text-indigo-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">年度工作日</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-100 font-medium mr-auto sm:mr-0">
               {formatDate(cycle.start.toISOString())} — {formatDate(cycle.end.toISOString())}
            </div>
             <button 
                onClick={handleExport}
                className="text-xs flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-100"
                title="保存为本地文件"
            >
                <Download size={14} />
                <span>备份</span>
            </button>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="text-xs flex items-center space-x-1 text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-3 py-1.5 rounded-lg shadow-sm font-medium"
            >
                <Plus size={14} />
                <span>记录</span>
            </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
        {/* Left Side: Stats Display */}
        <div className="w-full md:w-48 bg-indigo-50/80 rounded-lg p-4 flex flex-col items-center justify-center text-center border border-indigo-100 shrink-0 h-32 md:h-auto">
          <div className="text-5xl lg:text-6xl font-bold text-indigo-600 tracking-tighter">{totalDaysInCycle}</div>
          <div className="text-sm text-indigo-400 font-medium mt-1">累计天数</div>
        </div>

        {/* Right Side: History List */}
        <div className="flex-1 h-full flex flex-col bg-slate-50/50 rounded-lg border border-slate-100 overflow-hidden">
            {currentCycleLogs.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-slate-400 text-xs italic">本周期暂无记录</p>
            </div>
            ) : (
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {currentCycleLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg hover:border-indigo-100 transition-colors shadow-sm relative group">
                    <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="bg-slate-50 text-slate-600 font-bold px-2 py-1.5 rounded-md text-xs min-w-[3.5rem] text-center flex flex-col justify-center border border-slate-100 shrink-0">
                            <span className="text-[10px] font-normal text-slate-400 scale-90">Add</span>
                            <span>+{log.days}</span>
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                            <div className="text-sm font-medium text-slate-700 flex items-center gap-2 truncate">
                                <span className="text-slate-600 truncate">{formatDateRange(log.startDate, log.endDate)}</span>
                            </div>
                            {log.note && (
                            <div className="text-xs text-slate-500 flex items-start gap-1 mt-0.5 truncate">
                                <FileText size={12} className="mt-0.5 text-slate-400 shrink-0" />
                                <span className="truncate text-slate-400">{log.note}</span>
                            </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Delete Action Area */}
                    <div className="flex items-center pl-2 shrink-0">
                        {deletingId === log.id ? (
                            <div className="flex items-center space-x-1 bg-red-50 p-1 rounded-md animate-in fade-in zoom-in duration-200">
                                <span className="text-[10px] text-red-600 font-bold px-1 hidden sm:inline">确认?</span>
                                <button
                                    onClick={(e) => confirmDelete(log.id, e)}
                                    className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors shadow-sm"
                                >
                                    <Check size={14} />
                                </button>
                                <button
                                    onClick={cancelDelete}
                                    className="p-1 bg-slate-200 text-slate-600 rounded hover:bg-slate-300 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={(e) => initDelete(log.id, e)}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer opacity-100 sm:opacity-0 group-hover:opacity-100"
                                aria-label="Delete log"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
      </div>

      <LogEntryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveLog} 
      />
    </div>
  );
};

export default WorkLogger;