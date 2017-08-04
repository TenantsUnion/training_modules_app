import Vue from "vue";
import Component from "vue-class-component";
import {ModuleList} from '../modules_list_component/module_list_component';
import {ModuleDetails} from '../module_details_component/module_details_component';

import {$} from '../../../globals';

require('./_module_skeleton_component.scss');


@Component({
	template: require('./module_skeleton_component.tpl.html'),
	components: {
		'modules-list': ModuleList,
		'module-details': ModuleDetails
	},
	methods: {
		toggleMenu: function () {
			$("#page-content-wrapper").toggleClass("toggled");
			$("#sidebar-wrapper").toggleClass("toggled");
			$(".sidebar-nav").toggleClass("toggled");
			$("#wrapper").toggleClass("toggled");
		}
	}
})


export class ModuleSkeleton extends Vue {

}
