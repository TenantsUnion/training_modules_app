import Vue from 'vue';
import Component from "vue-class-component";
import {$} from '../../globals';

require('./_module_list_component.scss');

@Component({
	data: () => {
		return {
			modules: [
			{
				id: 1,
				title: 'Repairs',
				description: 'Repairs module description',
				timeEstimate: '1 - 2 hours',
				active: false,
				sections: [
				{
					id: 1,
					title: 'Mold',
					description: 'Mold description'
				},
				{
					id: 2,
					title: 'Pests',
					description: 'Pests description section'
				}
				]
			}, {
				id: 1,
				title: 'Deposits',
				description: 'Deposits module description',
				timeEstimate: '2 - 2.5 hours',
				active: false,
				sections: [
				{
					id: 1,
					title: 'Money',
					description: 'Money description'
				},
				{
					id: 2,
					title: 'Rights',
					description: 'Rights description section'
				}
				]
			}
			]
		};
	},
	template: require('./module_list_component.tpl.html')
})
export class ModuleList extends Vue {
	constructor(){
		super();
		$("#menu-toggle").click(function(e) {
			e.preventDefault();
			$("#page-content-wrapper").toggleClass("toggled");
			$("#sidebar-wrapper").toggleClass("toggled");
			$(".sidebar-nav").toggleClass("toggled");
			$("#wrapper").toggleClass("toggled");
		});
	}
}

