import '@servicenow/now-template-card'
import {createRef} from "@servicenow/ui-renderer-snabbdom";
import load from '../assets/img/loading.gif'

const Form = (state) => {

	function filterSearch(e, resultArr, rest) {
		e.preventDefault()

		let filters = Object.entries(rest).map(m => filterSet(m)).filter(m => m !== false) //seting witch field will be filtering regarding empty inputs

		state.dispatchFilterResult(filterResultArray(filters, resultArr))
	}

	function filterSet(obj) {

		let {name, value} = obj[1].current
		let filterObj = {}
		if (!value) {
			return false
		} else {
			filterObj[name] = value
			return filterObj
		}

	}

	function filterResultArray(filters, allCardsArray) {
		let result = [...allCardsArray]

		filters.forEach(m => result = actualArrayFilter(m, result))

		return result
		//result.filter(n=> n[check] == m[0])
	}

	function actualArrayFilter(obj, arr) {

		let [key] = Object.entries(obj)

		let check = key[0]

		if (check.includes('assig')) {
			return arr.filter(m => m[check].display_value == obj[check])
		} else {
			return arr.filter(m => m[check].toLowerCase() == obj[check].toLowerCase())
		}

	}

	let formRef = {
		nameRef: createRef(),
		textRef: createRef(),
		asstRef: createRef(),
		assGRef: createRef(),

	}
	return (
		<div className='forma'>
			<p>Search Filter</p>
			<form on-submit={(e) => filterSearch(e, state.stateResultArr, formRef)}>
				<div><span>Number:</span><input type="text" value='' name='number' ref={formRef.nameRef}/></div>
				<div><span>Status:</span><input type="text" value='' name='state' ref={formRef.textRef}/></div>
				<div><span>Assigned to:</span><input type="text" value='' name='assigned_to' ref={formRef.asstRef}/>
				</div>
				<div><span>Assignment group:</span><input type="text" value='Network' name='assignment_group'
														  ref={formRef.assGRef}/></div>

				<button type='submit'>Search</button>
			</form>
		</div>
	)
}

export default (state, {dispatch}) => {
	function clicked(e, event) {
		/*event.stopPropagation()
		dispatch('DROPDOWN_PANEL#ITEM_CLICKED', e)*/
	}

	function dispatchFilterResult(result) {
		dispatch('FETCH_LOADING');
		dispatch('FILTER', result);
	}

	const undef = (check) => {
		return check ? check : 'Not Selected'
	}

	return (
		<div>
			{state.filter ?
				<div>
					<Form stateResultArr={state.result} dispatchFilterResult={dispatchFilterResult}/>
					<div className='result'>Results: {state.filter.length}</div>
					<div className='contentBody'>

						{state.loading ? <div className='loading'><img src={load} alt=""/></div>
							: state.filter.map((element, index) =>
								<div className='cardContainer'>
									<now-template-card-assist on-click={(event) => clicked(element.number, event)}
															  key={index}
															  tagline={{
																  "icon": "tree-view-long-outline",
																  "label": "Incident"
															  }}
															  actions={[{
																  "id": `${element.number}`,
																  "label": "Open Record"
															  }, {
																  "id": `${element.number}`,
																  "label": "Delete"
															  }]}

															  heading={{"label": `${element.short_description}`}}
															  content={[{"label": "State", "value": `${element.state}`},
																  {
																	  "label": "Assigned",
																	  "value": `${undef(element.assigned_to.display_value)}`
																  },
																  {
																	  "label": "Assignment group",
																	  "value": `${undef(element.assignment_group.display_value)}`
																  },
																  {"label": "Number", "value": `${element.number}`}]}

															  footerContent={{
																  "label": "Updated",
																  "value": `${element.sys_updated_on}`
															  }}
															  configAria={{}} contentItemMinxWidth="300"/>
								</div>
							)

						}


					</div>
				</div>
				: <div className='loading'><img src={load} alt=""/></div>

			}

		</div>
	)
}
