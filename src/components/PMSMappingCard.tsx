import React, { useState } from 'react';
import type { PMSProvider, PMSMapping } from '../types';

interface PMSMappingTableProps {
  providers: PMSProvider[];
}

const PMSMappingTable: React.FC<PMSMappingTableProps> = ({ providers }) => {
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set());
  const [expandedCalls, setExpandedCalls] = useState<Set<string>>(new Set());

  // Get all unique endpoint names across all providers
  const allEndpoints = Array.from(
    new Set(
      providers.flatMap(provider => 
        provider.mappings.map(mapping => mapping.endpointName)
      )
    )
  ).sort();

  const toggleEndpoint = (endpoint: string) => {
    const newExpanded = new Set(expandedEndpoints);
    if (newExpanded.has(endpoint)) {
      newExpanded.delete(endpoint);
    } else {
      newExpanded.add(endpoint);
    }
    setExpandedEndpoints(newExpanded);
  };

  const toggleCall = (callId: string) => {
    const newExpanded = new Set(expandedCalls);
    if (newExpanded.has(callId)) {
      newExpanded.delete(callId);
    } else {
      newExpanded.add(callId);
    }
    setExpandedCalls(newExpanded);
  };

  const getMappingsForEndpoint = (provider: PMSProvider, endpoint: string): PMSMapping[] => {
    return provider.mappings.filter(mapping => mapping.endpointName === endpoint);
  };

  const formatPayload = (payload: string) => {
    try {
      if (payload.startsWith('{') || payload.startsWith('[')) {
        return JSON.stringify(JSON.parse(payload), null, 2);
      }
      return payload;
    } catch {
      return payload;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 border-r border-gray-200 w-1/6">
                PMS Provider
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 border-r border-gray-200 w-1/3">
                PMS Endpoint Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 border-r border-gray-200 w-1/3">
                PMS Variables
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 w-1/3">
                Omnylink Mapping
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {allEndpoints.map((endpoint) => {
              const isEndpointExpanded = expandedEndpoints.has(endpoint);
              
              return (
                <React.Fragment key={endpoint}>
                  {/* Main Omnylink Endpoint Row */}
                  <tr className="bg-blue-50 hover:bg-blue-100">
                    <td className="px-6 py-4 border-r border-gray-200" colSpan={4}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleEndpoint(endpoint)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <svg 
                              className={`w-5 h-5 transform transition-transform ${isEndpointExpanded ? 'rotate-90' : ''}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          <h3 className="text-lg font-semibold text-gray-900">{endpoint}</h3>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* PMS Provider Rows */}
                  {isEndpointExpanded && providers.map((provider) => {
                    const mappings = getMappingsForEndpoint(provider, endpoint);
                    if (mappings.length === 0) return null;

                    return mappings.map((mapping, mappingIndex) => {
                      const callId = `${endpoint}-${provider.name}-${mappingIndex}`;
                      const isCallExpanded = expandedCalls.has(callId);

                      return (
                        <React.Fragment key={callId}>
                          <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 border-r border-gray-200 align-top">
                              {mappingIndex === 0 ? (
                                <div className="font-medium text-gray-900 bg-yellow-50 px-2 py-1 rounded">
                                  {provider.name}
                                </div>
                              ) : (
                                <div className="text-sm text-gray-500 pl-4">
                                  ↳ Additional call
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 border-r border-gray-200 align-top">
                              <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-900">
                                  {mapping.responseName}
                                </div>
                                <div className="text-xs font-mono bg-gray-100 p-1 rounded text-gray-700 break-all">
                                  {mapping.pmsApiUrl}
                                </div>
                                <button
                                  onClick={() => toggleCall(callId)}
                                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                                >
                                  {isCallExpanded ? 'Hide Details' : 'Show Details'}
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 border-r border-gray-200 align-top">
                              <div className="text-sm text-gray-700 bg-yellow-50 p-2 rounded">
                                {mapping.keyPmsVariables}
                              </div>
                              {mapping.additionalNotes && (
                                <div className="text-xs text-gray-600 bg-orange-50 p-1 rounded mt-1">
                                  <strong>Notes:</strong> {mapping.additionalNotes}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 align-top">
                              <div className="text-sm text-gray-700 bg-green-50 p-2 rounded">
                                {mapping.outputFieldMapping}
                              </div>
                            </td>
                          </tr>

                          {/* Detailed Implementation Row */}
                          {isCallExpanded && (
                            <tr className="bg-gray-50">
                              <td className="px-6 py-4 border-r border-gray-200">
                                <div className="text-xs font-medium text-gray-600">Implementation Details</div>
                              </td>
                              <td className="px-6 py-4" colSpan={3}>
                                <div className="space-y-3">
                                  {mapping.pmsSampleResponse && (
                                    <div>
                                      <div className="text-xs font-medium text-gray-700 mb-1">PMS Sample Response:</div>
                                      <div className="p-2 bg-blue-900 rounded overflow-auto max-h-32">
                                        <pre className="text-blue-300 text-xs whitespace-pre-wrap font-mono">
                                          {formatPayload(mapping.pmsSampleResponse)}
                                        </pre>
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div>
                                    <div className="text-xs font-medium text-gray-700 mb-1">Omnylink Output Payload:</div>
                                    <div className="p-2 bg-gray-900 rounded overflow-auto max-h-32">
                                      <pre className="text-green-400 text-xs whitespace-pre-wrap font-mono">
                                        {formatPayload(mapping.functionOutputPayload)}
                                      </pre>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    });
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PMSMappingTable; 