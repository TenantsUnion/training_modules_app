<template>
    <div v-if="message" class="callout small"
         v-bind:class="{'success': isSuccess; 'warning': isWarning}">
        <h5>{{message}}</h5>
    </div>
</template>
<script lang="ts" src="./messages_component.ts"></script>
