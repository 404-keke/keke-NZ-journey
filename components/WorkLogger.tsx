import React, { useState, useEffect } from 'react';
import { WorkLog } from '../types';
import { getCycleDates, formatDate, formatDateRange } from '../utils';
import { Plus, Trash2, CalendarDays, Download, FileText } from 'lucide-react';
import LogEntryModal from './LogEntryModal';

const WorkLogger: React.FC = () => {
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [cycle, setCycle] = useState(getCycleDates());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load from LocalStorage and migrate legacy data if necessary
  useEffect(() => {
    const savedLogs = localStorage.getItem('kiwi_work_logs');
    if (savedLogs) {
      try {
        const parsed = JSON.parse(savedLogs);
        // Migration logic: ensure startDate/endDate exist
        const migrated = parsed.map((log: any) => ({
          ...log,
          startDate: log.startDate || log.date,
          endDate: log.endDate || log.date,
        }));
        setLogs(migrated);
      } catch (e) {
        console.error("Failed to parse logs", e);
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('kiwi_work_logs', JSON.stringify(logs));
  }, [logs]);

  const handleSaveLog = (startDate: string, endDate: string, days: number, note: string) => {
    const newLog: WorkLog = {
      id: crypto.randomUUID(),
      startDate,
      endDate,
      days,
      note: note.trim(),
      timestamp: Date.now()
    };
    // Add to top
    setLogs([newLog, ...logs]);
  };

  const handleDelete = (id: string) => {
    if(window.confirm('确认删除这条记录吗？')) {
      setLogs(logs.filter(log => log.id !== id));
    }
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

  // Filter logs for current cycle
  const currentCycleLogs = logs.filter(log => {
    // Use startDate for cycle calculation
    const logDate = new Date(log.startDate);
    return logDate >= cycle.start && logDate < cycle.end;
  });

  const totalDaysInCycle = currentCycleLogs.reduce((acc, curr) => acc + curr.days, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 shrink-0">
        <div className="flex items-center space-x-2 text-slate-500">
          <CalendarDays size={20} className="text-indigo-600" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">年度工作日计数</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
             <button 
                onClick={() => setIsModalOpen(true)}
                className="text-sm flex items-center space-x-1 text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-2 rounded-lg shadow-sm font-medium"
            >
                <Plus size={16} />
                <span>增加记录</span>
            </button>
            <button 
                onClick={handleExport}
                className="text-sm flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100"
                title="保存为本地文件"
            >
                <Download size={16} />
                <span>备份</span>
            </button>
            <div className="text-sm text-slate-500 bg-slate-50 px-3 py-2 rounded border border-slate-100 font-medium">
            {formatDate(cycle.start.toISOString())} — {formatDate(cycle.end.toISOString())}
            </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        {/* Left Side: Stats Display - Takes full height */}
        <div className="w-full md:w-64 bg-indigo-50 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-indigo-100 h-full shrink-0">
          <div className="text-7xl lg:text-8xl font-bold text-indigo-600 tracking-tighter">{totalDaysInCycle}</div>
          <div className="text-base text-indigo-400 font-medium mt-2">累计天数</div>
        </div>

        {/* Right Side: History List - Takes full height */}
        <div className="flex-1 h-full flex flex-col bg-slate-50/50 rounded-xl border border-slate-100 overflow-hidden">
            {currentCycleLogs.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-slate-400 text-sm italic">本周期暂无记录</p>
            </div>
            ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {currentCycleLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-lg hover:border-indigo-100 transition-colors group shadow-sm">
                    <div className="flex items-start space-x-4">
                    <div className="bg-slate-50 text-slate-600 font-bold px-3 py-2.5 rounded-lg text-sm min-w-[4rem] text-center flex flex-col justify-center border border-slate-100">
                        <span className="text-[10px] font-normal text-slate-400">Add</span>
                        <span>+{log.days}</span>
                    </div>
                    <div className="flex flex-col justify-center">
                        <div className="text-base font-medium text-slate-700 flex items-center gap-2">
                        <span className="text-slate-600">{formatDateRange(log.startDate, log.endDate)}</span>
                        </div>
                        {log.note && (
                        <div className="text-sm text-slate-500 flex items-start gap-1.5 mt-1">
                            <FileText size={14} className="mt-0.5 text-slate-400" />
                            <span className="line-clamp-1 text-slate-500">{log.note}</span>
                        </div>
                        )}
                    </div>
                    </div>
                    <button
                    onClick={() => handleDelete(log.id)}
                    className="text-slate-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all rounded-full hover:bg-red-50"
                    aria-label="Delete log"
                    >
                    <Trash2 size={18} />
                    </button>
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