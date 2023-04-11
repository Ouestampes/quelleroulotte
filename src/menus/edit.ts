import { MenuItemBuilderFunction } from '../types/electron';

const builder: MenuItemBuilderFunction = () => {
  return {
    label: '&Edition',
    submenu: [
      { label: '&Annuler', role: 'undo' },
      { label: '&Refaire', role: 'redo' },
      { type: 'separator' },
      { label: 'C&ouper', role: 'cut' },
      { label: '&Copier', role: 'copy' },
      { label: 'Co&ller', role: 'paste' },
      { label: '&Supprimer', role: 'delete' },
      { label: '&Tout selectionner', role: 'selectAll' },
    ],
  };
};

export default builder;
