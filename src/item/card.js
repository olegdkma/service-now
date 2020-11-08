import snabbdom from '@servicenow/ui-renderer-snabbdom';
import {createCustomElement, actionTypes} from '@servicenow/ui-core';
import view from './view'
import styles from './styles.scss';

const {COMPONENT_BOOTSTRAPPED, COMPONENT_RENDERED} = actionTypes;
import {createHttpEffect} from "@servicenow/ui-effect-http";


createCustomElement('example-cards', {
	renderer: {type: snabbdom},
	view,
	styles,
	actionHandlers: {
		[COMPONENT_BOOTSTRAPPED]: (coeffects) => {
			const {dispatch} = coeffects;
			dispatch('FETCH_LATEST_INCIDENT', {
				sysparm_display_value: 'true',

			});

		},
		'FETCH_LOADING': (coeffects) => {
			const {action, updateState, state} = coeffects;
			console.log(state.loading)
			updateState({loading: !state.loading},);
		},
		'FETCH_LATEST_INCIDENT': createHttpEffect('api/now/table/incident', {
			method: 'GET',
			queryParams: ['sysparm_display_value'],
			successActionType: 'FETCH_LATEST_INCIDENT_SUCCESS'
		}),
		'FETCH_LATEST_INCIDENT_SUCCESS': (coeffects) => {
			const {action, updateState, state, dispatch} = coeffects;
			const {result} = action.payload;

			updateState({result, filter: result},);

		},
		'NOW_DROPDOWN_PANEL#ITEM_CLICKED': (coeffects) => {
			const {action, dispatch, state} = coeffects;
			let [rez] = state.filter.filter(m => m.number == action.payload.item.id)

			if (action.payload.item.label === 'Delete') {
				dispatch('DELETE_ELEMENT', {sys_id: rez.sys_id})
				dispatch('FETCH_LOADING');
			}
			dispatch('DROPDOWN_P', {
				payload: rez,
				label: action.payload.item.label
			});
		},
		'DELETE_ELEMENT':
			createHttpEffect(`api/now/table/incident/:sys_id`, {
				method: 'DELETE',
				pathParams: ['sys_id'],
				successActionType: 'FETCH_DELETE_SUCCESS'
			}),
		'FETCH_DELETE_SUCCESS': (coeffects) => {
			const {updateState, state, action, dispatch} = coeffects;
			const deleteFromStateAndFilter = action.meta.request.updatedUrl.replace('api/now/table/incident/', '')
			const filterArray = state.result.filter(el => el.sys_id !== deleteFromStateAndFilter)
			updateState({result: filterArray, filter: filterArray, openedModal: null,});
			dispatch('FETCH_LOADING');

		},
		'FILTER': (coeffects) => {
			const {state, updateState, action, dispatch} = coeffects;
			const filterResult = action.payload
			updateState({filter: filterResult});
			dispatch('FETCH_LOADING');

		},
		initialState: {
			loading: false
		}


	}
});


