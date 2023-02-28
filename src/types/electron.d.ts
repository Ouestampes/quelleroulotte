import { MenuItem, MenuItemConstructorOptions } from 'electron';

export interface MenuItemBuilderOptions {
	isMac: boolean;
}

export type MenuItemBuilderFunction = (options?: MenuItemBuilderOptions) => MenuItemConstructorOptions | MenuItem;
