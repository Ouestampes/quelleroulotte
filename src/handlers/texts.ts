import { emitPublic } from '../windows/public';

export const publishTexts = (_: never, title: string, waiting: string) =>
  emitPublic('publicTextUpdated', { title, waiting });
