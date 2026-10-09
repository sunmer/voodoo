import {phototitleFiles} from '../videos/phototitle/assets/files';
import {photoquoteFiles} from '../videos/photoquote/assets/files';
import {photolowerFiles} from '../videos/photolower/assets/files';
import {slideshowFiles} from '../videos/slideshow/assets/files';
import {beforeafterphotoFiles} from '../videos/beforeafterphoto/assets/files';
import {travelintroFiles} from '../videos/travelintro/assets/files';
import {portraitcardFiles} from '../videos/portraitcard/assets/files';

// Image files of every template with image slots, for editor thumbnails. Add new image templates here.
export const templateFiles: Record<string, Record<string, string>> = {
  phototitle: phototitleFiles,
  photoquote: photoquoteFiles,
  photolower: photolowerFiles,
  slideshow: slideshowFiles,
  beforeafterphoto: beforeafterphotoFiles,
  travelintro: travelintroFiles,
  portraitcard: portraitcardFiles,
};
