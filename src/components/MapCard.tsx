import React from 'react';
import type { MapItem } from '../data/mapsData';
import { Eye } from 'lucide-react';

interface MapCardProps {
  map: MapItem;
  onSelect: (map: MapItem) => void;
}

export const MapCard: React.FC<MapCardProps> = ({ map, onSelect }) => {
  return (
    <article
      className="map-card"
      onClick={() => onSelect(map)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(map);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Abrir ${map.title}`}
    >
      {/* Container de imagem fixo */}
      <div className="card-thumb-container">
        <img
          src={map.thumbnail || map.image}
          alt={map.title}
          className="card-thumb-image"
          loading="lazy"
        />
        <div className="card-thumb-overlay">
          <span className="preview-action-btn">
            <Eye size={18} />
            <span>Visualizar em Alta Resolução</span>
          </span>
        </div>
      </div>

      {/* Conteúdo do Card com apenas o título e o rodapé */}
      <div className="card-body">
        <div className="card-header-row">
          <h3 className="card-title">{map.title}</h3>
        </div>

        {/* Rodapé mantendo clique para expandir */}
        <div className="card-footer-action">
          <span className="card-open-prompt">
            Clique para expandir
            <span className="card-arrow">→</span>
          </span>
        </div>
      </div>
    </article>
  );
};
