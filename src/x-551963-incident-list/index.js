import {createCustomElement, actionTypes} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import '@servicenow/now-template-card'
import '../item';



const view = (state, {dispatch}) => {

	function closeElement(data) {
		dispatch('MODAL_CLOSED', data);
	}

	function deleteElement(id) {
		dispatch('DELETE_ELEMENT', id);
	}

	return (
		<div >
			<example-cards />
			{state.openedModal && ModalW(state.openedModal, deleteElement, closeElement)}

		</div>
	);
};

const ModalW = (element, deleteMethod, method,) => {

	return (
		<div className='modalWindowCont'>
			<div className='modalWindow'>

				<button on-click={() => method()} className='close'>X</button>
				<p><span>State:</span>{element.state}</p>
				<p><span>Assigned:</span>{element.assigned_to.display_value}</p>
				<p><span>Assignment group:</span>{element.assignment_group.display_value}</p>
				<p><span>Number:</span>{element.number}</p>
				<p><span>Description:</span>{element.short_description}</p>

			</div>
		</div>
	)
}

//DELETE api/now/table/incident/:sys_id.


createCustomElement('x-551963-incident-list', {
	actionHandlers:{
		'DROPDOWN_P': (coeffects) => {
			const {action, updateState, state, dispatch} = coeffects;
			const result = action.payload;
			if (result.label == 'Delete') {

			} else {
				updateState({openedModal: result.payload});
			}

		},
		'MODAL_CLOSED': (coeffects) => {
			const {action, updateState, state} = coeffects;
			updateState({openedModal: null});
		},
	},

	renderer: {type: snabbdom},
	view,
	styles,
	initialState: {
		openedModal: null,
	}
});

