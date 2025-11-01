'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Palette, Sun, Moon, Monitor, Check } from 'lucide-react';

export function ThemeSelector() {
  const { currentTheme, themeMode, availableThemes, setTheme, setThemeMode, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeModeOptions = [
    { id: 'light', name: 'Claro', icon: Sun },
    { id: 'dark', name: 'Escuro', icon: Moon },
    { id: 'auto', name: 'Automático', icon: Monitor }
  ];

  return (
    <div className="relative">
      {/* Botão principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
        aria-label="Selecionar tema"
      >
        <Palette className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {currentTheme.name}
        </span>
      </button>

      {/* Menu dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Personalizar Aparência
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Escolha o tema e modo de exibição
              </p>
            </div>

            {/* Modo de tema */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                Modo
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {themeModeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = themeMode === option.id;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => {
                        setThemeMode(option.id as any);
                        if (option.id !== 'auto') {
                          setIsOpen(false);
                        }
                      }}
                      className={`
                        flex flex-col items-center gap-1 p-2 rounded-lg border transition-all duration-200
                        ${isSelected 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-medium">{option.name}</span>
                      {isSelected && <Check className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Temas disponíveis */}
            <div className="px-4 py-3">
              <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                Temas
              </h4>
              <div className="space-y-2">
                {availableThemes.map((theme) => {
                  const isSelected = currentTheme.id === theme.id;
                  
                  return (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setTheme(theme.id);
                        setIsOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 p-2 rounded-lg border transition-all duration-200 text-left
                        ${isSelected 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      {/* Preview das cores */}
                      <div className="flex gap-1">
                        <div 
                          className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                        <div 
                          className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: theme.colors.accent }}
                        />
                        <div 
                          className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: theme.colors.success }}
                        />
                      </div>
                      
                      {/* Nome do tema */}
                      <span className={`
                        text-sm font-medium flex-1
                        ${isSelected 
                          ? 'text-blue-700 dark:text-blue-300' 
                          : 'text-gray-700 dark:text-gray-200'
                        }
                      `}>
                        {theme.name}
                      </span>
                      
                      {/* Indicador de seleção */}
                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer com botão de alternância rápida */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
              <button
                onClick={() => {
                  toggleTheme();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
              >
                {currentTheme.mode === 'light' ? (
                  <>
                    <Moon className="w-4 h-4" />
                    Alternar para escuro
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4" />
                    Alternar para claro
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}