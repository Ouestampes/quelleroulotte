<template>
    <div>
        <div>
            <div>
                <p>
                    <b>Catégories du jeu</b>
                    <br />
                    <i>Si rien n'est coché, toutes les catégories seront sélectionnées</i>
                </p>
                <form ref="categories" v-for="category in categories">
                    <input type="checkbox" name="categories[]" :value="category">
                </form>
                <button>✓ Tout sélectionner</button>
                <button>❌ Fermer</button>
            </div>
        </div>
        <div>
            <button v-if="status === 'paused' || status === 'stopped'" @click="start">▶ Lancer le jeu</button>
            <button v-if="status === 'stopped'" @click="invoke('stop')">♨️ Sélectionner les catégories</button>
            <button v-if="status === 'started'" @click="invoke('pause')">⏸ Mettre le jeu en pause</button>
            <button v-if="status === 'started'" @click="invoke('goto-last')">⏭ Aller à la dernière question</button>
            <button v-if="status === 'started' || status === 'paused'" @click="invoke('stop')">⏹ Arrêter le jeu</button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ipcRenderer } from 'electron';
import { mapState } from 'pinia';
import { useStore } from '../stores/ipc';

export default defineComponent({
    computed: {
        ...mapState(useStore, ['categories', 'status'])
    },
    methods: {
        invoke: ipcRenderer.invoke,
        start() {
            const formData = new FormData(this.$refs.categories as HTMLFormElement);
            ipcRenderer.invoke('start', [...formData.values()]);
        }
    }
})
</script>
