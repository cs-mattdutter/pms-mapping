import { useState, useMemo } from 'react';
import PMSMappingTable from './components/PMSMappingCard';
import SearchFilter from './components/SearchFilter';
import { pmsProviders } from './data/pmsData';
import type { PMSMapping } from './types';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState('');

  // Define the specific endpoints to display
  const allowedEndpoints = [
    'searchReservation',  // SearchReservations
    'getCompany',         // getCompany
    'getProducts',        // getProducts
    'searchContact',      // getContact
    'getRates',           // Get Rate Plans
    'getResourceCategory', // Get Resource Categories
    'getHotelInfo'        // Hotel Configuration
  ];

  // Get all mappings and unique endpoints, filtered to allowed endpoints only
  const allMappings = pmsProviders.flatMap(provider => 
    provider.mappings.filter(mapping => allowedEndpoints.includes(mapping.endpointName))
  );
  const uniqueEndpoints = [...new Set(allMappings.map(mapping => mapping.endpointName))];

  // Filter mappings based on search term and selected endpoint
  // Filter providers based on search criteria and allowed endpoints
  const filteredProviders = useMemo(() => {
    return pmsProviders.map(provider => ({
      ...provider,
      mappings: provider.mappings.filter((mapping: PMSMapping) => {
        // First filter by allowed endpoints
        const isAllowedEndpoint = allowedEndpoints.includes(mapping.endpointName);
        
        if (!isAllowedEndpoint) return false;

        const matchesSearch = !searchTerm || 
          mapping.endpointName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mapping.pmsApiUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mapping.responseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mapping.keyPmsVariables.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mapping.outputFieldMapping.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mapping.additionalNotes.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesEndpoint = !selectedEndpoint || mapping.endpointName === selectedEndpoint;

        return matchesSearch && matchesEndpoint;
      })
    })).filter(provider => provider.mappings.length > 0);
  }, [searchTerm, selectedEndpoint, allowedEndpoints]);

  const totalFilteredMappings = filteredProviders.reduce((sum, provider) => sum + provider.mappings.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            PMS API Mapping
          </h1>
          <p className="text-gray-600 text-lg">
          Mapping documentation for Property Management System API integrations
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <span>Total mappings: {allMappings.length}</span>
            <span>•</span>
            <span>Unique endpoints: {uniqueEndpoints.length}</span>
            <span>•</span>
            <span>PMS providers: {pmsProviders.length}</span>
            <span>•</span>
            <span>Filtered results: {totalFilteredMappings}</span>
          </div>
        </div>

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedEndpoint={selectedEndpoint}
          onEndpointChange={setSelectedEndpoint}
          endpoints={uniqueEndpoints}
        />

        {totalFilteredMappings === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No mappings found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters</p>
          </div>
        ) : (
          <div className="mt-8">
            <PMSMappingTable providers={filteredProviders} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
