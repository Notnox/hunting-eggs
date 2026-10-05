import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { MapItem } from '../data/mapsData';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface MapDialogProps {
  map: MapItem | null;
  allMaps: MapItem[];
  onClose: () => void;
  onSelectMap: (map: MapItem) => void;
}

export const MapDialog: React.FC<MapDialogProps> = ({
  map,
  allMaps,
  onClose,
  onSelectMap
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const imageViewportRef = useRef<HTMLDivElement>(null);

  // Reset zoom e pan ao mudar de mapa
  useEffect(() => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  }, [map?.id]);

  // Travar o scroll do body enquanto o modal estiver aberto
  useEffect(() => {
    if (map) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [map]);

  const currentIndex = map ? allMaps.findIndex((m) => m.id === map.id) : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onSelectMap(allMaps[currentIndex - 1]);
    } else {
      onSelectMap(allMaps[allMaps.length - 1]);
    }
  }, [currentIndex, allMaps, onSelectMap]);

  const handleNext = useCallback(() => {
    if (currentIndex < allMaps.length - 1) {
      onSelectMap(allMaps[currentIndex + 1]);
    } else {
      onSelectMap(allMaps[0]);
    }
  }, [currentIndex, allMaps, onSelectMap]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.35, 4));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.35, 0.7);
      if (next <= 1) {
        setPanPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  // Atalhos de teclado
  useEffect(() => {
    if (!map) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0' || e.key === 'r') {
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [map, handlePrev, handleNext, onClose]);

  // Arrastar para mover o mapa ampliado
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom no scroll
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoomLevel((prev) => Math.min(prev + 0.25, 4));
    } else {
      setZoomLevel((prev) => {
        const next = Math.max(prev - 0.25, 0.8);
        if (next <= 1) {
          setPanPosition({ x: 0, y: 0 });
        }
        return next;
      });
    }
  };

  // Duplo clique para alternar zoom
  const handleDoubleClick = () => {
    if (zoomLevel > 1) {
      handleResetZoom();
    } else {
      setZoomLevel(2);
    }
  };

  const toggleFullscreen = () => {
    if (!dialogRef.current) return;
    if (!isFullscreen) {
      if (dialogRef.current.requestFullscreen) {
        dialogRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  if (!map) return null;

  return (
    <div
      className="dialog-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={map.title}
    >
      <div className={`dialog-container ${isFullscreen ? 'fullscreen-mode' : ''}`} ref={dialogRef}>
        {/* Barra superior */}
        <header className="dialog-header">
          <div className="dialog-header-left">
            <h2 className="dialog-title">{map.title}</h2>
            <span className="dialog-counter">
              ({currentIndex + 1} de {allMaps.length})
            </span>
          </div>

          <div className="dialog-header-actions">
            {/* Controles de Zoom */}
            <div className="zoom-controls-group">
              <button
                type="button"
                className="dialog-btn"
                onClick={handleZoomOut}
                title="Reduzir zoom (-)"
                disabled={zoomLevel <= 0.8}
              >
                <ZoomOut size={16} />
              </button>
              <button
                type="button"
                className="dialog-btn zoom-level-label"
                onClick={handleResetZoom}
                title="Redefinir zoom (0)"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                type="button"
                className="dialog-btn"
                onClick={handleZoomIn}
                title="Aumentar zoom (+)"
                disabled={zoomLevel >= 4}
              >
                <ZoomIn size={16} />
              </button>
              {zoomLevel !== 1 && (
                <button
                  type="button"
                  className="dialog-btn"
                  onClick={handleResetZoom}
                  title="Restaurar tamanho (R)"
                >
                  <RotateCcw size={15} />
                </button>
              )}
            </div>

            {/* Baixar Imagem */}
            <a
              href={map.image}
              download={`hunter-egg-${map.title.toLowerCase().replace(/\s+/g, '-')}.png`}
              className="dialog-btn"
              title="Baixar imagem"
            >
              <Download size={16} />
            </a>

            {/* Tela cheia */}
            <button
              type="button"
              className="dialog-btn"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            {/* Fechar */}
            <button
              type="button"
              className="dialog-btn close-btn"
              onClick={onClose}
              title="Fechar (Esc)"
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Área central ocupada inteiramente pela imagem do mapa */}
        <div className="dialog-content-area">
          {/* Navegação anterior */}
          <button
            type="button"
            className="nav-arrow-btn nav-prev"
            onClick={handlePrev}
            title="Mapa anterior (←)"
            aria-label="Mapa anterior"
          >
            <ChevronLeft size={30} />
          </button>

          {/* Viewport da imagem inteira */}
          <div
            className={`image-viewport ${isDragging ? 'grabbing' : zoomLevel > 1 ? 'grab' : ''}`}
            ref={imageViewportRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onDoubleClick={handleDoubleClick}
          >
            <div
              className="image-transform-wrapper"
              style={{
                transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
                transition: isDragging ? 'none' : 'transform 0.15s ease-out'
              }}
            >
              <img
                src={map.image}
                alt={map.title}
                className="full-dialog-image"
                draggable={false}
              />
            </div>
          </div>

          {/* Navegação próxima */}
          <button
            type="button"
            className="nav-arrow-btn nav-next"
            onClick={handleNext}
            title="Próximo mapa (→)"
            aria-label="Próximo mapa"
          >
            <ChevronRight size={30} />
          </button>
        </div>

        {/* Barra inferior de miniaturas para troca direta */}
        <footer className="dialog-footer">
          <div className="thumbnail-strip">
            {allMaps.map((item) => {
              const isSelected = item.id === map.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`strip-thumb-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => onSelectMap(item)}
                  title={item.title}
                >
                  <img src={item.image} alt={item.title} className="strip-thumb-img" />
                  <span className="strip-thumb-num">{item.title}</span>
                </button>
              );
            })}
          </div>
        </footer>
      </div>
    </div>
  );
};
