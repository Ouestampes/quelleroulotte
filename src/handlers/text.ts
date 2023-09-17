import { IpcMainInvokeEvent } from 'electron';

import { emitPublic } from '../windows/public';

export const publishText = (
  _: IpcMainInvokeEvent,
  title: string,
  waiting: string,
): void => emitPublic('publicTextUpdated', { title, waiting });
