import { ipcRenderer } from 'electron';
import { defineStore } from 'pinia';

export const useStore = defineStore('ipc', {
    state: () => ({
        status: 'stopped' as 'stopped' | 'started' | 'paused',
        id: null as string | null,
        categories: [] as string[],
        category: '',
        theme: '',
        question: '',
        answer: '',
        nbLoaded: 0,
        timer: 0
    })
});

const store = useStore();

ipcRenderer.on('questionsLoaded', (_, data) => {
    store.nbLoaded = data.length;
    store.categories = data.categories;
});

ipcRenderer.on('questionUpdated', (_, data) => {
    store.question = data.question;
    store.id = data.id;
    store.answer = data.answer;
    store.category = data.category;
    store.theme = data.theme;
});

ipcRenderer.on('time', (_, data) => {
    store.timer = data;
});

ipcRenderer.on('statusUpdated', (_, data) => {
    store.status = data;
});
