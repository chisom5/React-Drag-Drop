import { COLUMN_WIDTH, GUTTER_SIZE } from './constants';

export const moduleW2LocalWidth = (moduleW: number) => moduleW * COLUMN_WIDTH - GUTTER_SIZE;
export const moduleX2LocalX = (moduleX: number) => moduleW2LocalWidth(moduleX) + GUTTER_SIZE * 2;
export const moduleY2LocalY = (moduleY: number) => moduleY + GUTTER_SIZE;

// export const LocalWidth2moduleW = (moduleW: number) => moduleW - GUTTER_SIZE;
// export const LocalX2moduleX = (moduleX: number) => LocalWidth2moduleW(moduleX) - GUTTER_SIZE / 2;
