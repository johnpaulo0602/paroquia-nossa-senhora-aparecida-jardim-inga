import * as migration_20261106_095932_initial from './20261106_095932_initial';
import * as migration_20261111_022624_media_blur_and_object_key from './20261111_022624_media_blur_and_object_key';
import * as migration_20261111_035810_cms_simplification from './20261111_035810_cms_simplification';

export const migrations = [
  {
    up: migration_20261106_095932_initial.up,
    down: migration_20261106_095932_initial.down,
    name: '20261106_095932_initial',
  },
  {
    up: migration_20261111_022624_media_blur_and_object_key.up,
    down: migration_20261111_022624_media_blur_and_object_key.down,
    name: '20261111_022624_media_blur_and_object_key',
  },
  {
    up: migration_20261111_035810_cms_simplification.up,
    down: migration_20261111_035810_cms_simplification.down,
    name: '20261111_035810_cms_simplification'
  },
];
