"use strict";

var nodebbTranslator;
var unresponsive = function(translator){
	nodebbTranslator = translator;
}
function beResponsive(){
	window.localStorage['responsive'] = 'responsive';
	location.reload();
}

function beUnresponsive(){
	window.localStorage['responsive'] = 'unresponsive';
	location.reload();
}

function createMenuItem(text, selected){
	var li = document.createElement('li');
	var a = document.createElement('a');
	li.appendChild(a);
	a.href = '#';
	var i = document.createElement('i');
	a.appendChild(i);
	i.className = 'fa fa-fw';
	if( selected ){
		i.classList.add('fa-dot-circle-o');
	}
	else{
		i.classList.add('fa-circle-o');
	}
	var span = document.createElement('span');
	$(span).text(text);
	a.appendChild( span );
	return li;
}

function createMenu( menu, responsive ){
	var divider = document.createElement("li");
	divider.role = 'presentation';
	divider.classList.add('divider');
	
	nodebbTranslator.translate('[[unresponsive:responsive]]', function(text){
		var responsiveMenu = createMenuItem(text, responsive);
		responsiveMenu.id = 'media-override-responsive';
		responsiveMenu.addEventListener('click', beResponsive);
		
		nodebbTranslator.translate('[[unresponsive:desktop]]', function(text){
			var unresponsiveMenu = createMenuItem( text, !responsive);
			unresponsiveMenu.addEventListener('click', beUnresponsive);
			unresponsiveMenu.id = 'media-override-unresponsive';
			
			menu.appendChild( divider, responsiveMenu );
			menu.appendChild( responsiveMenu );
			menu.appendChild( unresponsiveMenu );
		});
	});
}

function addResponsiveMenu(responsive){
	var userControlList = $("#user-control-list");
	var mobileMenu = $('[component="header/usercontrol"]');
	var existingMenu = $("#media-override-responsive");
	if( userControlList.length > 0 && !existingMenu.length){
		createMenu( userControlList[0], responsive );
		createMenu( mobileMenu[0], responsive );
	}
}

var maxWidth, minWidth, translate;

maxWidth = /max-width:\s*(\d+px)/;
minWidth = /min-width:\s*(\d+px)/;
translate = {
	// based on max-width
	'767px': '0px',
	'768px': '0px',
	'979px': '0px',
	'991px': '0px',
	'992px': '0px',
	
	// based on min-width:
	'1000px': '1px',
	'768px': '0px',
	'979px': '1px',
	'992px': '1px'
}

function forceUnresponsiveStyle(){
	$('.container').addClass('container-fluid');
	$('.container').removeClass('container');
	// Get all stylesheets for ths docuemnt
	var s = [].slice.call(document.styleSheets);
	// Iterate through each one
	for(var ixs = 0; ixs < s.length; ixs++){
		sheet = s[ixs];
		if(sheet!=null && sheet.cssRules != null && sheet.cssRules.length > 0){
			// Get all cssRules for this stylesheet
			ss = sheet;
			var r = [].slice.call(sheet.cssRules);
			// iterate through each rule
			for (var ixr = 0; ixr < r.length; ixr++){
				var rule = r[ixr];
				// If this rule has a Media query, we're interested in it
				if(rule != null && rule.media != null && rule.media && rule.media.length > 0){
					var conditionText = rule.media.conditionText || rule.media.mediaText;
					var maxMatches = conditionText.match( maxWidth );
					if( maxMatches && translate[maxMatches[1]]){
						conditionText = conditionText.replace( maxMatches[1], translate[maxMatches[1]] );
					}
					var minMatches = conditionText.match( minWidth );
					if( minMatches && translate[minMatches[1]] ){
						conditionText = conditionText.replace( minMatches[1], translate[minMatches[1]] );
					}
					rule.media.mediaText = conditionText;
				}
			}
		}
	}
}

function init() {
	if(!nodebbTranslator){
		setTimeout( init, 10 );
	}
	var responsive = window.localStorage['responsive'] != 'unresponsive';
	if( !responsive ){
		forceUnresponsiveStyle();
	}
	addResponsiveMenu( responsive );
}
$(window).on('action:widgets.loaded', function(){
	init();
});
require(['translator'],  unresponsive);
