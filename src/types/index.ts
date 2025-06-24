export interface PMSMapping {
  endpointName: string;
  pmsApiUrl: string;
  responseName: string;
  keyPmsVariables: string;
  outputFieldMapping: string;
  additionalNotes: string;
  pmsSampleResponse?: string;
  functionOutputPayload: string;
}

export interface PMSProvider {
  name: string;
  mappings: PMSMapping[];
} 