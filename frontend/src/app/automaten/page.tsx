"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Typen für die Daten
type Machine = {
  id: number;
  name: string;
  machine_id: string;
  status: string;
  location: string;
  created_at: string;
  updated_at: string;
};

type ApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Machine[];
};

type Filters = {
  page: number;
  page_size: number;
  status: string;
  location: string;
  search: string;
};

export default function MachinesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State für Daten
  const [machines, setMachines] = useState<Machine[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter aus URL-Parametern initialisieren
  const initialFilters: Filters = {
    page: parseInt(searchParams.get('page') || '1'),
    page_size: parseInt(searchParams.get('page_size') || '10'),
    status: searchParams.get('status') || '',
    location: searchParams.get('location') || '',
    search: searchParams.get('search') || '',
  };
  
  const [filters, setFilters] = useState<Filters>(initialFilters);
  
  // URL aktualisieren, wenn sich Filter ändern
  useEffect(() => {
    // Erstelle neue URL mit den aktuellen Filtern
    const params = new URLSearchParams();
    
    if (filters.page > 1) params.set('page', filters.page.toString());
    if (filters.page_size !== 10) params.set('page_size', filters.page_size.toString());
    if (filters.status) params.set('status', filters.status);
    if (filters.location) params.set('location', filters.location);
    if (filters.search) params.set('search', filters.search);
    
    // URL aktualisieren, ohne Seite neu zu laden
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({ path: url }, '', url);
  }, [filters]);
  
  // Daten vom API laden
  useEffect(() => {
    const fetchMachines = async () => {
      try {
        setLoading(true);
        
        // URL mit Filtern erstellen
        const params = new URLSearchParams();
        params.set('page', filters.page.toString());
        params.set('page_size', filters.page_size.toString());
        if (filters.status) params.set('status', filters.status);
        if (filters.location) params.set('location', filters.location);
        if (filters.search) params.set('search', filters.search);
        
        // API-Anfrage durchführen
        const response = await fetch(`/api/machines/?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Fehler: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        setMachines(data.results);
        setTotalCount(data.count);
        setError(null);
      } catch (err) {
        setError('Fehler beim Laden der Daten');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMachines();
  }, [filters]); // Neu laden, wenn sich Filter ändern
  
  // Filter-Änderung
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ 
      ...prev, 
      [name]: value,
      page: 1, // Zurück zu Seite 1 bei Filteränderung
    }));
  };
  
  // Änderung der Seitengröße
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setFilters(prev => ({ 
      ...prev, 
      page_size: newSize,
      page: 1, // Zurück zu Seite 1 bei Änderung der Seitengröße
    }));
  };
  
  // Formular absenden
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  // Seite wechseln
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };
  
  // Berechne Gesamtzahl der Seiten
  const pageCount = Math.ceil(totalCount / filters.page_size);
  
  // Berechne Anzeigenummern (z.B. "Zeige 1-10 von 50 Einträgen")
  const startIndex = (filters.page - 1) * filters.page_size + 1;
  const endIndex = Math.min(filters.page * filters.page_size, totalCount);
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Automaten Übersicht</h1>
      
      {/* Filter-Formular */}
      <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Status-Filter */}
          <div>
            <label className="block mb-1">Status:</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Alle Status</option>
              <option value="active">Aktiv</option>
              <option value="inactive">Inaktiv</option>
              <option value="maintenance">Wartung</option>
              <option value="error">Fehler</option>
            </select>
          </div>
          
          {/* Standort-Filter */}
          <div>
            <label className="block mb-1">Standort:</label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="z.B. Berlin"
              className="w-full p-2 border rounded"
            />
          </div>
          
          {/* Suche */}
          <div>
            <label className="block mb-1">Suche:</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Name, ID oder Standort"
              className="w-full p-2 border rounded"
            />
          </div>
          
          {/* Einträge pro Seite */}
          <div>
            <label className="block mb-1">Einträge pro Seite:</label>
            <select
              value={filters.page_size}
              onChange={handlePageSizeChange}
              className="w-full p-2 border rounded"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
        
        <button 
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Filter anwenden
        </button>
      </form>
      
      {/* URL-Vorschau - zum Debugging */}
      <div className="text-xs bg-gray-100 p-2 mb-4 overflow-x-auto">
        <p>API-Anfrage: <code>/api/machines/?page={filters.page}&page_size={filters.page_size}
          {filters.status ? `&status=${filters.status}` : ''}
          {filters.location ? `&location=${filters.location}` : ''}
          {filters.search ? `&search=${filters.search}` : ''}</code></p>
      </div>
      
      {/* Lade-Anzeige */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="mt-2">Daten werden geladen...</p>
        </div>
      )}
      
      {/* Fehleranzeige */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}
      
      {/* Maschinen-Tabelle */}
      {!loading && !error && (
        <>
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">ID</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Standort</th>
              </tr>
            </thead>
            <tbody>
              {machines.map(machine => (
                <tr key={machine.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{machine.name}</td>
                  <td className="py-2 px-4">{machine.machine_id}</td>
                  <td className="py-2 px-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold
                      ${machine.status === 'active' ? 'bg-green-100 text-green-800' :
                        machine.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                        machine.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`
                    }>
                      {machine.status === 'active' ? 'Aktiv' :
                        machine.status === 'inactive' ? 'Inaktiv' :
                        machine.status === 'maintenance' ? 'Wartung' : 'Fehler'}
                    </span>
                  </td>
                  <td className="py-2 px-4">{machine.location}</td>
                </tr>
              ))}
              
              {/* Keine Daten */}
              {machines.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    Keine Maschinen gefunden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Paginierung */}
          <div className="mt-6 flex flex-col md:flex-row md:justify-between items-center">
            {/* Info zur aktuellen Seite */}
            <div className="mb-4 md:mb-0">
              {totalCount > 0 ? (
                <span>Zeige {startIndex} bis {endIndex} von {totalCount} Einträgen</span>
              ) : (
                <span>0 Einträge</span>
              )}
            </div>
            
            {/* Seiten-Navigation */}
            <div className="flex flex-wrap justify-center gap-2">
              {/* Erste Seite */}
              <button
                onClick={() => handlePageChange(1)}
                disabled={filters.page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                «
              </button>
              
              {/* Vorherige Seite */}
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                ‹
              </button>
              
              {/* Seitenzahlen */}
              {[...Array(pageCount)].map((_, index) => {
                const pageNum = index + 1;
                
                // Für bessere Übersichtlichkeit maximal 5 Seiten anzeigen
                if (
                  pageCount <= 7 || 
                  pageNum === 1 || 
                  pageNum === pageCount ||
                  (pageNum >= filters.page - 1 && pageNum <= filters.page + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 border rounded 
                        ${filters.page === pageNum ? 'bg-blue-500 text-white' : ''}`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === filters.page - 2 || 
                  pageNum === filters.page + 2
                ) {
                  return <span key={pageNum} className="px-2">...</span>;
                }
                
                return null;
              })}
              
              {/* Nächste Seite */}
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page >= pageCount}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                ›
              </button>
              
              {/* Letzte Seite */}
              <button
                onClick={() => handlePageChange(pageCount)}
                disabled={filters.page >= pageCount}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                »
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}