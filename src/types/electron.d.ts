import { MenuItem, MenuItemConstructorOptions } from 'electron';

export interface MenuItemBuilderOptions {
  isMac: boolean;
}

export type MenuItemBuilderItem = MenuItemConstructorOptions | MenuItem;

export type MenuItemBuilderFunction = (
  options: MenuItemBuilderOptions,
) => MenuItemBuilderItem;
