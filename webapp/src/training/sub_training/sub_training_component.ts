import Vue from "vue";
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';

@Component({
    name: 'sub-training'
})
export class SubTrainingComponent extends Vue {
    @Prop({type: Object, required: true})
    info!: { description: string, timeEstimate: number };
    @Prop({type: String, default: ""})
    subTrainingTitle!: string;
    @Prop({type: Array, default: []})
    subTrainings: object[];
}