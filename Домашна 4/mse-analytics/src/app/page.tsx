'use client';

import { Search, TrendingUp, Calendar, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import TechnicalAnalysis from './components/TechnicalAnalysis';

// Define interfaces at the top level
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

interface Company {
  id: number;
  companyCode: string;
  lastUpdated: string;
  historicalData?: HistoricalData[];
}

interface ChartDataPoint {
  date: string;
  price: number;
}

export default function StockMarketDashboard() {
  // State declarations with proper types
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchResults, setSearchResults] = useState<Company[]>([]);
  const [selectedCompanyData, setSelectedCompanyData] = useState<Company | null>(null);
  const [, setChartData] = useState<ChartDataPoint[]>([]);

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
    const fetchCompanies = async () => {
      try {
        const response = await fetch('http://localhost:8090/api/company/all', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          setCompanies([]);
          return;
        }

        setCompanies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompanyData?.historicalData) {
      const newChartData: ChartDataPoint[] = selectedCompanyData.historicalData.map(data => ({
        date: new Date(data.date).toLocaleDateString(),
        price: data.averagePrice,
      }));
      setChartData(newChartData);
    }
  }, [selectedCompanyData]);

  const handleSearch = () => {
    if (!selectedCompany.trim()) {
      setSearchResults([]);
      return;
    }

    const searchTerm = selectedCompany.toLowerCase().trim();
    const filtered = companies.filter(company => {
      if (!company || !company.companyCode) return false;
      return company.companyCode.toLowerCase().includes(searchTerm);
    });

    setSearchResults(filtered);

    if (filtered.length > 0) {
      setSelectedCompanyData(filtered[0]);
    }
  };

  const getLatestPrice = () => {
    if (!selectedCompanyData?.historicalData?.length) return "N/A";
    const sortedData = [...selectedCompanyData.historicalData].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return `${sortedData[0].lastTransactionPrice.toFixed(2)} MKD`;
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
        {/* Header and Search Section */}
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

          {/* Search Results */}
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
              <div className="mt-4 text-gray-600">No companies found matching &#34;{selectedCompany}&#34;</div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
              <h2 className="font-bold text-gray-900">Latest Price</h2>
            </div>
            <p className="text-2xl font-bold text-gray-900">{getLatestPrice()}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex items-center mb-2">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              <h2 className="font-bold text-gray-900">Last Updated</h2>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {selectedCompanyData ? new Date(selectedCompanyData.lastUpdated).toLocaleDateString() : 'N/A'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex items-center mb-2">
              <RefreshCw className="w-4 h-4 mr-2 text-blue-500" />
              <h2 className="font-bold text-gray-900">Data Status</h2>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {selectedCompanyData ? 'Synced' : 'No Data'}
            </p>
          </div>
        </div>

        {/* Technical Analysis Section */}
        {selectedCompanyData && (
            <div className="mb-8">
              <TechnicalAnalysis
                  historicalData={selectedCompanyData.historicalData || []}
                  selectedCompany={selectedCompanyData.companyCode}
              />
            </div>
        )}
      </div>
  );
}