/**
 * User input for text searching
 * 
 * @protected 
 * @type {String}
 *
 * @properties={typeid:35,uuid:"0C32DA9C-BC50-46F9-A8F7-6BB9E86D7370"}
 */
var searchText = '';

/**
 * The MultiLookup object used by this lookup form
 * 
 * @protected  
 * @type {scopes.svyLookup.MultiLookup}
 * @properties={typeid:35,uuid:"1477F822-48C8-46E2-9FA9-60222FC6B324",variableType:-4}
 */
var MultiLookup = null;

/**
 * Handler for the selection callback
 * 
 * @private 
 * @type {Function}
 * @properties={typeid:35,uuid:"AEF95A40-FE41-44D7-97D2-AFD10E7D45EC",variableType:-4}
 */
var selectHandler = null;

/**
 * Runs the search. Loads records in the foundset.
 * 
 * @protected 
 * @properties={typeid:24,uuid:"ECD9F461-ACE8-4DCB-B0F7-5193D7FF4752"}
 */
function search(txt){
	
	// load all records if no input
	if(!txt){
		foundset.loadAllRecords();
	}
	
	// create search object
	var simpleSearch = scopes.svySearch.createSimpleSearch(foundset);
	simpleSearch.setSearchText(txt);
	
	// Add search providers
	for (var i = 0; i < lookup.getFieldCount(); i++) {
		var field = lookup.getField(i);
		if(field.isSearchable()){
			simpleSearch.addSearchProvider(field.getDataProvider())
				.setAlias(field.getTitleText());
		}
	}
	
	// apply search
	simpleSearch.loadRecords(foundset);
}

/**
 * Shows this form as pop-up, returns selection in callback
 * 
 * @public  
 * @param {Function} callback The function that is called when selection happens
 * @param {RuntimeComponent} target The component which will be shown
 * @param {Number} [width] The width of the pop-up. Optional. Default is component width 
 * @param {Number} [height] The height of the pop-up. Optional. Default is form height.
 * @param {String} [initialValue] Initial value in search. Optional. Default is empty.
 * 
 * @properties={typeid:24,uuid:"3882A299-CE63-4F09-A85D-E597D90358CA"}
 */
function showPopUp(callback, target, width, height, initialValue){
	selectHandler = callback;
	var w = !width ? target.getWidth() : width;
	if(initialValue){
		searchText = initialValue;
		search(searchText);
		foundset.loadAllRecords();
	}
	plugins.window.showFormPopup(target,this,this,'foobar',w,height);
}

/**
 * Hook for sub form(s) to implement specific sol model additions
 * 
 * @protected 
 * @param {JSForm} jsForm
 * @param {scopes.svyLookup.MultiLookup} multiLookupObj
 * @properties={typeid:24,uuid:"B0B53EC8-3DD3-4997-B257-DBB4DCA128D2"}
 */
function onCreateInstance(jsForm, multiLookupObj){
	// to be overridden
}

/**
 * @public 
 * @param {scopes.svyLookup.MultiLookup} multiLookupObj
 * @return {RuntimeForm<AbstractLookup>}
 * @properties={typeid:24,uuid:"75BD5BD0-3CB1-45DC-A75A-A349EB25D22C"}
 */
function newInstance(multiLookupObj){
	
	// create JSForm clone
	var formName = application.getUUID().toString();
	var jsForm = solutionModel.cloneForm(formName,solutionModel.getForm(controller.getName()));
	
	//create an in memory datasource to store data
	var inMemDS = formName.split('-').join('_');
	var eds = databaseManager.createEmptyDataSet();
	eds.addColumn('id');eds.addColumn('display');
	var uri = eds.createDataSource(inMemDS, [JSColumn.UUID_COLUMN, JSColumn.TEXT]);	
	
	jsForm.dataSource = uri;

	// pass control to sub form(s)
	onCreateInstance(jsForm,multiLookupObj);
	
	/** @type {RuntimeForm<AbstractLookup>} */
	var form = forms[jsForm.name];
	form['MultiLookup'] = multiLookupObj;
	return form;
}

/**
 * Callback when item is selected
 * @protected 
 * @properties={typeid:24,uuid:"5A59560F-F374-408D-98FB-A8601B7AA54D"}
 */
function onSelect(){
	
	// dismiss popup
	dismiss();
	
	// invoke callback
	if(selectHandler){
		selectHandler.call(this,foundset.getSelectedRecord());
	}
}

/**
 * Dismisses the popup
 * 
 * @protected 
 * @properties={typeid:24,uuid:"FEE59FA7-0062-4DE7-8A6C-BEBBCA4A729B"}
 */
function dismiss(){
	plugins.window.closeFormPopup(null);
}
