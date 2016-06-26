(function($) {

	/*
	======== A Handy Little QUnit Reference ========
	http://api.qunitjs.com/
	
	Test methods:
	module(name, {[setup][ ,teardown]})
	test(name, callback)
	expect(numberOfAssertions)
	stop(increment)
	start(decrement)
	Test assertions:
	ok(value, [message])
	equal(actual, expected, [message])
	notEqual(actual, expected, [message])
	deepEqual(actual, expected, [message])
	notDeepEqual(actual, expected, [message])
	strictEqual(actual, expected, [message])
	notStrictEqual(actual, expected, [message])
	throws(block, [expected], [message])
	*/
		
	module('jQuery#href');
	
	test('read components', function() {
	
		expect(6);
		
		var $a = $('<a>').attr('href','http://www.example.com/path/to/page/?a=foo&b=bar#derp');
				
		strictEqual($a.href('protocol'), 'http');
		strictEqual($a.href('host'), 'www.example.com');
		strictEqual($a.href('path'), 'path/to/page/');
		deepEqual($a.href('query'), {a:'foo',b:'bar'});
		strictEqual($a.href('hash'), 'derp');
		strictEqual($a.href('href'), 'http://www.example.com/path/to/page/?a=foo&b=bar#derp');
	
	});

	test('read components relative', function() {
	
		expect(6);
		
		var $a = $('<a>').attr('href','?a=foo&b=bar#derp');
				
		strictEqual($a.href('protocol'), 'http');
		strictEqual($a.href('host'), 'jquery-href.localhost.com');
		strictEqual($a.href('path'), 'test/href.html');
		deepEqual($a.href('query'), {a:'foo',b:'bar'});
		strictEqual($a.href('hash'), 'derp');
		strictEqual($a.href('href'), 'http://jquery-href.localhost.com/test/href.html?a=foo&b=bar#derp');
	
	});

	test('read components root relative', function() {
	
		expect(6);
		
		var $a = $('<a>').attr('href','/path/to/page?a=foo&b=bar#derp');
				
		strictEqual($a.href('protocol'), 'http');
		strictEqual($a.href('host'), 'jquery-href.localhost.com');
		strictEqual($a.href('path'), 'path/to/page');
		deepEqual($a.href('query'), {a:'foo',b:'bar'});
		strictEqual($a.href('hash'), 'derp');
		strictEqual($a.href('href'), 'http://jquery-href.localhost.com/path/to/page?a=foo&b=bar#derp');
	
	});

	test('write components', function() {
	
		expect(6);

		var $a = $('<a>').attr('href','http://www.example.com/path/to/page/?a=foo&b=bar#derp');
				
		$a.href('protocol','https');
		strictEqual($a.attr('href'), 'https://www.example.com/path/to/page/?a=foo&b=bar#derp');

		$a.href('host','example.com');
		strictEqual($a.attr('href'), 'https://example.com/path/to/page/?a=foo&b=bar#derp');

		$a.href('path','path/to/another/page');
		strictEqual($a.attr('href'), 'https://example.com/path/to/another/page?a=foo&b=bar#derp');

		$a.href('query',{b:"noggin",c:"boggin"});
		strictEqual($a.attr('href'), 'https://example.com/path/to/another/page?a=foo&b=noggin&c=boggin#derp');

		$a.href('query.replace',{q:"fly-fishing"});
		strictEqual($a.attr('href'), 'https://example.com/path/to/another/page?q=fly-fishing#derp');

		$a.href('hash','carp');
		strictEqual($a.attr('href'), 'https://example.com/path/to/another/page?q=fly-fishing#carp');
	
	});

	test('write multiple components', function(){
	
		expect(1);

		var $a = $('<a>').attr('href','http://www.example.com/path/to/page/?a=foo&b=bar#derp');
		
		$a.href({protocol:'https', host:'example.com'});
		strictEqual($a.attr('href'), 'https://example.com/path/to/page/?a=foo&b=bar#derp');
	
	});
	
	test('unsetting components', function(){

		expect(6);
	
		var $a = $('<a>').attr('href','https://www.example.com/path/to/page/?a=foo&b=bar#derp');
		
		$a.href('hash', null);
		strictEqual($a.attr('href'), 'https://www.example.com/path/to/page/?a=foo&b=bar');

		$a.href('query.replace', null);
		strictEqual($a.attr('href'), 'https://www.example.com/path/to/page/');

		$a.href('path', null);
		strictEqual($a.attr('href'), 'https://www.example.com');

		$a.href('host', null);
		strictEqual($a.attr('href'), 'https://jquery-href.localhost.com');

		$a.href('protocol', null);
		strictEqual($a.attr('href'), 'http://jquery-href.localhost.com');
		
		var $b = $('<a>').attr('href','https://www.example.com/path/to/page/?a=foo&b=bar#derp');

		$b.href('href', null);
		strictEqual($b.attr('href'), 'http://jquery-href.localhost.com/test/href.html');
		
	
	});
	
	test('complex query string', function(){
	
		expect(2);
	
		var $a = $('<a>').attr('href','http://www.example.com/');
		$a.href('query',{a:['one','two','three'],b:{foo:'bar'}});
		strictEqual($a.href('href'),'http://www.example.com?a%5B%5D=one&a%5B%5D=two&a%5B%5D=three&b%5Bfoo%5D=bar');		
		deepEqual($a.href('query'), {a:['one','two','three'],b:{foo:'bar'}});
	
	});
	
	
	module('jQuery.href');
	
	test('create <a> with URL', function(){
	
		expect(4);
	
		var $a = $.href('http://www.example.com/path/to/page/?a=foo&b=bar#derp');
		
		ok($a instanceof $);
		strictEqual($a.length, 1);
		strictEqual($a[0].nodeName, 'A');
		strictEqual($a.attr('href'), 'http://www.example.com/path/to/page/?a=foo&b=bar#derp');	
	
	});

	test('create <a> on current page', function(){
	
		expect(4);
	
		var $a = $.href();
		
		ok($a instanceof $);
		strictEqual($a.length, 1);
		strictEqual($a[0].nodeName, 'A');
		strictEqual($a.attr('href'), window.document.location.href);
	
	});
	
	test('linkEquals', function(){
	
		expect(8);
	
		// relative links equivalent to absolute
		ok($.href.linkEquals('href.html','http://jquery-href.localhost.com/test/href.html'));
		ok($.href.linkEquals('toast/','http://jquery-href.localhost.com/test/toast/')); 
		ok($.href.linkEquals('/toast/','http://jquery-href.localhost.com/toast/')); 
		ok($.href.linkEquals('?foo=bar','http://jquery-href.localhost.com/test/href.html?foo=bar'));
		
		// can use <a> elements or jquery objects
		var $a = $('<a>').attr('href','http://jquery-href.localhost.com/bacon/');
		ok($.href.linkEquals('/bacon/', $a));
		ok($.href.linkEquals('/bacon/', $a[0]));
		ok($.href.linkEquals($a, $a[0]));

		// order of query params shouldn't matter
		ok($.href.linkEquals('?a=1&b=2', '?b=2&a=1'));
				
	
	});
	
	test('home', function(){
	
		expect(1);
		
		strictEqual($.href.home().attr('href'), 'http://jquery-href.localhost.com');
	
	});
	
	module('selectors');
	
	test(':href-internal & :href-external', function() {
	
		expect(10);
	
		var $links = $('<div>').html(
			'<a name="in0" href="/foo" ></a>' +
			'<a name="in1" href="bar" ></a>' +
			'<a name="in2" href="#" ></a>' +
			'<a name="in3" href="http://jquery-href.localhost.com/derp?a=b" ></a>' +
			'<a name="in4" href="http://jquery-href.localhost.com" ></a>' +
			'<a name="in5" href="https://jquery-href.localhost.com" ></a>' +
			'<a name="ex0" href="http://google.com" ></a>' +
			'<a name="ex1" href="http://jquery-href.localhost.co.uk" ></a>'
		);
		
		var $internal = $links.find(':href-internal');
		strictEqual($internal.length, 6);
		strictEqual($internal.eq(0).attr('name'),'in0');
		strictEqual($internal.eq(1).attr('name'),'in1');
		strictEqual($internal.eq(2).attr('name'),'in2');
		strictEqual($internal.eq(3).attr('name'),'in3');
		strictEqual($internal.eq(4).attr('name'),'in4');
		strictEqual($internal.eq(5).attr('name'),'in5');


		var $external = $links.find(':href-external');
		strictEqual($external.length, 2);
		strictEqual($external.eq(0).attr('name'),'ex0');
		strictEqual($external.eq(1).attr('name'),'ex1');
	});

}(jQuery));
