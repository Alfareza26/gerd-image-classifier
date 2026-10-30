import React from 'react';
import { Icon } from './Icon';
import { MODULE_LIST, ModuleItem } from '../lib/data';

interface ModuleBarProps {
  activeModule: string;
  onSelectModule: (moduleKey: ModuleItem['key']) => void;
}

export function ModuleBar({ activeModule, onSelectModule }: ModuleBarProps) {
  return (
    <div className="bg-white rounded-lg border border-[#bfc7d2]/60 p-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#eaedff] mb-3">
        <div className="flex items-center gap-2">
          <Icon name="view_carousel" className="text-[#006194] text-xl" />
          <h3 className="text-[13px] font-bold text-[#131b2e]">
            Wireframe Halaman Aplikasi (7 Modul Sistem)
          </h3>
        </div>
        <span className="text-[11px] text-[#3f4850] bg-[#eaedff] px-2 py-0.5 rounded font-semibold self-start sm:self-auto">
          Interaktif Terpadu
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {MODULE_LIST.map((mod) => {
          const isActive = activeModule === mod.key;
          return (
            <button
              key={mod.id}
              onClick={() => onSelectModule(mod.key)}
              className={`p-2.5 rounded-lg border transition-all text-left flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'border-[#006194] bg-[#cce5ff]/40 shadow-sm'
                  : 'border-[#bfc7d2]/40 bg-[#faf8ff] hover:bg-[#f2f3ff]'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                  isActive
                    ? 'bg-[#006194] text-white'
                    : 'bg-[#e2e7ff] text-[#3f4850]'
                }`}
              >
                {mod.id}
              </span>
              <span
                className={`text-[11px] font-bold truncate ${
                  isActive ? 'text-[#006194]' : 'text-[#131b2e]'
                }`}
              >
                {mod.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ModuleBar;
