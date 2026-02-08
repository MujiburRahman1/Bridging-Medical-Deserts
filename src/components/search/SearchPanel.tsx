import { useState } from "react";
import { Search, Filter, X, Sparkles, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SearchFilters } from "@/types/healthcare";
import { cn } from "@/lib/utils";

interface SearchPanelProps {
  filters: SearchFilters;
  suggestions: string[];
  filterOptions: {
    regions: string[];
    specialties: string[];
    equipment: string[];
    procedures: string[];
  };
  resultCount: number;
  onUpdateFilters: (filters: Partial<SearchFilters>) => void;
  onClearFilters: () => void;
  onAISearch?: (query: string) => void;
}

export function SearchPanel({
  filters,
  suggestions,
  filterOptions,
  resultCount,
  onUpdateFilters,
  onClearFilters,
  onAISearch,
}: SearchPanelProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const hasActiveFilters =
    filters.query ||
    filters.region ||
    filters.specialty ||
    filters.equipment ||
    filters.procedure;

  const handleSuggestionClick = (suggestion: string) => {
    onUpdateFilters({ query: suggestion });
    setShowSuggestions(false);
  };

  return (
    <Card className="p-4">
      {/* Search input with AI button */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={filters.query}
            onChange={(e) => onUpdateFilters({ query: e.target.value })}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search facilities, procedures, or ask a question..."
            className="pl-10 pr-4"
          />

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
              <div className="p-2">
                <p className="text-xs text-muted-foreground font-medium px-2 mb-1">
                  Suggested queries
                </p>
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2"
                  >
                    <Sparkles className="h-3 w-3 text-primary" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {onAISearch && (
          <Button
            onClick={() => onAISearch(filters.query)}
            disabled={!filters.query}
            className="bg-gradient-hero"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            AI Search
          </Button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filters:</span>
        </div>

        <Select
          value={filters.region || "all"}
          onValueChange={(v) => onUpdateFilters({ region: v === "all" ? undefined : v })}
        >
          <SelectTrigger className="w-40 h-8 text-xs">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {filterOptions.regions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.specialty || "all"}
          onValueChange={(v) => onUpdateFilters({ specialty: v === "all" ? undefined : v })}
        >
          <SelectTrigger className="w-40 h-8 text-xs">
            <SelectValue placeholder="Specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            {filterOptions.specialties.slice(0, 20).map((specialty) => (
              <SelectItem key={specialty} value={specialty}>
                {specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.equipment || "all"}
          onValueChange={(v) => onUpdateFilters({ equipment: v === "all" ? undefined : v })}
        >
          <SelectTrigger className="w-40 h-8 text-xs">
            <SelectValue placeholder="Equipment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Equipment</SelectItem>
            {filterOptions.equipment.slice(0, 20).map((eq) => (
              <SelectItem key={eq} value={eq}>
                {eq}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 text-xs text-muted-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Found <span className="font-medium text-foreground">{resultCount}</span> facilities
        </span>
        {hasActiveFilters && (
          <Badge variant="secondary" className="text-xs">
            Filtered
          </Badge>
        )}
      </div>
    </Card>
  );
}
