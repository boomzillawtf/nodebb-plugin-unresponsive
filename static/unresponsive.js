;(function(){
"use strict";

var nodebbTranslator,
	rawStrings = [
		['unresponsive','responsive'],
		['unresponsive','desktop'],
		['unresponsive','settings_header'],
		['unresponsive','settings_text'],
		['unresponsive','settings'],
		['unresponsive','mode_header'],
		['unresponsive','mode_text'],
		['unresponsive','other_settings'],
		['unresponsive','other_text'],
		['unresponsive','cancel'],
		['unresponsive','max_fluid_width'],
		['unresponsive','max_content_width'],
		['unresponsive','max_notification_height'],
		['unresponsive','notification_width'],
		['unresponsive','left_margin'],
		['unresponsive','confirm_desktop'],
		['unresponsive','confirm_desktop_header'],
		['unresponsive','confirm_desktop_text'],
		['global','save_changes']
	],
	strings = { translated: 0 },
	settings,
	hasCustomStyle,
	settingsDiv,
	settingsModalDiv,
	desktopDiv,
	desktopModalDiv;

var unresponsive = function(translator){
	rawStrings.map( function( raw, ix ){
		translator.translate( '[[' + raw[0] + ':' + raw[1] + ']]', function( text ){
			strings[raw[1]] = text;
			++strings.translated;
			if( strings.translated == rawStrings.length ){
				nodebbTranslator = translator;
			}
		});
	});
}

function beResponsive(){
	settings.responsive = true;
	saveSettings()
	location.reload();
}

function beUnresponsive(){
	settings.responsive = false;
	saveSettings();
	window.localStorage['responsive'] = 'unresponsive';
	location.reload();
}

function createMenuItem( text, fa_icon){
	var li = element(null, 'li');
	var a = element(li, 'a');
	a.href = '#';
	var i = element(a, 'i',['fa','fa-fw'] );
	if( fa_icon === true ){
		i.classList.add( 'fa-dot-circle-o' );
	}
	else if (fa_icon === false ){
		i.classList.add( 'fa-circle-o' );
	}
	else if( fa_icon ){
		i.classList.add( fa_icon );
	}
	var span = element(a, 'span', [], text);
	return li;
}

function element(parent, elementName, classes, text){
	var el = document.createElement(elementName);
	if(parent){
		parent.appendChild(el);
	}
	if( classes ){
		if( !Array.isArray(classes) ){
			classes = [classes];
		}
		for( var i = 0; i < classes.length; ++i ){
			el.classList.add(classes[i]);
		}
	}
	$(el).text(text);
	return el;
}

function radio(parent, name, value){
	var r = element(parent, "input", ["unresponsive"]);
	r.type = "radio";
	r.name = name;
	r.value = value;
	return r;
}

function input(parent, id, value){
	var i = element(parent, "input", "form-control");
	i.id = id;
	i.type = "text";
	i.value = value;
	return i;
}


function label(parent, forElement, value ){
	var l = element(parent, "label", null, value );
	l.setAttribute('for', forElement);
	return l;
}

function createDesktopDiv(){
	var mainDiv = $("#turn-on-desktop-dialog");
	if( mainDiv.length > 0 ){
		return mainDiv[0];
	}
	mainDiv = element($('body')[0], "div", ["account","unresponsive-dialog"]);
	mainDiv.id = 'turn-on-desktop-dialog';
	desktopModalDiv = element($('body')[0], "div", "unresponsive-modal");
	desktopModalDiv.addEventListener("click", function(){$(desktopModalDiv).hide(); $(desktopDiv).hide();} );
	
	element( mainDiv, "h2", [], strings["confirm_desktop_header"]);
	element( mainDiv, "p", [], strings["confirm_desktop_text"]);
	var form = element(mainDiv, "form");
	var actionsDiv = element(form, "div", "form-actions");
	var submit = element( actionsDiv, "a", ["btn","btn-primary"], strings["confirm_desktop"] );
	var cancel = element( actionsDiv, "a", "btn", strings["cancel"] );
	
	submit.addEventListener('click', function(event){ beUnresponsive(); });
	cancel.addEventListener('click', function(event){ onCancelSettings([mainDiv,desktopModalDiv]);});
	
	return mainDiv;
}

function createSettingsDiv(){
	var mainDiv = $("#unresponsive-setting-dialog");
	if( mainDiv.length > 0 ){
		return mainDiv[0];
	}
	
	mainDiv = element($('body')[0], "div", ["account","unresponsive-dialog"]);
	mainDiv.id = 'unresponsive-setting-dialog';
	settingsModalDiv = element($('body')[0], "div", "unresponsive-modal");
	settingsModalDiv.addEventListener("click", function(){$(settingsModalDiv).hide(); $(settingsDiv).hide();});
	
	element(mainDiv, "h2", [], strings["settings_header"]);
	element(mainDiv, "span", [], strings["settings_text"]);
	
	var form = element(mainDiv, "form");
	var row = element(form, "div", "row");
	
	element( row, "h4", [], strings["mode_header"]);
	var modeWell = element( form, "div", "well");
	var responsiveRadio = radio(modeWell, "unresponsive_mode", "responsive");
	responsiveRadio.id = 'responsive-radio';
	label( modeWell, "responsive-radio", strings["responsive"] );
	element( modeWell, "br");
	
	var unresponsiveRadio = radio(modeWell, "unresponsive_mode", "unresponsive");
	unresponsiveRadio.id = 'unresponsive-radio';
	label( modeWell, 'unresponsive-radio', strings["desktop"] );
	element( modeWell, "br");
	
	label( modeWell, "max-fluid-width", strings['max_fluid_width']);
	var maxFluidWidth = input(modeWell, "max-fluid-width", settings.maxFluidWidth ? settings.maxFluidWidth : '' );
	element( modeWell, "br");
	
	label( modeWell, "left-margin", strings['left_margin']);
	var maxFluidWidth = input(modeWell, "left-margin", settings.leftMargin ? settings.leftMargin : 'auto' );
	element( modeWell, "br");
	
	element( modeWell, "span", [], strings["mode_text"]);
	
	var row = element(form, "div", "row");
	element( row, "h4", [], strings["other_settings"]);
	var otherWell = element( form, "div", "well");
	element( otherWell, "span", [], strings["other_text"]);
	element( otherWell, "br");
	label( otherWell, "max-content-width", strings['max_content_width']);
	var maxContentWidth = input(otherWell, "max-content-width", settings.maxContentWidth ? settings.maxContentWidth : '');
	element( otherWell, "br");
	
	label( otherWell, "max-notification-height", strings['max_notification_height']);
	var maxNotificationHeight = input(otherWell, "max-notification-height", settings.maxNotificationHeight ? settings.maxNotificationHeight : '');
	element( modeWell, "br");
	
	label( otherWell, "notification-width", strings['notification_width']);
	var notificationWidth = input(otherWell, "notification-width", settings.notificationWidth ? settings.notificationWidth : '');
	element( modeWell, "br");
	
	var actionsDiv = element(form, "div", "form-actions");
	var submit = element( actionsDiv, "a", ["btn","btn-primary"], strings["save_changes"] );
	var cancel = element( actionsDiv, "a", "btn", strings["cancel"] );
	submit.addEventListener('click', function(event){ onSaveSettings([mainDiv,settingsModalDiv]);});
	cancel.addEventListener('click', function(event){ onCancelSettings([mainDiv,settingsModalDiv]);});
	
	return mainDiv;
}

function onCancelSettings( div ){
	$(div).hide();
}

function onSaveSettings( div ){
	var originalResponsive = settings.responsive;
	settings.responsive = $("input[value=responsive]").prop("checked");
	
	var originalMaxFluid = settings.maxFluidWidth;
	settings.maxFluidWidth = $("#max-fluid-width")[0].value;
	
	var originalMaxContent = settings.maxContentWidth;
	settings.maxContentWidth = $("#max-content-width")[0].value;
	
	var originalMaxNotificationHeight = settings.maxNotificationHeight;
	settings.maxNotificationHeight = $("#max-notification-height")[0].value;
	
	var originalMaxNotificationWidth = settings.notificationWidth;
	settings.notificationWidth = $("#notification-width")[0].value;
	
	var originalLeftMargin = settings.leftMargin;
	settings.leftMargin = $("#left-margin")[0].value;
	
	$(div).hide();
	saveSettings();
	var needsRefresh = false;
	if( originalMaxContent != settings.maxContentWidth || originalMaxNotificationHeight != settings.maxNotificationHeight
		|| originalMaxNotificationWidth != settings.notificationWidth ){
		
		needsRefresh = true;
	}
	if( originalResponsive != settings.responsive ||
		originalMaxFluid != settings.maxFluidWidth ||
		originalLeftMargin != settings.leftMargin){
		
		if( settings.responsive ){
			needsRefresh = false;
			beResponsive();
		}
		else{
			needsRefresh = false;
			beUnresponsive();
		}
	}
	if( needsRefresh ){
		location.reload();
	}
}

function onShowSettings(){
	$("input[value=responsive]").prop("checked", settings.responsive );
	$("input[value=unresponsive]").prop("checked", !settings.responsive );
	$("#max-fluid-width")[0].value = settings.maxFluidWidth ? settings.maxFluidWidth : '';
	$("#max-notification-height")[0].value = settings.maxNotificationHeight ? settings.maxNotificationHeight : '';
	$("#notification-width")[0].value = settings.notificationWidth ? settings.notificationWidth : '';
	$(settingsModalDiv).show();
	$(settingsDiv).show();
	
}

function confirmDesktop(){
	$(desktopModalDiv).show();
	$(desktopDiv).show();
}

function createMenu( menu, hasCustomStyle ){
	var divider = element(menu, "li", "divider");
	divider.role = 'presentation';
	
	var responsiveMenu = createMenuItem( strings.responsive, settings.responsive);
	responsiveMenu.id = 'media-override-responsive';
	responsiveMenu.addEventListener('click', beResponsive);
	
	var unresponsiveMenu = createMenuItem( strings.desktop, !settings.responsive);
	unresponsiveMenu.addEventListener('click', confirmDesktop );
	unresponsiveMenu.id = 'media-override-unresponsive';
	
	menu.appendChild( divider, responsiveMenu );
	if( !hasCustomStyle ){
		menu.appendChild( responsiveMenu );
		menu.appendChild( unresponsiveMenu );
	}
	
	var settingsMenu = createMenuItem( strings.settings, "fa-gear" );
	settingsMenu.id = 'unresponsive-settings';
	menu.appendChild( settingsMenu );
	settingsMenu.addEventListener('click', onShowSettings );
}

function addResponsiveMenu(){
	var userControlList = $("#user-control-list");
	var mobileMenu = $('[component="header/usercontrol"]');
	var existingMenu = $("#unresponsive-settings");
	if( userControlList.length > 0 && !existingMenu.length){
		createMenu( userControlList[0], hasCustomStyle );
		createMenu( mobileMenu[0], hasCustomStyle );
	}
}

function initInterface(){
	addResponsiveMenu();
	settingsDiv = createSettingsDiv();
	desktopDiv = createDesktopDiv();
}

var maxWidth, minWidth, translateMax, translateMin;

maxWidth = /max-width:\s*(\d+px)/;
minWidth = /min-width:\s*(\d+px)/;
translateMax = {
	// based on max-width
	'767px': '0px',
	'768px': '0px',
	'979px': '0px',
	'991px': '0px',
	'992px': '0px',
	'1199px': '0px'
};
translateMin = {
	// based on min-width:
	'1000px': '1px',
	'767px': '1px',
	'768px': '1px',
	'979px': '1px',
	'991px': '1px',
	'992px': '1px',
	'1200px': '1px',
	'1199px': '1px'
};

function styleTweaks(){
	var s = [].slice.call(document.styleSheets);
	if( settings.maxContentWidth ){
		s[0].insertRule("div .content { max-width: " + settings.maxContentWidth + ";}", s[0].cssRules.length);
	}
	if( settings.maxNotificationHeight ){
		s[0].insertRule(
			"#menu .notification-list, .header .notification-list{max-height: " + settings.maxNotificationHeight + ";}",
			s[0].cssRules.length);
	}
	if( settings.notificationWidth ){
		s[0].insertRule(
			".notification-list li, .header .notification-list li {width: " + settings.notificationWidth+ ";}",
			s[0].cssRules.length);
	}
	
}

function resizeHeader(){
	var height = $('#header-menu').height();
	$('body').css('padding-top', (height + 20) + 'px');
}

function forceUnresponsiveStyle(){
	$('.container').addClass('container-fluid');
	$('.container').removeClass('container');
	$(window).resize( resizeHeader );
	// Get all stylesheets for ths docuemnt
	var s = [].slice.call(document.styleSheets);
	if( settings.maxFluidWidth ){
		s[0].insertRule(".container-fluid { max-width: " + settings.maxFluidWidth + ";}", s[0].cssRules.length);
	}
	if( settings.leftMargin ){
		s[0].insertRule(".container-fluid { margin-left: " + settings.leftMargin + ";}", s[0].cssRules.length);
	}
	// Iterate through each one
	for(var ixs = 0; ixs < s.length; ixs++){
		var sheet;
		try {
			sheet = s[ixs];
			if(sheet!=null && sheet.cssRules != null && sheet.cssRules.length > 0){
				// Get all cssRules for this stylesheet
				var r = [].slice.call(sheet.cssRules);
				// iterate through each rule
				for (var ixr = 0; ixr < r.length; ixr++){
					var rule = r[ixr];
					
					// If this rule has a Media query, we're interested in it
					if(rule != null && rule.media != null && rule.media && rule.media.length > 0){
						var conditionText = rule.media.conditionText || rule.media.mediaText;
						var maxMatches = conditionText.match( maxWidth );
						if( maxMatches && translateMax[maxMatches[1]]){
							conditionText = conditionText.replace( maxMatches[1], translateMax[maxMatches[1]] );
						}
						var minMatches = conditionText.match( minWidth );
						if( minMatches && translateMin[minMatches[1]] ){
							conditionText = conditionText.replace( minMatches[1], translateMin[minMatches[1]] );
						}
						rule.media.mediaText = conditionText;
					}
				}
			}
		} catch (e) {
			sheet = null;
		}
	}
}

function saveSettings(){
	window.localStorage['unresponsive-settings'] = JSON.stringify( settings );
}

function loadSettings(){
	settings = window.localStorage['unresponsive-settings'];
	if( !settings ){
		settings = window.localStorage['responsive'];
		settings = { responsive: settings != 'unresponsive' };
		saveSettings();
		window.localStorage.removeItem('responsive');
	}
	else{
		settings = JSON.parse( settings );
	}
	return settings;
}

function hasBootstrapStyle(){
	var bootswatchCSS = $('#bootswatchCSS');
	if( bootswatchCSS.length ){
		return !!bootswatchCSS[0]['href'];
	}
	return false;
}

function init() {
	if(!nodebbTranslator){
		setTimeout( init, 10 );
		return;
	}
	hasCustomStyle = hasBootstrapStyle();
	loadSettings();
	
	if( !settings.responsive && !hasCustomStyle ){
		forceUnresponsiveStyle();
	}
	styleTweaks();
	initInterface( hasCustomStyle );
}

$(window).on('action:widgets.loaded', function(){
	init();
});
require(['translator'],  unresponsive);
}());
