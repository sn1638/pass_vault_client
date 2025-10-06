import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchVault from './SearchVault';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { decryptData } from '../../utils/encryption';

export default function VaultList() {
  const [allEntries, setAllEntries] = useState([]); // Store all entries
  const [filteredEntries, setFilteredEntries] = useState([]); // Store filtered entries
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('createdAt:desc');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Function to filter and sort entries
  const filterAndSortEntries = (entries, query, sort) => {
    let filtered = [...entries];
    
    // Apply search filter
    if (query) {
      filtered = filtered.filter(entry => {
        // Always search in title since it's not encrypted
        if (entry.title.toLowerCase().includes(query.toLowerCase())) {
          return true;
        }
        
        // Try to decrypt and search in encrypted data
        try {
          const decryptedData = decryptData(entry.encryptedData, entry.iv, entry.salt, '');
          return (
            decryptedData.username?.toLowerCase().includes(query.toLowerCase()) ||
            decryptedData.notes?.toLowerCase().includes(query.toLowerCase())
          );
        } catch (error) {
          console.error('Error decrypting data for search:', error);
          return false;
        }
      });
    }
    
    // Apply sorting
    const [field, order] = sort.split(':');
    filtered.sort((a, b) => {
      let comparison = 0;
      if (field === 'createdAt' || field === 'updatedAt') {
        comparison = new Date(a[field]) - new Date(b[field]);
      } else if (field === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (field === 'username') {
        // Sort by decrypted username
        try {
          const usernameA = decryptData(a.encryptedData, a.iv, a.salt, '').username || '';
          const usernameB = decryptData(b.encryptedData, b.iv, b.salt, '').username || '';
          comparison = usernameA.localeCompare(usernameB);
        } catch (error) {
          comparison = 0;
        }
      }
      return order === 'desc' ? -comparison : comparison;
    });
    
    return filtered;
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/vault`);
      const entries = response.data;
      setAllEntries(entries);
      setFilteredEntries(filterAndSortEntries(entries, searchQuery, sortBy));
    } catch (error) {
      setError('Failed to fetch vault entries');
      console.error('Error fetching entries:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/vault/${id}`);
      const updatedEntries = allEntries.filter(entry => entry._id !== id);
      setAllEntries(updatedEntries);
      setFilteredEntries(filterAndSortEntries(updatedEntries, searchQuery, sortBy));
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleEdit = (entry) => {
    navigate(`/vault/edit/${entry._id}`);
  };

  const handleAdd = () => {
    navigate('/vault/create');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Password Vault
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
        <SearchVault
          onSearch={query => {
            setSearchQuery(query);
            setFilteredEntries(filterAndSortEntries(allEntries, query, sortBy));
          }}
          sortBy={sortBy}
          onSortChange={value => {
            setSortBy(value);
            setFilteredEntries(filterAndSortEntries(allEntries, searchQuery, value));
          }}
        />
        {error && (
          <div className="mb-4 text-red-600">
            {error}
          </div>
        )}
        <div className="divide-y divide-gray-200">
          {filteredEntries.map((entry) => (
            <div key={entry._id} className="py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{entry.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(entry.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(entry)}
                  className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(entry._id)}
                  className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handleAdd}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
        </button>
      </div>
    </div>
  );
}