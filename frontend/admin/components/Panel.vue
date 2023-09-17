<template>
    <div>
        <div>N° : {{ }}</div>
        <div>Catégorie : <span class="ip--category"></span></div>
        <div>Thème : <span class="ip--theme"></span></div>
        <br />
        <div>
            Question :
            <div class="ip--question"></div>
        </div>
        <div>
            Réponse :
            <div class="ip--answer"></div>
        </div>
        <div>
            <p>Temps écoulé : <span class="ip--timer"></span></p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    data = (): {
        question: String!,
        id: Number!,
        answer: String!,
        category: String[],
        theme: String!
    } => ({
        question: null,
        id: null,
        answer: null,
        category: null,
        theme: null
    })
})
</script>