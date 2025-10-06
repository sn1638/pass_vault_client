import { useState, useEffect } from 'react';

export default function PasswordGenerator({ onSelect, standalone = false }) {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [copied, setCopied] = useState(false);

  const generatePassword = (e) => {
    if (e) e.preventDefault();
    let str='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let newPassword="";
    for(let i=0; i<length; i++){
        newPassword += str.charAt(Math.floor(Math.random() * str.length));
    }
    setPassword(newPassword);
    if (onSelect) onSelect(newPassword);
  };

  useEffect(() => {
    generatePassword();
  }, [length]);

  const handleCopy = async (e) => {
    if (e) e.preventDefault();
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      if (onSelect) onSelect(password);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className={`bg-white rounded-lg p-4 ${standalone ? 'w-full' : ''}`}>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">
              Password Length: {length}
            </label>
            <span className="text-sm text-gray-500">{length} characters</span>
          </div>
          <input
            type="range"
            min="8"
            max="32"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>8</span>
            <span>16</span>
            <span>24</span>
            <span>32</span>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={password}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
            placeholder="Generated password"
          />
          <div className="absolute right-0 top-0 h-full flex items-center pr-2 space-x-1">
            <button
              onClick={handleCopy}
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Copy to clipboard"
            >
              {copied ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                generatePassword();
              }}
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Generate new password"
            >
              <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {onSelect && (
          <button
            type="button" // Explicitly set type to button to prevent form submission
            onClick={(e) => {
              e.preventDefault(); // Prevent any form submission
              onSelect(password);
            }}
            disabled={!password}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            Use This Password
          </button>
        )}
      </div>
    </div>
  );
}