import * as migration_20261106_095932_initial from './20261106_095932_initial';

export const migrations = [
  {
    up: migration_20261106_095932_initial.up,
    down: migration_20261106_095932_initial.down,
    name: '20261106_095932_initial'
  },
];
