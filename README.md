# jQueryHref

jQuery extension which adds lots of helpful tools for manipulation of URLs and hyperlinks


### Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/cheeserolls/jQueryHref/master/dist/jquery.href.min.js
[max]: https://raw.github.com/cheeserolls/jQueryHref/master/dist/jquery.href.js


### .href()

Suppose we're on `http://www.example.com/path/to/page?foo=bar`

```html
<a id="myLink" href="http://www.example.com/path/to/page/?a=foo&b=bar#derp">click here</a>
```

**Read componenets (normalised across browsers)**

```javascript
$('#myLink').href('protocol');   // http
$('#myLink').href('host');       // www.example.com
$('#myLink').href('path');       // path/to/page/
$('#myLink').href('query');      // {a:"foo",b:"bar"}
$('#myLink').href('hash');       // derp
$('#myLink').href('href');       // http://www.example.com/path/to/page?a=foo&b=bar#derp
```

**Write components:**

```javascript
$('#myLink').href('protocol','https').href('path','path/to/otherpage/').href('hash',null);
```

or equivalently

```javascript
$('#myLink').href({protocol:'https', path:'path/to/otherpage/', href:null});
```

href of `#myLink` is now `https://www.example.com/path/to/otherpage/?a=foo&b=bar`

**Make changes to query string:  (changes are merged)**

```javascript
$('#myLink').href('query',{b:"noggin",c:"boggin"});
```

href of `#myLink` is now `https://www.example.com/path/to/otherpage/?a=foo&b=noggin&c=boggin`

**Replace query string:  (as opposed to merge)**

```javascript
$('#myLink').href('query.replace',{q:"Fly Fishing"});
```

href of `#myLink` is now `https://www.example.com/path/to/otherpage/?q=Fly+Fishing`

**Relative links work too:**

If we're on `http://www.example.com/egg` and have `<a id="myLink" href="/bacon">click here</a>`

```javascript
$('#myLink').href('host');       // www.example.com
$('#myLink').href('path');       // bacon
```

### Some other bits

**2 new jquery selectors**

`:href-internal` - matches links to pages on the same hostname
`:href-external` - matches links to pages on a different hostname

eg - make all external links open in a new tab:
```javascript
$('a:external').attr('target','_blank');
```

**Use $.href to create <a> elements quickly for further manipluation:**

```javascript
$.href('www.google.com');    // jQuery set containing an <a> element with href www.google.com
$.href();                    // jQuery set containing an <a> element with href of the current URL


// start with current URL, change a query param, force protocol to https, and alert the resulting URL
alert($.href().href('query',{foo:'bar'}).href('protocol','https').href('href'));
```

**Utility function to get the site homepage:**

```javascript
$.href.home();  // jQuery set containing an <a> element with href of the current URL with the path, query and hash all removed
```

**Utility function for comparing links:**

If we're on `http://www.example.com/egg` and have `<a id="myLink" href="/bacon">click here</a>`

```javascript
$.href.linkEquals('/toast/','http://www.example.com/toast/');        // true - strings interpreted as links and normalized
$.href.linkEquals('?foo=bar','http://www.example.com/egg/?foo=bar'); // true - strings interpreted as links and normalized
$.href.linkEquals('/bacon/', $('#myLink'));                          // true - first element of jquery set used, if it's a link
$.href.linkEquals('/bacon/', document.getElementById('myLink'));     // true - DOM elements also ok, if it's a link
```


