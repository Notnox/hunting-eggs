import { useState } from 'react';
import { MAPS_DATA, type MapItem } from './data/mapsData';
import { MapCard } from './components/MapCard';
import { MapDialog } from './components/MapDialog';
import { Sparkles } from 'lucide-react';
import logoImg from './assets/logo.webp';
import './App.css';

export function App() {
  const [selectedMap, setSelectedMap] = useState<MapItem | null>(null);

  return (
    <div className="app-container">
      {/* Top Navbar Limpa */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand-section">
            <img
              src={logoImg}
              alt="Hunting Eggs Logo"
              className="brand-logo-img"
            />
            <div className="brand-text-group">
              <span className="brand-title">HUNTING EGGS</span>
              <span className="brand-subtitle">Caça aos Ovos</span>
            </div>
          </div>

          <div className="header-badge-count">
            <Sparkles size={14} />
            <span>{MAPS_DATA.length} Mapas Carregados</span>
          </div>
        </div>
      </header>

      {/* Grid com os Cards dos Mapas (sem os textos do print) */}
      <main className="map-grid-section" style={{ paddingTop: '36px' }}>
        <div className="map-cards-grid">
          {MAPS_DATA.map((map) => (
            <MapCard
              key={map.id}
              map={map}
              onSelect={(selected) => setSelectedMap(selected)}
            />
          ))}
        </div>
      </main>

      {/* Dialog com a visualização inteira do mapa */}
      <MapDialog
        map={selectedMap}
        allMaps={MAPS_DATA}
        onClose={() => setSelectedMap(null)}
        onSelectMap={(map) => setSelectedMap(map)}
      />
    </div>
  );
}

export default App;
