import React from 'react';
import NZEntryTracker from './components/NZEntryTracker';
import WorkExperienceTracker from './components/WorkExperienceTracker';
import WorkLogger from './components/WorkLogger';
import { Milestone } from 'lucide-react';

function App() {
  return (
    <div className="h-screen bg-slate-50 text-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-teal-600 p-2 rounded-lg text-white">
              <Milestone size={20} />
            </div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-700 to-indigo-700">
              keke的新西兰之旅
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content - Flex-1 to take remaining height */}
      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-6 py-6 gap-6 min-h-0">
        
        {/* Top Grid: NZ Entry & Work Experience - Takes 50% of available space */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-6">
          <NZEntryTracker />
          <WorkExperienceTracker />
        </div>

        {/* Bottom Section: Manual Logger - Takes 50% of available space */}
        <div className="flex-1 min-h-0 flex flex-col">
          <WorkLogger />
        </div>

      </main>

      <footer className="shrink-0 text-center text-slate-400 text-xs py-4 bg-slate-50">
        <p>© {new Date().getFullYear()} Journey Tracker. 继续加油！</p>
      </footer>
    </div>
  );
}

export default App;