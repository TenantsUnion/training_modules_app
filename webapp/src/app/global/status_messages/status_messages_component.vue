<template>
    <div v-if="messages.length" class="status-messages-container">
        <div v-for="message in messages" class="callout alert-callout" v-bind:class="statusStyleClasses(message)">
            <strong v-if="message.title">{{message.title}}</strong>
            <span v-if="message.message">{{message.message}}</span>
            <button class="close-button" v-on:click="dismissMessage(message)" aria-label="Dismiss alert" type="button">
                <span aria-hidden="true">⊗</span>
            </button>
        </div>
    </div>
</template>
<script lang="ts" src="./status_messages_component.ts"></script>
<style lang="scss">
    $alert-callout-border-left-width: rem-calc(5);
    $alert-callout-large-font-scale: 150%;
    $alert-callout-small-font-scale: 80%;

    .status-messages-container {
        position: fixed;
        top: 80px;
        right: 0;
        width: 35%;
        z-index: 2;
    }

    .alert-callout {
        width: 100%;
        background: $light-gray;
        color: $dark-gray;
        border: 0;
        border-left: $alert-callout-border-left-width solid $dark-gray;
        box-shadow: 0 5px 8px -6px rgba(0, 0, 0, 0.2);

        &.success {
            background: $light-gray;
            color: $dark-gray;
            border-left: $alert-callout-border-left-width solid $success-color;
        }

        &.alert {
            background: $light-gray;
            color: $dark-gray;
            border-left: $alert-callout-border-left-width solid $alert-color;
        }

        &.warning {
            background: $light-gray;
            color: $dark-gray;
            border-left: $alert-callout-border-left-width solid $warning-color;
        }

        &.primary {
            background: $light-gray;
            color: $dark-gray;
            border-left: $alert-callout-border-left-width solid $primary-color;
        }

        &.small {

            font-size: $alert-callout-small-font-scale;

            .close-button {
                font-size: 1.5rem;
            }
        }

        &.large {
            font-size: $alert-callout-large-font-scale;

            .close-button {
                font-size: 3rem;
            }
        }

        .close-button {
            font-size: 2rem;
            @include vertical-center;
        }
    }
</style>