import { emitPublic } from '../windows/public';

export const publishWaitingMessage = (
  _: never,
  title: string,
  waiting: string,
) => emitPublic('publicTextUpdated', { title, waiting });
