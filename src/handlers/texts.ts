import { IpcMainInvokeEvent } from 'electron';

import { emitPublic } from '../windows/public';

export const publishTexts = (
  _: IpcMainInvokeEvent,
  title: string,
  waiting: string,
) => emitPublic('publicTextUpdated', { title, waiting });
