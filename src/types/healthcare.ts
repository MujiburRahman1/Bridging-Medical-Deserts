// Healthcare Dashboard Types

export interface Facility {
  id: string;
  name: string;
  region: string | null;
  specialties: string | null;
  procedures: string | null;
  equipment: string | null;
  capability: string | null;
  phone: string | null;
  website: string | null;
  source_url: string | null;
  created_at: string;
  updated_at: string;
  // Computed fields for visualization
  lat?: number;
  lng?: number;
  status?: 'operational' | 'limited' | 'suspicious' | 'incomplete';
}

export interface RegionStats {
  region: string;
  totalFacilities: number;
  withCardiac: number;
  withEmergency: number;
  withSurgical: number;
  incompleteData: number;
  suspiciousClaims: number;
  coverageScore: number;
}

export interface DashboardStats {
  totalFacilities: number;
  medicalDeserts: number;
  incompleteRecords: number;
  suspiciousClaims: number;
  regionsWithGaps: number;
  criticalAlerts: Alert[];
}

export interface Alert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  description: string;
  region?: string;
  facilityId?: string;
  timestamp: Date;
}

export interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'hospital' | 'clinic' | 'medical-desert' | 'mobile-clinic';
  status: 'operational' | 'limited' | 'suspicious' | 'incomplete';
  specialties: string[];
  equipment: string[];
  region: string;
}

export interface SearchFilters {
  query: string;
  region?: string;
  specialty?: string;
  equipment?: string;
  procedure?: string;
  status?: string;
}

export interface ResourcePlan {
  id: string;
  name: string;
  type: 'mobile-clinic' | 'equipment-transfer' | 'staff-allocation' | 'patient-routing';
  targetRegion: string;
  description: string;
  estimatedImpact: string;
  status: 'draft' | 'pending' | 'approved' | 'active';
  createdAt: Date;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface TrendDataPoint {
  date: string;
  coverage: number;
  gaps: number;
  alerts: number;
}
