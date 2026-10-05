import mapa1 from '../assets/maps/mapa1.png';
import mapa2 from '../assets/maps/mapa2.png';
import mapa3 from '../assets/maps/mapa3.png';
import mapa4 from '../assets/maps/mapa4.png';
import mapa5 from '../assets/maps/mapa5.png';
import mapa6 from '../assets/maps/mapa6.png';
import mapa7 from '../assets/maps/mapa7.png';

import thumb1 from '../assets/thumbs/thumb1.png';
import thumb2 from '../assets/thumbs/thumb2.png';
import thumb3 from '../assets/thumbs/thumb3.png';
import thumb4 from '../assets/thumbs/thumb4.png';
import thumb5 from '../assets/thumbs/thumb5.png';
import thumb6 from '../assets/thumbs/thumb6.png';
import thumb7 from '../assets/thumbs/thumb7.png';

export interface MapItem {
  id: number;
  title: string;
  image: string;       // Imagem completa do mapa para o modal
  thumbnail: string;   // Recorte/print focado na Main Entrance para o card
  eggsCount: number;
}

export const MAPS_DATA: MapItem[] = [
  {
    id: 1,
    title: 'Mapa 01 - 5 ovos',
    image: mapa1,
    thumbnail: thumb1,
    eggsCount: 5
  },
  {
    id: 2,
    title: 'Mapa 02 - 5 ovos',
    image: mapa2,
    thumbnail: thumb2,
    eggsCount: 5
  },
  {
    id: 3,
    title: 'Mapa 03 - 7 ovos',
    image: mapa3,
    thumbnail: thumb3,
    eggsCount: 7
  },
  {
    id: 4,
    title: 'Mapa 04 - 5 ovos',
    image: mapa4,
    thumbnail: thumb4,
    eggsCount: 5
  },
  {
    id: 5,
    title: 'Mapa 05 - 6 ovos',
    image: mapa5,
    thumbnail: thumb5,
    eggsCount: 6
  },
  {
    id: 6,
    title: 'Mapa 06 - 5 ovos',
    image: mapa6,
    thumbnail: thumb6,
    eggsCount: 5
  },
  {
    id: 7,
    title: 'Mapa 07 - 6 ovos',
    image: mapa7,
    thumbnail: thumb7,
    eggsCount: 6
  }
];
