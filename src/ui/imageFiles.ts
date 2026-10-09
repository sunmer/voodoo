import {phototitleFiles} from '../videos/phototitle/assets/files';
import {photoquoteFiles} from '../videos/photoquote/assets/files';

// Image files of every template with image slots, for editor thumbnails. Add new image templates here.
export const templateFiles: Record<string, Record<string, string>> = {
  phototitle: phototitleFiles,
  photoquote: photoquoteFiles,
};
