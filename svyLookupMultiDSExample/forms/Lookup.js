/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"32BB4D45-1D13-4DD3-8FDD-DA4FB6EE669B"}
 */
var searchText;

/**
 * @properties={typeid:24,uuid:"0CEC6007-D103-4847-9ABD-5710BE8EBC6B"}
 * @AllowToRunInFind
 */
function search() {
	// create an array of lookupS (multi datasources) (initially just add products ds)
	var mlobj = scopes.svyLookup.createMultiDSLookup([datasources.db.example_data.products.getDataSource()]);
	
	//get the products datasource from list and add some fields to search on.
	var products = mlobj.getLookup(datasources.db.example_data.products.getDataSource());
	products.addField('products_to_categories.categoryname').setTitleText('Category');
	products.addField('productname').setTitleText('Product');
	products.addField('products_to_suppliers.companyname').setTitleText('Supplier');
	
	//set a single display field to appear in the popup
	products.setDisplayField('productname');
	
	//set header text to appear for results in this datasource in the popup
	//if nothing is set else we will use datasource name.
	products.setHeader('Products');
	
	//add customers datasource to the list
	var customers = mlobj.addLookup(datasources.db.example_data.customers.getDataSource())
	customers.addField('customerid').setTitleText('Customer ID');
	customers.addField('country').setTitleText('Country');	
	customers.setDisplayField('companyname');
	customers.setHeader('Customers');
	
	//add employees datasource to the list
	var employees = mlobj.addLookup(datasources.db.example_data.employees.getDataSource())
	employees.addField('firstname').setTitleText('First Name');
	employees.addField('lastname').setTitleText('Last Name');	
	employees.setDisplayField('firstname');
	employees.setHeader('Employees');
	
	// show pop-up
	/** @type {RuntimeComponent} */	
	var component = elements.search;
	mlobj.showPopUpMultiDS(onSelect, component, null, null, searchText);
}

/**
 * @properties={typeid:24,uuid:"B411BF08-9B9F-4A5C-AFB0-5C17AAC0C159"}
 */
function onSelect(data){
	searchText = data.s;
	if (data.rec.record)
	application.output('selected : ' + data.rec.record);
}