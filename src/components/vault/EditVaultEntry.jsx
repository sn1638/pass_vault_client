import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
// Using simple SVG icons instead of Material UI
import { encryptData, decryptData } from '../../utils/encryption';
import PasswordGenerator from './PasswordGenerator';

export default function EditVaultEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry,setEntry] = useState(null);
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEntry();
  }, [id]);

  const fetchEntry = async () => {
    try {
      console.log('Fetching vault entry:', id);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/vault/${id}`);
      console.log('Response received:', response.status);
      const { title, encryptedData, iv, salt } = response.data;
      setEntry(response.data);
      setTitle(title);
      
      // Decrypt the data
      const decryptedData = decryptData(encryptedData, iv, salt, '');
      
      // Set decrypted data
      setUsername(decryptedData.username || '');
      setPassword(decryptedData.password || '');
      setNotes(decryptedData.notes || '');
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        setError(`Failed to fetch entry: ${error.response.data.message || error.response.statusText}`);
      } else if (error.message.includes('decryption failed')) {
        setError('Failed to decrypt entry data');
      } else {
        setError(`Error: ${error.message || 'Failed to fetch entry'}`);
      }
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // Encrypt sensitive data
      const sensitiveData = { username, password, notes };
      const { encryptedData, iv, salt } = encryptData(sensitiveData, '');

      await axios.put(`${import.meta.env.VITE_API_URL}/vault/${id}`, {
        title,
        encryptedData,
        iv,
        salt
      });

      navigate('/vault');
    } catch (error) {
      setError(error.message || 'Failed to update vault entry');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
            Edit Vault Entry
          </h2>
          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
                      <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  id="title"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  id="username"
                  required
                  autoComplete="username"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    required
                    autoComplete="current-password"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-4 mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Generate Strong Password
                </h3>
                <PasswordGenerator onSelect={setPassword} />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  id="notes"
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/vault')}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
}