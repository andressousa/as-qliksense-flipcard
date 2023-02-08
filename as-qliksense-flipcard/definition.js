/*!
*
* The MIT License (MIT)
* Copyright (c) 2023
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of
* this software and associated documentation files (the "Software"), to deal in
* the Software without restriction, including without limitation the rights to
* use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
* the Software, and to permit persons to whom the Software is furnished to do so,
* subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
* FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
* COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
* IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
* CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*
* @version v1.0.0
* @link https://github.com/andressousa/as-qliksense-flipcard
* @author André Sousa
* @license MIT
*/

define(["qlik", "ng!$q"],
function ( qlik, $q ){
	"use strict";

	var app = qlik.currApp();

	/**
	 * Function for listing all objects in the master item list
	 *
	 * @returns list
	 *
	 */
	function listObjects(){
		var defer = $q.defer();
		app.getAppObjectList('masterobject', function(data){
			var objects = [];
			objects.push({
				value: null,
				label: 'Select'
			});
			var sortedData = _.sortBy( data.qAppObjectList.qItems, function(item){
				return item.qData.rank;
			});
			_.each(sortedData, function(item){
				objects.push({
					value: item.qInfo.qId,
					label: item.qMeta.title
				});
			});
			return defer.resolve(objects);
		} );
		return defer.promise;		
	};


	return {
		type: "items",
		component: "accordion",
		items: {
			appearence: {
				uses: "settings"
			},
			settings: {
				type: "items",
				label: "Objects",
				items: {
					frontObj: {
						type: "string",
						component: "dropdown",
						label: "Front Object",
						ref: "front",
						options: function(){ return listObjects().then(function(items){ return items; }); }
					},
					backObj: {
						type: "string",
						component: "dropdown",
						label: "Back Object",
						ref: "back",
						options: function(){ return listObjects().then(function(items){ return items; }); }
					}
				}
			}
		}
	}
});