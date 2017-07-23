import Vue from 'vue';
import Component from "vue-class-component";

@Component({
    props: {
        username: String
    },
    // language=HTML
    template: `<p>Hello {{ username }}</p>`
})
export class AdminNavBar extends Vue {
}

