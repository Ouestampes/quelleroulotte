import { MenuItemBuilderFunction } from '../types/electron';

const builder: MenuItemBuilderFunction = () => {
  return {
    label: '&Affichage',
    submenu: [
      { label: '&Recharger', role: 'reload' },
      { label: '&Forcer le rechargement', role: 'forceReload' },
      { label: '&Outils développeur', role: 'toggleDevTools' },
      { type: 'separator' },
      { label: 'Ré&initialiser zoom', role: 'resetZoom' },
      { label: '&Zoomer', role: 'zoomIn' },
      { label: '&Dézoomer', role: 'zoomOut' },
      { type: 'separator' },
      { label: '&Plein écran (contrôleur)', role: 'togglefullscreen' },
      { label: 'P&lein écran (public)', click: () => {} },
    ],
  };
};

export default builder;
