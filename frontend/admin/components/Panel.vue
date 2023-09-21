<template>
    <div>
        <div>N° : {{ id }}</div>
        <div>Catégorie : {{ category }}</div>
        <div>Thème : {{ theme }}</div>
        <br />
        <div>Question : {{ question }}</div>
        <div>Réponse : {{ answer }}</div>
        <div>
            <p>Temps écoulé : {{ timer }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'pinia';
import { useStore } from '../stores/ipc';

export default defineComponent({
    computed: {
        ...mapState(useStore, ['id', 'category', 'theme', 'question', 'answer', 'timer'])
    }
})
</script>
