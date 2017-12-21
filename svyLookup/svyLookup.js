/**
 * Creates a lookup object which can be used to show a pop-up form
 *
 * @public
 * @param {String|JSFoundSet|JSRecord} dataSource The data source to lookup
 * @return {Lookup}
 * @properties={typeid:24,uuid:"65E8E051-667D-4118-A873-8024C2648F09"}
 */
function createLookup(dataSource) {
	/** @type {String} */
	var ds = dataSource;
	if (dataSource instanceof JSRecord || dataSource instanceof JSFoundSet) {
		ds = dataSource.getDataSource();
	}
	return new Lookup(ds);
}

/**
 * Creates a set of lookup objects which can be used to show a pop-up form
 * @public
 * @param {Array<String|JSFoundSet|JSRecord>} dataSources The data source to lookup
 * @return {MultiLookup}
 *
 * @properties={typeid:24,uuid:"A80BE700-B4A6-4168-AC6E-9289E8BF0E44"}
 */
function createMultiDSLookup(dataSources) {
	var ml = new MultiLookup();
	for (var i = 0; i < dataSources.length; i++) {
		/** @type {String} */
		var ds = dataSources[i];
		if (dataSources[i] instanceof JSRecord || dataSources[i] instanceof JSFoundSet) {
			ds = dataSources[i].getDataSource();
		}
		ml.addLookup(ds)
	}
	return ml;
}

/**
 * @public
 * @constructor
 * @properties={typeid:24,uuid:"0C81E4B2-4943-40B4-BCF4-334C054D1DAA"}
 */
function MultiLookup() {

	/**
	 * @private
	 * @type {Object<Lookup>}
	 */
	var Lookups = { };

	/**
	 * Adds a dataSource to list of Lookups
	 *
	 * @public
	 * @param {String} dataSource
	 * @return {Lookup}
	 */
	this.addLookup = function(dataSource) {
		var ds = new Lookup(dataSource);
		ds.setHeader(dataSource);
		Lookups[dataSource] = ds;
		return ds;
	}

	/**
	 * Get a dataSource from list of Lookups
	 *
	 * @public
	 * @param {String} dataSource
	 * @return {Lookup}
	 */
	this.getLookup = function(dataSource) {
		return Lookups[dataSource]
	}

	/**
	 * Shows the lookup
	 *
	 * @public
	 * @param {Function} callback The function that will be called when a selection is made
	 * @param {RuntimeComponent} target The component to show relative to
	 * @param {Number} [width] The width of the lookup. Optional. Default is same as target component
	 * @param {Number} [height] The height of the lookup. Optional. Default is implementation-specifc.
	 * @param {String} [initialValue] And initial value to show in the search
	 * @SuppressWarnings(wrongparameters) Fixes illegitmate warning
	 */
	this.showPopUpMultiDS = function(callback, target, width, height, initialValue) {
		var runtimeForm = forms.svyLookupTableMultiDS.newInstance(this);
		runtimeForm.showPopUp(callback, target, width, height, initialValue);
	}

}

/**
 * @public
 * @param {String} datasource
 * @constructor
 * @properties={typeid:24,uuid:"DC5A7A69-5B84-4438-9BFD-06558632E4E8"}
 */
function Lookup(datasource) {

	/**
	 * @private
	 * @type {Array<LookupField>}
	 */
	var fields = [];

	/**
	 * @private
	 * @type {String}
	 */
	var displayField;

	/**
	 * @private
	 * @type {String}
	 */
	var header;

	/**
	 * Set display field to the lookup object
	 *
	 * @public
	 * @param {String} h HeaderText on datasource for Multi Lookup Popup
	 * @return {String}
	 */
	this.setHeader = function(h) {
		if (!h || h.length < 1) {
			var ds = this.getDataSource().split('/')
			header = ds[ds.length-1];
		} else {
			header = h
		}
		return header;
	}

	/**
	 * get header field
	 *
	 * @public
	 * @return {String}
	 */
	this.getHeader = function() {
		return header;
	}

	/**
	 * Set display field to the lookup object
	 *
	 * @public
	 * @param {String} df Display dataprovider to be used for Multi Lookup Popup
	 * @return {String}
	 */
	this.setDisplayField = function(df) {
		displayField = df
		return displayField;
	}

	/**
	 * get display field to the lookup object
	 *
	 * @public
	 * @return {String}
	 */
	this.getDisplayField = function() {
		return displayField;
	}

	/**
	 * Gets the data source for this Lookup object
	 * @public
	 * @return {String}
	 */
	this.getDataSource = function() {
		return datasource;
	}

	/**
	 * Adds a field to the lookup object
	 *
	 * @public
	 * @param {String} dataProvider
	 * @return {LookupField}
	 */
	this.addField = function(dataProvider) {
		var provider = new LookupField(this, dataProvider);
		fields.push(provider);
		return provider;
	}

	/**
	 * Gets the field at the specified index
	 * @public
	 * @param {Number} index
	 * @return {LookupField}
	 */
	this.getField = function(index) {
		return fields[index];
	}

	/**
	 * Removes a field at the specified index
	 * @public
	 * @param {Number} index
	 */
	this.removeField = function(index) {
		fields.splice(index, 1);
	}

	/**
	 * Gets the number of fields in the lookup object
	 * @public
	 * @return {Number}
	 */
	this.getFieldCount = function() {
		return fields.length;
	}

	/**
	 * Shows the lookup
	 *
	 * @public
	 * @param {Function} callback The function that will be called when a selection is made
	 * @param {RuntimeComponent} target The component to show relative to
	 * @param {Number} [width] The width of the lookup. Optional. Default is same as target component
	 * @param {Number} [height] The height of the lookup. Optional. Default is implementation-specifc.
	 * @param {String} [initialValue] And initial value to show in the search
	 * @SuppressWarnings(wrongparameters) Fixes illegitmate warning
	 */
	this.showPopUp = function(callback, target, width, height, initialValue) {

		var runtimeForm = forms.svyLookupTable.newInstance(this);
		runtimeForm.showPopUp(callback, target, width, height, initialValue);
	}
}

/**
 * @public
 * @param {Lookup} lookup
 * @param dataProvider
 * @constructor
 * @properties={typeid:24,uuid:"298B728E-ED51-4ECD-BB3B-0878B766BCBB"}
 * @AllowToRunInFind
 */
function LookupField(lookup, dataProvider) {

	/**
	 * @private
	 * @type {Boolean}
	 */
	var searchable = true;

	/**
	 * @private
	 * @type {String}
	 */
	var titleText = dataProvider;

	/**
	 * @private
	 * @type {String}
	 */
	var valueListName = null;

	/**
	 * @private
	 * @type {String}
	 */
	var format = null;

	/**
	 * @private
	 * @type {Boolean}
	 */
	var visible = true;

	/**
	 * Gets the data provider for this field
	 * @public
	 * @return {String}
	 */
	this.getDataProvider = function() {
		return dataProvider;
	}

	/**
	 * Indicates if this field is searchable
	 *
	 * @public
	 * @param {Boolean} b True to make searchable. False to make display-only
	 * @return {LookupField}
	 */
	this.setSearchable = function(b) {
		searchable = b;
		return this;
	}

	/**
	 * Gets the searchability of this field
	 * @public
	 * @return {Boolean}
	 */
	this.isSearchable = function() {
		return searchable;
	}

	/**
	 * Sets the display text for this field
	 *
	 * @public
	 * @param {String} txt
	 * @return {LookupField}
	 */
	this.setTitleText = function(txt) {
		titleText = txt;
		return this;
	}

	/**
	 * Gets the display text for this field
	 *
	 * @public
	 * @return {String}
	 */
	this.getTitleText = function() {
		return titleText;
	}

	/**
	 * Sets the valuelist to use to display this field
	 *
	 * @public
	 * @param {String} vl
	 * @return {LookupField}
	 */
	this.setvalueListName = function(vl) {
		valueListName = vl;
		return this;
	}

	/**
	 * Gets the value list name for this field
	 * @public
	 * @return {String}
	 */
	this.getValueListName = function() {
		return valueListName;
	}

	/**
	 * Sets this field's visibility in the lookup form
	 * @public
	 * @param {Boolean} b
	 * @return {LookupField}
	 */
	this.setVisible = function(b) {
		visible = b;
		return this;
	}

	/**
	 * Indicates if this field should be displayed
	 *
	 * @public
	 * @return {Boolean}
	 */
	this.isVisible = function() {
		return visible;
	}

	/**
	 * Sets the display format for this field
	 *
	 * @public
	 * @param {String} f
	 * @return {LookupField}
	 */
	this.setFormat = function(f) {
		format = f;
		return this;
	}

	/**
	 * Gets the display format for this field;
	 *
	 * @public
	 * @return {String}
	 */
	this.getFormat = function() {
		return format;
	}
}
