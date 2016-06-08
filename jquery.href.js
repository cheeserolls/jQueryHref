/**
 * jQuery href plugin
 *
 * Provides helpful functions for creating, selecting and manipulating <a> elements and urls
 *
 * @todo create $.href function which does   $('<a>').href
 * @todo provide some way to instantly get the site homepage
 *
 */

jQuery(function($){

var _composeLink = function(parts) {
	var q = (parts.query ? $.param(parts.query) : false);
	return parts.protocol + '://' + parts.host + '/' + parts.path + (q ? '?'+q : '') + (parts.hash ? '#'+parts.hash : '') ;	
};

$.decomposeLink = function(a) {
	var temp = {
		'protocol':a.protocol.replace(/:?\/?\/?$/,''), // normalise by removing trailing colon and slashes
		'host':a.host,
		'path':a.pathname.replace(/^\//,'').replace(/\/$/,''), // normalise by removing leading and trailing slashes
		'query':$.deparam(a.search.replace(/^\?/,'')), // split into components in an aobject
		'hash':a.hash.replace(/^#/,'') // normalise by removing leading hash
	};
	temp.href = _composeLink(temp);
	return temp;
}

$.linkEquals = function(a,b) {

	// both arguments can be strings, <a> elements, or jQuery objects whose first element is an <a> element - anything else, return false
	if (typeof(a)=='string') {a = $('<a>').attr('href',a);}
	if (a instanceof jQuery) {a = a[0];}
	if (a && (a.nodeName=='A')) {
		a = $.decomposeLink(a);
	} else {
		return false;
	}
	if (typeof(b)=='string') {b = $('<a>').attr('href',b);}
	if (b instanceof jQuery) {b = b[0];}
	if (b && (b.nodeName=='A')) {
		b = $.decomposeLink(b);
	} else {
		return false;
	}
	// all parts have to be equal, but we sort the query params before comparing because the order of the parameters shouldn't matter
	return (a.protocol==b.protocol) && (a.host==b.host) && (a.path==b.path) && (a.hash==b.hash) && ($.param(a.query).split('&').sort().join('&')==$.param(b.query).split('&').sort().join('&'));
	
}


$.fn.href = function() {
		
	// Only works on a elements
	if (this[0].nodeName!='A') {return this;}
	
	// if no href is set yet for this element, then use the current doc location
	if (!this[0].href) {this[0].href = window.document.location.href;}
	
	// no arguments - return the href
	if (arguments.length==0) {return this[0].href;}
	
	// save a reference to this in a variable
	var $self = this;
	
	// break apart the sections of the link so that they can be separately manipulated
	var temp = $.decomposeLink(this[0]);

	// one string argument - assume we're getting a component of the url
	// If no named component of the url matches, then assume we're setting the entire href
	if (arguments.length==1 && (typeof arguments[0]=='string')) {
		if (temp.hasOwnProperty(arguments[0])) {
			return temp[arguments[0]];
		} else {
			this.attr('href',arguments[0]);
			return this;
		}
	}
	
	// define setter functions
	var setters = {
		'protocol': function(arg) {temp.protocol = arg.replace(/:?\/?\/?$/,'');},
		'host': function(arg) {temp.host = arg;},
		'path': function(arg) {temp.path = arg.replace(/^\//,'');},
		'query': function(arg) {$.extend(temp.query,arg);},
		'query.replace': function(arg) {temp.query = arg;},
		'hash': function(arg) {temp.hash = arg.replace(/^#/,''); console.log(temp);  console.log(_composeLink(temp));},
		'href': function(arg) {$self.attr('href',arg); temp = $.decomposeLink($self[0]);}
	};

	
	// 2 arguments, first is a component of the url - set that component
	if (arguments.length==2 && setters[arguments[0]]) {
		setters[arguments[0]](arguments[1]);
	}
	
	// one argument which is an object - setting multiple components of the url at the same time
	// keys should be named components of the url
	if (arguments.length==1 && (typeof arguments[0]=='object')) {	
		for (var i in arguments[0]) {
			if (setters[i]) {setters[i](arguments[0][i]);}
		}
	}

	this.attr('href',_composeLink(temp));
	
	return this;
		
}

// Allow matching internal links with :internal and external with :external
$.expr[':']['internal'] = function(obj,index,meta,stack) {return obj.hostname && obj.hostname==document.location.hostname;}
$.expr[':']['external'] = function(obj,index,meta,stack) {return obj.hostname && obj.hostname!=document.location.hostname;}




/**
 * jQuery deparam is an extraction of the deparam method from Ben Alman's jQuery BBQ
 * http://benalman.com/projects/jquery-bbq-plugin/
 */
$.deparam = function (params, coerce) {

	var obj = {},
	coerce_types = { 'true': !0, 'false': !1, 'null': null };

	// Iterate over all name=value pairs.
	$.each(params.replace(/\+/g, ' ').split('&'), function (j,v) {
		var param = v.split('='), key = decodeURIComponent(param[0]), val, cur = obj, i = 0;

		// If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
		// into its component parts.
		var keys = key.split(']['), keys_last = keys.length - 1;

		// If the first keys part contains [ and the last ends with ], then []
		// are correctly balanced.
		if (/\[/.test(keys[0]) && /\]$/.test(keys[keys_last])) {
			// Remove the trailing ] from the last keys part.
			keys[keys_last] = keys[keys_last].replace( /\]$/ , '');

			// Split first keys part into two parts on the [ and add them back onto
			// the beginning of the keys array.
			keys = keys.shift().split('[').concat(keys);

			keys_last = keys.length - 1;
		
		} else {
			// Basic 'foo' style key.
			keys_last = 0;
		}

		// Are we dealing with a name=value pair, or just a name?
		if (param.length === 2) {
			
			val = decodeURIComponent(param[1]);

			// Coerce values.
			if (coerce) {
				val = val && !isNaN(val)              ? +val              // number
					: val === 'undefined'             ? undefined         // undefined
					: coerce_types[val] !== undefined ? coerce_types[val] // true, false, null
					: val;                                                // string
			}

			if ( keys_last ) {
				// Complex key, build deep object structure based on a few rules:
				// * The 'cur' pointer starts at the object top-level.
				// * [] = array push (n is set to array length), [n] = array if n is 
				//   numeric, otherwise object.
				// * If at the last keys part, set the value.
				// * For each keys part, if the current level is undefined create an
				//   object or array based on the type of the next keys part.
				// * Move the 'cur' pointer to the next level.
				// * Rinse & repeat.
				for (; i <= keys_last; i++) {
					key = keys[i] === '' ? cur.length : keys[i];
					cur = cur[key] = i < keys_last
						? cur[key] || (keys[i+1] && isNaN(keys[i+1]) ? {} : [])
						: val;
				}
	
			} else {
			
				// Simple key, even simpler rules, since only scalars and shallow
				// arrays are allowed.
		
				if ($.isArray(obj[key])) {
					// val is already an array, so push on the next value.
					obj[key].push( val );
			
				} else if (obj[key] !== undefined) {
					// val isn't an array, but since a second value has been specified,
					// convert val into an array.
					obj[key] = [obj[key], val];
			
				} else {
					// val is a scalar.
					obj[key] = val;
				}
			}
		
		} else if (key) {
			// No value was defined, so set something meaningful.
			obj[key] = coerce ? undefined : '';
		}
	
	});

	return obj;
};


});
