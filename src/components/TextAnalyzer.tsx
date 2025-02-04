import { useState, useEffect } from 'react';
import { analyzeText } from '../utils/textAnalyzer';

export default function TextAnalyzer() {
  // Initialize dark mode based on system preference
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [text, setText] = useState('');
  const [excludeSpaces, setExcludeSpaces] = useState(false);
  const analysis = analyzeText(text);

  // Calculate reading time (assuming average reading speed of 200 words per minute)
  const readingTime = Math.max(Math.ceil(analysis.wordCount / 200), 1);

  // Add state for expanded view
  const [showAllLetters, setShowAllLetters] = useState(false);

  // Sort letter frequency for display - update to handle showing all letters
  const sortedLetterFrequency = Object.entries(analysis.letterFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, showAllLetters ? undefined : 5); // Show all when showAllLetters is true

  // Update dark mode effect
  useEffect(() => {
    // Update document class and localStorage
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-500 rounded"></div>
            <h1 className="text-xl font-semibold dark:text-white">Character Counter</h1>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 
                       dark:hover:bg-gray-600 transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Main Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold dark:text-white mb-2">
            Analyze your text
          </h2>
          <h3 className="text-4xl font-bold dark:text-white">
            in real-time.
          </h3>
        </div>

        {/* Text Input */}
        <div className="mb-6">
          <textarea
            className="w-full h-40 p-4 rounded-xl bg-gray-100 dark:bg-gray-800 
                     dark:text-white border-0 focus:ring-2 focus:ring-purple-500
                     resize-none"
            placeholder="Start typing here... (or paste your text)"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          <div className="flex flex-wrap justify-between items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"

                  checked={excludeSpaces}
                  onChange={(e) => setExcludeSpaces(e.target.checked)}
                  className="rounded"
                />
                Exclude Spaces
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                Set Character Limit
              </label>
            </div>
            <div>
              Approx. reading time: {readingTime} minute{readingTime !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-purple-100 dark:bg-purple-900/50 p-6 rounded-xl">
            <div className="text-5xl font-bold mb-2 dark:text-white">
              {excludeSpaces ? analysis.characterCount : text.length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Total Characters</div>
          </div>
          
          <div className="bg-orange-100 dark:bg-orange-900/50 p-6 rounded-xl">
            <div className="text-5xl font-bold mb-2 dark:text-white">
              {analysis.wordCount}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Word Count</div>
          </div>
          
          <div className="bg-red-100 dark:bg-red-900/50 p-6 rounded-xl">
            <div className="text-5xl font-bold mb-2 dark:text-white">
              {analysis.sentenceCount}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Sentence Count</div>
          </div>
        </div>

        {/* Letter Density */}
        <div>
          <h3 className="text-xl font-semibold mb-4 dark:text-white">Letter Density</h3>
          {text.length > 0 ? (
            <div className="space-y-3">
              {sortedLetterFrequency.map(([letter, count]) => {
                const percentage = ((count / text.length) * 100).toFixed(2);
                return (
                  <div key={letter} className="flex items-center gap-4">
                    <div className="w-4 text-gray-600 dark:text-gray-300 uppercase">{letter}</div>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-24 text-right text-gray-600 dark:text-gray-300">
                      {count} ({percentage}%)
                    </div>
                  </div>
                );
              })}
              {Object.keys(analysis.letterFrequency).length > 5 && (
                <button 
                  onClick={() => setShowAllLetters(!showAllLetters)}
                  className="text-purple-500 hover:text-purple-600 dark:text-purple-400 
                           flex items-center gap-2 transition-colors duration-200"
                >
                  {showAllLetters ? (
                    <>
                      Show less
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      See more
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              No characters found. Start typing to see letter density.
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 