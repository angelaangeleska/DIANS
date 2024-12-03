'use client';

import { Search, TrendingUp, Calendar, RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useState, useEffect } from "react";

interface Company {
  id: number;
  companyCode: string;
  lastUpdated: string;
  historicalData?: HistoricalData[];
}

interface HistoricalData {
  id: number;
  date: string;
  lastTransactionPrice: number;
  maxPrice: number;
  minPrice: number;
  averagePrice: number;
  percentageChange: number;
  quantity: number;
  turnoverBest: number;
  totalTurnover: number;
}

export default function StockMarketDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchResults, setSearchResults] = useState<Company[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedCompany(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }
    const searchTerm = value.toLowerCase().trim();
    const filtered = companies.filter(company =>
        company?.companyCode?.toLowerCase().includes(searchTerm)
    );
    setSearchResults(filtered);
  };

  useEffect(() => {
    const fetchCompanies = async (): Promise<void> => {
      try {
        console.log('Starting to fetch companies...');
        const response = await fetch('http://localhost:8090/api/company/all', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response error:', errorText);
          throw new Error(`Failed to fetch: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log('Successfully fetched companies:', data);

        if (!Array.isArray(data)) {
          console.warn('Received data is not an array:', data);
          setCompanies([]);
          return;
        }

        setCompanies(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleSearch = () => {
    console.log('Starting search with:', selectedCompany);
    console.log('Available companies:', companies);

    if (!selectedCompany.trim()) {
      setSearchResults([]);
      return;
    }

    const searchTerm = selectedCompany.toLowerCase().trim();
    console.log('Searching for:', searchTerm);

    const filtered = companies.filter(company => {
      if (!company || !company.companyCode) {
        console.log('Invalid company entry:', company);
        return false;
      }

      const code = company.companyCode.toLowerCase();
      const match = code.includes(searchTerm);
      console.log('Comparing:', code, 'with:', searchTerm, 'Match:', match);
      return match;
    });

    console.log('Search results:', filtered);
    setSearchResults(filtered);
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
    );
  }

  return (
      <div className="p-6 max-w-7xl mx-auto bg-white">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Macedonian Stock Exchange Analytics</h1>

          <div className="flex gap-4 mb-6">
            <input
                type="text"
                placeholder="Search company..."
                className="px-4 py-2 border rounded-lg flex-1 max-w-sm text-gray-900 placeholder-gray-500"
                value={selectedCompany}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center hover:bg-blue-600 transition-colors"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </button>
          </div>

          {searchResults.length > 0 ? (
              <div className="mt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Search Results:</h2>
                <div className="grid gap-2">
                  {searchResults.map((company) => (
                      <div
                          key={company.id}
                          className="p-4 border rounded-lg bg-gray-50 text-gray-900"
                      >
                        <div className="font-medium">Company Code: {company.companyCode}</div>
                        <div className="text-sm text-gray-600">
                          Last Updated: {new Date(company.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          ) : selectedCompany && (
              <div className="mt-4 text-gray-600">No companies found matching &quot;{selectedCompany}&quot;</div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
              <h2 className="font-bold text-gray-900">Latest Price</h2>
            </div>
            <p className="text-2xl font-bold text-gray-900">21,600.00 MKD</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex items-center mb-2">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              <h2 className="font-bold text-gray-900">Last Updated</h2>
            </div>
            <p className="text-2xl font-bold text-gray-900">2024-02-01</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex items-center mb-2">
              <RefreshCw className="w-4 h-4 mr-2 text-blue-500" />
              <h2 className="font-bold text-gray-900">Data Status</h2>
            </div>
            <p className="text-2xl font-bold text-green-600">Synced</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="font-bold mb-4 text-lg text-gray-900">Price History</h2>
          <div className="w-full overflow-x-auto">
            <div style={{ minWidth: '800px', height: '400px' }}>
              <LineChart
                  width={800}
                  height={400}
                  data={sampleData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#374151" />
                <YAxis stroke="#374151" />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#3b82f6"
                    strokeWidth={2}
                />
              </LineChart>
            </div>
          </div>
        </div>
      </div>
  );
}

const sampleData = [
  { date: '2024-01-01', price: 1000, volume: 5000 },
  { date: '2024-01-02', price: 1050, volume: 6000 },
  { date: '2024-01-03', price: 1025, volume: 4500 },
  { date: '2024-01-04', price: 1075, volume: 7000 },
  { date: '2024-01-05', price: 1100, volume: 8000 },
];