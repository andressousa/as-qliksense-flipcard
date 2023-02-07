/*!
*
* AS Flipcard - An extension for Qlik Sense to display a flipcard that holds two master items. 
* --
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
* @link https://github.com/andressousa/qliksense-flipcard-extension
* @author André Sousa
* @license MIT
*/

define([
	 "qlik"
	,"jquery"
	,"./definition"
	,"./support"
	,"css!./style.css"
],
function (
	 qlik
	,$
	,definition
	,support
){
	"use strict";

	/**
	 * Function to provide random IDs for html elements
	 *
	 * @returns string
	 *
	 */
	function randID(){
	    let result = '';
	    const chr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	    const chrLen = chr.length;
	    while (result.length < 10) {
			result += chr.charAt(Math.floor(Math.random() * chrLen ));
	    }
	    return 'flip-' + result;
	}

	return {
		definition 	: definition,
		support 	: support,
		paint: function ($element, layout) {

			//current app instance
			var app = qlik.currApp();

			//clear html
			$element.empty();

			//generate element ID
			layout.cardID 		= randID();
			layout.frontID 		= randID();
			layout.backID 		= randID();
			layout.buttonID 	= randID();
			
			//generate full html layout
			var html = '';
			html += '<div qv-extension style="height: 100%; position: relative; overflow: hidden;">';
			html += '<div class="scene scene--card">';
			html += '<button id="'+layout.buttonID+'" type="button" class="lui-button card__flip"><span class="lui-icon lui-icon--swap"></span></button>';
			html += '<button id="flipexp-'+layout.buttonID+'" type="button" class="lui-button card__flip"><span class="lui-icon lui-icon--export"></span></button>';
			html += '<div id="'+layout.cardID+'" class="card">';
			html += '<div id="'+layout.frontID+'" class="card__face card__face--front">Front Chart</div>';
			html += '<div id="'+layout.backID+'" class="card__face card__face--back">Back Chart</div>';
			html += '</div></div></div>';

			//show elements
			$element.append(html);

			//create attribute for export purpose
			$('#'+layout.frontID).attr('obj-id', layout.front);
			$('#'+layout.backID).attr('obj-id', layout.back);

			//export data from visible object
			$('body').find('button#flipexp-' + layout.buttonID).on('click', function(){
				var card = $(this).parent('div').find('.card');
				var id = card.hasClass('is-flipped') ? card.find('.card__face').last().attr('obj-id') : card.find('.card__face').first().attr('obj-id');

				app.getObject(id).then(function(model) { 
					var table = qlik.table(model); 
					table.exportData({download: true}); 
				});
			});

			//toggle front/back objects
			$('body').find('button#' + layout.buttonID).on('click', function(){
				$(this).parent('div').find('.card').toggleClass('is-flipped');
			});
			
			//show qlik sense objects
			app.getObject(layout.frontID, layout.front);
			app.getObject(layout.backID, layout.back);

			return qlik.Promise.resolve();
		}
	};

});
