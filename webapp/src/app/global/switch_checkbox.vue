<template>
    <div class="grid-x grid-padding-x">
        <div class="cell small-3 switch success tiny">
            <input class="switch-input" id="checkbox-switch" type="checkbox" name="checkboxSwitch"
                   v-model="checked"/>
            <label class="switch-paddle" for="checkbox-switch">
                <span class="show-for-sr">{{switchText}}</span>
            </label>
        </div>
        <div class="small-9">
            <p class="text-center">
                {{switchText}}
            </p>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import Component from "vue-class-component";

    @Component({
        props: {
            initChecked: {
                type: Boolean,
                default: false
            },
            switchText: {
                type: String,
                required: true
            }
        }
    })
    export default class SwitchCheckboxComponent extends Vue {
        initChecked: boolean;
        checked: boolean = this.initChecked;
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
    @import '../scss/variables';

    @mixin colored-switches($checked-color) {
        input:checked ~ .switch-paddle {
            background: $checked-color;
        }
    }

    .switch {
        &.primary {
            @include colored-switches(map-get($foundation-palette, primary))
        }

        &.secondary {
            @include colored-switches(map-get($foundation-palette, secondary))
        }

        &.success {
            @include colored-switches(map-get($foundation-palette, success))
        }

        &.alert {
            @include colored-switches(map-get($foundation-palette, alert))
        }

        &.warning {
            @include colored-switches(map-get($foundation-palette, warning))
        }
    }
</style>
