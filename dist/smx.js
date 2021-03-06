/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

// EXPOSE
var _sizzle = window.Sizzle;

Sizzle.noConflict = function() {
	if ( window.Sizzle === Sizzle ) {
		window.Sizzle = _sizzle;
	}

	return Sizzle;
};

if ( true ) {
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return Sizzle; }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
// Sizzle requires that there be a global window in Common-JS like environments
} else if ( typeof module !== "undefined" && module.exports ) {
	module.exports = Sizzle;
} else {
	window.Sizzle = Sizzle;
}
// EXPOSE

})( window );


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _NodeCore = __webpack_require__(10);

var _NodeCore2 = _interopRequireDefault(_NodeCore);

var _NodeTraversal = __webpack_require__(11);

var _NodeTraversal2 = _interopRequireDefault(_NodeTraversal);

var _NodeAttributes = __webpack_require__(12);

var _NodeAttributes2 = _interopRequireDefault(_NodeAttributes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @memberof smx
 * @mixes Node-Core
 * @mixes Node-Attributes
 * @mixes Node-Traversal
 *
 * @description
 * The Node class wraps an XMLNode and provides an easy to use api
 * to interact with it.
 *
 * This class can be further extended by mixins from custom modules.
 */
var Node = function () {

  /**
   * @constructor
   * @param {XMLNode} xmlNode
   */
  function Node(xmlNode) {
    _classCallCheck(this, Node);

    //require nodeType === 1 --> Node.ELEMENT_NODE
    if (xmlNode.nodeType !== 1) throw new Error('Node constructor requires ELEMENT_NODE');

    /**
     * Original XMLNode for reference
     * @type {XMLNode}
     * @protected
     */
    this[0] = xmlNode;
  }

  /**
   * Direct access to XMLNode's id attribute.
   * @type {String}
   * @readonly
   */


  _createClass(Node, [{
    key: 'id',
    get: function get() {
      return this[0].getAttribute('id');
    }

    /**
     * Direct access to XMLNode name
     * @type {String}
     * @readonly
     */

  }, {
    key: 'name',
    get: function get() {
      return this[0].nodeName;
    }

    /**
     * Gets node name based on inner XMLNode.nodeName,
     * default is `smx`, posible values are `txt`, `md`, `html`, ...
     * @type {String}
     * @readonly
     */

  }, {
    key: 'type',
    get: function get() {
      if (this[0].getAttribute) return this[0].getAttribute('type') || 'smx';else return 'smx';
    }

    /**
     * Gets node className based on inner XMLNode class attribute
     * @type {String}
     * @readonly
     */

  }, {
    key: 'className',
    get: function get() {
      if (this[0].getAttribute) return this[0].getAttribute('class');else return '';
    }

    /**
     * Gets the owner SMXDoxument
     * @type {SMXDocument}
     * @readonly
     */

  }, {
    key: 'document',
    get: function get() {
      return this._document;
    }

    /**
     * Gets browser url hash
     * @type {String}
     * @readonly
     */

  }, {
    key: 'hash',
    get: function get() {
      return '#!/' + this.uri;
    }

    /**
     * Gets Uniform Resource Identifier.
     * Concatenation of id values from parent nodes up to document root
     * @type {String}
     * @readonly
     */

  }, {
    key: 'uri',
    get: function get() {
      var hash = this.id + '/';
      if (this.parent) return this.parent.uri + hash;else return hash;
    }

    /**
     * Gets Uniform Resource Locator
     * Concatenation of path values from parent nodes up to document root
     * @type {String}
     * @readonly
     */

  }, {
    key: 'url',
    get: function get() {

      var path = this[0].getAttribute('path');
      var result;
      if (this.parent) {
        if (!path) result = this.parent.url;else {
          //add trail slash
          var trail = path.substr(-1);
          if (trail != '/') path += '/';
          result = this.parent.url + path;
        }
      } else {
        if (path) {
          //add trail slash
          var _trail = path.substr(-1);
          if (_trail != '/') path += '/';
          result = path;
        }
      }

      //remove double slashes
      if (result) result = result.replace(/(https?:\/\/)|(\/)+/g, "$1$2");

      return result;
    }

    /**
     * Gets source file url for this node
     * @type {String}
     * @readonly
     */

  }, {
    key: 'src',
    get: function get() {

      var result = '';
      var file = this[0].getAttribute('file');

      if (!file) result = this.parent ? this.parent.src : undefined;else result = this.url + file;

      //remove double slashes
      if (result) result = result.replace(/(https?:\/\/)|(\/)+/g, "$1$2");

      return result;
    }

    /**
     * Gets parent node
     * @type {SMXNode}
     * @readonly
     */

  }, {
    key: 'parent',
    get: function get() {
      return this.document.wrap(this[0].parentNode);
    }

    /**
     * Gets ancestors nodes, ordered from outer to inner.
     * @type {SMXNode[]}
     * @readonly
     */

  }, {
    key: 'ancestors',
    get: function get() {
      var a = [];
      var p = this;
      while (p.parent) {
        p = p.parent;
        a.unshift(p);
      }
      return a;
    }

    /**
     * Gets root node
     * @type {SMXNode}
     * @readonly
     */

  }, {
    key: 'root',
    get: function get() {
      return this.ancestors[0] || this;
    }

    /**
     * Gets children nodes
     * @type {SMXNode[]}
     * @readonly
     */

  }, {
    key: 'children',
    get: function get() {
      //non smx nodes should have no children
      if (this.type !== 'smx') return [];else return this.document.wrap(this[0].childNodes);
    }

    /**
     * Gets first child node
     * @type {SMXNode}
     * @readonly
     */

  }, {
    key: 'first',
    get: function get() {
      return this.children.shift();
    }

    /**
     * Gets last child node
     * @type {SMXNode}
     * @readonly
     */

  }, {
    key: 'last',
    get: function get() {
      return this.children.pop();
    }

    /**
     * Gets previous sibling node
     * @type {SMXNode}
     * @readonly
     */

  }, {
    key: 'previous',
    get: function get() {
      return this.document.wrap(this[0].previousElementSibling || this[0].previousSibling);
    }

    /**
     * Gets next sibling node
     * @type {SMXNode}
     * @readonly
     */

  }, {
    key: 'next',
    get: function get() {
      return this.document.wrap(this[0].nextElementSibling || this[0].nextSibling);
    }
  }]);

  return Node;
}();

//import Node extensions


//extends Node prototype
_extends(Node.prototype, _NodeCore2.default);
_extends(Node.prototype, _NodeTraversal2.default);
_extends(Node.prototype, _NodeAttributes2.default);

exports.default = Node;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _sizzle = __webpack_require__(0);

var _sizzle2 = _interopRequireDefault(_sizzle);

var _eventify = __webpack_require__(3);

var _eventify2 = _interopRequireDefault(_eventify);

var _IdAttributeProcessor = __webpack_require__(9);

var _IdAttributeProcessor2 = _interopRequireDefault(_IdAttributeProcessor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @memberof smx
 * @desc
 * The Loader class loads, parses, and transforms XML data
 * from multiple sources.
 *
 * The Loader can load data from valid XMLDocument sources,
 * p.e. from an url, an XJSON oject or an XMLDocument object.
 * The Loader can also load asyc and merge recursively new content from
 * other valid sources, url or objects.
 *
 * ### Reserved XML: `<include>`
 */
var Loader = function () {

  /** @constructor */
  function Loader() {
    _classCallCheck(this, Loader);

    //extend with events on, off, trigger
    _eventify2.default.enable(this);

    // XML Document Object
    this.xmlDocument = null;

    /**
     * @member {XMLHttpRequest}
     * @desc xhr controller for file requests
     * @private
     */
    this.xhr = null;
  }

  /**
   * Loads the resource for the given url.
   * @param {String} url
   * @async
   * @trigger smx.Loader:event:complete
   * @trigger smx.Loader:event:error
   */


  Loader.prototype.load = function load(url) {

    var onSuccess = this.onLoadFileSuccess.bind(this);
    var onError = this.onLoadFileError.bind(this);

    this.xhr = new XMLHttpRequest();
    this.xhr.open('GET', url, true);
    this.xhr.onreadystatechange = function (evt) {

      if (this.readyState !== 4) return;
      if (this.status >= 200 && this.status < 400) onSuccess(evt.target);else onError(evt.target);
    };
    this.xhr.send();

    return;
  };

  Loader.prototype.onLoadFileSuccess = function onLoadFileSuccess(xhr) {

    log('> ' + xhr.responseURL + ' ' + xhr.status + ' (' + xhr.statusText + ')');
    //log( xhr.responseText);
    //var ext = xhr.responseURL.split('.').pop();

    //detect if already exist xml root node
    var is_root = !this.xmlDocument ? true : false;

    if (is_root) {

      //resolve as error if first loaded file is not a valid XMLDocument
      if (!xhr.responseXML) throw new Error('Invalid XML root');

      //set xml root document
      this.xmlDocument = xhr.responseXML;

      //ignore XMLDocument and other unwanted nodes like comments, text, ...
      //get just the root XMLElement as lastChild in document
      var node = this.xmlDocument.lastChild;

      resolvePathFileAttributes(node, xhr.responseURL);
    } else {

      //get 1st <include> found in current XMLDocument
      var include = (0, _sizzle2.default)('include[loading="true"]', this.xmlDocument)[0];

      //resolve if just loaded data is an XML document or not
      var isXml = xhr.responseXML ? true : false;

      //ignore XMLDocument and other unwanted nodes like comments, text, ...
      //get just the root XMLElement as lastChild in document
      var new_node = xhr.responseXML ? xhr.responseXML.lastChild : null;

      //not xml? create a new xml node to wrap the loaded data
      if (!new_node) {

        //resolves new node name based on include's name attribute
        //defaults to generic the nodeName `node`
        var nodeName = include.getAttribute('name') || 'node';

        //get just loaded data
        var data = xhr.responseText;

        //autodetect data type based on just loaded file extension
        var type = include.getAttribute('src').split('.').pop();

        //create new data node
        new_node = createDataNode(this.xmlDocument, nodeName, data, type);
      }

      //resolve 'path' and 'file' attributes from original 'src'
      resolvePathFileAttributes(new_node, include.getAttribute('src'));

      //copy attributes from include node to the new node
      copyAttributes(include, new_node);

      //replace include node with the new node
      include.parentNode.replaceChild(new_node, include);
    }

    var inc = parseIncludes(this.xmlDocument);

    if (inc) {

      //flag include node as loading
      inc.setAttribute('loading', 'true');

      //get include target url
      var url = inc.getAttribute('src') || '';

      //replace @lang keyword in src
      //if(url.indexOf('@lang')>=0) url = url.replace(/@lang/g, this.options.lang);

      //resolve full url
      var ref = inc;
      while (ref.parentNode) {
        var parent = ref.parentNode;
        var path = parent.getAttribute ? parent.getAttribute('path') || '' : '';
        url = path + url;
        ref = parent;
      }

      this.load(url);
    } else this.onLoadXMLComplete();

    return;
  };

  Loader.prototype.onLoadFileError = function onLoadFileError(xhr) {

    log('> ' + xhr.responseURL + '" ' + xhr.status + ' (' + xhr.statusText + ')');
    this.trigger('error', xhr.responseText);
  };

  Loader.prototype.onLoadXMLComplete = function onLoadXMLComplete() {

    //ensure all nodes have unique id
    _IdAttributeProcessor2.default.process(this.xmlDocument);

    //trigger complete event
    this.trigger('complete', this.xmlDocument);

    return;
  };

  Loader.prototype.XML2str = function XML2str(xmlNode) {

    try {
      // Gecko/Webkit-based browsers (Firefox, Chrome, Opera...
      return new XMLSerializer().serializeToString(xmlNode);
    } catch (e) {
      try {
        // Internet Explorer.
        return xmlNode.xml;
      } catch (e) {
        //Other browsers without XML Serializer
        alert('XMLSerializer not supported');
      }
    }

    return '';
  };

  Loader.prototype.str2XML = function str2XML(str) {

    var xml = null;

    if (global.ActiveXObject) {

      xml = new ActiveXObject('Microsoft.XMLDOM');
      xml.async = 'false';
      xml.loadXML(str);
    } else {

      var parser = new DOMParser();
      xml = parser.parseFromString(str, 'text/xml');
    }

    return xml;
  };

  return Loader;
}();

//
//  PRIVATE HELPER METHODS
//

var copyAttributes = function copyAttributes(srcNode, targetNode) {

  var ignoreAttributes = ['src', 'path', 'file'];

  var attrs = srcNode.attributes;

  for (var i = 0; i < attrs.length; i++) {

    var name = attrs[i].name;
    var value = attrs[i].value;

    if (ignoreAttributes.indexOf(name) < 0) {
      var attr = targetNode.getAttribute(name);
      if ((typeof attr === 'undefined' ? 'undefined' : _typeof(attr)) === undefined || attr === null || attr === false) targetNode.setAttribute(name, value);
    }
  }

  return targetNode;
};

var resolvePathFileAttributes = function resolvePathFileAttributes(xmlNode, url) {

  //get src string from xmlNode attribute or given url
  var src = url ? url : xmlNode.getAttribute('src');

  //declare resultant attribute values
  var path, file;

  //no src string? just ignore..
  if (!src) return xmlNode;

  //split by slashes
  src = src.split('/');

  //if multipart, last is file
  if (src.length > 0) file = src.pop();

  //join path parts
  path = src.join('/') + '/';

  //set inlcuded xmlNode core attributes
  if (path) xmlNode.setAttribute('path', path);
  if (file) xmlNode.setAttribute('file', file);

  return xmlNode;
};

var createDataNode = function createDataNode(xmlDocument, nodeName, data, type) {
  var node = xmlDocument.createElement(nodeName);
  var cdata = xmlDocument.createCDATASection(data);
  node.appendChild(cdata);
  node.setAttribute('type', type || 'cdata');
  return node;
};

var parseIncludes = function parseIncludes(xmlDocument) {

  var inc;

  //find all existing <include> nodes
  var includes = (0, _sizzle2.default)('include', xmlDocument);

  //iterate and filter includes
  while (!inc && includes.length > 0) {

    var follow = true;

    //get first include found
    inc = includes.shift();

    //FILTER BY LANG ATTR
    //attribute lang must match options lang
    //var inc_lang = inc.getAttribute('lang');
    //if(inc_lang && inc_lang!=this.options.lang) follow = false;

    //FILTER BY IGNORE ATTR
    //exclude if ignore attribute is defined and != false
    var inc_ignore = inc.getAttribute('ignore');
    if (inc_ignore === 'true') follow = false;

    if (!follow) {
      inc.parentNode.removeChild(inc);
      inc = null;
    }
  }

  return inc;
};

/**
 * Fired when loading completes sucessfully.
 * @event complete
 * @memberof smx.Loader
 * @return {XMLDocument}
 */

/**
 * Fired when loading fails
 * @event error
 * @memberof smx.Loader
 * @return {Object}
 */

exports.default = Loader;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// Eventify
// -----------------
// Copyright(c) 2010-2012 Jeremy Ashkenas, DocumentCloud
// Copyright(c) 2014 Bermi Ferrer <bermi@bermilabs.com>
// Copyright(c) 2013 Nicolas Perriault

// MIT Licensed


// A module that can be mixed in to *any object* in order to provide it with
// custom events. You may bind with `on` or remove with `off` callback functions
// to an event; trigger`-ing an event fires all callbacks in succession.
//
//     var object = {};
//     Eventify.enable(object);
//     object.on('expand', function(){ alert('expanded'); });
//     object.trigger('expand');
(function (name, global, definition) {
  if (true) {
    module.exports = definition(name, global);
  } else if (typeof define === 'function' && typeof define.amd === 'object') {
    define(definition);
  } else {
   //  global[name] = definition(name, global);
    var self = definition(),

    // Save the previous value of the `Eventify` variable.
    prev = global[name];

    // Run Eventify in *noConflict* mode, returning the `Eventify`
    // variable to its previous owner. Returns a reference to
    // the Eventify object.
    self.noConflict = function () {
      global[name] = prev;
      return self;
    };

    global[name] = self;
  }

}(this.localEventifyLibraryName || "Eventify", this, function () {
  'use strict';

  // Eventify, based on Backbone.Events
  // -----------------


  function uniqueId(prefix) {
    idCounter = idCounter + 1;
    var id = idCounter + '';
    return prefix ? prefix + id : id;
  }

  function once(func) {
    var ran = false,
      memo;
    return function () {
      if (ran) {
        return memo;
      }
      var args = (arguments.length === 1 ?
              [arguments[0]] : Array.apply(null, arguments));
      ran = true;
      memo = func.apply(this, args);
      func = null;
      return memo;
    };
  }

  var EventifyInstance,
    listenMethods = {
      listenTo: 'on',
      listenToOnce: 'once'
    },
    slice = Array.prototype.slice,
    idCounter = 0,

    // Regular expression used to split event strings
    eventSplitter = /\s+/,

    // Defines the name of the local variable the Eventify library will use
    // this is specially useful if window.Eventify is already being used
    // by your application and you want a different name. For example:
    //    // Declare before including the Eventify library
    //    var localEventifyLibraryName = 'EventManager';

    // Create a safe reference to the Eventify object for use below.
    Eventify = function () {
      return this;
    };

  Eventify.prototype = {

    // Event Functions
    // -----------------

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function (name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) {
        return this;
      }
      this._events = this._events || {};
      var events = this._events[name] || (this._events[name] = []);
      events.push({
        callback: callback,
        context: context,
        ctx: context || this
      });
      return this;
    },


    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function (name, callback, context) {
      var self = this,
        onceListener;

      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) {
        return this;
      }

      onceListener = once(function () {
        self.off(name, onceListener);
        var args = (arguments.length === 1 ?
                [arguments[0]] : Array.apply(null, arguments));
        callback.apply(this, args);
      });

      onceListener._callback = callback;
      return this.on(name, onceListener, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function (name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) {
        return this;
      }
      if (!name && !callback && !context) {
        this._events = {};
        return this;
      }

      names = name ? [name] : Object.keys(this._events);
      for (i = 0, l = names.length; i < l; i += 1) {
        name = names[i];
        events = this._events[name];
        if (events) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j += 1) {
              ev = events[j];
              if ((callback &&
                  callback !== ev.callback &&
                  callback !== ev.callback._callback) ||
                (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) {
            delete this._events[name];
          }
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function () {
      if (!this._events) {
        return this;
      }
      // #6 arguments should not be leaked in order to allow V8 optimizations.
      // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers
      var args = (arguments.length === 1 ?
              [arguments[0]] : Array.apply(null, arguments));

      var events, allEvents;
      var name = args[0];
      var extraArgs = args.slice(1);
      if (!eventsApi(this, 'trigger', name, extraArgs)) {
        return this;
      }
      events = this._events[name];
      allEvents = this._events.all;
      if (events) {
        triggerEvents(events, extraArgs);
      }
      if (allEvents) {
        triggerEvents(allEvents, args);
      }
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function (obj, name, callback) {
      var deleteListener, id,
        listeners = this._listeners;
      if (!listeners) {
        return this;
      }
      deleteListener = !name && !callback;
      if (typeof name === 'object') {
        callback = this;
      }
      listeners = {};
      if (obj) {
        listeners[obj._listenerId] = obj;
      }
      for (id in listeners) {
        if (listeners.hasOwnProperty(id)) {
          listeners[id].off(name, callback, this);
          if (deleteListener) {
            delete this._listeners[id];
          }
        }
      }
      return this;
    },

  };



  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  function eventsApi(obj, action, name, rest) {
    var key, i, l, names;

    if (!name) {
      return true;
    }

    // Handle event maps.
    if (typeof name === 'object') {
      for (key in name) {
        if (name.hasOwnProperty(key)) {
          obj[action].apply(obj, [key, name[key]].concat(rest));
        }
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      names = name.split(eventSplitter);
      for (i = 0, l = names.length; i < l; i += 1) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  }

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).

  function triggerEvents(events, args) {
    var ev,
      i = 0,
      l = events.length,
      a1 = args[0],
      a2 = args[1],
      a3 = args[2];
    switch (args.length) {
    case 0:
      while (i < l) {
        ev = events[i];
        ev.callback.call(ev.ctx);
        i += 1;
      }
      return;
    case 1:
      while (i < l) {
        ev = events[i];
        ev.callback.call(ev.ctx, a1);
        i += 1;
      }
      return;
    case 2:
      while (i < l) {
        ev = events[i];
        ev.callback.call(ev.ctx, a1, a2);
        i += 1;
      }
      return;
    case 3:
      while (i < l) {
        ev = events[i];
        ev.callback.call(ev.ctx, a1, a2, a3);
        i += 1;
      }
      return;
    default:
      while (i < l) {
        ev = events[i];
        ev.callback.apply(ev.ctx, args);
        i += 1;
      }
    }
  }


  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  Object.keys(listenMethods).forEach(function (method) {
    var implementation = listenMethods[method];
    Eventify.prototype[method] = function (obj, name, callback) {
      var id,
        listeners = this._listeners || (this._listeners = {});
      obj._listenerId = obj._listenerId || uniqueId('l');
      id = obj._listenerId;
      listeners[id] = obj;
      if (typeof name === 'object') {
        callback = this;
      }
      obj[implementation](name, callback, this);
      return this;
    };
  });


  // Export an Eventify instance for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `Eventify` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  EventifyInstance = new Eventify();

  EventifyInstance.version = "2.0.0";


  // Utility Functions
  // -----------------


  // Adds the methods on, off and trigger to a target Object
  EventifyInstance.enable = function enable(target) {
    var i, len,
      methods = Object.keys(Eventify.prototype);
    target = target || {};
    for (i = 0, len = methods.length; i < len; i = i + 1) {
      target[methods[i]] = this[methods[i]];
    }
    return target;
  };

  EventifyInstance.create = function () {
    return Object.create(Eventify.prototype);
  };

  // Backbone.Events drop in replacement compatibility
  EventifyInstance.mixin = EventifyInstance.enable;

  // Expose prototype so other objects can extend it
  EventifyInstance.proto = Eventify.prototype;

  // Sets Eventify on the browser window or on the process
  return EventifyInstance;

  // Establish the root object, `window` in the browser,
  // or `global` on the server.
}));


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sizzle = __webpack_require__(0);

var _sizzle2 = _interopRequireDefault(_sizzle);

var _Node = __webpack_require__(1);

var _Node2 = _interopRequireDefault(_Node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @memberof smx
 * @desc
 * The Document class wraps an XMLDocument and provides an easy to use api
 * to interact with it and its contents.
 *
 * This class can be further extended by mixins from custom modules.
 */
var Document = function () {

  /**
   * @param {XMLDocument}
   */
  function Document(xmlDocument) {
    _classCallCheck(this, Document);

    //requires DOCUMENT_NODE
    if (xmlDocument.nodeType !== 9) throw new Error('Document constructor requires DOCUMENT_NODE');

    /**
     * Original XMLDocument for reference
     * @type {XMLDocument}
     * @protected
     */
    this[0] = xmlDocument;

    /**
     * Contains an id &rarr; key map of all processed nodes for easy acccess.
     * @type {Object}
     * @private
     */
    this._cache = {};

    /**
     * Namespace for storing custom modules data.
     * @type {Object}
     * @private
     */
    this._data = {};
  }

  /**
   * Gets Uniform Resource Locator
   * Concatenation of path values from parent nodes up to document root
   * @type {String}
   * @readonly
   */


  /**
   * Gets the node with the given identifier.
   * @param {String} id
   * @return {smx.Node}
   */
  Document.prototype.getNodeById = function getNodeById(id) {

    //cached id?
    if (this._cache[id]) return this._cache[id];

    //search in document
    var xmlNode = this[0].getElementById(id);

    //not found
    return this.wrap(xmlNode);
  };

  //gid(id){ return this.getNodeById(id) }

  /**
   * Finds all nodes matching the given selector.
   * @param {String} selector - search selector
   * @param {smx.Node=} context - node context to find inside
   * @return {Array.<smx.Node>}
   */


  Document.prototype.find = function find(selector, ctxNode) {

    if (!selector) return [];
    var nodes = (0, _sizzle2.default)(selector, (ctxNode || this)[0]);
    return this.wrap(nodes);
  };

  /**
   * Wraps an existing node or nodes in smx paradigm.
   * @param {XMLNode|XMLNode[]}
   * @return {smx.Node|smx.Node[]}
   */


  Document.prototype.wrap = function wrap(s) {

    if (!s) return;

    var _this = this;
    var _wrapNode = function _wrapNode(xmlNode) {

      var id;

      //tries getting an id attribute
      try {
        id = xmlNode.getAttribute('id');
      } catch (e) {}

      //id attr is required!
      if (!id) return;

      //ensure using the active document
      if (xmlNode.ownerDocument !== _this[0]) return;

      //Does already exists a node with this id?
      //prevent duplicated nodes and return existing one
      if (_this._cache[id]) return _this._cache[id];

      //create new Node from given XMLNode
      var node = new _Node2.default(xmlNode);

      //reference node owner document
      node._document = _this;

      //adds wrapped node in cache
      _this._cache[id] = node;

      //return wrapped node
      return node;
    };

    var isArray = s.constructor.name === 'Array' || s.length >= 0;
    var isNodeList = s.constructor.name === 'NodeList';
    if (isArray || isNodeList) {
      //NodeList does not allow .map
      //force array so we can do the mapping
      //s = Array.prototype.slice.call(s);
      return [].map.call(s, function (n) {
        return n[0] ? n : _wrapNode(n);
      });
    } else {
      return s[0] ? s : _wrapNode(s);
    }
  };

  _createClass(Document, [{
    key: 'path',
    get: function get() {
      var path = this[0].URL.split('/');
      path.pop();return path.join('/');
    }

    /**
     * Gets the source file url for this document.
     * @type {String}
     * @readonly
     */

  }, {
    key: 'src',
    get: function get() {
      return this[0].URL;
    }

    /**
     * Gets the root node.
     * @type {smx.Node}
     * @readonly
     */

  }, {
    key: 'root',
    get: function get() {
      return this.wrap(this[0].lastChild);
    }
  }]);

  return Document;
}();

//expose
//smx.Document = Document;

exports.default = Document;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _smx = __webpack_require__(6);

var _smx2 = _interopRequireDefault(_smx);

var _Loader = __webpack_require__(2);

var _Loader2 = _interopRequireDefault(_Loader);

var _Node = __webpack_require__(1);

var _Node2 = _interopRequireDefault(_Node);

var _Document = __webpack_require__(4);

var _Document2 = _interopRequireDefault(_Document);

var _Playhead = __webpack_require__(13);

var _Playhead2 = _interopRequireDefault(_Playhead);

var _index = __webpack_require__(14);

var _index2 = _interopRequireDefault(_index);

var _index3 = __webpack_require__(19);

var _index4 = _interopRequireDefault(_index3);

var _index5 = __webpack_require__(22);

var _index6 = _interopRequireDefault(_index5);

var _index7 = __webpack_require__(25);

var _index8 = _interopRequireDefault(_index7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_smx2.default.Loader = _Loader2.default;
_smx2.default.Document = _Document2.default;
_smx2.default.Node = _Node2.default;
_smx2.default.Playhead = _Playhead2.default;

_smx2.default.registerModule(_index2.default);
_smx2.default.registerModule(_index4.default);
_smx2.default.registerModule(_index6.default);
_smx2.default.registerModule(_index8.default);

//expose global
window.smx = _smx2.default;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _smxLoad = __webpack_require__(7);

var _smxLoad2 = _interopRequireDefault(_smxLoad);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @namespace smx
 * @version 2.1
 * @desc
 * Global `smx` namespace, one namespace to hold the whole framework.
 *
 * The smx namespace can serves also as namespace function, see {@link smx.smx smx()}.
 */
var smx = function smx() {
  return _smx_wrapper.apply(smx, arguments);
};

/**
 * Gets current framework version.
 * @memberof smx
 * @type {String}
 * @protected
 */
smx.version = '0.8.14';

/**
 * Current active document.
 * @memberof smx
 * @type {smx.Document}
 * @protected
 */
smx.document = null;

/**
 * Array of loaded documents.
 * @memberof smx
 * @type {smx.Document[]}
 * @protected
 */
smx.documents = [];

/**
 * Namescape for custom modules, may extend smx core Classes and provide
 * new processing layers to be applied during the XML loading process.
 * This array is protected and should be controlled only be the registerModule method.
 * @memberof smx
 * @type {Array}
 * @protected
 */
smx.modules = [];

/**
 * Registers a new module. Will add it to modules collection and will also
 * extend smx core classes if the module defines any extension.
 */
smx.registerModule = function (m) {

  //dumb check...
  if (!m) return;

  //add it to modules collection
  this.modules.push(m);

  //register process function
  if (m.process) smx.processors.push(m.process);

  //extend SMXNode
  if (m.Node) _extends(smx.Node.prototype, m.Node);

  //extend SMXDocument
  if (m.Document) _extends(smx.Document.prototype, m.Document);

  //return the registerd module as success
  return m;
};

/**
* @method smx
* @param {String|smx.Node|smx.Node[]} [s]
* @return {smx.Node|smx.Nodes[]}
* @memberof smx
* @static
* @desc
* Global node wrapper, an useful shortcut for interacting with the current
* active document.
*
* Notice that this method is a namespace function, is private inner function
* attached directly onto smx namespace. Dont try to call this function as a
* namespace member, use the `smx` namespace itself as a function.
*
* If the required parameter is a CSS selector string will return a collection
* of {@link smx.Node Nodes} matching the given selector as a result of calling
* {@link smx.Document#find Document.find} on the current active document.
*
* If the paramater is single or array of XMLNode will return the input nodes
* wrapped as smx Nodes.
* Additionally if input are already smx Nodes will return already cached Nodes,
* so don't be afraid about rewraping nodes using this wrapper.
*
* @example
* //use it as a namespace function.
* smx('library > book');
* // => [SMXNode, SMXNode, SMXNode, ...]
*
* //not like this
* smx.smx('library > book');
* // => Error: smx.smx is not a Function.
*/
var _smx_wrapper = function _smx_wrapper(s) {

  //require an active document
  if (!smx.document) return;

  //no arguments? do nothing...
  if (!s) return;

  //string? should be a selector search
  if (typeof s === 'string') {

    //require an active document instance
    if (!smx.document) return [];

    //use given selector to find in active document
    return smx.document.find(s);
  }

  return smx.document.wrap(s);
};

smx.load = _smxLoad2.default;

exports.default = smx;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Loader = __webpack_require__(2);

var _Loader2 = _interopRequireDefault(_Loader);

var _Document = __webpack_require__(4);

var _Document2 = _interopRequireDefault(_Document);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DATA;
var PROCESSOR_INDEX;

/**
 * Loads a new smx document.
 * @memberof smx
 * @method load
 * @param {String} url
 * @param {smx~onLoadSuccess} onSuccess
 * @param {smx~onLoadError} onError
 * @async
 */
var LOAD = function LOAD(data, success, error) {

	if (!data) return;

	//conditional loading should check for multiple data source types
	//from url file as xml or json file... from xmlNode... from json object...
	//for now just proceed assuming an url for an xml file
	SUCCESS_CALLBACK = success || function () {};
	ERROR_CALLBACK = error || function () {};

	DATA = {};
	PROCESSOR_INDEX = 0;

	if (typeof data === 'string') LOAD_SMX_DOCUMENT(data);else LOAD_SMX_DOCUMENT_FROM_JSON(data);
};

/**
 * Callback function when loading completes succefully.
 * @callback smx~onLoadSuccess
 * @param {SMXDocument} document - Just loaded document
 */
var SUCCESS_CALLBACK = function SUCCESS_CALLBACK(document) {};

/**
 * Callback function used loading throws an error.
 * @callback smx~onLoadError
 * @param {Error} error - Error object
 */
var ERROR_CALLBACK = function ERROR_CALLBACK(e) {};

var LOAD_SMX_DOCUMENT = function LOAD_SMX_DOCUMENT(url) {
	var loader = new _Loader2.default();
	loader.on('complete', APPLY_PROCESSORS);
	loader.on('error', LOAD_SMX_ERROR);
	loader.load(url);
};

var LOAD_SMX_DOCUMENT_FROM_JSON = function LOAD_SMX_DOCUMENT_FROM_JSON(data) {
	var x2js = new X2JS();
	var xmlDocument = x2js.json2xml(data);
	APPLY_PROCESSORS(xmlDocument);
};

var APPLY_PROCESSORS = function APPLY_PROCESSORS(xmlDocument) {
	var xml = xmlDocument;
	var processor = smx.modules[PROCESSOR_INDEX].Processor;
	if (processor) {
		processor(xml, function (data) {
			if (data) _extends(DATA, data);
			PROCESSOR_INDEX++;
			APPLY_PROCESSORS(xml);
		});
	} else {
		CLEAN_TEXT_NODES(xml);
	}
};

var CLEAN_TEXT_NODES = function CLEAN_TEXT_NODES(xml) {

	var count = 0;

	function clean(node) {

		for (var n = 0; n < node.childNodes.length; n++) {

			var child = node.childNodes[n];

			//	1	ELEMENT_NODE
			//	2	ATTRIBUTE_NODE
			//	3	TEXT_NODE
			//	4	CDATA_SECTION_NODE
			//	5	ENTITY_REFERENCE_NODE
			//	6	ENTITY_NODE
			//	7	PROCESSING_INSTRUCTION_NODE
			//	8	COMMENT_NODE
			//	9	DOCUMENT_NODE
			//	10	DOCUMENT_TYPE_NODE
			//	11	DOCUMENT_FRAGMENT_NODE
			//	12	NOTATION_NODE

			var isElementNode = function isElementNode(n) {
				return n.nodeType === 1;
			};
			var isCommentNode = function isCommentNode(n) {
				return n.nodeType === 8;
			};
			var isEmptyTextNode = function isEmptyTextNode(n) {
				return n.nodeType === 3 && !/\S/.test(n.nodeValue);
			};

			if (isCommentNode(child) || isEmptyTextNode(child)) {
				node.removeChild(child);
				count++;
				n--;
			} else if (isElementNode(child)) {
				clean(child);
			}
		}
	}

	clean(xml);

	log('CLEANING XML: ' + count + ' nodes removed');

	CREATE_SMX_DOCUMENT(xml);
};

var CREATE_SMX_DOCUMENT = function CREATE_SMX_DOCUMENT(xml) {

	log('smx load complete!');

	var d = new _Document2.default(xml);

	_extends(d._data, DATA);

	smx.documents.push(d);

	//set it as active document if its empty
	if (!smx.document) smx.document = d;

	SUCCESS_CALLBACK(d);
};

var LOAD_SMX_COMPLETE = function LOAD_SMX_COMPLETE(smxDocument) {

	SUCCESS_CALLBACK(d);

	return;
};

var LOAD_SMX_ERROR = function LOAD_SMX_ERROR(e) {

	log('smx load error: ' + e);

	ERROR_CALLBACK(e);

	return;
};

exports.default = LOAD;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sizzle = __webpack_require__(0);

var _sizzle2 = _interopRequireDefault(_sizzle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 *	util method
 *	GET_UNIQUE_ID
 *	returns unique base36 ids strings [0-9]+[a-z]
 *
 *	based on incremental integer starting at 0
 *	Native Intger.toString only handles up base 36
 *
 *  base36 [0-9]+[a-z]
 *  base62 [0-9]+[a-z]+[A-Z] but requires BigInt.js!
 *
 */

var ID_INDEX = 0;
var GET_UNIQUE_ID = function GET_UNIQUE_ID() {
  ID_INDEX++;return parseInt(ID_INDEX).toString(36);
};
//const GET_UNIQUE_ID = ()=>{ return bigInt2str(str2bigInt(ID_INDEX+"",10,0,0),62) };


var IdAttributeProcessor = {

  /**
   * Parser name
   * @protected
   * @type {String}
   */
  name: 'Id',

  /**
   * Selector used to find nodes having matching attributes to be parsed
   * @protected
   * @type {String}
   */
  selector: ':not([id])',

  /**
   * Processor function
   * @static
   * @param {XMLDocument} xmlDocument
   * @return {XMLDocument}
   */
  process: function process(xmlDocument) {

    //get ids already in use inside xmlDocument
    var nodes_with_id_attr = (0, _sizzle2.default)('[id]', xmlDocument);
    var ids_in_use = nodes_with_id_attr.map(function (n) {
      return n.id;
    });

    //get nodes matching the parser selector
    var nodes = (0, _sizzle2.default)(this.selector, xmlDocument);

    //iterate over all matching nodes
    for (var i = 0, len = nodes.length; i < len; i++) {

      //get node
      var node = nodes[i];

      //generate an unique id for the node
      var id = GET_UNIQUE_ID();
      while (ids_in_use.indexOf(id) > 0) {
        id = GET_UNIQUE_ID();
      } //add new id to list
      ids_in_use.push(id);

      //set node id
      node.setAttribute('id', id);
    }

    log('ATTRIBUTE PROCESSOR: ID (' + nodes.length + ' nodes)');

    return xmlDocument;
  }

};

//expose to smx namespace
exports.default = IdAttributeProcessor;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sizzle = __webpack_require__(0);

var _sizzle2 = _interopRequireDefault(_sizzle);

var _Node = __webpack_require__(1);

var _Node2 = _interopRequireDefault(_Node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Extends {@link smx.Node Node} with core methods.
 * @mixin Node-Core
 * @see smx.Node
 */

var NodeCore = {

    /**
     * Gets the index position in parent's children. If node has no parent,
     * will return 0. When using the optional parameter `selector`, the
     * resultant index is calculated based only in the sibling nodes matching
     * the given selector, if node does not match the selector itself will
     * return -1.
     *
     * @memberof Node-Core
     * @param {String=} selector - filter selector
     * @return {Integer}
     */
    getIndex: function getIndex(selector) {

        //0 by default
        var index = 0;

        //no parent? its kind of root so it has no sibling nodes
        if (!this.parent) return index;

        //get sibling nodes
        var siblings = this.parent.children;

        //filter siblings collection with a css selector if its defined
        if (selector) siblings = siblings.filter(function (s) {
            return _sizzle2.default.matchesSelector(s[0], selector);
        });

        //get position in siblings collection
        index = siblings.indexOf(this);

        return index;
    },

    /**
     * Gets the text content.
     *
     * @memberof Node-Core
     * @return {String}
     */
    getText: function getText() {

        return this[0].text || this[0].textContent || '';
    },

    /**
     * Gets the html content.
     *
     * @memberof Node-Core
     * @return {String}
     */
    getHTML: function getHTML() {

        //get raw children XMLNodes
        var children = this[0].childNodes;

        //defaults to empty string
        var str = '';

        for (var i = 0, len = children.length; i < len; i++) {
            str += children[i].xml || new XMLSerializer().serializeToString(children[i]);
        }return str;
    },

    /**
     * Gets the inner data content formatted according to node type.
     *
     * @memberof Node-Core
     * @return {String}
     */
    getData: function getData() {

        //get raw text data
        var data = this.getText();

        //get data type
        var type = this.type;
        switch (this.type) {
            case 'json':
                try {
                    data = JSON.parse(data);
                } catch (e) {}
                break;
            default:
                break;
        }

        return data;
    },

    /**
     * Gets the string representation.
     *
     * @memberof Node-Core
     * @return {String}
     */
    toString: function toString() {

        return ('<' + this.name + ' id="' + this.id + '">').trim();
    },

    /**
     * Gets the Node as JSON Object representation.
     * @method toJSON
     * @memberof Node-Core
     * @return {Object}
     * @todo Not Implemented!
     */
    toJSON: function toJSON() {
        return {};
    }

};

exports.default = NodeCore;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sizzle = __webpack_require__(0);

var _sizzle2 = _interopRequireDefault(_sizzle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Extends {@link smx.Node Node} with tree traversal utility methods.
 * @mixin Node-Traversal
 * @see smx.Node
 */

var Traversal = {

  /**
   * Gets a list of all ancestor nodes matching the given selector, ordered from outer to inner.
   * @param {String} selector
   * @return {smx.Node[]}
   * @memberof Node-Traversal
   */
  getAncestors: function getAncestors(selector) {

    if (!selector) return this.ancestors;
    return this.ancestors.filter(function (n) {
      return n.isMatch(selector);
    });
  },

  // EXTRA - PARENT RELATED OPERATIONS

  /**
   * Checks if node is an ancestor of another.
   * @param {smx.Node} node - reference node
   * @return {Boolean}
   * @memberof Node-Traversal
   */
  isAncestorOf: function isAncestorOf(node) {

    if (!node.parent) return false;
    var ancestorsId = node.ancestors.map(function (n) {
      return n.id;
    });
    if (ancestorsId.indexOf(this.id) > -1) return true;else return false;
  },

  /**
   * Checks if node matches the given selector.
   * @param {String} selector - css selector to match
   * @return {Boolean}
   * @memberof Node-Traversal
   */
  isMatch: function isMatch(selector) {

    return _sizzle2.default.matchesSelector(this[0], selector);
  },

  // CHILD RELATED OPERATIONS

  /**
   * Finds all descendant nodes matching the given selector.
   * @param {String} selector - search selector
   * @return {Array.<Node>}
   * @memberof Node-Traversal
   */
  find: function find(selector) {

    if (!selector) return [];
    if (!this.children.length) return [];

    return this.document.find(selector, this);
  },

  /**
   * This method is like `find` but returns only the first result.
   * @param {String} selector - search selector
   * @return {smx.Node}
   * @memberof Node-Traversal
   */
  findOne: function findOne(selector) {

    return this.find(selector)[0];
  },

  /**
   * Gets the children nodes matching the given selector.
   * @param {String=} selector
   * @return {Array.<Node>}
   * @memberof Node-Traversal
   */
  getChildren: function getChildren(selector) {

    if (!selector) return this.children;

    return this.children.filter(function (n) {
      return n.isMatch(selector);
    });
  },

  /**
   * Gets the first child node matching the given selector.
   * @param {String=} selector
   * @return {smx.Node}
   * @memberof Node-Traversal
   */
  getFirst: function getFirst(selector) {

    if (!selector) return this.first;

    var children = this.children;
    var i = 0,
        len = children.length,
        result;
    while (i < len && !result) {
      if (children[i].isMatch(selector)) result = children[i];
      i++;
    }

    return result;
  },

  /**
   * Gets the last child node matching the given selector.
   * @param {String=} selector
   * @return {smx.Node}
   * @memberof Node-Traversal
   */
  getLast: function getLast(selector) {

    if (!selector) return this.last;

    var children = this.children.reverse();
    var i = 0,
        len = children.length,
        result;
    while (i < len && !result) {
      if (children[i].isMatch(selector)) result = children[i];
      i++;
    }

    return result;
  },

  // EXTRA - CHILD RELATED OPERATIONS

  /**
   * Gets child node at given index
   * @param {Integer} index - index position
   * @return {smx.Node}
   * @memberof Node-Traversal
   */
  getChildAt: function getChildAt(index) {

    return this.children[index];
  },

  /**
   * Checks if a node is child of another
   * @param {smx.Node} node - reference node
   * @return {Boolean}
   * @memberof Node-Traversal
   */
  isDescendantOf: function isDescendantOf(node) {

    if (!node.parent) return false;
    var ancestorsId = this.ancestors.map(function (n) {
      return n.id;
    });
    if (ancestorsId.indexOf(node.id) > -1) return true;else return false;
  },

  // SIBLING RELATED OPERATIONS


  /**
   * Gets the next sibling node matching the given selector.
   * @param {String=} selector - filter selector
   * @return {smx.Node}
   * @memberof Node-Traversal
   */
  getNext: function getNext(selector) {

    if (!selector) return this.next;else {
      var n = this.next;
      var isMatch = false;
      while (!isMatch && n) {
        if (n.isMatch(selector)) isMatch = true;else n = n.next;
      }
      return isMatch ? n : undefined;
    }
  },

  /**
   * Gets all next sibling nodes matching the given selector.
   * @param {String=} selector - filter selector
   * @return {smx.Node[]}
   * @memberof Node-Traversal
   */
  getAllNext: function getAllNext(selector) {

    if (!this.next) return [];else {
      //fill up nodes array walking all next nodes
      var n = this.next;
      var nodes = [n];
      while (n && n.next) {
        n = n.next;
        nodes.push(n);
      }
      if (!selector) return nodes;else //return filtered by selector
        return nodes.filter(function (n) {
          return n.isMatch(selector);
        });
    }
  },

  /**
   * Gets the previous sibling node matching the given selector.
   * @param {String=} selector - filter selector
   * @return {smx.Node}
   * @memberof Node-Traversal
   */
  getPrevious: function getPrevious(selector) {

    if (!selector) return this.previous;else {
      var n = this.previous;
      var isMatch = false;
      while (!isMatch && n) {
        if (n.isMatch(selector)) isMatch = true;else n = n.previous;
      }
      return isMatch ? n : undefined;
    }
  },

  /**
   * Gets all previous sibling nodes matching the given selector.
   * @param {String=} selector - filter selector
   * @return {smx.Node[]}
   * @memberof Node-Traversal
   */
  getAllPrevious: function getAllPrevious(selector) {

    if (!this.previous) return [];else {
      //fill up nodes array walking all previous nodes
      var n = this.previous;
      var nodes = [n];
      while (n && n.previous) {
        n = n.previous;
        nodes.unshift(n);
      }
      if (!selector) return nodes;else //return filtered by selector
        return nodes.filter(function (n) {
          return n.isMatch(selector);
        });
    }
  }

};

exports.default = Traversal;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Extends {@link smx.Node Node} with utility attribute getters.
 * @mixin Node-Attributes
 * @see smx.Node
 */

var NodeAttributes = {

    /**
     * Gets the value for the given attribute name.
     *
     * @memberof Node-Attributes
     * @param {String} name - attribute name
     * @return {String} value
     * @example
     * //<movie tags="sci-fi, horror, adventures" />
     * $movie.attr('tags')
     * // => "sci-fi, horror, adventures"
     */
    attr: function attr(name) {

        return this[0].getAttribute ? this[0].getAttribute(name) : undefined;
    },

    /**
     * This method is like `attr` but will use an attribute parser if there is
     * one predefined for the given attribute name.
     *
     * @memberof Node-Attributes
     * @param {String} name - attribute name
     * @param {Object=} opt - options to pass into attribute parser
     * @return {String} value
     */
    get: function get(name, opt) {

        if (!this[0].getAttribute) return undefined;

        //get an existing attribute parser for the given name
        var parser = smx.AttributeParsers[name];

        //no parser? return the raw attribute
        if (!parser) return this.attr(name);

        //else use the parser with the given options
        else return parser(name, opt);
    },

    /**
     * Checks if node has or not an attribute with the given name
     * @method has
     * @memberof Node-Attributes
     * @param {String} name - attribute name
     * @return {Boolean}
     */
    has: function has(name) {
        if (!this[0].getAttribute) return false;
        //return this[0].hasAttribute(name);
        //IE8 does not support XMLNode.hasAttribute, so...
        return this[0].getAttribute(name) !== null;
    },

    /**
     * Gets Delimiter Separated Value
     * An utility method converts given attribute value into dsv array
     * @method dsv
     * @memberof Node-Attributes
     * @param name {String} the name of the attribute
     * @param delimiter {String=} delimiter string
     * @return {Array.<String>}
     * @example
     * //<movie tags="sci-fi, horror, adventures">
     * $movie.dsv('tags',',')
     * // => ["sci-fi", "horror", "adventures"]
     */
    dsv: function dsv(name, delimiter) {

        //ignore undefined attributes
        if (!this.has(name)) return;

        //get attr's value by name
        var value = this.attr(name);

        //resolve delimiter, defaults to space
        var d = delimiter || ' ';

        //if attribute exists value must be String
        if (typeof value != 'string') return [];

        //split value by delimiter
        var list = value.split(delimiter);

        //trim spaces nicely handling multiple spaced values
        list = list.map(function (str) {

            //convert multiple spaces, tabs, newlines, etc, to single spaces
            str = str.replace(/^\s+/, '');

            //trim leading and trailing whitespaces
            str = str.replace(/(^\s+|\s+$)/g, '');

            return str;
        });

        //remove empty like values
        list = list.filter(function (str) {
            return value !== '' && value !== ' ';
        });

        return list;
    }

};

exports.default = NodeAttributes;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
		value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventify = __webpack_require__(3);

var _eventify2 = _interopRequireDefault(_eventify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @memberof smx
 * @desc
 * The Playhead class is a {@link smx.Document Document} navigation controller.
 *
 * Provides a plain interface to navigate along a Document tree,
 * keeps a navigation registry and emits useful events for listening
 * to any movement.
 */
var Playhead = function () {

		/**
   * @param {smx.Document} document - The document to navigate through
   */
		function Playhead(doc) {
				_classCallCheck(this, Playhead);

				//document is required
				if (!doc) return;

				//extend with events on, off, trigger
				_eventify2.default.enable(this);

				/**
     * The document to navigate through
     * @type {smx.Document}
     * @private
     */
				this._document = doc;

				/**
     * Contains all currently selected nodes ordered from outter to inner.
     * @type {smx.Node[]}
     * @private
     */
				this._selection = [];
		}

		/**
   * Gets the associated document
   * @type {smx.Document}
   * @readonly
   */


		/**
   * Navigates to document's root node.
   */
		Playhead.prototype.reset = function reset() {
				return this.navigate(this.document.root);
		};

		/**
   * Performs play action
   * @param {(String|smx.Node)=} ref target reference
   */


		Playhead.prototype.play = function play(ref) {

				//no reference? just do a forward
				if (!ref) return this.forward();

				//resolve target node
				var tnode = ref.id ? ref : this.document.getNodeById(ref);

				//not found? ignore...
				if (tnode) return this.navigate(tnode);

				//else ignore
				return;
		};

		/**
   * Navigates to an inner node, moves the head to current head's first child.
   */


		Playhead.prototype.enter = function enter() {

				//get current node
				var cnode = this.head;if (!cnode) return;

				//get children nodes
				var children = cnode.children;

				//no children?
				if (!children.length) return;

				//get first child
				var tnode = children[0];

				//navigates to target node
				return this.navigate(tnode);
		};

		/**
   * Navigates to an outter node, moves the head to current head's parent.
   */


		Playhead.prototype.exit = function exit() {

				//get current node
				var cnode = this.head;if (!cnode) return;

				//has parent node?
				if (!cnode.parent) return;

				//get parent node
				var tnode = cnode.parent;

				//navigates to target node
				return this.navigate(tnode);
		};

		/**
   * Navigates to current head's next sibling node.
   */


		Playhead.prototype.next = function next() {

				//get current node
				var cnode = this.head;if (!cnode) return;

				//get next node
				var tnode = cnode.next;if (!tnode) return;

				//navigates to target node
				return this.navigate(tnode);
		};

		/**
   * Navigates to current head's previous sibling node.
   */


		Playhead.prototype.previous = function previous() {

				//get current node
				var cnode = this.head;if (!cnode) return;

				//get previous node
				var tnode = cnode.previous;if (!tnode) return;

				//navigates to target node
				return this.navigate(tnode);
		};

		/**
   * Navigates to current head's next node in flat tree mode.
   */


		Playhead.prototype.forward = function forward() {

				var tnode = void 0,
				    cnode = void 0,
				    children = void 0;

				//get current node
				cnode = this.head;

				//no current node? ignore
				if (!cnode) return;

				tnode = cnode.first || cnode.next;

				if (!tnode) {

						var parent = cnode.parent;
						while (parent && !tnode) {
								tnode = parent.next;
								parent = parent.parent;
						}
				}

				return tnode ? this.navigate(tnode) : null;
		};

		/**
    * Navigates to current head's previous node in flat tree mode.
   */


		Playhead.prototype.backward = function backward() {

				if (!this.head) return;
				var tnode = this.head.previous || this.head.parent;
				return tnode ? this.navigate(tnode) : null;
		};

		/**
    * @param {String} keyword
    * @desc
   * Executes a playhead command based on the given action keyword. keywords
   * are basically some playhead's method names.
   *
   * List of valid commands:
   * `reset`, `play`, `next`, `previous`,
   * `enter`, `exit`, `forward`, `backward`.
   *
   */


		Playhead.prototype.exec = function exec(keyword) {

				//define valid keywords mapping existing methods
				var keywords = ['reset', 'play', 'next', 'previous', 'enter', 'exit', 'forward', 'backward'];

				//resolve for a valid keyword
				var isValidKeyword = keywords.indexOf(keyword) >= 0;

				//not valid keyword? error!
				if (!isValidKeyword) throw new Error('UNKNOWN KEYWORD "!"' + keyword + '"');

				//try-catched execution
				try {
						return this[keyword]();
				} catch (e) {
						throw new Error('Playhead Error: Keyword exec "!' + keyword + '"', e);
				}
		};

		/**
    * @param {String|smx.Node} target
    * @desc
    *
   * Navigates to a given target node or executes a playhead command.
   * If `target` is a node will navigate to it, if `target` is a string will
   * try to find a node identified as `target` and will navigate to it. If
   * `target` is a `!` preffixed string will execute it as a playhead command.
   *
   * See {@link smx.Playhead#exec .exec()} for a list of valid commands.
   *
   * @example
   * //instance a new Playhead
   * var playhead = new smx.Playhead(doc);
   *
   * //navigate by node identifier
   * playhead.navigate('a42');
   *
   * //to to given node
   * playhead.navigate(node);
   *
   * //using commands
   * playhead.navigate('!next')
   * //same as
   * playhead.exec('next')
   * // or
   * playhead.next();
   *
   */


		Playhead.prototype.navigate = function navigate(target) {

				//check for a keyword, must be '!' preffixed string
				var isKeyword = typeof target === 'string' && target.indexOf('!') === 0;

				//keyword? resolve by exec unpreffixed reference
				if (isKeyword) return this.exec(target.substr(1));

				//resolve target node by reference
				//assuming having and id property means smx.Node...
				var tnode = target.id ? target : this.document.getNodeById(target);

				//no target found? error!
				if (!tnode) throw new Error('Playhead Error: Invalid target ' + target);

				//get current node
				var cnode = this.head;

				//no need to move...
				if (tnode === cnode) return cnode;

				//--> LEGACY ASYNC ATTR CONDITIONAL NAVIGATION WAS HERE...
				//see leagacy playhead implementations for more info

				//resets private navigation registry
				var selected = [],
				    deselected = [];

				if (!cnode) {
						cnode = this.document.root;
						selected.push(cnode);
				}

				/* trying a better approach */

				var isDescendant = cnode.isAncestorOf(tnode);
				var isAncestor = tnode.isAncestorOf(cnode);

				//aux filter fn for later use
				var isNodeOrAncestorOf = function isNodeOrAncestorOf(n) {
						return n == tnode || n.isAncestorOf(tnode);
				};

				var r = cnode;
				if (cnode === tnode) {
						//..
				} else if (isDescendant) {
						while (r != tnode) {
								r = r.children.filter(isNodeOrAncestorOf)[0];
								selected.push(r);
						}
				} else if (isAncestor) {
						while (r != tnode) {
								deselected.push(r);
								r = r.parent;
						}
				} else {
						while (!r.isAncestorOf(cnode) || !r.isAncestorOf(tnode)) {
								deselected.push(r);
								r = r.parent;
						}
						while (r != tnode) {
								r = r.children.filter(isNodeOrAncestorOf)[0];
								selected.push(r);
						}
				}

				//update path
				for (var i = 0; i < deselected.length; i++) {
						this._selection.pop();
				}
				for (var i = 0; i < selected.length; i++) {
						this._selection.push(selected[i]);
				}

				this.trigger('change', {
						selected: selected,
						deselected: deselected,
						selection: this._selection,
						origin: cnode,
						target: tnode
				});

				/*
    //FIRE EVENTS
      
    //FIRE 'LEAVE' EVENT
    if(cnode){
        
    	//fire generic 'leave' event in resulting current node
    	this.trigger('leave', cnode);
    	
    	//fire specific node 'leave' event
    	this.trigger('leave:'+cnode.id, cnode);
    	
    }
      
    //--> LEGACY CONDITIONAL NOSTOP ATTRIBUTE WAS HERE...
      //see leagacy playhead implementations for more info
      
    //fire generic 'stay' event in resulting current node
    this.trigger('stay',tnode);
    
    //fire specific node 'stay' event
    this.trigger('stay:'+tnode.id,tnode);
      
    //notify node navigation completed
    this.trigger('ready',tnode);
      
      //return head node
    return this.head;
    
    */
		};

		_createClass(Playhead, [{
				key: 'document',
				get: function get() {
						return this._document;
				}

				/**
     * Gets all currently selected nodes ordered from outter to inner.
     * @type {smx.Node[]}
     * @readonly
     */

		}, {
				key: 'selection',
				get: function get() {
						return this._selection;
				}

				/**
     * Gets the head node, which is the last node in selection.
     * @type {smx.Node}
     * @readonly
     */

		}, {
				key: 'head',
				get: function get() {
						return this._selection[this._selection.length - 1];
				}

				/**
     * Gets the root node, which is the first node selection.
     * @type {smx.Node}
     * @readonly
     */

		}, {
				key: 'root',
				get: function get() {
						return this._selection[0];
				}
		}]);

		return Playhead;
}();

//Doclets for Eventify extended methods

/**
 * Binds an event to a `callback` function. Passing `"all"` will bind
 * the callback to all events fired.
 * @memberof smx.Playhead
 * @instance
 * @method
 * @name on
 * @param {String} name
 * @param {Function} callback
 * @param {Object} context
 */

/**
 * Binds an event to only be triggered a single time. After the first time
 * the callback is invoked, it will be removed.
 * @memberof smx.Playhead
 * @instance
 * @method
 * @name once
 * @param {String} name
 * @param {Function} callback
 * @param {Object} context
 */

/**
 * Remove one or many callbacks. If `context` is null, removes all
 * callbacks with that function. If `callback` is null, removes all
 * callbacks for the event. If `name` is null, removes all bound
 * callbacks for all events.
 * @memberof smx.Playhead
 * @instance
 * @method
 * @name off
 * @param {String} name
 * @param {Function} callback
 * @param {Object} context
 */

//Doclet for PlayheadEvent definition
/**
 * Playhead Event Object
 * @typedef {Object} smx.Playhead.PlayheadEvent
 * @property {smx.Node[]} selected
 * @property {smx.Node[]} deselected
 * @property {smx.Node[]} selection
 * @property {smx.Node} origin
 * @property {smx.Node} target
 */

//Doclets for events

/*
 * Fired every time the head changes.
 * @event change
 * @memberof smx.Playhead
 * @return {smx.Playhead.PlayheadEvent}
 */

/*
 * Fired when entering to any node
 * @event enter
 * @memberof smx.Playhead
 * @return {smx.Playhead.PlayheadEvent}
 */

/*
 * Fired just after `enter` but for a specific node
 * @event enter:id
 * @memberof smx.Playhead
 * @return {smx.Playhead.PlayheadEvent}
 */

/*
 * Fired when exiting from any node
 * @event exit
 * @memberof smx.Playhead
 * @return {smx.Playhead.PlayheadEvent}
 */

/*
 * Fired just after `exit` but for a specific node
 * @event exit:id
 * @memberof smx.Playhead
 * @return {smx.Playhead.PlayheadEvent}
 */

/*
 * Fired every time a head change occurs and stays on any node
 * @event stay
 * @memberof smx.Playhead
 * @return {smx.Playhead.PlayheadEvent}
 */

/*
 * Fired just after `stay` but for a specific node
 * @event stay:id
 * @memberof smx.Playhead
 * @return {smx.Playhead.PlayheadEvent}
 */

/*
 * Fired every time a node stops being the head
 * @event leave
 * @memberof smx.Playhead
 * @return {smx.Playhead.PlayheadEvent}
 */

/*
 * Fired just after `leave` but for a specific node
 * @event leave:id
 * @memberof smx.Playhead
 * @return {smx.Playhead.PlayheadEvent}
 */

/*
 * Fired every time the playhead finishes all operations and goes idle
 * @event ready
 * @memberof smx.Playhead
 * @return {smx.Playhead.PlayheadEvent}
 */

/*
 * Fired when playhed goes to sync mode
 * @event sync
 * @memberof smx.Playhead
 * @return {smx.Playhead.PlayheadEvent}
 */

exports.default = Playhead;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MetadataProcessor = __webpack_require__(15);

var _MetadataProcessor2 = _interopRequireDefault(_MetadataProcessor);

var _DocumentInterface = __webpack_require__(17);

var _DocumentInterface2 = _interopRequireDefault(_DocumentInterface);

var _NodeInterface = __webpack_require__(18);

var _NodeInterface2 = _interopRequireDefault(_NodeInterface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Processor = function Processor(xmlDocument, _callback) {

  var doc = xmlDocument;
  var __callback = _callback || function () {};

  //smx.meta.parseXML(xmlDocument, {
  _MetadataProcessor2.default.processXMLDocument(xmlDocument, {
    callback: function callback(xmlDocument, data) {
      __callback({
        metadata: data
      });
    }
  });
}; /**
    * Metadata Module
    * @module Metadata
    * @memberof smx
    * @description
    * Provides a flexible data layer for document's nodes.
    *
    * Using nested `<metadata>` nodes you can attach data to the direct parent node.
    * Data can be also attached to nodes using `meta-` preffixed attributes.
    *
    * ### Reserved XML: `metadata`, `[meta-*]`.
    *
    * @example
    * <book meta-ISBN="978-3-16-148410-0">
    *    <metadata>
    *      <title>Moby Dick</title>
    *      <description>
    *        Lorem ipsum dolor sit amet consectetuer...
    *      </description>
    *    </metadata>
    *    <chapter>...</chapter>
    *    <chapter>...</chapter>
    *    <chapter>...</chapter>
    * </book>
    *
    * <!-- Processed XML -->
    * <book>
    *   <!-- metadata = {
    *     'ref': '978-3-16-148410-0',
    *     'title': 'Moby Dick',
    *     'description': 'Lorem ipsum dolor sit amet consectetuer...'
    *   } -->
    *   <chapter>...</chapter>
    *   <chapter>...</chapter>
    *   <chapter>...</chapter>
    * </book>
    *
    * book.meta('ref');
    * // => "978-3-16-148410-0"
    * book.meta('title');
    * // => "Moby Dick"
    * book.children.length;
    * // => 3
    */

exports.default = {
  Processor: Processor,
  Document: _DocumentInterface2.default,
  Node: _NodeInterface2.default
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sizzle = __webpack_require__(0);

var _sizzle2 = _interopRequireDefault(_sizzle);

var _SizzleMetaFilter = __webpack_require__(16);

var _SizzleMetaFilter2 = _interopRequireDefault(_SizzleMetaFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * SMX Metadata Processor
 * @module MetadataProcessor
 * @memberof smx.module:Metadata
 */

_sizzle2.default.selectors.filters.meta = _SizzleMetaFilter2.default;

//local helper
var escapeHtml = function escapeHtml(html) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return html.replace(/[&<>"']/g, function (m) {
        return map[m];
    });
};

/**
 * Processes the given XMLDocument
 * @param {XMLDocument} xml
 * @param {Object} options
 * @async
 */
var processXMLDocument = function processXMLDocument(xml, opt) {

    var XML = xml;

    //validate XML
    if (!XML) return;

    //normalize options
    var options = _.extend({
        data: {},
        callback: function callback() {
            return;
        },
        total: 0,
        nodes: null,
        max_iterations: 25
    }, opt);

    // get all unprocessed nodes based on flag attr
    // `metadata-processed` attribute is added after processed
    // nodes missing the flag attr are the nodes we need to process
    var nodes;
    if (!options.nodes) {
        //using Sizzle.selectors.filters.meta.js
        var selector = ['metadata,:meta'];
        nodes = (0, _sizzle2.default)(selector.join(''), XML);
        //include root node itself to the list
        //nodes.unshift(XML);
    } else nodes = options.nodes;

    //calculate percent progress
    if (nodes.length > options.total) options.total = nodes.length;
    var percent = Math.floor(100 - nodes.length * 100 / options.total) || 0;

    log('METADATA PROCESSING... (' + (options.total - nodes.length) + '/' + options.total + ') ' + percent + '%');

    var i = 0;

    while (nodes.length && i < options.max_iterations) {

        var node = nodes.shift();

        var result;

        if (node.nodeType == 1) {

            result = node.nodeName == 'metadata' ? processMetadataNode(node) : processMetaAttributes(node);

            if (result) {

                //create node data object if does not exists yet
                if (!options.data[result.id]) options.data[result.id] = {};

                //extend parent data object
                if (!_.isEmpty(result.data)) _.extend(options.data[result.id], result.data);
            }
        }

        i++;
    }

    //more nodes to process?
    if (nodes.length) {

        _.delay(_.bind(function () {
            processXMLDocument(XML, {
                data: options.data,
                callback: options.callback,
                total: options.total,
                nodes: nodes
            });
        }, this), 0);
    }
    //complete! no more nodes to process
    else {

            //remove all existing metadata-processed attributes
            //log('METADATA REMOVING FLAGS...' );
            var flagged_nodes = (0, _sizzle2.default)('[metadata-processed]', XML);
            _.each(flagged_nodes, function (node) {
                node.removeAttribute('metadata-processed');
            });

            log('METADATA COMPLETE!   (' + options.total + '/' + options.total + ') 100%');

            try {

                options.callback(XML, options.data);
            } catch (e) {

                log('METADATA CALLBACK ERROR! ' + e.toString());
            }
        }

    return;
};

/**
 * Processes the given XMLNode
 * @param {XMLNode} node
 * @return {Object} data
 */

var processMetadataNode = function processMetadataNode(node) {

    //metadata node is required...
    if (!node || node.nodeName !== 'metadata') return;

    //get direct metadata parent node
    var parent = node.parentNode;

    //no parent node? wtf!!
    if (!parent) return;

    //node id which to attach processed data
    var id = parent.getAttribute('id');

    //instance returning data object
    var data = {};

    //get and remove metadata node from parent
    var md = parent.removeChild(node);

    for (var c = 0; c < md.childNodes.length; c++) {

        var xmlNode = md.childNodes[c];

        var key = xmlNode.nodeName;

        var value;

        if (xmlNode.innerHTML) {

            //is <![CDATA ???
            var is_cdata = (xmlNode.innerHTML + '').indexOf('<![CDATA') >= 0;

            if (is_cdata) {

                var _chilNodes = xmlNode.childNodes;

                var _cdata,
                    i = 0;

                while (!_cdata && i < _chilNodes.length) {

                    var _node = _chilNodes[i];

                    if (_node && _node.nodeType === 4) _cdata = _node;

                    i++;
                }

                if (_node) value = escapeHtml(_cdata.textContent + '');else value = xmlNode.innerHTML;
            } else {

                value = xmlNode.innerHTML;

                //trim unwanted trailing and leading whitespace
                value = (value + '').replace(/^\s+|\s+$/gm, '');
            }
        } else {

            var childs = xmlNode.childNodes;

            var str = '';

            if (childs.length) {
                _.each(childs, function (item, index) {
                    str += item.xml || new XMLSerializer().serializeToString(item);
                });
            }

            value = str;

            //trim unwanted trailing and leading whitespace
            value = (value + '').replace(/^\s+|\s+$/gm, '');
        }

        //ignore text nodes, comment nodes, ...
        if (xmlNode.nodeType == 1) data[key] = value;
    }

    return {
        'data': data,
        'id': id
    };
};

/**
 * Processes meta attributes from the given XMLNode
 * @param {XMLNode} node
 * @return {Object} data
 */

var processMetaAttributes = function processMetaAttributes(node) {

    if (!node) return;

    //instance the resultant data object
    var data = {};

    //node id which to attach processed data
    var id = node.getAttribute('id');

    //get data from node attributes
    var attrs = node.attributes;

    var names = _.map(attrs, 'name');
    var values = _.map(attrs, 'value');

    var len = attrs.length;

    for (var i = 0; i < len; i++) {
        var name = names[i];
        var value = values[i];
        if (name.indexOf("meta-") == 0) {

            //remove meta- preffix
            name = name.substr(5);

            //trim unwanted trailing and leading whitespace
            value = (value + '').replace(/^\s+|\s+$/gm, '');

            //set new data entry
            data[name] = value;

            //remove the attribute
            node.removeAttribute("meta-" + name);
        }
    }

    //flag node with "metadata-processed" attr
    node.setAttribute('metadata-processed', 'true');

    return {
        'data': data,
        'id': id
    };
};

exports.default = {
    processXMLDocument: processXMLDocument,
    processMetadataNode: processMetadataNode,
    processMetaAttributes: processMetaAttributes
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var SizzleMetaFilter = function SizzleMetaFilter(elem, i, match) {
    var preffix = 'meta-';
    var regex = new RegExp('\\s*' + preffix + '\\w*="', 'ig');
    var attrs = elem.attributes;
    var str = [];
    str.push('<' + elem.nodeName);
    for (var a = 0; a < attrs.length; a++) {
        str.push(attrs[a].nodeName + '="' + attrs[a].nodeValue + '"');
    }
    str.push('>');
    str = str.join(' ');

    return regex.test(str);
};

exports.default = SizzleMetaFilter;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Extends {@link smx.Document Document} with metadata module methods.
 * @mixin Document-Metadata
 * @memberof smx.module:Metadata
 * @see {@link smx.Document Document}
 */
var DocumentInterface = {

  /**
  * Performs a search
   * @method search
   * @instance
  * @param {String} query
  * @param {module:Metadata.searchOptions=} options
  * @return {module:Metadata.searchResult[]}
   * @memberof module:Metadata.Document-Metadata
   * @see module:Metadata.searchOptions
   * @see module:Metadata.searchResult
  */
  search: function search(str, opts) {

    var results = [];

    //empty or invalid str return empty results array
    if (!_.isString(str) || str === '') return results;

    /**
    * The options object used as parameter in {@link module:Metadata.Node-Metadata#search .search()} method.
     * @typedef {Object} module:Metadata.searchOptions
    * @property {Boolean} sensitive
    * @property {Boolean} insensitive
    * @property {SMXNode} node
    * @property {String} selector
    * @property {String[]} include
    * @property {String[]} exclude
    * @see {@link module:Metadata.Document-Metadata#search Document-Metadata.search()}
    * @see {@link module:Metadata.Node-Metadata#search Node-Metadata.search()}
    */

    /**
    * The returning object by the {@link module:Metadata.Node-Metadata#search .search()} method, returns an array of them.
     * @typedef {Object[]} module:Metadata.searchResult
    * @property {SMXNode} node
    * @property {String} meta-key
    * @property {String} meta-value
    * @see {@link module:Metadata.Document-Metadata#search Document-Metadata.search()}
    * @see {@link module:Metadata.Node-Metadata#search Node-Metadata.search()}
    */

    var options = _.defaults(opts || {}, {

      //case sensivity
      sensitive: false,

      //accents sensivity
      insensitive: false,

      //node context
      node: null,

      //base selector
      selector: '',

      //include selectors
      include: [],

      //exclude selectors
      exclude: []

    });

    str = options.sensitive ? str : str.toLowerCase();

    var json;
    var doc = this;

    if (options.selector + '') {

      var nodes = this.find(options.selector, options.node);

      var ids = _.pluck(nodes, 'id');

      var datas = [];

      _.each(this._data.metadata, function (value, key, list) {

        if (_.includes(ids, key)) datas.push(value);
      });

      json = _.map(datas, function (data, index) {
        data.id = ids[index];return data;
      });
    } else {

      var _ids = _.keys(this._data.metadata);
      var values = _.values(this._data.metadata);

      json = _.map(values, function (value, index) {
        value.id = _ids[index];return value;
      });
    }

    _.each(json, function (item) {

      //save id property for later use and delete it
      //so loop wont process it and will run faster
      var id = item.id + '';delete item.id;

      _.each(item, function (value, key) {

        //ignore empty string and non string values...
        var is_valid_string = _.isString(value) && !_.isEmpty(value) ? true : false;

        if (is_valid_string) {

          var _value = options.sensitive ? value : value.toLowerCase();

          if (_value.indexOf(str) >= 0) {

            results.push({
              'node': doc.getNodeById(id),
              'meta': key,
              'value': value
            });
          }
        }
      });
    });

    results = _.uniq(results);

    return results;
  }
};

exports.default = DocumentInterface;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Extends {@link smx.Node Node} with metadata module methods.
 * @mixin Node-Metadata
 * @memberof smx.module:Metadata
 * @see {@link smx.Node Node}
 */
var NodeInterface = {

  /**
   * Gets the metadata value for the given key.
   * @method meta
   * @instance
   * @param {String} key
   * @return {String}
   * @memberof smx.module:Metadata.Node-Metadata
   */
  meta: function meta(key) {

    try {
      return this.document._data.metadata[this.id][key];
    } catch (e) {}
  },

  /**
   * Gets the interpolated metadata value for the given key.
   * The interpolation uses {{}} delimiters and the node as data context.
   * @method interpolate
   * @instance
   * @param {String} key
   * @return {String}
   * @memberof smx.module:Metadata.Node-Metadata
   */
  interpolate: function interpolate(key) {

    var settings = { interpolate: /\{\{(.+?)\}\}/g };
    try {
      return _.template(this.meta(key), this, settings);
    } catch (e) {}
  },

  /**
  * Performs a search in owner document using this node as context.
   * @method search
   * @instance
   * @param {String} query
   * @param {module:Metadata.searchOptions=} options
   * @return {module:Metadata.searchResult[]}
   * @memberof smx.module:Metadata.Node-Metadata
   * @see {@link module:Metadata.searchOptions searchOptions}
   * @see {@link module:Metadata.searchResult searchResult}
   */
  search: function search(str, opt) {
    var options = opt || {};
    options.node = this;
    return this.document.search(str, opt);
  }

};

exports.default = NodeInterface;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _PrototypeProcessor = __webpack_require__(20);

var _PrototypeProcessor2 = _interopRequireDefault(_PrototypeProcessor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Processor = function Processor(xmlDocument, _callback) {

  var doc = xmlDocument;
  var __callback = _callback || function () {};

  _PrototypeProcessor2.default.processXMLDocument(xmlDocument, {
    callback: function callback(xmlDocument, data) {
      __callback({
        proto: data
      });
    }
  });
}; /**
    * Prototype Module
    * @module Prototype
    * @memberof smx
    * @description
    *
    * The Prototype module provides a customizable XML transformation
    * layer.
    *
    * Using the key tag `<prototype>` you can define a collection of
    * transformation rules based on CSS selectors. The rules cannot modify the
    * tree, transformations are limited to attributes only. You can add,
    * remove and override attributes.
    *
    * The transformations are applied after the XML tree completes the
    * loading, while smx parsing process. `<prototype>` tags are removed once
    * they get parsed. No footprints on resultant working XML tree.
    *
    * You can think of it as CSS for XML attributes, kind of XSLT but using CSS
    * selectors instead of XSLT patterns.
    *
    * ### Reserved XML: `<prototype>`.
    *
    * @example
    * <!-- source library.xml -->
    * <library>
    *
    *    <prototype>
    *    <![CDATA[
    *
    *      //all nodes named 'book' will have a
    *      //'type' attribute with 'html' as value
    *      book{
    *        type: txt;
    *      }
    *
    *      //all nodes named 'book' having the class 'markdown' will have
    *      //an attribute 'type' with the value 'html' and
    *      //an attribute 'formatted' with the value 'true'
    *      book.markdown{
    *        type: md;
    *        formatted: true;
    *      }
    *    ]]>
    *    </prototype>
    *
    *   <book>..</book>
    *   <book>..</book>
    *   <book class="markdown">..</book>
    *
    * <library>
    *
    * <!-- processed library.xml -->
    * <library>
    *   <book type="html">..</book>
    *   <book type="html">..</book>
    *   <book class="markdown" type="md" formatted="true">..</book>
    * <library>
    */

exports.default = {
  Processor: Processor
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sizzle = __webpack_require__(0);

var _sizzle2 = _interopRequireDefault(_sizzle);

var _CSSParser = __webpack_require__(21);

var _CSSParser2 = _interopRequireDefault(_CSSParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Processes the given XMLDocument
 * @param {XMLDocument} xml
 * @param {Object} options
 * @param {Integer} [options.max_iterations=1] Maximum number of prototype blocks to process at once.
 * @param {Boolean}  [options.propagate=true] If true the processed data will be propagated to matching XML nodes.
 * @param {Function} options.callback Callback function executed on processing complete.
 * @async
 */
/**
 * SMX Prototype Processor
 * @module PrototypeProcessor
 * @memberof smx.module:Prototype
 * @description This processor will parse and process all <prototype> nodes.
 * Uses {@link http://www.glazman.org/JSCSSP/ JSCSSP} internally.
 * @todo Try other good looking CSS parsers, like {@link https://github.com/cwdoh/cssparser.js CSSParser}
 * or {@link https://github.com/NV/CSSOM CSSOM}.
 * @todo Implement an alternative selector engine for {@link https://msdn.microsoft.com/en-us/library/ms256113(v=vs.85).aspx XSLT Patterns}.
 */

var processXMLDocument = function processXMLDocument(XML, opt) {

  //validate XML
  if (!XML) return;

  //normalize options
  var options = _.extend({
    data: [],
    propagate: true,
    callback: function callback() {
      return;
    },
    max_iterations: 1
  }, opt);

  // get all <prototype> nodes in given XML
  // <prototype> nodes will get removed after processing
  var nodes = (0, _sizzle2.default)('prototype', XML);

  log('PROCESSING PROTOTYPES... (' + nodes.length + ')');

  var iterations = 0;

  var i = 0;

  while (nodes.length && i < options.max_iterations) {

    var node = nodes[i];

    var proto = processXMLNode(node);

    options.data.push(proto);

    i++;
  }

  //all nodes processed?
  if (nodes.length) {

    _.delay(_.bind(function () {
      processXMLDocument(XML, {
        data: options.data,
        propagate: options.propagate,
        callback: options.callback
      });
    }, this), 0);
  }
  //ok all nodes processed!
  else {

      log('PROCESSING PROTOTYPES... DONE!');

      //reverse extracted prototypes...
      //so we apply from outter to the inner
      //so specific rules will overwrite global rules
      options.data = options.data.reverse();

      //APPLY EXTRACTED PROTOTYPES
      if (options.propagate) for (var x = 0; x < options.data.length; x++) {
        applyPrototypes(XML, options.data[x]);
      }log('APPLYING PROTOTYPES... DONE!');

      log('COMPLETE!'); //' ('+ options.total +'/'+ options.total +') 100%' );

      try {
        options.callback(XML, options.data);
      } catch (e) {
        log('CALLBACK ERROR! ' + e.toString());
      }
    }

  return;
};

/**
 * Processes the given XMLNode
 * @param {XMLNode} xmlNode
 * @return {Object} data
 * @return {String} data.id
 * @return {Object[]} data.rules
 */
var processXMLNode = function processXMLNode(node) {

  //prototype node required...
  if (!node || node.nodeName !== 'prototype') return;

  var RULES = {};

  //get direct metadata parent node
  var parent = node.parentNode;

  //no parent node? wtf!!
  if (!parent) return;

  //get and remove <prototype> node from parent
  var proto = parent.removeChild(node);

  /* CSS PARSING */

  //get CSS text
  var source = proto.textContent || proto.firstChild.nodeValue; // "proto.firstChild.nodeValue" in IE8

  //Remove css comments, comments outside any rule could break CSSParser...
  //!!!WARNING, THIS IS NOT BULLETPROOF!!! empty comments like this -> /**/ wont be removed
  //needs improvement...
  source = source.replace(/\s*(?!<\")\/\*[^\*]+\*\/(?!\")\s*/g, '');

  var parser = new _CSSParser2.default();
  var sheet = parser.parse(source, false, true);

  var rules = sheet.getJSONP();
  var keys = _.keys(rules);

  for (var i = 0; i < keys.length; i++) {

    var key = keys[i];
    var rule = rules[key];

    //if key rule exists extend it
    if (RULES[key]) _.extend(RULES[key], rule);

    //else create key rule
    else RULES[key] = rule;
  }

  return {
    'id': parent.getAttribute('id'),
    'rules': RULES
  };
};

/**
 * Apply the processed data into given XMLNode
 * @param {XMLDocument} xmlDocument
 * @param {Object} data
 * @return {XMLDocument} result
 */
var applyPrototypes = function applyPrototypes(xml, proto) {

  //get target node
  //var node = Sizzle('#'+proto.id, xml)[0];
  //var XML = node || xml;

  var XML = xml;

  var RULES = proto.rules;

  var RESOLVED_PROTO_ATTRS = {};

  var applyProtoAttributes = function applyProtoAttributes(node, attrs) {

    var id = node.getAttribute('id') || node.getAttribute('id');

    _.each(attrs, function (value, key, list) {

      //all values should/must be strings
      if (!_.isString(value)) return;

      //important flag? starting with '!'
      //important values will overwrite node attribute values
      if (value.indexOf('!') === 0) {

        //remove '!' so it does not apply to node attributes
        value = value.substr(1);

        //apply attr value into node using temp namespace
        node.setAttribute(key, value);
      } else {

        //apply using temp namespace
        if (!RESOLVED_PROTO_ATTRS[id]) RESOLVED_PROTO_ATTRS[id] = {};

        RESOLVED_PROTO_ATTRS[id][key] = value;

        //node.setAttribute('temp-'+key,value);
      }
    });
  };

  //APPLY PROTOTYPES

  _.each(RULES, function (value, key, list) {

    //get matching nodes
    var nodes = (0, _sizzle2.default)(key, XML);

    //include document itself to nodes list
    //if (Sizzle.matchesSelector(XML,key)) nodes.unshift(XML);

    //get proto attrs
    var attrs = RULES[key];

    //apply attrs to each matching node
    if (nodes.length > 0 && attrs) {

      _.each(nodes, function (item, index) {

        applyProtoAttributes(item, attrs);
      });
    }
  });

  //APPLY RESOLVED PROTOTYPES

  _.each(RESOLVED_PROTO_ATTRS, function (attrs, nodeId, collection) {

    if (!_.isString(nodeId) || nodeId === "") return;

    //var node = INDEX_CACHE[nodeId];
    //var node = Sizzle.matchesSelector(XML,'#'+nodeId);
    //var node = Sizzle.matchesSelector(XML.documentElement,'#'+nodeId);
    //WARNING!!!!!!!! IE8 FAILS!!!!
    //var node = XML.getElementById(nodeId);
    //.getElementById is not supported for XML documents
    //var node = (XML.getAttribute('id')===nodeId)? XML : Sizzle('#'+nodeId, XML)[0];
    var node = (0, _sizzle2.default)('#' + nodeId, XML)[0];

    //node = node[0];

    if (node) {
      _.each(attrs, function (value, key, list) {

        if (_.isEmpty(node.getAttribute(key))) {

          node.setAttribute(key, value);
        }
      });
    }
  });

  return XML;
};

exports.default = {
  processXMLDocument: processXMLDocument,
  processXMLNode: processXMLNode,
  applyPrototypes: applyPrototypes
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _kCOLOR_NAMES, _jscsspToken$prototyp;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*

JSCSSP a CSS parser
http://www.glazman.org/JSCSSP/

Useful because we want to use non CSS definitions
It parses even invalid CSS rules
We can keep accesing parsed data models

@clopez: modified version 20130612

Original version uses javascript keyword "const" which is not valid ECMA5
Here we replace "const" with "var"
Minified version also required adding some semicolons :D

*/

var kCHARSET_RULE_MISSING_SEMICOLON = "Missing semicolon at the end of @charset rule";var kCHARSET_RULE_CHARSET_IS_STRING = "The charset in the @charset rule should be a string";var kCHARSET_RULE_MISSING_WS = "Missing mandatory whitespace after @charset";var kIMPORT_RULE_MISSING_URL = "Missing URL in @import rule";var kURL_EOF = "Unexpected end of stylesheet";var kURL_WS_INSIDE = "Multiple tokens inside a url() notation";var kVARIABLES_RULE_POSITION = "@variables rule invalid at this position in the stylesheet";var kIMPORT_RULE_POSITION = "@import rule invalid at this position in the stylesheet";var kNAMESPACE_RULE_POSITION = "@namespace rule invalid at this position in the stylesheet";var kCHARSET_RULE_CHARSET_SOF = "@charset rule invalid at this position in the stylesheet";var kUNKNOWN_AT_RULE = "Unknow @-rule";var kENGINES = ["webkit", "presto", "trident", "generic"];var kCSS_VENDOR_VALUES = { "-moz-box": { "webkit": "-webkit-box", "presto": "", "trident": "", "generic": "box" }, "-moz-inline-box": { "webkit": "-webkit-inline-box", "presto": "", "trident": "", "generic": "inline-box" }, "-moz-initial": { "webkit": "", "presto": "", "trident": "", "generic": "initial" }, "-moz-linear-gradient": { "webkit20110101": FilterLinearGradientForOutput, "webkit": FilterLinearGradientForOutput, "presto": "", "trident": "", "generic": FilterLinearGradientForOutput }, "-moz-radial-gradient": { "webkit20110101": FilterRadialGradientForOutput, "webkit": FilterRadialGradientForOutput, "presto": "", "trident": "", "generic": FilterRadialGradientForOutput }, "-moz-repeating-linear-gradient": { "webkit20110101": "", "webkit": FilterRepeatingGradientForOutput, "presto": "", "trident": "", "generic": FilterRepeatingGradientForOutput }, "-moz-repeating-radial-gradient": { "webkit20110101": "", "webkit": FilterRepeatingGradientForOutput, "presto": "", "trident": "", "generic": FilterRepeatingGradientForOutput } };var kCSS_VENDOR_PREFIXES = { "lastUpdate": 1304175007, "properties": [{ "gecko": "", "webkit": "", "presto": "", "trident": "-ms-accelerator", "status": "P" }, { "gecko": "", "webkit": "", "presto": "-wap-accesskey", "trident": "", "status": "" }, { "gecko": "-moz-animation", "webkit": "-webkit-animation", "presto": "", "trident": "", "status": "WD" }, { "gecko": "-moz-animation-delay", "webkit": "-webkit-animation-delay", "presto": "", "trident": "", "status": "WD" }, { "gecko": "-moz-animation-direction", "webkit": "-webkit-animation-direction", "presto": "", "trident": "", "status": "WD" }, { "gecko": "-moz-animation-duration", "webkit": "-webkit-animation-duration", "presto": "", "trident": "", "status": "WD" }, { "gecko": "-moz-animation-fill-mode", "webkit": "-webkit-animation-fill-mode", "presto": "", "trident": "", "status": "ED" }, { "gecko": "-moz-animation-iteration-count", "webkit": "-webkit-animation-iteration-count", "presto": "", "trident": "", "status": "WD" }, { "gecko": "-moz-animation-name", "webkit": "-webkit-animation-name", "presto": "", "trident": "", "status": "WD" }, { "gecko": "-moz-animation-play-state", "webkit": "-webkit-animation-play-state", "presto": "", "trident": "", "status": "WD" }, { "gecko": "-moz-animation-timing-function", "webkit": "-webkit-animation-timing-function", "presto": "", "trident": "", "status": "WD" }, { "gecko": "-moz-appearance", "webkit": "-webkit-appearance", "presto": "", "trident": "", "status": "CR" }, { "gecko": "", "webkit": "-webkit-backface-visibility", "presto": "", "trident": "", "status": "WD" }, { "gecko": "background-clip", "webkit": "-webkit-background-clip", "presto": "background-clip", "trident": "background-clip", "status": "WD" }, { "gecko": "", "webkit": "-webkit-background-composite", "presto": "", "trident": "", "status": "" }, { "gecko": "-moz-background-inline-policy", "webkit": "", "presto": "", "trident": "", "status": "P" }, { "gecko": "background-origin", "webkit": "-webkit-background-origin", "presto": "background-origin", "trident": "background-origin", "status": "WD" }, { "gecko": "", "webkit": "background-position-x", "presto": "", "trident": "-ms-background-position-x", "status": "" }, { "gecko": "", "webkit": "background-position-y", "presto": "", "trident": "-ms-background-position-y", "status": "" }, { "gecko": "background-size", "webkit": "-webkit-background-size", "presto": "background-size", "trident": "background-size", "status": "WD" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-behavior", "status": "" }, { "gecko": "-moz-binding", "webkit": "", "presto": "", "trident": "", "status": "P" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-block-progression", "status": "" }, { "gecko": "", "webkit": "-webkit-border-after", "presto": "", "trident": "", "status": "ED" }, { "gecko": "", "webkit": "-webkit-border-after-color", "presto": "", "trident": "", "status": "ED" }, { "gecko": "", "webkit": "-webkit-border-after-style", "presto": "", "trident": "", "status": "ED" }, { "gecko": "", "webkit": "-webkit-border-after-width", "presto": "", "trident": "", "status": "ED" }, { "gecko": "", "webkit": "-webkit-border-before", "presto": "", "trident": "", "status": "ED" }, { "gecko": "", "webkit": "-webkit-border-before-color", "presto": "", "trident": "", "status": "ED" }, { "gecko": "", "webkit": "-webkit-border-before-style", "presto": "", "trident": "", "status": "ED" }, { "gecko": "", "webkit": "-webkit-border-before-width", "presto": "", "trident": "", "status": "ED" }, { "gecko": "-moz-border-bottom-colors", "webkit": "", "presto": "", "trident": "", "status": "P" }, { "gecko": "border-bottom-left-radius", "webkit": "-webkit-border-bottom-left-radius", "presto": "border-bottom-left-radius", "trident": "border-bottom-left-radius", "status": "WD" }, { "gecko": "", "webkit": "-webkit-border-bottom-left-radius = border-bottom-left-radius", "presto": "", "trident": "", "status": "" }, { "gecko": "border-bottom-right-radius", "webkit": "-webkit-border-bottom-right-radius", "presto": "border-bottom-right-radius", "trident": "border-bottom-right-radius", "status": "WD" }, { "gecko": "", "webkit": "-webkit-border-bottom-right-radius = border-bottom-right-radius", "presto": "", "trident": "", "status": "" }, { "gecko": "-moz-border-end", "webkit": "-webkit-border-end", "presto": "", "trident": "", "status": "ED" }, { "gecko": "-moz-border-end-color", "webkit": "-webkit-border-end-color", "presto": "", "trident": "", "status": "ED" }, { "gecko": "-moz-border-end-style", "webkit": "-webkit-border-end-style", "presto": "", "trident": "", "status": "ED" }, { "gecko": "-moz-border-end-width", "webkit": "-webkit-border-end-width", "presto": "", "trident": "", "status": "ED" }, { "gecko": "", "webkit": "-webkit-border-fit", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-border-horizontal-spacing", "presto": "", "trident": "", "status": "" }, { "gecko": "-moz-border-image", "webkit": "-webkit-border-image", "presto": "-o-border-image", "trident": "", "status": "WD" }, { "gecko": "-moz-border-left-colors", "webkit": "", "presto": "", "trident": "", "status": "P" }, { "gecko": "border-radius", "webkit": "-webkit-border-radius", "presto": "border-radius", "trident": "border-radius", "status": "WD" }, { "gecko": "-moz-border-right-colors", "webkit": "", "presto": "", "trident": "", "status": "P" }, { "gecko": "-moz-border-start", "webkit": "-webkit-border-start", "presto": "", "trident": "", "status": "ED" }, { "gecko": "-moz-border-start-color", "webkit": "-webkit-border-start-color", "presto": "", "trident": "", "status": "ED" }, { "gecko": "-moz-border-start-style", "webkit": "-webkit-border-start-style", "presto": "", "trident": "", "status": "ED" }, { "gecko": "-moz-border-start-width", "webkit": "-webkit-border-start-width", "presto": "", "trident": "", "status": "ED" }, { "gecko": "-moz-border-top-colors", "webkit": "", "presto": "", "trident": "", "status": "P" }, { "gecko": "border-top-left-radius", "webkit": "-webkit-border-top-left-radius", "presto": "border-top-left-radius", "trident": "border-top-left-radius", "status": "WD" }, { "gecko": "", "webkit": "-webkit-border-top-left-radius = border-top-left-radius", "presto": "", "trident": "", "status": "" }, { "gecko": "border-top-right-radius", "webkit": "-webkit-border-top-right-radius", "presto": "border-top-right-radius", "trident": "border-top-right-radius", "status": "WD" }, { "gecko": "", "webkit": "-webkit-border-top-right-radius = border-top-right-radius", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-border-vertical-spacing", "presto": "", "trident": "", "status": "" }, { "gecko": "-moz-box-align", "webkit": "-webkit-box-align", "presto": "", "trident": "-ms-box-align", "status": "WD" }, { "gecko": "-moz-box-direction", "webkit": "-webkit-box-direction", "presto": "", "trident": "-ms-box-direction", "status": "WD" }, { "gecko": "-moz-box-flex", "webkit": "-webkit-box-flex", "presto": "", "trident": "-ms-box-flex", "status": "WD" }, { "gecko": "", "webkit": "-webkit-box-flex-group", "presto": "", "trident": "", "status": "WD" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-box-line-progression", "status": "" }, { "gecko": "", "webkit": "-webkit-box-lines", "presto": "", "trident": "-ms-box-lines", "status": "WD" }, { "gecko": "-moz-box-ordinal-group", "webkit": "-webkit-box-ordinal-group", "presto": "", "trident": "-ms-box-ordinal-group", "status": "WD" }, { "gecko": "-moz-box-orient", "webkit": "-webkit-box-orient", "presto": "", "trident": "-ms-box-orient", "status": "WD" }, { "gecko": "-moz-box-pack", "webkit": "-webkit-box-pack", "presto": "", "trident": "-ms-box-pack", "status": "WD" }, { "gecko": "", "webkit": "-webkit-box-reflect", "presto": "", "trident": "", "status": "" }, { "gecko": "box-shadow", "webkit": "-webkit-box-shadow", "presto": "box-shadow", "trident": "box-shadow", "status": "WD" }, { "gecko": "-moz-box-sizing", "webkit": "box-sizing", "presto": "box-sizing", "trident": "", "status": "CR" }, { "gecko": "", "webkit": "-webkit-box-sizing = box-sizing", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-epub-caption-side = caption-side", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-color-correction", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-column-break-after", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-column-break-before", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-column-break-inside", "presto": "", "trident": "", "status": "" }, { "gecko": "-moz-column-count", "webkit": "-webkit-column-count", "presto": "column-count", "trident": "column-count", "status": "CR" }, { "gecko": "-moz-column-gap", "webkit": "-webkit-column-gap", "presto": "column-gap", "trident": "column-gap", "status": "CR" }, { "gecko": "-moz-column-rule", "webkit": "-webkit-column-rule", "presto": "column-rule", "trident": "column-rule", "status": "CR" }, { "gecko": "-moz-column-rule-color", "webkit": "-webkit-column-rule-color", "presto": "column-rule-color", "trident": "column-rule-color", "status": "CR" }, { "gecko": "-moz-column-rule-style", "webkit": "-webkit-column-rule-style", "presto": "column-rule-style", "trident": "column-rule-style", "status": "CR" }, { "gecko": "-moz-column-rule-width", "webkit": "-webkit-column-rule-width", "presto": "column-rule-width", "trident": "column-rule-width", "status": "CR" }, { "gecko": "", "webkit": "-webkit-column-span", "presto": "column-span", "trident": "column-span", "status": "CR" }, { "gecko": "-moz-column-width", "webkit": "-webkit-column-width", "presto": "column-width", "trident": "column-width", "status": "CR" }, { "gecko": "", "webkit": "-webkit-columns", "presto": "columns", "trident": "columns", "status": "CR" }, { "gecko": "", "webkit": "-webkit-dashboard-region", "presto": "-apple-dashboard-region", "trident": "", "status": "" }, { "gecko": "filter", "webkit": "", "presto": "filter", "trident": "-ms-filter", "status": "" }, { "gecko": "-moz-float-edge", "webkit": "", "presto": "", "trident": "", "status": "P" }, { "gecko": "", "webkit": "", "presto": "-o-focus-opacity", "trident": "", "status": "" }, { "gecko": "-moz-font-feature-settings", "webkit": "", "presto": "", "trident": "", "status": "" }, { "gecko": "-moz-font-language-override", "webkit": "", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-font-size-delta", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-font-smoothing", "presto": "", "trident": "", "status": "" }, { "gecko": "-moz-force-broken-image-icon", "webkit": "", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-grid-column", "status": "WD" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-grid-column-align", "status": "WD" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-grid-column-span", "status": "WD" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-grid-columns", "status": "WD" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-grid-layer", "status": "WD" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-grid-row", "status": "WD" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-grid-row-align", "status": "WD" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-grid-row-span", "status": "WD" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-grid-rows", "status": "WD" }, { "gecko": "", "webkit": "-webkit-highlight", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-hyphenate-character", "presto": "", "trident": "", "status": "WD" }, { "gecko": "", "webkit": "-webkit-hyphenate-limit-after", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-hyphenate-limit-before", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-hyphens", "presto": "", "trident": "", "status": "WD" }, { "gecko": "", "webkit": "-epub-hyphens = -webkit-hyphens", "presto": "", "trident": "", "status": "" }, { "gecko": "-moz-image-region", "webkit": "", "presto": "", "trident": "", "status": "P" }, { "gecko": "ime-mode", "webkit": "", "presto": "", "trident": "-ms-ime-mode", "status": "" }, { "gecko": "", "webkit": "", "presto": "-wap-input-format", "trident": "", "status": "" }, { "gecko": "", "webkit": "", "presto": "-wap-input-required", "trident": "", "status": "" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-interpolation-mode", "status": "" }, { "gecko": "", "webkit": "", "presto": "-xv-interpret-as", "trident": "", "status": "" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-layout-flow", "status": "" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-layout-grid", "status": "" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-layout-grid-char", "status": "" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-layout-grid-line", "status": "" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-layout-grid-mode", "status": "" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-layout-grid-type", "status": "" }, { "gecko": "", "webkit": "-webkit-line-box-contain", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-line-break", "presto": "", "trident": "-ms-line-break", "status": "" }, { "gecko": "", "webkit": "-webkit-line-clamp", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-line-grid-mode", "status": "" }, { "gecko": "", "webkit": "", "presto": "-o-link", "trident": "", "status": "" }, { "gecko": "", "webkit": "", "presto": "-o-link-source", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-locale", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-logical-height", "presto": "", "trident": "", "status": "ED" }, { "gecko": "", "webkit": "-webkit-logical-width", "presto": "", "trident": "", "status": "ED" }, { "gecko": "", "webkit": "-webkit-margin-after", "presto": "", "trident": "", "status": "ED" }, { "gecko": "", "webkit": "-webkit-margin-after-collapse", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-margin-before", "presto": "", "trident": "", "status": "ED" }, { "gecko": "", "webkit": "-webkit-margin-before-collapse", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-margin-bottom-collapse", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-margin-collapse", "presto": "", "trident": "", "status": "" }, { "gecko": "-moz-margin-end", "webkit": "-webkit-margin-end", "presto": "", "trident": "", "status": "ED" }, { "gecko": "-moz-margin-start", "webkit": "-webkit-margin-start", "presto": "", "trident": "", "status": "ED" }, { "gecko": "", "webkit": "-webkit-margin-top-collapse", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-marquee", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "", "presto": "-wap-marquee-dir", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-marquee-direction", "presto": "", "trident": "", "status": "WD" }, { "gecko": "", "webkit": "-webkit-marquee-increment", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "", "presto": "-wap-marquee-loop", "trident": "", "status": "WD" }, { "gecko": "", "webkit": "-webkit-marquee-repetition", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-marquee-speed", "presto": "-wap-marquee-speed", "trident": "", "status": "WD" }, { "gecko": "", "webkit": "-webkit-marquee-style", "presto": "-wap-marquee-style", "trident": "", "status": "WD" }, { "gecko": "mask", "webkit": "-webkit-mask", "presto": "mask", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-mask-attachment", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-mask-box-image", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-mask-clip", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-mask-composite", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-mask-image", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-mask-origin", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-mask-position", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-mask-position-x", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-mask-position-y", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-mask-repeat", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-mask-repeat-x", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-mask-repeat-y", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-mask-size", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-match-nearest-mail-blockquote-color", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-max-logical-height", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-max-logical-width", "presto": "", "trident": "", "status": "ED" }, { "gecko": "", "webkit": "-webkit-min-logical-height", "presto": "", "trident": "", "status": "ED" }, { "gecko": "", "webkit": "-webkit-min-logical-width", "presto": "", "trident": "", "status": "ED" }, { "gecko": "", "webkit": "", "presto": "-o-mini-fold", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-nbsp-mode", "presto": "", "trident": "", "status": "P" }, { "gecko": "", "webkit": "", "presto": "-o-object-fit", "trident": "", "status": "ED" }, { "gecko": "", "webkit": "", "presto": "-o-object-position", "trident": "", "status": "ED" }, { "gecko": "opacity", "webkit": "-webkit-opacity", "presto": "opacity", "trident": "opacity", "status": "WD" }, { "gecko": "", "webkit": "-webkit-opacity = opacity", "presto": "", "trident": "", "status": "" }, { "gecko": "-moz-outline-radius", "webkit": "", "presto": "", "trident": "", "status": "P" }, { "gecko": "-moz-outline-radius-bottomleft", "webkit": "", "presto": "", "trident": "", "status": "P" }, { "gecko": "-moz-outline-radius-bottomright", "webkit": "", "presto": "", "trident": "", "status": "P" }, { "gecko": "-moz-outline-radius-topleft", "webkit": "", "presto": "", "trident": "", "status": "P" }, { "gecko": "-moz-outline-radius-topright", "webkit": "", "presto": "", "trident": "", "status": "P" }, { "gecko": "overflow-x", "webkit": "overflow-x", "presto": "overflow-x", "trident": "-ms-overflow-x", "status": "WD" }, { "gecko": "overflow-y", "webkit": "overflow-y", "presto": "overflow-y", "trident": "-ms-overflow-y", "status": "WD" }, { "gecko": "", "webkit": "-webkit-padding-after", "presto": "", "trident": "", "status": "ED" }, { "gecko": "", "webkit": "-webkit-padding-before", "presto": "", "trident": "", "status": "ED" }, { "gecko": "-moz-padding-end", "webkit": "-webkit-padding-end", "presto": "", "trident": "", "status": "ED" }, { "gecko": "-moz-padding-start", "webkit": "-webkit-padding-start", "presto": "", "trident": "", "status": "ED" }, { "gecko": "", "webkit": "-webkit-perspective", "presto": "", "trident": "", "status": "WD" }, { "gecko": "", "webkit": "-webkit-perspective-origin", "presto": "", "trident": "", "status": "WD" }, { "gecko": "", "webkit": "-webkit-perspective-origin-x", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-perspective-origin-y", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "", "presto": "-xv-phonemes", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-rtl-ordering", "presto": "", "trident": "", "status": "P" }, { "gecko": "-moz-script-level", "webkit": "", "presto": "", "trident": "", "status": "" }, { "gecko": "-moz-script-min-size", "webkit": "", "presto": "", "trident": "", "status": "" }, { "gecko": "-moz-script-size-multiplier", "webkit": "", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "", "presto": "scrollbar-3dlight-color", "trident": "-ms-scrollbar-3dlight-color", "status": "P" }, { "gecko": "", "webkit": "", "presto": "scrollbar-arrow-color", "trident": "-ms-scrollbar-arrow-color", "status": "P" }, { "gecko": "", "webkit": "", "presto": "scrollbar-base-color", "trident": "-ms-scrollbar-base-color", "status": "P" }, { "gecko": "", "webkit": "", "presto": "scrollbar-darkshadow-color", "trident": "-ms-scrollbar-darkshadow-color", "status": "P" }, { "gecko": "", "webkit": "", "presto": "scrollbar-face-color", "trident": "-ms-scrollbar-face-color", "status": "P" }, { "gecko": "", "webkit": "", "presto": "scrollbar-highlight-color", "trident": "-ms-scrollbar-highlight-color", "status": "P" }, { "gecko": "", "webkit": "", "presto": "scrollbar-shadow-color", "trident": "-ms-scrollbar-shadow-color", "status": "P" }, { "gecko": "", "webkit": "", "presto": "scrollbar-track-color", "trident": "-ms-scrollbar-track-color", "status": "P" }, { "gecko": "-moz-stack-sizing", "webkit": "", "presto": "", "trident": "", "status": "P" }, { "gecko": "", "webkit": "-webkit-svg-shadow", "presto": "", "trident": "", "status": "" }, { "gecko": "-moz-tab-size", "webkit": "", "presto": "-o-tab-size", "trident": "", "status": "" }, { "gecko": "", "webkit": "", "presto": "-o-table-baseline", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-tap-highlight-color", "presto": "", "trident": "", "status": "P" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-text-align-last", "status": "WD" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-text-autospace", "status": "WD" }, { "gecko": "-moz-text-blink", "webkit": "", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-text-combine", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-epub-text-combine = -webkit-text-combine", "presto": "", "trident": "", "status": "" }, { "gecko": "-moz-text-decoration-color", "webkit": "", "presto": "", "trident": "", "status": "" }, { "gecko": "-moz-text-decoration-line", "webkit": "", "presto": "", "trident": "", "status": "" }, { "gecko": "-moz-text-decoration-style", "webkit": "", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-text-decorations-in-effect", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-text-emphasis", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-epub-text-emphasis = -webkit-text-emphasis", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-text-emphasis-color", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-epub-text-emphasis-color = -webkit-text-emphasis-color", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-text-emphasis-position", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-text-emphasis-style", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-epub-text-emphasis-style = -webkit-text-emphasis-style", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-webkit-text-fill-color", "presto": "", "trident": "", "status": "P" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-text-justify", "status": "WD" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-text-kashida-space", "status": "P" }, { "gecko": "", "webkit": "-webkit-text-orientation", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "-epub-text-orientation = -webkit-text-orientation", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "text-overflow", "presto": "text-overflow", "trident": "-ms-text-overflow", "status": "WD" }, { "gecko": "", "webkit": "-webkit-text-security", "presto": "", "trident": "", "status": "P" }, { "gecko": "", "webkit": "-webkit-text-size-adjust", "presto": "", "trident": "-ms-text-size-adjust", "status": "" }, { "gecko": "", "webkit": "-webkit-text-stroke", "presto": "", "trident": "", "status": "P" }, { "gecko": "", "webkit": "-webkit-text-stroke-color", "presto": "", "trident": "", "status": "P" }, { "gecko": "", "webkit": "-webkit-text-stroke-width", "presto": "", "trident": "", "status": "P" }, { "gecko": "", "webkit": "-epub-text-transform = text-transform", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "", "presto": "", "trident": "-ms-text-underline-position", "status": "P" }, { "gecko": "", "webkit": "-webkit-touch-callout", "presto": "", "trident": "", "status": "P" }, { "gecko": "-moz-transform", "webkit": "-webkit-transform", "presto": "-o-transform", "trident": "-ms-transform", "status": "WD" }, { "gecko": "-moz-transform-origin", "webkit": "-webkit-transform-origin", "presto": "-o-transform-origin", "trident": "-ms-transform-origin", "status": "WD" }, { "gecko": "", "webkit": "-webkit-transform-origin-x", "presto": "", "trident": "", "status": "P" }, { "gecko": "", "webkit": "-webkit-transform-origin-y", "presto": "", "trident": "", "status": "P" }, { "gecko": "", "webkit": "-webkit-transform-origin-z", "presto": "", "trident": "", "status": "P" }, { "gecko": "", "webkit": "-webkit-transform-style", "presto": "", "trident": "", "status": "WD" }, { "gecko": "-moz-transition", "webkit": "-webkit-transition", "presto": "-o-transition", "trident": "", "status": "WD" }, { "gecko": "-moz-transition-delay", "webkit": "-webkit-transition-delay", "presto": "-o-transition-delay", "trident": "", "status": "WD" }, { "gecko": "-moz-transition-duration", "webkit": "-webkit-transition-duration", "presto": "-o-transition-duration", "trident": "", "status": "WD" }, { "gecko": "-moz-transition-property", "webkit": "-webkit-transition-property", "presto": "-o-transition-property", "trident": "", "status": "WD" }, { "gecko": "-moz-transition-timing-function", "webkit": "-webkit-transition-timing-function", "presto": "-o-transition-timing-function", "trident": "", "status": "WD" }, { "gecko": "", "webkit": "-webkit-user-drag", "presto": "", "trident": "", "status": "P" }, { "gecko": "-moz-user-focus", "webkit": "", "presto": "", "trident": "", "status": "P" }, { "gecko": "-moz-user-input", "webkit": "", "presto": "", "trident": "", "status": "P" }, { "gecko": "-moz-user-modify", "webkit": "-webkit-user-modify", "presto": "", "trident": "", "status": "P" }, { "gecko": "-moz-user-select", "webkit": "-webkit-user-select", "presto": "", "trident": "", "status": "P" }, { "gecko": "", "webkit": "", "presto": "-xv-voice-balance", "trident": "", "status": "" }, { "gecko": "", "webkit": "", "presto": "-xv-voice-duration", "trident": "", "status": "" }, { "gecko": "", "webkit": "", "presto": "-xv-voice-pitch", "trident": "", "status": "" }, { "gecko": "", "webkit": "", "presto": "-xv-voice-pitch-range", "trident": "", "status": "" }, { "gecko": "", "webkit": "", "presto": "-xv-voice-rate", "trident": "", "status": "" }, { "gecko": "", "webkit": "", "presto": "-xv-voice-stress", "trident": "", "status": "" }, { "gecko": "", "webkit": "", "presto": "-xv-voice-volume", "trident": "", "status": "" }, { "gecko": "-moz-window-shadow", "webkit": "", "presto": "", "trident": "", "status": "P" }, { "gecko": "", "webkit": "word-break", "presto": "", "trident": "-ms-word-break", "status": "WD" }, { "gecko": "", "webkit": "-epub-word-break = word-break", "presto": "", "trident": "", "status": "" }, { "gecko": "word-wrap", "webkit": "word-wrap", "presto": "word-wrap", "trident": "-ms-word-wrap", "status": "WD" }, { "gecko": "", "webkit": "-webkit-writing-mode", "presto": "writing-mode", "trident": "-ms-writing-mode", "status": "ED" }, { "gecko": "", "webkit": "-epub-writing-mode = -webkit-writing-mode", "presto": "", "trident": "", "status": "" }, { "gecko": "", "webkit": "zoom", "presto": "", "trident": "-ms-zoom", "status": "" }] };var kCSS_PREFIXED_VALUE = [{ "gecko": "-moz-box", "webkit": "-moz-box", "presto": "", "trident": "", "generic": "box" }];var CssInspector = { mVENDOR_PREFIXES: null, kEXPORTS_FOR_GECKO: true, kEXPORTS_FOR_WEBKIT: true, kEXPORTS_FOR_PRESTO: true, kEXPORTS_FOR_TRIDENT: true, cleanPrefixes: function cleanPrefixes() {
		this.mVENDOR_PREFIXES = null;
	}, prefixesForProperty: function prefixesForProperty(aProperty) {
		if (!this.mVENDOR_PREFIXES) {
			this.mVENDOR_PREFIXES = {};for (var i = 0; i < kCSS_VENDOR_PREFIXES.properties.length; i++) {
				var p = kCSS_VENDOR_PREFIXES.properties[i];if (p.gecko && (p.webkit || p.presto || p.trident)) {
					var o = {};if (this.kEXPORTS_FOR_GECKO) o[p.gecko] = true;if (this.kEXPORTS_FOR_WEBKIT && p.webkit) o[p.webkit] = true;if (this.kEXPORTS_FOR_PRESTO && p.presto) o[p.presto] = true;if (this.kEXPORTS_FOR_TRIDENT && p.trident) o[p.trident] = true;this.mVENDOR_PREFIXES[p.gecko] = [];for (var j in o) {
						this.mVENDOR_PREFIXES[p.gecko].push(j);
					}
				}
			}
		}if (aProperty in this.mVENDOR_PREFIXES) return this.mVENDOR_PREFIXES[aProperty].sort();return null;
	}, parseColorStop: function parseColorStop(parser, token) {
		var color = parser.parseColor(token);var position = "";if (!color) return null;token = parser.getToken(true, true);if (token.isPercentage() || token.isDimensionOfUnit("cm") || token.isDimensionOfUnit("mm") || token.isDimensionOfUnit("in") || token.isDimensionOfUnit("pc") || token.isDimensionOfUnit("px") || token.isDimensionOfUnit("em") || token.isDimensionOfUnit("ex") || token.isDimensionOfUnit("pt")) {
			position = token.value;token = parser.getToken(true, true);
		}return { color: color, position: position };
	}, parseGradient: function parseGradient(parser, token) {
		var isRadial = false;var gradient = { isRepeating: false };if (token.isNotNull()) {
			if (token.isFunction("-moz-linear-gradient(") || token.isFunction("-moz-radial-gradient(") || token.isFunction("-moz-repeating-linear-gradient(") || token.isFunction("-moz-repeating-radial-gradient(")) {
				if (token.isFunction("-moz-radial-gradient(") || token.isFunction("-moz-repeating-radial-gradient(")) {
					gradient.isRadial = true;
				}if (token.isFunction("-moz-repeating-linear-gradient(") || token.isFunction("-moz-repeating-radial-gradient(")) {
					gradient.isRepeating = true;
				}token = parser.getToken(true, true);var haveGradientLine = false;var foundHorizPosition = false;var haveAngle = false;if (token.isAngle()) {
					gradient.angle = token.value;haveGradientLine = true;haveAngle = true;token = parser.getToken(true, true);
				}if (token.isLength() || token.isIdent("top") || token.isIdent("center") || token.isIdent("bottom") || token.isIdent("left") || token.isIdent("right")) {
					haveGradientLine = true;if (token.isLength() || token.isIdent("left") || token.isIdent("right")) {
						foundHorizPosition = true;
					}gradient.position = token.value;token = parser.getToken(true, true);
				}if (haveGradientLine) {
					if (!haveAngle && token.isAngle()) {
						gradient.angle = token.value;haveAngle = true;token = parser.getToken(true, true);
					} else if (token.isLength() || foundHorizPosition && (token.isIdent("top") || token.isIdent("center") || token.isIdent("bottom")) || !foundHorizPosition && (token.isLength() || token.isIdent("top") || token.isIdent("center") || token.isIdent("bottom") || token.isIdent("left") || token.isIdent("right"))) {
						gradient.position = "position" in gradient ? gradient.position + " " : "";gradient.position += token.value;token = parser.getToken(true, true);
					}if (!haveAngle && token.isAngle()) {
						gradient.angle = token.value;haveAngle = true;token = parser.getToken(true, true);
					}if (!token.isSymbol(",")) return null;token = parser.getToken(true, true);
				}if (gradient.isRadial) {
					if (token.isIdent("circle") || token.isIdent("ellipse")) {
						gradient.shape = token.value;token = parser.getToken(true, true);
					}if (token.isIdent("closest-side") || token.isIdent("closest-corner") || token.isIdent("farthest-side") || token.isIdent("farthest-corner") || token.isIdent("contain") || token.isIdent("cover")) {
						gradient.size = token.value;token = parser.getToken(true, true);
					}if (!("shape" in gradient) && (token.isIdent("circle") || token.isIdent("ellipse"))) {
						gradient.shape = token.value;token = parser.getToken(true, true);
					}if (("shape" in gradient || "size" in gradient) && !token.isSymbol(",")) return null;else if ("shape" in gradient || "size" in gradient) token = parser.getToken(true, true);
				}var stop1 = this.parseColorStop(parser, token);if (!stop1) return null;token = parser.currentToken();if (!token.isSymbol(",")) return null;token = parser.getToken(true, true);var stop2 = this.parseColorStop(parser, token);if (!stop2) return null;token = parser.currentToken();if (token.isSymbol(",")) {
					token = parser.getToken(true, true);
				}gradient.stops = [stop1, stop2];while (!token.isSymbol(")")) {
					var colorstop = this.parseColorStop(parser, token);if (!colorstop) return null;token = parser.currentToken();if (!token.isSymbol(")") && !token.isSymbol(",")) return null;if (token.isSymbol(",")) token = parser.getToken(true, true);gradient.stops.push(colorstop);
				}return gradient;
			}
		}return null;
	}, parseBoxShadows: function parseBoxShadows(aString) {
		var parser = new CSSParser();parser._init();parser.mPreserveWS = false;parser.mPreserveComments = false;parser.mPreservedTokens = [];parser.mScanner.init(aString);var shadows = [];var token = parser.getToken(true, true);var color = "",
		    blurRadius = "0px",
		    offsetX = "0px",
		    offsetY = "0px",
		    spreadRadius = "0px";var inset = false;while (token.isNotNull()) {
			if (token.isIdent("none")) {
				shadows.push({ none: true });token = parser.getToken(true, true);
			} else {
				if (token.isIdent('inset')) {
					inset = true;token = parser.getToken(true, true);
				}if (token.isPercentage() || token.isDimensionOfUnit("cm") || token.isDimensionOfUnit("mm") || token.isDimensionOfUnit("in") || token.isDimensionOfUnit("pc") || token.isDimensionOfUnit("px") || token.isDimensionOfUnit("em") || token.isDimensionOfUnit("ex") || token.isDimensionOfUnit("pt")) {
					var offsetX = token.value;token = parser.getToken(true, true);
				} else return [];if (!inset && token.isIdent('inset')) {
					inset = true;token = parser.getToken(true, true);
				}if (token.isPercentage() || token.isDimensionOfUnit("cm") || token.isDimensionOfUnit("mm") || token.isDimensionOfUnit("in") || token.isDimensionOfUnit("pc") || token.isDimensionOfUnit("px") || token.isDimensionOfUnit("em") || token.isDimensionOfUnit("ex") || token.isDimensionOfUnit("pt")) {
					var offsetX = token.value;token = parser.getToken(true, true);
				} else return [];if (!inset && token.isIdent('inset')) {
					inset = true;token = parser.getToken(true, true);
				}if (token.isPercentage() || token.isDimensionOfUnit("cm") || token.isDimensionOfUnit("mm") || token.isDimensionOfUnit("in") || token.isDimensionOfUnit("pc") || token.isDimensionOfUnit("px") || token.isDimensionOfUnit("em") || token.isDimensionOfUnit("ex") || token.isDimensionOfUnit("pt")) {
					var blurRadius = token.value;token = parser.getToken(true, true);
				}if (!inset && token.isIdent('inset')) {
					inset = true;token = parser.getToken(true, true);
				}if (token.isPercentage() || token.isDimensionOfUnit("cm") || token.isDimensionOfUnit("mm") || token.isDimensionOfUnit("in") || token.isDimensionOfUnit("pc") || token.isDimensionOfUnit("px") || token.isDimensionOfUnit("em") || token.isDimensionOfUnit("ex") || token.isDimensionOfUnit("pt")) {
					var spreadRadius = token.value;token = parser.getToken(true, true);
				}if (!inset && token.isIdent('inset')) {
					inset = true;token = parser.getToken(true, true);
				}if (token.isFunction("rgb(") || token.isFunction("rgba(") || token.isFunction("hsl(") || token.isFunction("hsla(") || token.isSymbol("#") || token.isIdent()) {
					var color = parser.parseColor(token);token = parser.getToken(true, true);
				}if (!inset && token.isIdent('inset')) {
					inset = true;token = parser.getToken(true, true);
				}shadows.push({ none: false, color: color, offsetX: offsetX, offsetY: offsetY, blurRadius: blurRadius, spreadRadius: spreadRadius });if (token.isSymbol(",")) {
					inset = false;color = "";blurRadius = "0px";spreadRadius = "0px";offsetX = "0px";offsetY = "0px";token = parser.getToken(true, true);
				} else if (!token.isNotNull()) return shadows;else return [];
			}
		}return shadows;
	}, parseTextShadows: function parseTextShadows(aString) {
		var parser = new CSSParser();parser._init();parser.mPreserveWS = false;parser.mPreserveComments = false;parser.mPreservedTokens = [];parser.mScanner.init(aString);var shadows = [];var token = parser.getToken(true, true);var color = "",
		    blurRadius = "0px",
		    offsetX = "0px",
		    offsetY = "0px";while (token.isNotNull()) {
			if (token.isIdent("none")) {
				shadows.push({ none: true });token = parser.getToken(true, true);
			} else {
				if (token.isFunction("rgb(") || token.isFunction("rgba(") || token.isFunction("hsl(") || token.isFunction("hsla(") || token.isSymbol("#") || token.isIdent()) {
					var color = parser.parseColor(token);token = parser.getToken(true, true);
				}if (token.isPercentage() || token.isDimensionOfUnit("cm") || token.isDimensionOfUnit("mm") || token.isDimensionOfUnit("in") || token.isDimensionOfUnit("pc") || token.isDimensionOfUnit("px") || token.isDimensionOfUnit("em") || token.isDimensionOfUnit("ex") || token.isDimensionOfUnit("pt")) {
					var offsetX = token.value;token = parser.getToken(true, true);
				} else return [];if (token.isPercentage() || token.isDimensionOfUnit("cm") || token.isDimensionOfUnit("mm") || token.isDimensionOfUnit("in") || token.isDimensionOfUnit("pc") || token.isDimensionOfUnit("px") || token.isDimensionOfUnit("em") || token.isDimensionOfUnit("ex") || token.isDimensionOfUnit("pt")) {
					var offsetY = token.value;token = parser.getToken(true, true);
				} else return [];if (token.isPercentage() || token.isDimensionOfUnit("cm") || token.isDimensionOfUnit("mm") || token.isDimensionOfUnit("in") || token.isDimensionOfUnit("pc") || token.isDimensionOfUnit("px") || token.isDimensionOfUnit("em") || token.isDimensionOfUnit("ex") || token.isDimensionOfUnit("pt")) {
					var blurRadius = token.value;token = parser.getToken(true, true);
				}if (!color && (token.isFunction("rgb(") || token.isFunction("rgba(") || token.isFunction("hsl(") || token.isFunction("hsla(") || token.isSymbol("#") || token.isIdent())) {
					var color = parser.parseColor(token);token = parser.getToken(true, true);
				}shadows.push({ none: false, color: color, offsetX: offsetX, offsetY: offsetY, blurRadius: blurRadius });if (token.isSymbol(",")) {
					color = "";blurRadius = "0px";offsetX = "0px";offsetY = "0px";token = parser.getToken(true, true);
				} else if (!token.isNotNull()) return shadows;else return [];
			}
		}return shadows;
	}, parseBackgroundImages: function parseBackgroundImages(aString) {
		var parser = new CSSParser();parser._init();parser.mPreserveWS = false;parser.mPreserveComments = false;parser.mPreservedTokens = [];parser.mScanner.init(aString);var backgrounds = [];var token = parser.getToken(true, true);while (token.isNotNull()) {
			if (token.isFunction("url(")) {
				token = parser.getToken(true, true);var urlContent = parser.parseURL(token);backgrounds.push({ type: "image", value: "url(" + urlContent });token = parser.getToken(true, true);
			} else if (token.isFunction("-moz-linear-gradient(") || token.isFunction("-moz-radial-gradient(") || token.isFunction("-moz-repeating-linear-gradient(") || token.isFunction("-moz-repeating-radial-gradient(")) {
				var gradient = this.parseGradient(parser, token);backgrounds.push({ type: gradient.isRadial ? "radial-gradient" : "linear-gradient", value: gradient });token = parser.getToken(true, true);
			} else return null;if (token.isSymbol(",")) {
				token = parser.getToken(true, true);if (!token.isNotNull()) return null;
			}
		}return backgrounds;
	}, serializeGradient: function serializeGradient(gradient) {
		var s = gradient.isRadial ? gradient.isRepeating ? "-moz-repeating-radial-gradient(" : "-moz-radial-gradient(" : gradient.isRepeating ? "-moz-repeating-linear-gradient(" : "-moz-linear-gradient(";if (gradient.angle || gradient.position) s += (gradient.angle ? gradient.angle + " " : "") + (gradient.position ? gradient.position : "") + ", ";if (gradient.isRadial && (gradient.shape || gradient.size)) s += (gradient.shape ? gradient.shape : "") + " " + (gradient.size ? gradient.size : "") + ", ";for (var i = 0; i < gradient.stops.length; i++) {
			var colorstop = gradient.stops[i];s += colorstop.color + (colorstop.position ? " " + colorstop.position : "");if (i != gradient.stops.length - 1) s += ", ";
		}s += ")";return s;
	}, parseBorderImage: function parseBorderImage(aString) {
		var parser = new CSSParser();parser._init();parser.mPreserveWS = false;parser.mPreserveComments = false;parser.mPreservedTokens = [];parser.mScanner.init(aString);var borderImage = { url: "", offsets: [], widths: [], sizes: [] };var token = parser.getToken(true, true);if (token.isFunction("url(")) {
			token = parser.getToken(true, true);var urlContent = parser.parseURL(token);if (urlContent) {
				borderImage.url = urlContent.substr(0, urlContent.length - 1).trim();if (borderImage.url[0] == '"' && borderImage.url[borderImage.url.length - 1] == '"' || borderImage.url[0] == "'" && borderImage.url[borderImage.url.length - 1] == "'") borderImage.url = borderImage.url.substr(1, borderImage.url.length - 2);
			} else return null;
		} else return null;token = parser.getToken(true, true);if (token.isNumber() || token.isPercentage()) borderImage.offsets.push(token.value);else return null;var i;for (i = 0; i < 3; i++) {
			token = parser.getToken(true, true);if (token.isNumber() || token.isPercentage()) borderImage.offsets.push(token.value);else break;
		}if (i == 3) token = parser.getToken(true, true);if (token.isSymbol("/")) {
			token = parser.getToken(true, true);if (token.isDimension() || token.isNumber("0") || token.isIdent() && token.value in parser.kBORDER_WIDTH_NAMES) borderImage.widths.push(token.value);else return null;for (var i = 0; i < 3; i++) {
				token = parser.getToken(true, true);if (token.isDimension() || token.isNumber("0") || token.isIdent() && token.value in parser.kBORDER_WIDTH_NAMES) borderImage.widths.push(token.value);else break;
			}if (i == 3) token = parser.getToken(true, true);
		}for (var i = 0; i < 2; i++) {
			if (token.isIdent("stretch") || token.isIdent("repeat") || token.isIdent("round")) borderImage.sizes.push(token.value);else if (!token.isNotNull()) return borderImage;else return null;token = parser.getToken(true, true);
		}if (!token.isNotNull()) return borderImage;return null;
	}, parseMediaQuery: function parseMediaQuery(aString) {
		var kCONSTRAINTS = { "width": true, "min-width": true, "max-width": true, "height": true, "min-height": true, "max-height": true, "device-width": true, "min-device-width": true, "max-device-width": true, "device-height": true, "min-device-height": true, "max-device-height": true, "orientation": true, "aspect-ratio": true, "min-aspect-ratio": true, "max-aspect-ratio": true, "device-aspect-ratio": true, "min-device-aspect-ratio": true, "max-device-aspect-ratio": true, "color": true, "min-color": true, "max-color": true, "color-index": true, "min-color-index": true, "max-color-index": true, "monochrome": true, "min-monochrome": true, "max-monochrome": true, "resolution": true, "min-resolution": true, "max-resolution": true, "scan": true, "grid": true };var parser = new CSSParser();parser._init();parser.mPreserveWS = false;parser.mPreserveComments = false;parser.mPreservedTokens = [];parser.mScanner.init(aString);var m = { amplifier: "", medium: "", constraints: [] };var token = parser.getToken(true, true);if (token.isIdent("all") || token.isIdent("aural") || token.isIdent("braille") || token.isIdent("handheld") || token.isIdent("print") || token.isIdent("projection") || token.isIdent("screen") || token.isIdent("tty") || token.isIdent("tv")) {
			m.medium = token.value;token = parser.getToken(true, true);
		} else if (token.isIdent("not") || token.isIdent("only")) {
			m.amplifier = token.value;token = parser.getToken(true, true);if (token.isIdent("all") || token.isIdent("aural") || token.isIdent("braille") || token.isIdent("handheld") || token.isIdent("print") || token.isIdent("projection") || token.isIdent("screen") || token.isIdent("tty") || token.isIdent("tv")) {
				m.medium = token.value;token = parser.getToken(true, true);
			} else return null;
		}if (m.medium) {
			if (!token.isNotNull()) return m;if (token.isIdent("and")) {
				token = parser.getToken(true, true);
			} else return null;
		}while (token.isSymbol("(")) {
			token = parser.getToken(true, true);if (token.isIdent() && token.value in kCONSTRAINTS) {
				var constraint = token.value;token = parser.getToken(true, true);if (token.isSymbol(":")) {
					token = parser.getToken(true, true);var values = [];while (!token.isSymbol(")")) {
						values.push(token.value);token = parser.getToken(true, true);
					}if (token.isSymbol(")")) {
						m.constraints.push({ constraint: constraint, value: values });token = parser.getToken(true, true);if (token.isNotNull()) {
							if (token.isIdent("and")) {
								token = parser.getToken(true, true);
							} else return null;
						} else return m;
					} else return null;
				} else if (token.isSymbol(")")) {
					m.constraints.push({ constraint: constraint, value: null });token = parser.getToken(true, true);if (token.isNotNull()) {
						if (token.isIdent("and")) {
							token = parser.getToken(true, true);
						} else return null;
					} else return m;
				} else return null;
			} else return null;
		}return m;
	} };var CSS_ESCAPE = '\\';var IS_HEX_DIGIT = 1;var START_IDENT = 2;var IS_IDENT = 4;var IS_WHITESPACE = 8;var W = IS_WHITESPACE;var I = IS_IDENT;var S = START_IDENT;var SI = IS_IDENT | START_IDENT;var XI = IS_IDENT | IS_HEX_DIGIT;var XSI = IS_IDENT | START_IDENT | IS_HEX_DIGIT;function CSSScanner(aString) {
	this.init(aString);
}CSSScanner.prototype = { kLexTable: [0, 0, 0, 0, 0, 0, 0, 0, 0, W, W, 0, W, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, W, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, I, 0, 0, XI, XI, XI, XI, XI, XI, XI, XI, XI, XI, 0, 0, 0, 0, 0, 0, 0, XSI, XSI, XSI, XSI, XSI, XSI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, 0, S, 0, 0, SI, 0, XSI, XSI, XSI, XSI, XSI, XSI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI], kHexValues: { "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "a": 10, "b": 11, "c": 12, "d": 13, "e": 14, "f": 15 }, mString: "", mPos: 0, mPreservedPos: [], init: function init(aString) {
		this.mString = aString;this.mPos = 0;this.mPreservedPos = [];
	}, getCurrentPos: function getCurrentPos() {
		return this.mPos;
	}, getAlreadyScanned: function getAlreadyScanned() {
		return this.mString.substr(0, this.mPos);
	}, preserveState: function preserveState() {
		this.mPreservedPos.push(this.mPos);
	}, restoreState: function restoreState() {
		if (this.mPreservedPos.length) {
			this.mPos = this.mPreservedPos.pop();
		}
	}, forgetState: function forgetState() {
		if (this.mPreservedPos.length) {
			this.mPreservedPos.pop();
		}
	}, read: function read() {
		if (this.mPos < this.mString.length) return this.mString.charAt(this.mPos++);return -1;
	}, peek: function peek() {
		if (this.mPos < this.mString.length) return this.mString.charAt(this.mPos);return -1;
	}, isHexDigit: function isHexDigit(c) {
		var code = c.charCodeAt(0);return code < 256 && (this.kLexTable[code] & IS_HEX_DIGIT) != 0;
	}, isIdentStart: function isIdentStart(c) {
		var code = c.charCodeAt(0);return code >= 256 || (this.kLexTable[code] & START_IDENT) != 0;
	}, startsWithIdent: function startsWithIdent(aFirstChar, aSecondChar) {
		var code = aFirstChar.charCodeAt(0);return this.isIdentStart(aFirstChar) || aFirstChar == "-" && this.isIdentStart(aSecondChar);
	}, isIdent: function isIdent(c) {
		var code = c.charCodeAt(0);return code >= 256 || (this.kLexTable[code] & IS_IDENT) != 0;
	}, pushback: function pushback() {
		this.mPos--;
	}, nextHexValue: function nextHexValue() {
		var c = this.read();if (c == -1 || !this.isHexDigit(c)) return new jscsspToken(jscsspToken.NULL_TYPE, null);var s = c;c = this.read();while (c != -1 && this.isHexDigit(c)) {
			s += c;c = this.read();
		}if (c != -1) this.pushback();return new jscsspToken(jscsspToken.HEX_TYPE, s);
	}, gatherEscape: function gatherEscape() {
		var c = this.peek();if (c == -1) return "";if (this.isHexDigit(c)) {
			var code = 0;for (var i = 0; i < 6; i++) {
				c = this.read();if (this.isHexDigit(c)) code = code * 16 + this.kHexValues[c.toLowerCase()];else if (!this.isHexDigit(c) && !this.isWhiteSpace(c)) {
					this.pushback();break;
				} else break;
			}if (i == 6) {
				c = this.peek();if (this.isWhiteSpace(c)) this.read();
			}return String.fromCharCode(code);
		}c = this.read();if (c != "\n") return c;return "";
	}, gatherIdent: function gatherIdent(c) {
		var s = "";if (c == CSS_ESCAPE) s += this.gatherEscape();else s += c;c = this.read();while (c != -1 && (this.isIdent(c) || c == CSS_ESCAPE)) {
			if (c == CSS_ESCAPE) s += this.gatherEscape();else s += c;c = this.read();
		}if (c != -1) this.pushback();return s;
	}, parseIdent: function parseIdent(c) {
		var value = this.gatherIdent(c);var nextChar = this.peek();if (nextChar == "(") {
			value += this.read();return new jscsspToken(jscsspToken.FUNCTION_TYPE, value);
		}return new jscsspToken(jscsspToken.IDENT_TYPE, value);
	}, isDigit: function isDigit(c) {
		return c >= '0' && c <= '9';
	}, parseComment: function parseComment(c) {
		var s = c;while ((c = this.read()) != -1) {
			s += c;if (c == "*") {
				c = this.read();if (c == -1) break;if (c == "/") {
					s += c;break;
				}this.pushback();
			}
		}return new jscsspToken(jscsspToken.COMMENT_TYPE, s);
	}, parseNumber: function parseNumber(c) {
		var s = c;var foundDot = false;while ((c = this.read()) != -1) {
			if (c == ".") {
				if (foundDot) break;else {
					s += c;foundDot = true;
				}
			} else if (this.isDigit(c)) s += c;else break;
		}if (c != -1 && this.startsWithIdent(c, this.peek())) {
			var unit = this.gatherIdent(c);s += unit;return new jscsspToken(jscsspToken.DIMENSION_TYPE, s, unit);
		} else if (c == "%") {
			s += "%";return new jscsspToken(jscsspToken.PERCENTAGE_TYPE, s);
		} else if (c != -1) this.pushback();return new jscsspToken(jscsspToken.NUMBER_TYPE, s);
	}, parseString: function parseString(aStop) {
		var s = aStop;var previousChar = aStop;var c;while ((c = this.read()) != -1) {
			if (c == aStop && previousChar != CSS_ESCAPE) {
				s += c;break;
			} else if (c == CSS_ESCAPE) {
				c = this.peek();if (c == -1) break;else if (c == "\n" || c == "\r" || c == "\f") {
					d = c;c = this.read();if (d == "\r") {
						c = this.peek();if (c == "\n") c = this.read();
					}
				} else {
					s += this.gatherEscape();c = this.peek();
				}
			} else if (c == "\n" || c == "\r" || c == "\f") {
				break;
			} else s += c;previousChar = c;
		}return new jscsspToken(jscsspToken.STRING_TYPE, s);
	}, isWhiteSpace: function isWhiteSpace(c) {
		var code = c.charCodeAt(0);return code < 256 && (this.kLexTable[code] & IS_WHITESPACE) != 0;
	}, eatWhiteSpace: function eatWhiteSpace(c) {
		var s = c;while ((c = this.read()) != -1) {
			if (!this.isWhiteSpace(c)) break;s += c;
		}if (c != -1) this.pushback();return s;
	}, parseAtKeyword: function parseAtKeyword(c) {
		return new jscsspToken(jscsspToken.ATRULE_TYPE, this.gatherIdent(c));
	}, nextToken: function nextToken() {
		var c = this.read();if (c == -1) return new jscsspToken(jscsspToken.NULL_TYPE, null);if (this.startsWithIdent(c, this.peek())) return this.parseIdent(c);if (c == '@') {
			var nextChar = this.read();if (nextChar != -1) {
				var followingChar = this.peek();this.pushback();if (this.startsWithIdent(nextChar, followingChar)) return this.parseAtKeyword(c);
			}
		}if (c == "." || c == "+" || c == "-") {
			var nextChar = this.peek();if (this.isDigit(nextChar)) return this.parseNumber(c);else if (nextChar == "." && c != ".") {
				firstChar = this.read();var secondChar = this.peek();this.pushback();if (this.isDigit(secondChar)) return this.parseNumber(c);
			}
		}if (this.isDigit(c)) {
			return this.parseNumber(c);
		}if (c == "'" || c == '"') return this.parseString(c);if (this.isWhiteSpace(c)) {
			var s = this.eatWhiteSpace(c);return new jscsspToken(jscsspToken.WHITESPACE_TYPE, s);
		}if (c == "|" || c == "~" || c == "^" || c == "$" || c == "*") {
			var nextChar = this.read();if (nextChar == "=") {
				switch (c) {case "~":
						return new jscsspToken(jscsspToken.INCLUDES_TYPE, "~=");case "|":
						return new jscsspToken(jscsspToken.DASHMATCH_TYPE, "|=");case "^":
						return new jscsspToken(jscsspToken.BEGINSMATCH_TYPE, "^=");case "$":
						return new jscsspToken(jscsspToken.ENDSMATCH_TYPE, "$=");case "*":
						return new jscsspToken(jscsspToken.CONTAINSMATCH_TYPE, "*=");default:
						break;}
			} else if (nextChar != -1) this.pushback();
		}if (c == "/" && this.peek() == "*") return this.parseComment(c);return new jscsspToken(jscsspToken.SYMBOL_TYPE, c);
	} };function CSSParser(aString) {
	this.mToken = null;this.mLookAhead = null;this.mScanner = new CSSScanner(aString);this.mPreserveWS = true;this.mPreserveComments = true;this.mPreservedTokens = [];this.mError = null;
}CSSParser.prototype = { _init: function _init() {
		this.mToken = null;this.mLookAhead = null;
	}, kINHERIT: "inherit", kBORDER_WIDTH_NAMES: { "thin": true, "medium": true, "thick": true }, kBORDER_STYLE_NAMES: { "none": true, "hidden": true, "dotted": true, "dashed": true, "solid": true, "double": true, "groove": true, "ridge": true, "inset": true, "outset": true }, kCOLOR_NAMES: (_kCOLOR_NAMES = { "transparent": true, "black": true, "silver": true, "gray": true, "white": true, "maroon": true, "red": true, "purple": true, "fuchsia": true, "green": true, "lime": true, "olive": true, "yellow": true, "navy": true, "blue": true, "teal": true, "aqua": true, "aliceblue": true, "antiquewhite": true }, _defineProperty(_kCOLOR_NAMES, "aqua", true), _defineProperty(_kCOLOR_NAMES, "aquamarine", true), _defineProperty(_kCOLOR_NAMES, "azure", true), _defineProperty(_kCOLOR_NAMES, "beige", true), _defineProperty(_kCOLOR_NAMES, "bisque", true), _defineProperty(_kCOLOR_NAMES, "black", true), _defineProperty(_kCOLOR_NAMES, "blanchedalmond", true), _defineProperty(_kCOLOR_NAMES, "blue", true), _defineProperty(_kCOLOR_NAMES, "blueviolet", true), _defineProperty(_kCOLOR_NAMES, "brown", true), _defineProperty(_kCOLOR_NAMES, "burlywood", true), _defineProperty(_kCOLOR_NAMES, "cadetblue", true), _defineProperty(_kCOLOR_NAMES, "chartreuse", true), _defineProperty(_kCOLOR_NAMES, "chocolate", true), _defineProperty(_kCOLOR_NAMES, "coral", true), _defineProperty(_kCOLOR_NAMES, "cornflowerblue", true), _defineProperty(_kCOLOR_NAMES, "cornsilk", true), _defineProperty(_kCOLOR_NAMES, "crimson", true), _defineProperty(_kCOLOR_NAMES, "cyan", true), _defineProperty(_kCOLOR_NAMES, "darkblue", true), _defineProperty(_kCOLOR_NAMES, "darkcyan", true), _defineProperty(_kCOLOR_NAMES, "darkgoldenrod", true), _defineProperty(_kCOLOR_NAMES, "darkgray", true), _defineProperty(_kCOLOR_NAMES, "darkgreen", true), _defineProperty(_kCOLOR_NAMES, "darkgrey", true), _defineProperty(_kCOLOR_NAMES, "darkkhaki", true), _defineProperty(_kCOLOR_NAMES, "darkmagenta", true), _defineProperty(_kCOLOR_NAMES, "darkolivegreen", true), _defineProperty(_kCOLOR_NAMES, "darkorange", true), _defineProperty(_kCOLOR_NAMES, "darkorchid", true), _defineProperty(_kCOLOR_NAMES, "darkred", true), _defineProperty(_kCOLOR_NAMES, "darksalmon", true), _defineProperty(_kCOLOR_NAMES, "darkseagreen", true), _defineProperty(_kCOLOR_NAMES, "darkslateblue", true), _defineProperty(_kCOLOR_NAMES, "darkslategray", true), _defineProperty(_kCOLOR_NAMES, "darkslategrey", true), _defineProperty(_kCOLOR_NAMES, "darkturquoise", true), _defineProperty(_kCOLOR_NAMES, "darkviolet", true), _defineProperty(_kCOLOR_NAMES, "deeppink", true), _defineProperty(_kCOLOR_NAMES, "deepskyblue", true), _defineProperty(_kCOLOR_NAMES, "dimgray", true), _defineProperty(_kCOLOR_NAMES, "dimgrey", true), _defineProperty(_kCOLOR_NAMES, "dodgerblue", true), _defineProperty(_kCOLOR_NAMES, "firebrick", true), _defineProperty(_kCOLOR_NAMES, "floralwhite", true), _defineProperty(_kCOLOR_NAMES, "forestgreen", true), _defineProperty(_kCOLOR_NAMES, "fuchsia", true), _defineProperty(_kCOLOR_NAMES, "gainsboro", true), _defineProperty(_kCOLOR_NAMES, "ghostwhite", true), _defineProperty(_kCOLOR_NAMES, "gold", true), _defineProperty(_kCOLOR_NAMES, "goldenrod", true), _defineProperty(_kCOLOR_NAMES, "gray", true), _defineProperty(_kCOLOR_NAMES, "green", true), _defineProperty(_kCOLOR_NAMES, "greenyellow", true), _defineProperty(_kCOLOR_NAMES, "grey", true), _defineProperty(_kCOLOR_NAMES, "honeydew", true), _defineProperty(_kCOLOR_NAMES, "hotpink", true), _defineProperty(_kCOLOR_NAMES, "indianred", true), _defineProperty(_kCOLOR_NAMES, "indigo", true), _defineProperty(_kCOLOR_NAMES, "ivory", true), _defineProperty(_kCOLOR_NAMES, "khaki", true), _defineProperty(_kCOLOR_NAMES, "lavender", true), _defineProperty(_kCOLOR_NAMES, "lavenderblush", true), _defineProperty(_kCOLOR_NAMES, "lawngreen", true), _defineProperty(_kCOLOR_NAMES, "lemonchiffon", true), _defineProperty(_kCOLOR_NAMES, "lightblue", true), _defineProperty(_kCOLOR_NAMES, "lightcoral", true), _defineProperty(_kCOLOR_NAMES, "lightcyan", true), _defineProperty(_kCOLOR_NAMES, "lightgoldenrodyellow", true), _defineProperty(_kCOLOR_NAMES, "lightgray", true), _defineProperty(_kCOLOR_NAMES, "lightgreen", true), _defineProperty(_kCOLOR_NAMES, "lightgrey", true), _defineProperty(_kCOLOR_NAMES, "lightpink", true), _defineProperty(_kCOLOR_NAMES, "lightsalmon", true), _defineProperty(_kCOLOR_NAMES, "lightseagreen", true), _defineProperty(_kCOLOR_NAMES, "lightskyblue", true), _defineProperty(_kCOLOR_NAMES, "lightslategray", true), _defineProperty(_kCOLOR_NAMES, "lightslategrey", true), _defineProperty(_kCOLOR_NAMES, "lightsteelblue", true), _defineProperty(_kCOLOR_NAMES, "lightyellow", true), _defineProperty(_kCOLOR_NAMES, "lime", true), _defineProperty(_kCOLOR_NAMES, "limegreen", true), _defineProperty(_kCOLOR_NAMES, "linen", true), _defineProperty(_kCOLOR_NAMES, "magenta", true), _defineProperty(_kCOLOR_NAMES, "maroon", true), _defineProperty(_kCOLOR_NAMES, "mediumaquamarine", true), _defineProperty(_kCOLOR_NAMES, "mediumblue", true), _defineProperty(_kCOLOR_NAMES, "mediumorchid", true), _defineProperty(_kCOLOR_NAMES, "mediumpurple", true), _defineProperty(_kCOLOR_NAMES, "mediumseagreen", true), _defineProperty(_kCOLOR_NAMES, "mediumslateblue", true), _defineProperty(_kCOLOR_NAMES, "mediumspringgreen", true), _defineProperty(_kCOLOR_NAMES, "mediumturquoise", true), _defineProperty(_kCOLOR_NAMES, "mediumvioletred", true), _defineProperty(_kCOLOR_NAMES, "midnightblue", true), _defineProperty(_kCOLOR_NAMES, "mintcream", true), _defineProperty(_kCOLOR_NAMES, "mistyrose", true), _defineProperty(_kCOLOR_NAMES, "moccasin", true), _defineProperty(_kCOLOR_NAMES, "navajowhite", true), _defineProperty(_kCOLOR_NAMES, "navy", true), _defineProperty(_kCOLOR_NAMES, "oldlace", true), _defineProperty(_kCOLOR_NAMES, "olive", true), _defineProperty(_kCOLOR_NAMES, "olivedrab", true), _defineProperty(_kCOLOR_NAMES, "orange", true), _defineProperty(_kCOLOR_NAMES, "orangered", true), _defineProperty(_kCOLOR_NAMES, "orchid", true), _defineProperty(_kCOLOR_NAMES, "palegoldenrod", true), _defineProperty(_kCOLOR_NAMES, "palegreen", true), _defineProperty(_kCOLOR_NAMES, "paleturquoise", true), _defineProperty(_kCOLOR_NAMES, "palevioletred", true), _defineProperty(_kCOLOR_NAMES, "papayawhip", true), _defineProperty(_kCOLOR_NAMES, "peachpuff", true), _defineProperty(_kCOLOR_NAMES, "peru", true), _defineProperty(_kCOLOR_NAMES, "pink", true), _defineProperty(_kCOLOR_NAMES, "plum", true), _defineProperty(_kCOLOR_NAMES, "powderblue", true), _defineProperty(_kCOLOR_NAMES, "purple", true), _defineProperty(_kCOLOR_NAMES, "red", true), _defineProperty(_kCOLOR_NAMES, "rosybrown", true), _defineProperty(_kCOLOR_NAMES, "royalblue", true), _defineProperty(_kCOLOR_NAMES, "saddlebrown", true), _defineProperty(_kCOLOR_NAMES, "salmon", true), _defineProperty(_kCOLOR_NAMES, "sandybrown", true), _defineProperty(_kCOLOR_NAMES, "seagreen", true), _defineProperty(_kCOLOR_NAMES, "seashell", true), _defineProperty(_kCOLOR_NAMES, "sienna", true), _defineProperty(_kCOLOR_NAMES, "silver", true), _defineProperty(_kCOLOR_NAMES, "skyblue", true), _defineProperty(_kCOLOR_NAMES, "slateblue", true), _defineProperty(_kCOLOR_NAMES, "slategray", true), _defineProperty(_kCOLOR_NAMES, "slategrey", true), _defineProperty(_kCOLOR_NAMES, "snow", true), _defineProperty(_kCOLOR_NAMES, "springgreen", true), _defineProperty(_kCOLOR_NAMES, "steelblue", true), _defineProperty(_kCOLOR_NAMES, "tan", true), _defineProperty(_kCOLOR_NAMES, "teal", true), _defineProperty(_kCOLOR_NAMES, "thistle", true), _defineProperty(_kCOLOR_NAMES, "tomato", true), _defineProperty(_kCOLOR_NAMES, "turquoise", true), _defineProperty(_kCOLOR_NAMES, "violet", true), _defineProperty(_kCOLOR_NAMES, "wheat", true), _defineProperty(_kCOLOR_NAMES, "white", true), _defineProperty(_kCOLOR_NAMES, "whitesmoke", true), _defineProperty(_kCOLOR_NAMES, "yellow", true), _defineProperty(_kCOLOR_NAMES, "yellowgreen", true), _defineProperty(_kCOLOR_NAMES, "activeborder", true), _defineProperty(_kCOLOR_NAMES, "activecaption", true), _defineProperty(_kCOLOR_NAMES, "appworkspace", true), _defineProperty(_kCOLOR_NAMES, "background", true), _defineProperty(_kCOLOR_NAMES, "buttonface", true), _defineProperty(_kCOLOR_NAMES, "buttonhighlight", true), _defineProperty(_kCOLOR_NAMES, "buttonshadow", true), _defineProperty(_kCOLOR_NAMES, "buttontext", true), _defineProperty(_kCOLOR_NAMES, "captiontext", true), _defineProperty(_kCOLOR_NAMES, "graytext", true), _defineProperty(_kCOLOR_NAMES, "highlight", true), _defineProperty(_kCOLOR_NAMES, "highlighttext", true), _defineProperty(_kCOLOR_NAMES, "inactiveborder", true), _defineProperty(_kCOLOR_NAMES, "inactivecaption", true), _defineProperty(_kCOLOR_NAMES, "inactivecaptiontext", true), _defineProperty(_kCOLOR_NAMES, "infobackground", true), _defineProperty(_kCOLOR_NAMES, "infotext", true), _defineProperty(_kCOLOR_NAMES, "menu", true), _defineProperty(_kCOLOR_NAMES, "menutext", true), _defineProperty(_kCOLOR_NAMES, "scrollbar", true), _defineProperty(_kCOLOR_NAMES, "threeddarkshadow", true), _defineProperty(_kCOLOR_NAMES, "threedface", true), _defineProperty(_kCOLOR_NAMES, "threedhighlight", true), _defineProperty(_kCOLOR_NAMES, "threedlightshadow", true), _defineProperty(_kCOLOR_NAMES, "threedshadow", true), _defineProperty(_kCOLOR_NAMES, "window", true), _defineProperty(_kCOLOR_NAMES, "windowframe", true), _defineProperty(_kCOLOR_NAMES, "windowtext", true), _kCOLOR_NAMES), kLIST_STYLE_TYPE_NAMES: { "decimal": true, "decimal-leading-zero": true, "lower-roman": true, "upper-roman": true, "georgian": true, "armenian": true, "lower-latin": true, "lower-alpha": true, "upper-latin": true, "upper-alpha": true, "lower-greek": true, "disc": true, "circle": true, "square": true, "none": true, "box": true, "check": true, "diamond": true, "hyphen": true, "lower-armenian": true, "cjk-ideographic": true, "ethiopic-numeric": true, "hebrew": true, "japanese-formal": true, "japanese-informal": true, "simp-chinese-formal": true, "simp-chinese-informal": true, "syriac": true, "tamil": true, "trad-chinese-formal": true, "trad-chinese-informal": true, "upper-armenian": true, "arabic-indic": true, "binary": true, "bengali": true, "cambodian": true, "khmer": true, "devanagari": true, "gujarati": true, "gurmukhi": true, "kannada": true, "lower-hexadecimal": true, "lao": true, "malayalam": true, "mongolian": true, "myanmar": true, "octal": true, "oriya": true, "persian": true, "urdu": true, "telugu": true, "tibetan": true, "upper-hexadecimal": true, "afar": true, "ethiopic-halehame-aa-et": true, "ethiopic-halehame-am-et": true, "amharic-abegede": true, "ehiopic-abegede-am-et": true, "cjk-earthly-branch": true, "cjk-heavenly-stem": true, "ethiopic": true, "ethiopic-abegede": true, "ethiopic-abegede-gez": true, "hangul-consonant": true, "hangul": true, "hiragana-iroha": true, "hiragana": true, "katakana-iroha": true, "katakana": true, "lower-norwegian": true, "oromo": true, "ethiopic-halehame-om-et": true, "sidama": true, "ethiopic-halehame-sid-et": true, "somali": true, "ethiopic-halehame-so-et": true, "tigre": true, "ethiopic-halehame-tig": true, "tigrinya-er-abegede": true, "ethiopic-abegede-ti-er": true, "tigrinya-et": true, "ethiopic-halehame-ti-et": true, "upper-greek": true, "asterisks": true, "footnotes": true, "circled-decimal": true, "circled-lower-latin": true, "circled-upper-latin": true, "dotted-decimal": true, "double-circled-decimal": true, "filled-circled-decimal": true, "parenthesised-decimal": true, "parenthesised-lower-latin": true }, reportError: function reportError(aMsg) {
		this.mError = aMsg;
	}, consumeError: function consumeError() {
		var e = this.mError;this.mError = null;return e;
	}, currentToken: function currentToken() {
		return this.mToken;
	}, getHexValue: function getHexValue() {
		this.mToken = this.mScanner.nextHexValue();return this.mToken;
	}, getToken: function getToken(aSkipWS, aSkipComment) {
		if (this.mLookAhead) {
			this.mToken = this.mLookAhead;this.mLookAhead = null;return this.mToken;
		}this.mToken = this.mScanner.nextToken();while (this.mToken && (aSkipWS && this.mToken.isWhiteSpace() || aSkipComment && this.mToken.isComment())) {
			this.mToken = this.mScanner.nextToken();
		}return this.mToken;
	}, lookAhead: function lookAhead(aSkipWS, aSkipComment) {
		var preservedToken = this.mToken;this.mScanner.preserveState();var token = this.getToken(aSkipWS, aSkipComment);this.mScanner.restoreState();this.mToken = preservedToken;return token;
	}, ungetToken: function ungetToken() {
		this.mLookAhead = this.mToken;
	}, addUnknownAtRule: function addUnknownAtRule(aSheet, aString) {
		var currentLine = CountLF(this.mScanner.getAlreadyScanned());var blocks = [];var token = this.getToken(false, false);while (token.isNotNull()) {
			aString += token.value;if (token.isSymbol(";") && !blocks.length) break;else if (token.isSymbol("{") || token.isSymbol("(") || token.isSymbol("[") || token.type == "function") {
				blocks.push(token.isFunction() ? "(" : token.value);
			} else if (token.isSymbol("}") || token.isSymbol(")") || token.isSymbol("]")) {
				if (blocks.length) {
					var ontop = blocks[blocks.length - 1];if (token.isSymbol("}") && ontop == "{" || token.isSymbol(")") && ontop == "(" || token.isSymbol("]") && ontop == "[") {
						blocks.pop();if (!blocks.length && token.isSymbol("}")) break;
					}
				}
			}token = this.getToken(false, false);
		}this.addUnknownRule(aSheet, aString, currentLine);
	}, addUnknownRule: function addUnknownRule(aSheet, aString, aCurrentLine) {
		var errorMsg = this.consumeError();var rule = new jscsspErrorRule(errorMsg);rule.currentLine = aCurrentLine;rule.parsedCssText = aString;rule.parentStyleSheet = aSheet;aSheet.cssRules.push(rule);
	}, addWhitespace: function addWhitespace(aSheet, aString) {
		var rule = new jscsspWhitespace();rule.parsedCssText = aString;rule.parentStyleSheet = aSheet;aSheet.cssRules.push(rule);
	}, addComment: function addComment(aSheet, aString) {
		var rule = new jscsspComment();rule.parsedCssText = aString;rule.parentStyleSheet = aSheet;aSheet.cssRules.push(rule);
	}, parseCharsetRule: function parseCharsetRule(aToken, aSheet) {
		var s = aToken.value;var token = this.getToken(false, false);s += token.value;if (token.isWhiteSpace(" ")) {
			token = this.getToken(false, false);s += token.value;if (token.isString()) {
				var encoding = token.value;token = this.getToken(false, false);s += token.value;if (token.isSymbol(";")) {
					var rule = new jscsspCharsetRule();rule.encoding = encoding;rule.parsedCssText = s;rule.parentStyleSheet = aSheet;aSheet.cssRules.push(rule);return true;
				} else this.reportError(kCHARSET_RULE_MISSING_SEMICOLON);
			} else this.reportError(kCHARSET_RULE_CHARSET_IS_STRING);
		} else this.reportError(kCHARSET_RULE_MISSING_WS);this.addUnknownAtRule(aSheet, s);return false;
	}, parseImportRule: function parseImportRule(aToken, aSheet) {
		var currentLine = CountLF(this.mScanner.getAlreadyScanned());var s = aToken.value;this.preserveState();var token = this.getToken(true, true);var media = [];var href = "";if (token.isString()) {
			href = token.value;s += " " + href;
		} else if (token.isFunction("url(")) {
			token = this.getToken(true, true);var urlContent = this.parseURL(token);if (urlContent) {
				href = "url(" + urlContent;s += " " + href;
			}
		} else this.reportError(kIMPORT_RULE_MISSING_URL);if (href) {
			token = this.getToken(true, true);while (token.isIdent()) {
				s += " " + token.value;media.push(token.value);token = this.getToken(true, true);if (!token) break;if (token.isSymbol(",")) {
					s += ",";
				} else if (token.isSymbol(";")) {
					break;
				} else break;token = this.getToken(true, true);
			}if (!media.length) {
				media.push("all");
			}if (token.isSymbol(";")) {
				s += ";";this.forgetState();var rule = new jscsspImportRule();rule.currentLine = currentLine;rule.parsedCssText = s;rule.href = href;rule.media = media;rule.parentStyleSheet = aSheet;aSheet.cssRules.push(rule);return true;
			}
		}this.restoreState();this.addUnknownAtRule(aSheet, "@import");return false;
	}, parseVariablesRule: function parseVariablesRule(token, aSheet) {
		var currentLine = CountLF(this.mScanner.getAlreadyScanned());var s = token.value;var declarations = [];var valid = false;this.preserveState();token = this.getToken(true, true);var media = [];var foundMedia = false;while (token.isNotNull()) {
			if (token.isIdent()) {
				foundMedia = true;s += " " + token.value;media.push(token.value);token = this.getToken(true, true);if (token.isSymbol(",")) {
					s += ",";
				} else {
					if (token.isSymbol("{")) this.ungetToken();else {
						token.type = jscsspToken.NULL_TYPE;break;
					}
				}
			} else if (token.isSymbol("{")) break;else if (foundMedia) {
				token.type = jscsspToken.NULL_TYPE;break;
			}token = this.getToken(true, true);
		}if (token.isSymbol("{")) {
			s += " {";token = this.getToken(true, true);while (true) {
				if (!token.isNotNull()) {
					valid = true;break;
				}if (token.isSymbol("}")) {
					s += "}";valid = true;break;
				} else {
					var d = this.parseDeclaration(token, declarations, true, false, aSheet);s += (d && declarations.length ? " " : "") + d;
				}token = this.getToken(true, false);
			}
		}if (valid) {
			this.forgetState();var rule = new jscsspVariablesRule();rule.currentLine = currentLine;rule.parsedCssText = s;rule.declarations = declarations;rule.media = media;rule.parentStyleSheet = aSheet;aSheet.cssRules.push(rule);return true;
		}this.restoreState();return false;
	}, parseNamespaceRule: function parseNamespaceRule(aToken, aSheet) {
		var currentLine = CountLF(this.mScanner.getAlreadyScanned());var s = aToken.value;var valid = false;this.preserveState();var token = this.getToken(true, true);if (token.isNotNull()) {
			var prefix = "";var url = "";if (token.isIdent()) {
				prefix = token.value;s += " " + prefix;token = this.getToken(true, true);
			}if (token) {
				var foundURL = false;if (token.isString()) {
					foundURL = true;url = token.value;s += " " + url;
				} else if (token.isFunction("url(")) {
					token = this.getToken(true, true);var urlContent = this.parseURL(token);if (urlContent) {
						url += "url(" + urlContent;foundURL = true;s += " " + urlContent;
					}
				}
			}if (foundURL) {
				token = this.getToken(true, true);if (token.isSymbol(";")) {
					s += ";";this.forgetState();var rule = new jscsspNamespaceRule();rule.currentLine = currentLine;rule.parsedCssText = s;rule.prefix = prefix;rule.url = url;rule.parentStyleSheet = aSheet;aSheet.cssRules.push(rule);return true;
				}
			}
		}this.restoreState();this.addUnknownAtRule(aSheet, "@namespace");return false;
	}, parseFontFaceRule: function parseFontFaceRule(aToken, aSheet) {
		var currentLine = CountLF(this.mScanner.getAlreadyScanned());var s = aToken.value;var valid = false;var descriptors = [];this.preserveState();var token = this.getToken(true, true);if (token.isNotNull()) {
			if (token.isSymbol("{")) {
				s += " " + token.value;var token = this.getToken(true, false);while (true) {
					if (token.isSymbol("}")) {
						s += "}";valid = true;break;
					} else {
						var d = this.parseDeclaration(token, descriptors, false, false, aSheet);s += (d && descriptors.length ? " " : "") + d;
					}token = this.getToken(true, false);
				}
			}
		}if (valid) {
			this.forgetState();var rule = new jscsspFontFaceRule();rule.currentLine = currentLine;rule.parsedCssText = s;rule.descriptors = descriptors;rule.parentStyleSheet = aSheet;aSheet.cssRules.push(rule);return true;
		}this.restoreState();return false;
	}, parsePageRule: function parsePageRule(aToken, aSheet) {
		var currentLine = CountLF(this.mScanner.getAlreadyScanned());var s = aToken.value;var valid = false;var declarations = [];this.preserveState();var token = this.getToken(true, true);var pageSelector = "";if (token.isSymbol(":") || token.isIdent()) {
			if (token.isSymbol(":")) {
				pageSelector = ":";token = this.getToken(false, false);
			}if (token.isIdent()) {
				pageSelector += token.value;s += " " + pageSelector;token = this.getToken(true, true);
			}
		}if (token.isNotNull()) {
			if (token.isSymbol("{")) {
				s += " " + token.value;var token = this.getToken(true, false);while (true) {
					if (token.isSymbol("}")) {
						s += "}";valid = true;break;
					} else {
						var d = this.parseDeclaration(token, declarations, true, true, aSheet);s += (d && declarations.length ? " " : "") + d;
					}token = this.getToken(true, false);
				}
			}
		}if (valid) {
			this.forgetState();var rule = new jscsspPageRule();rule.currentLine = currentLine;rule.parsedCssText = s;rule.pageSelector = pageSelector;rule.declarations = declarations;rule.parentStyleSheet = aSheet;aSheet.cssRules.push(rule);return true;
		}this.restoreState();return false;
	}, parseDefaultPropertyValue: function parseDefaultPropertyValue(token, aDecl, aAcceptPriority, descriptor, aSheet) {
		var valueText = "";var blocks = [];var foundPriority = false;var values = [];while (token.isNotNull()) {
			if ((token.isSymbol(";") || token.isSymbol("}") || token.isSymbol("!")) && !blocks.length) {
				if (token.isSymbol("}")) this.ungetToken();break;
			}if (token.isIdent(this.kINHERIT)) {
				if (values.length) {
					return "";
				} else {
					valueText = this.kINHERIT;var value = new jscsspVariable(kJscsspINHERIT_VALUE, aSheet);values.push(value);token = this.getToken(true, true);break;
				}
			} else if (token.isSymbol("{") || token.isSymbol("(") || token.isSymbol("[")) {
				blocks.push(token.value);
			} else if (token.isSymbol("}") || token.isSymbol("]")) {
				if (blocks.length) {
					var ontop = blocks[blocks.length - 1];if (token.isSymbol("}") && ontop == "{" || token.isSymbol(")") && ontop == "(" || token.isSymbol("]") && ontop == "[") {
						blocks.pop();
					}
				}
			}if (token.isFunction()) {
				if (token.isFunction("var(")) {
					token = this.getToken(true, true);if (token.isIdent()) {
						var name = token.value;token = this.getToken(true, true);if (token.isSymbol(")")) {
							var value = new jscsspVariable(kJscsspVARIABLE_VALUE, aSheet);valueText += "var(" + name + ")";value.name = name;values.push(value);
						} else return "";
					} else return "";
				} else {
					var fn = token.value;token = this.getToken(false, true);var arg = this.parseFunctionArgument(token);if (arg) {
						valueText += fn + arg;var value = new jscsspVariable(kJscsspPRIMITIVE_VALUE, aSheet);value.value = fn + arg;values.push(value);
					} else return "";
				}
			} else if (token.isSymbol("#")) {
				var color = this.parseColor(token);if (color) {
					valueText += color;var value = new jscsspVariable(kJscsspPRIMITIVE_VALUE, aSheet);value.value = color;values.push(value);
				} else return "";
			} else if (!token.isWhiteSpace() && !token.isSymbol(",")) {
				var value = new jscsspVariable(kJscsspPRIMITIVE_VALUE, aSheet);value.value = token.value;values.push(value);valueText += token.value;
			} else valueText += token.value;token = this.getToken(false, true);
		}if (values.length && valueText) {
			this.forgetState();aDecl.push(this._createJscsspDeclarationFromValuesArray(descriptor, values, valueText));return valueText;
		}return "";
	}, parseMarginOrPaddingShorthand: function parseMarginOrPaddingShorthand(token, aDecl, aAcceptPriority, aProperty) {
		var top = null;var bottom = null;var left = null;var right = null;var values = [];while (true) {
			if (!token.isNotNull()) break;if (token.isSymbol(";") || aAcceptPriority && token.isSymbol("!") || token.isSymbol("}")) {
				if (token.isSymbol("}")) this.ungetToken();break;
			} else if (!values.length && token.isIdent(this.kINHERIT)) {
				values.push(token.value);token = this.getToken(true, true);break;
			} else if (token.isDimension() || token.isNumber("0") || token.isPercentage() || token.isIdent("auto")) {
				values.push(token.value);
			} else return "";token = this.getToken(true, true);
		}var count = values.length;switch (count) {case 1:
				top = values[0];bottom = top;left = top;right = top;break;case 2:
				top = values[0];bottom = top;left = values[1];right = left;break;case 3:
				top = values[0];left = values[1];right = left;bottom = values[2];break;case 4:
				top = values[0];right = values[1];bottom = values[2];left = values[3];break;default:
				return "";}this.forgetState();aDecl.push(this._createJscsspDeclarationFromValue(aProperty + "-top", top));aDecl.push(this._createJscsspDeclarationFromValue(aProperty + "-right", right));aDecl.push(this._createJscsspDeclarationFromValue(aProperty + "-bottom", bottom));aDecl.push(this._createJscsspDeclarationFromValue(aProperty + "-left", left));return top + " " + right + " " + bottom + " " + left;
	}, parseBorderColorShorthand: function parseBorderColorShorthand(token, aDecl, aAcceptPriority) {
		var top = null;var bottom = null;var left = null;var right = null;var values = [];while (true) {
			if (!token.isNotNull()) break;if (token.isSymbol(";") || aAcceptPriority && token.isSymbol("!") || token.isSymbol("}")) {
				if (token.isSymbol("}")) this.ungetToken();break;
			} else if (!values.length && token.isIdent(this.kINHERIT)) {
				values.push(token.value);token = this.getToken(true, true);break;
			} else {
				var color = this.parseColor(token);if (color) values.push(color);else return "";
			}token = this.getToken(true, true);
		}var count = values.length;switch (count) {case 1:
				top = values[0];bottom = top;left = top;right = top;break;case 2:
				top = values[0];bottom = top;left = values[1];right = left;break;case 3:
				top = values[0];left = values[1];right = left;bottom = values[2];break;case 4:
				top = values[0];right = values[1];bottom = values[2];left = values[3];break;default:
				return "";}this.forgetState();aDecl.push(this._createJscsspDeclarationFromValue("border-top-color", top));aDecl.push(this._createJscsspDeclarationFromValue("border-right-color", right));aDecl.push(this._createJscsspDeclarationFromValue("border-bottom-color", bottom));aDecl.push(this._createJscsspDeclarationFromValue("border-left-color", left));return top + " " + right + " " + bottom + " " + left;
	}, parseCueShorthand: function parseCueShorthand(token, declarations, aAcceptPriority) {
		var before = "";var after = "";var values = [];var values = [];while (true) {
			if (!token.isNotNull()) break;if (token.isSymbol(";") || aAcceptPriority && token.isSymbol("!") || token.isSymbol("}")) {
				if (token.isSymbol("}")) this.ungetToken();break;
			} else if (!values.length && token.isIdent(this.kINHERIT)) {
				values.push(token.value);
			} else if (token.isIdent("none")) values.push(token.value);else if (token.isFunction("url(")) {
				var token = this.getToken(true, true);var urlContent = this.parseURL(token);if (urlContent) values.push("url(" + urlContent);else return "";
			} else return "";token = this.getToken(true, true);
		}var count = values.length;switch (count) {case 1:
				before = values[0];after = before;break;case 2:
				before = values[0];after = values[1];break;default:
				return "";}this.forgetState();aDecl.push(this._createJscsspDeclarationFromValue("cue-before", before));aDecl.push(this._createJscsspDeclarationFromValue("cue-after", after));return before + " " + after;
	}, parsePauseShorthand: function parsePauseShorthand(token, declarations, aAcceptPriority) {
		var before = "";var after = "";var values = [];var values = [];while (true) {
			if (!token.isNotNull()) break;if (token.isSymbol(";") || aAcceptPriority && token.isSymbol("!") || token.isSymbol("}")) {
				if (token.isSymbol("}")) this.ungetToken();break;
			} else if (!values.length && token.isIdent(this.kINHERIT)) {
				values.push(token.value);
			} else if (token.isDimensionOfUnit("ms") || token.isDimensionOfUnit("s") || token.isPercentage() || token.isNumber("0")) values.push(token.value);else return "";token = this.getToken(true, true);
		}var count = values.length;switch (count) {case 1:
				before = values[0];after = before;break;case 2:
				before = values[0];after = values[1];break;default:
				return "";}this.forgetState();aDecl.push(this._createJscsspDeclarationFromValue("pause-before", before));aDecl.push(this._createJscsspDeclarationFromValue("pause-after", after));return before + " " + after;
	}, parseBorderWidthShorthand: function parseBorderWidthShorthand(token, aDecl, aAcceptPriority) {
		var top = null;var bottom = null;var left = null;var right = null;var values = [];while (true) {
			if (!token.isNotNull()) break;if (token.isSymbol(";") || aAcceptPriority && token.isSymbol("!") || token.isSymbol("}")) {
				if (token.isSymbol("}")) this.ungetToken();break;
			} else if (!values.length && token.isIdent(this.kINHERIT)) {
				values.push(token.value);
			} else if (token.isDimension() || token.isNumber("0") || token.isIdent() && token.value in this.kBORDER_WIDTH_NAMES) {
				values.push(token.value);
			} else return "";token = this.getToken(true, true);
		}var count = values.length;switch (count) {case 1:
				top = values[0];bottom = top;left = top;right = top;break;case 2:
				top = values[0];bottom = top;left = values[1];right = left;break;case 3:
				top = values[0];left = values[1];right = left;bottom = values[2];break;case 4:
				top = values[0];right = values[1];bottom = values[2];left = values[3];break;default:
				return "";}this.forgetState();aDecl.push(this._createJscsspDeclarationFromValue("border-top-width", top));aDecl.push(this._createJscsspDeclarationFromValue("border-right-width", right));aDecl.push(this._createJscsspDeclarationFromValue("border-bottom-width", bottom));aDecl.push(this._createJscsspDeclarationFromValue("border-left-width", left));return top + " " + right + " " + bottom + " " + left;
	}, parseBorderStyleShorthand: function parseBorderStyleShorthand(token, aDecl, aAcceptPriority) {
		var top = null;var bottom = null;var left = null;var right = null;var values = [];while (true) {
			if (!token.isNotNull()) break;if (token.isSymbol(";") || aAcceptPriority && token.isSymbol("!") || token.isSymbol("}")) {
				if (token.isSymbol("}")) this.ungetToken();break;
			} else if (!values.length && token.isIdent(this.kINHERIT)) {
				values.push(token.value);
			} else if (token.isIdent() && token.value in this.kBORDER_STYLE_NAMES) {
				values.push(token.value);
			} else return "";token = this.getToken(true, true);
		}var count = values.length;switch (count) {case 1:
				top = values[0];bottom = top;left = top;right = top;break;case 2:
				top = values[0];bottom = top;left = values[1];right = left;break;case 3:
				top = values[0];left = values[1];right = left;bottom = values[2];break;case 4:
				top = values[0];right = values[1];bottom = values[2];left = values[3];break;default:
				return "";}this.forgetState();aDecl.push(this._createJscsspDeclarationFromValue("border-top-style", top));aDecl.push(this._createJscsspDeclarationFromValue("border-right-style", right));aDecl.push(this._createJscsspDeclarationFromValue("border-bottom-style", bottom));aDecl.push(this._createJscsspDeclarationFromValue("border-left-style", left));return top + " " + right + " " + bottom + " " + left;
	}, parseBorderEdgeOrOutlineShorthand: function parseBorderEdgeOrOutlineShorthand(token, aDecl, aAcceptPriority, aProperty) {
		var bWidth = null;var bStyle = null;var bColor = null;while (true) {
			if (!token.isNotNull()) break;if (token.isSymbol(";") || aAcceptPriority && token.isSymbol("!") || token.isSymbol("}")) {
				if (token.isSymbol("}")) this.ungetToken();break;
			} else if (!bWidth && !bStyle && !bColor && token.isIdent(this.kINHERIT)) {
				bWidth = this.kINHERIT;bStyle = this.kINHERIT;bColor = this.kINHERIT;
			} else if (!bWidth && (token.isDimension() || token.isIdent() && token.value in this.kBORDER_WIDTH_NAMES || token.isNumber("0"))) {
				bWidth = token.value;
			} else if (!bStyle && token.isIdent() && token.value in this.kBORDER_STYLE_NAMES) {
				bStyle = token.value;
			} else {
				var color = aProperty == "outline" && token.isIdent("invert") ? "invert" : this.parseColor(token);if (!bColor && color) bColor = color;else return "";
			}token = this.getToken(true, true);
		}this.forgetState();bWidth = bWidth ? bWidth : "medium";bStyle = bStyle ? bStyle : "none";bColor = bColor ? bColor : "-moz-initial";function addPropertyToDecl(aSelf, aDecl, property, w, s, c) {
			aDecl.push(aSelf._createJscsspDeclarationFromValue(property + "-width", w));aDecl.push(aSelf._createJscsspDeclarationFromValue(property + "-style", s));aDecl.push(aSelf._createJscsspDeclarationFromValue(property + "-color", c));
		}if (aProperty == "border") {
			addPropertyToDecl(this, aDecl, "border-top", bWidth, bStyle, bColor);addPropertyToDecl(this, aDecl, "border-right", bWidth, bStyle, bColor);addPropertyToDecl(this, aDecl, "border-bottom", bWidth, bStyle, bColor);addPropertyToDecl(this, aDecl, "border-left", bWidth, bStyle, bColor);
		} else addPropertyToDecl(this, aDecl, aProperty, bWidth, bStyle, bColor);return bWidth + " " + bStyle + " " + bColor;
	}, parseBackgroundShorthand: function parseBackgroundShorthand(token, aDecl, aAcceptPriority) {
		var kHPos = { "left": true, "right": true };var kVPos = { "top": true, "bottom": true };var kPos = { "left": true, "right": true, "top": true, "bottom": true, "center": true };var bgColor = null;var bgRepeat = null;var bgAttachment = null;var bgImage = null;var bgPosition = null;while (true) {
			if (!token.isNotNull()) break;if (token.isSymbol(";") || aAcceptPriority && token.isSymbol("!") || token.isSymbol("}")) {
				if (token.isSymbol("}")) this.ungetToken();break;
			} else if (!bgColor && !bgRepeat && !bgAttachment && !bgImage && !bgPosition && token.isIdent(this.kINHERIT)) {
				bgColor = this.kINHERIT;bgRepeat = this.kINHERIT;bgAttachment = this.kINHERIT;bgImage = this.kINHERIT;bgPosition = this.kINHERIT;
			} else {
				if (!bgAttachment && (token.isIdent("scroll") || token.isIdent("fixed"))) {
					bgAttachment = token.value;
				} else if (!bgPosition && (token.isIdent() && token.value in kPos || token.isDimension() || token.isNumber("0") || token.isPercentage())) {
					bgPosition = token.value;token = this.getToken(true, true);if (token.isDimension() || token.isNumber("0") || token.isPercentage()) {
						bgPosition += " " + token.value;
					} else if (token.isIdent() && token.value in kPos) {
						if (bgPosition in kHPos && token.value in kHPos || bgPosition in kVPos && token.value in kVPos) return "";bgPosition += " " + token.value;
					} else {
						this.ungetToken();bgPosition += " center";
					}
				} else if (!bgRepeat && (token.isIdent("repeat") || token.isIdent("repeat-x") || token.isIdent("repeat-y") || token.isIdent("no-repeat"))) {
					bgRepeat = token.value;
				} else if (!bgImage && (token.isFunction("url(") || token.isIdent("none"))) {
					bgImage = token.value;if (token.isFunction("url(")) {
						token = this.getToken(true, true);var url = this.parseURL(token);if (url) bgImage += url;else return "";
					}
				} else if (!bgImage && (token.isFunction("-moz-linear-gradient(") || token.isFunction("-moz-radial-gradient(") || token.isFunction("-moz-repeating-linear-gradient(") || token.isFunction("-moz-repeating-radial-gradient("))) {
					var gradient = CssInspector.parseGradient(this, token);if (gradient) bgImage = CssInspector.serializeGradient(gradient);else return "";
				} else {
					var color = this.parseColor(token);if (!bgColor && color) bgColor = color;else return "";
				}
			}token = this.getToken(true, true);
		}this.forgetState();bgColor = bgColor ? bgColor : "transparent";bgImage = bgImage ? bgImage : "none";bgRepeat = bgRepeat ? bgRepeat : "repeat";bgAttachment = bgAttachment ? bgAttachment : "scroll";bgPosition = bgPosition ? bgPosition : "top left";aDecl.push(this._createJscsspDeclarationFromValue("background-color", bgColor));aDecl.push(this._createJscsspDeclarationFromValue("background-image", bgImage));aDecl.push(this._createJscsspDeclarationFromValue("background-repeat", bgRepeat));aDecl.push(this._createJscsspDeclarationFromValue("background-attachment", bgAttachment));aDecl.push(this._createJscsspDeclarationFromValue("background-position", bgPosition));return bgColor + " " + bgImage + " " + bgRepeat + " " + bgAttachment + " " + bgPosition;
	}, parseListStyleShorthand: function parseListStyleShorthand(token, aDecl, aAcceptPriority) {
		var kPosition = { "inside": true, "outside": true };var lType = null;var lPosition = null;var lImage = null;while (true) {
			if (!token.isNotNull()) break;if (token.isSymbol(";") || aAcceptPriority && token.isSymbol("!") || token.isSymbol("}")) {
				if (token.isSymbol("}")) this.ungetToken();break;
			} else if (!lType && !lPosition && !lImage && token.isIdent(this.kINHERIT)) {
				lType = this.kINHERIT;lPosition = this.kINHERIT;lImage = this.kINHERIT;
			} else if (!lType && token.isIdent() && token.value in this.kLIST_STYLE_TYPE_NAMES) {
				lType = token.value;
			} else if (!lPosition && token.isIdent() && token.value in kPosition) {
				lPosition = token.value;
			} else if (!lImage && token.isFunction("url")) {
				token = this.getToken(true, true);var urlContent = this.parseURL(token);if (urlContent) {
					lImage = "url(" + urlContent;
				} else return "";
			} else if (!token.isIdent("none")) return "";token = this.getToken(true, true);
		}this.forgetState();lType = lType ? lType : "none";lImage = lImage ? lImage : "none";lPosition = lPosition ? lPosition : "outside";aDecl.push(this._createJscsspDeclarationFromValue("list-style-type", lType));aDecl.push(this._createJscsspDeclarationFromValue("list-style-position", lPosition));aDecl.push(this._createJscsspDeclarationFromValue("list-style-image", lImage));return lType + " " + lPosition + " " + lImage;
	}, parseFontShorthand: function parseFontShorthand(token, aDecl, aAcceptPriority) {
		var kStyle = { "italic": true, "oblique": true };var kVariant = { "small-caps": true };var kWeight = { "bold": true, "bolder": true, "lighter": true, "100": true, "200": true, "300": true, "400": true, "500": true, "600": true, "700": true, "800": true, "900": true };var kSize = { "xx-small": true, "x-small": true, "small": true, "medium": true, "large": true, "x-large": true, "xx-large": true, "larger": true, "smaller": true };var kValues = { "caption": true, "icon": true, "menu": true, "message-box": true, "small-caption": true, "status-bar": true };var kFamily = { "serif": true, "sans-serif": true, "cursive": true, "fantasy": true, "monospace": true };var fStyle = null;var fVariant = null;var fWeight = null;var fSize = null;var fLineHeight = null;var fFamily = "";var fSystem = null;var fFamilyValues = [];var normalCount = 0;while (true) {
			if (!token.isNotNull()) break;if (token.isSymbol(";") || aAcceptPriority && token.isSymbol("!") || token.isSymbol("}")) {
				if (token.isSymbol("}")) this.ungetToken();break;
			} else if (!fStyle && !fVariant && !fWeight && !fSize && !fLineHeight && !fFamily && !fSystem && token.isIdent(this.kINHERIT)) {
				fStyle = this.kINHERIT;fVariant = this.kINHERIT;fWeight = this.kINHERIT;fSize = this.kINHERIT;fLineHeight = this.kINHERIT;fFamily = this.kINHERIT;fSystem = this.kINHERIT;
			} else {
				if (!fSystem && token.isIdent() && token.value in kValues) {
					fSystem = token.value;break;
				} else {
					if (!fStyle && token.isIdent() && token.value in kStyle) {
						fStyle = token.value;
					} else if (!fVariant && token.isIdent() && token.value in kVariant) {
						fVariant = token.value;
					} else if (!fWeight && (token.isIdent() || token.isNumber()) && token.value in kWeight) {
						fWeight = token.value;
					} else if (!fSize && (token.isIdent() && token.value in kSize || token.isDimension() || token.isPercentage())) {
						fSize = token.value;var token = this.getToken(false, false);if (token.isSymbol("/")) {
							token = this.getToken(false, false);if (!fLineHeight && (token.isDimension() || token.isNumber() || token.isPercentage())) {
								fLineHeight = token.value;
							} else return "";
						} else this.ungetToken();
					} else if (token.isIdent("normal")) {
						normalCount++;if (normalCount > 3) return "";
					} else if (!fFamily && (token.isString() || token.isIdent())) {
						var lastWasComma = false;while (true) {
							if (!token.isNotNull()) break;else if (token.isSymbol(";") || aAcceptPriority && token.isSymbol("!") || token.isSymbol("}")) {
								this.ungetToken();break;
							} else if (token.isIdent() && token.value in kFamily) {
								var value = new jscsspVariable(kJscsspPRIMITIVE_VALUE, null);value.value = token.value;fFamilyValues.push(value);fFamily += token.value;break;
							} else if (token.isString() || token.isIdent()) {
								var value = new jscsspVariable(kJscsspPRIMITIVE_VALUE, null);value.value = token.value;fFamilyValues.push(value);fFamily += token.value;lastWasComma = false;
							} else if (!lastWasComma && token.isSymbol(",")) {
								fFamily += ", ";lastWasComma = true;
							} else return "";token = this.getToken(true, true);
						}
					} else {
						return "";
					}
				}
			}token = this.getToken(true, true);
		}this.forgetState();if (fSystem) {
			aDecl.push(this._createJscsspDeclarationFromValue("font", fSystem));return fSystem;
		}fStyle = fStyle ? fStyle : "normal";fVariant = fVariant ? fVariant : "normal";fWeight = fWeight ? fWeight : "normal";fSize = fSize ? fSize : "medium";fLineHeight = fLineHeight ? fLineHeight : "normal";fFamily = fFamily ? fFamily : "-moz-initial";aDecl.push(this._createJscsspDeclarationFromValue("font-style", fStyle));aDecl.push(this._createJscsspDeclarationFromValue("font-variant", fVariant));aDecl.push(this._createJscsspDeclarationFromValue("font-weight", fWeight));aDecl.push(this._createJscsspDeclarationFromValue("font-size", fSize));aDecl.push(this._createJscsspDeclarationFromValue("line-height", fLineHeight));aDecl.push(this._createJscsspDeclarationFromValuesArray("font-family", fFamilyValues, fFamily));return fStyle + " " + fVariant + " " + fWeight + " " + fSize + "/" + fLineHeight + " " + fFamily;
	}, _createJscsspDeclaration: function _createJscsspDeclaration(property, value) {
		var decl = new jscsspDeclaration();decl.property = property;decl.value = this.trim11(value);decl.parsedCssText = property + ": " + value + ";";return decl;
	}, _createJscsspDeclarationFromValue: function _createJscsspDeclarationFromValue(property, valueText) {
		var decl = new jscsspDeclaration();decl.property = property;var value = new jscsspVariable(kJscsspPRIMITIVE_VALUE, null);value.value = valueText;decl.values = [value];decl.valueText = valueText;decl.parsedCssText = property + ": " + valueText + ";";return decl;
	}, _createJscsspDeclarationFromValuesArray: function _createJscsspDeclarationFromValuesArray(property, values, valueText) {
		var decl = new jscsspDeclaration();decl.property = property;decl.values = values;decl.valueText = valueText;decl.parsedCssText = property + ": " + valueText + ";";return decl;
	}, parseURL: function parseURL(token) {
		var value = "";if (token.isString()) {
			value += token.value;token = this.getToken(true, true);
		} else while (true) {
			if (!token.isNotNull()) {
				this.reportError(kURL_EOF);return "";
			}if (token.isWhiteSpace()) {
				nextToken = this.lookAhead(true, true);if (!nextToken.isSymbol(")")) {
					this.reportError(kURL_WS_INSIDE);token = this.currentToken();break;
				}
			}if (token.isSymbol(")")) {
				break;
			}value += token.value;token = this.getToken(false, false);
		}if (token.isSymbol(")")) {
			return value + ")";
		}return "";
	}, parseFunctionArgument: function parseFunctionArgument(token) {
		var value = "";if (token.isString()) {
			value += token.value;token = this.getToken(true, true);
		} else {
			var parenthesis = 1;while (true) {
				if (!token.isNotNull()) return "";if (token.isFunction() || token.isSymbol("(")) parenthesis++;if (token.isSymbol(")")) {
					parenthesis--;if (!parenthesis) break;
				}value += token.value;token = this.getToken(false, false);
			}
		}if (token.isSymbol(")")) return value + ")";return "";
	}, parseColor: function parseColor(token) {
		var color = "";if (token.isFunction("rgb(") || token.isFunction("rgba(")) {
			color = token.value;var isRgba = token.isFunction("rgba(");token = this.getToken(true, true);if (!token.isNumber() && !token.isPercentage()) return "";color += token.value;token = this.getToken(true, true);if (!token.isSymbol(",")) return "";color += ", ";token = this.getToken(true, true);if (!token.isNumber() && !token.isPercentage()) return "";color += token.value;token = this.getToken(true, true);if (!token.isSymbol(",")) return "";color += ", ";token = this.getToken(true, true);if (!token.isNumber() && !token.isPercentage()) return "";color += token.value;if (isRgba) {
				token = this.getToken(true, true);if (!token.isSymbol(",")) return "";color += ", ";token = this.getToken(true, true);if (!token.isNumber()) return "";color += token.value;
			}token = this.getToken(true, true);if (!token.isSymbol(")")) return "";color += token.value;
		} else if (token.isFunction("hsl(") || token.isFunction("hsla(")) {
			color = token.value;var isHsla = token.isFunction("hsla(");token = this.getToken(true, true);if (!token.isNumber()) return "";color += token.value;token = this.getToken(true, true);if (!token.isSymbol(",")) return "";color += ", ";token = this.getToken(true, true);if (!token.isPercentage()) return "";color += token.value;token = this.getToken(true, true);if (!token.isSymbol(",")) return "";color += ", ";token = this.getToken(true, true);if (!token.isPercentage()) return "";color += token.value;if (isHsla) {
				token = this.getToken(true, true);if (!token.isSymbol(",")) return "";color += ", ";token = this.getToken(true, true);if (!token.isNumber()) return "";color += token.value;
			}token = this.getToken(true, true);if (!token.isSymbol(")")) return "";color += token.value;
		} else if (token.isIdent() && token.value in this.kCOLOR_NAMES) color = token.value;else if (token.isSymbol("#")) {
			token = this.getHexValue();if (!token.isHex()) return "";var length = token.value.length;if (length != 3 && length != 6) return "";if (token.value.match(/[a-fA-F0-9]/g).length != length) return "";color = "#" + token.value;
		}return color;
	}, parseDeclaration: function parseDeclaration(aToken, aDecl, aAcceptPriority, aExpandShorthands, aSheet) {
		this.preserveState();var blocks = [];if (aToken.isIdent()) {
			var descriptor = aToken.value.toLowerCase();var token = this.getToken(true, true);if (token.isSymbol(":")) {
				var token = this.getToken(true, true);var value = "";var declarations = [];if (aExpandShorthands) switch (descriptor) {case "background":
						value = this.parseBackgroundShorthand(token, declarations, aAcceptPriority);break;case "margin":case "padding":
						value = this.parseMarginOrPaddingShorthand(token, declarations, aAcceptPriority, descriptor);break;case "border-color":
						value = this.parseBorderColorShorthand(token, declarations, aAcceptPriority);break;case "border-style":
						value = this.parseBorderStyleShorthand(token, declarations, aAcceptPriority);break;case "border-width":
						value = this.parseBorderWidthShorthand(token, declarations, aAcceptPriority);break;case "border-top":case "border-right":case "border-bottom":case "border-left":case "border":case "outline":
						value = this.parseBorderEdgeOrOutlineShorthand(token, declarations, aAcceptPriority, descriptor);break;case "cue":
						value = this.parseCueShorthand(token, declarations, aAcceptPriority);break;case "pause":
						value = this.parsePauseShorthand(token, declarations, aAcceptPriority);break;case "font":
						value = this.parseFontShorthand(token, declarations, aAcceptPriority);break;case "list-style":
						value = this.parseListStyleShorthand(token, declarations, aAcceptPriority);break;default:
						value = this.parseDefaultPropertyValue(token, declarations, aAcceptPriority, descriptor, aSheet);break;} else value = this.parseDefaultPropertyValue(token, declarations, aAcceptPriority, descriptor, aSheet);token = this.currentToken();if (value) {
					var priority = false;if (token.isSymbol("!")) {
						token = this.getToken(true, true);if (token.isIdent("important")) {
							priority = true;token = this.getToken(true, true);if (token.isSymbol(";") || token.isSymbol("}")) {
								if (token.isSymbol("}")) this.ungetToken();
							} else return "";
						} else return "";
					} else if (token.isNotNull() && !token.isSymbol(";") && !token.isSymbol("}")) return "";for (var i = 0; i < declarations.length; i++) {
						declarations[i].priority = priority;aDecl.push(declarations[i]);
					}return descriptor + ": " + value + ";";
				}
			}
		} else if (aToken.isComment()) {
			if (this.mPreserveComments) {
				this.forgetState();var comment = new jscsspComment();comment.parsedCssText = aToken.value;aDecl.push(comment);
			}return aToken.value;
		}this.restoreState();var s = aToken.value;blocks = [];var token = this.getToken(false, false);while (token.isNotNull()) {
			s += token.value;if ((token.isSymbol(";") || token.isSymbol("}")) && !blocks.length) {
				if (token.isSymbol("}")) this.ungetToken();break;
			} else if (token.isSymbol("{") || token.isSymbol("(") || token.isSymbol("[") || token.isFunction()) {
				blocks.push(token.isFunction() ? "(" : token.value);
			} else if (token.isSymbol("}") || token.isSymbol(")") || token.isSymbol("]")) {
				if (blocks.length) {
					var ontop = blocks[blocks.length - 1];if (token.isSymbol("}") && ontop == "{" || token.isSymbol(")") && ontop == "(" || token.isSymbol("]") && ontop == "[") {
						blocks.pop();
					}
				}
			}token = this.getToken(false, false);
		}return "";
	}, parseKeyframesRule: function parseKeyframesRule(aToken, aSheet) {
		var currentLine = CountLF(this.mScanner.getAlreadyScanned());var s = aToken.value;var valid = false;var keyframesRule = new jscsspKeyframesRule();keyframesRule.currentLine = currentLine;this.preserveState();var token = this.getToken(true, true);var foundName = false;while (token.isNotNull()) {
			if (token.isIdent()) {
				foundName = true;s += " " + token.value;keyframesRule.name = token.value;token = this.getToken(true, true);if (token.isSymbol("{")) this.ungetToken();else {
					token.type = jscsspToken.NULL_TYPE;break;
				}
			} else if (token.isSymbol("{")) {
				if (!foundName) {
					token.type = jscsspToken.NULL_TYPE;
				}break;
			} else {
				token.type = jscsspToken.NULL_TYPE;break;
			}token = this.getToken(true, true);
		}if (token.isSymbol("{") && keyframesRule.name) {
			s += " { ";token = this.getToken(true, false);while (token.isNotNull()) {
				if (token.isComment() && this.mPreserveComments) {
					s += " " + token.value;var comment = new jscsspComment();comment.parsedCssText = token.value;keyframesRule.cssRules.push(comment);
				} else if (token.isSymbol("}")) {
					valid = true;break;
				} else {
					var r = this.parseKeyframeRule(token, keyframesRule, true);if (r) s += r;
				}token = this.getToken(true, false);
			}
		}if (valid) {
			this.forgetState();keyframesRule.currentLine = currentLine;keyframesRule.parsedCssText = s;aSheet.cssRules.push(keyframesRule);return true;
		}this.restoreState();return false;
	}, parseKeyframeRule: function parseKeyframeRule(aToken, aOwner) {
		var currentLine = CountLF(this.mScanner.getAlreadyScanned());this.preserveState();var token = aToken;var key = "";while (token.isNotNull()) {
			if (token.isIdent() || token.isPercentage()) {
				if (token.isIdent() && !token.isIdent("from") && !token.isIdent("to")) {
					key = "";break;
				}key += token.value;token = this.getToken(true, true);if (token.isSymbol("{")) {
					this.ungetToken();break;
				} else if (token.isSymbol(",")) {
					key += ", ";
				} else {
					key = "";break;
				}
			} else {
				key = "";break;
			}token = this.getToken(true, true);
		}var valid = false;var declarations = [];if (key) {
			var s = key;token = this.getToken(true, true);if (token.isSymbol("{")) {
				s += " { ";token = this.getToken(true, false);while (true) {
					if (!token.isNotNull()) {
						valid = true;break;
					}if (token.isSymbol("}")) {
						s += "}";valid = true;break;
					} else {
						var d = this.parseDeclaration(token, declarations, true, true, aOwner);s += (d && declarations.length ? " " : "") + d;
					}token = this.getToken(true, false);
				}
			}
		} else {}if (valid) {
			var rule = new jscsspKeyframeRule();rule.currentLine = currentLine;rule.parsedCssText = s;rule.declarations = declarations;rule.keyText = key;rule.parentRule = aOwner;aOwner.cssRules.push(rule);return s;
		}this.restoreState();s = this.currentToken().value;this.addUnknownAtRule(aOwner, s);return "";
	}, parseMediaRule: function parseMediaRule(aToken, aSheet) {
		var currentLine = CountLF(this.mScanner.getAlreadyScanned());var s = aToken.value;var valid = false;var mediaRule = new jscsspMediaRule();mediaRule.currentLine = currentLine;this.preserveState();var token = this.getToken(true, true);var foundMedia = false;while (token.isNotNull()) {
			if (token.isIdent()) {
				foundMedia = true;s += " " + token.value;mediaRule.media.push(token.value);token = this.getToken(true, true);if (token.isSymbol(",")) {
					s += ",";
				} else {
					if (token.isSymbol("{")) this.ungetToken();else {
						token.type = jscsspToken.NULL_TYPE;break;
					}
				}
			} else if (token.isSymbol("{")) break;else if (foundMedia) {
				token.type = jscsspToken.NULL_TYPE;break;
			}token = this.getToken(true, true);
		}if (token.isSymbol("{") && mediaRule.media.length) {
			s += " { ";token = this.getToken(true, false);while (token.isNotNull()) {
				if (token.isComment() && this.mPreserveComments) {
					s += " " + token.value;var comment = new jscsspComment();comment.parsedCssText = token.value;mediaRule.cssRules.push(comment);
				} else if (token.isSymbol("}")) {
					valid = true;break;
				} else {
					var r = this.parseStyleRule(token, mediaRule, true);if (r) s += r;
				}token = this.getToken(true, false);
			}
		}if (valid) {
			this.forgetState();mediaRule.parsedCssText = s;aSheet.cssRules.push(mediaRule);return true;
		}this.restoreState();return false;
	}, trim11: function trim11(str) {
		str = str.replace(/^\s+/, '');for (var i = str.length - 1; i >= 0; i--) {
			if (/\S/.test(str.charAt(i))) {
				str = str.substring(0, i + 1);break;
			}
		}return str;
	}, parseStyleRule: function parseStyleRule(aToken, aOwner, aIsInsideMediaRule) {
		var currentLine = CountLF(this.mScanner.getAlreadyScanned());this.preserveState();var selector = this.parseSelector(aToken, false);var valid = false;var declarations = [];if (selector) {
			selector = this.trim11(selector.selector);var s = selector;var token = this.getToken(true, true);if (token.isSymbol("{")) {
				s += " { ";var token = this.getToken(true, false);while (true) {
					if (!token.isNotNull()) {
						valid = true;break;
					}if (token.isSymbol("}")) {
						s += "}";valid = true;break;
					} else {
						var d = this.parseDeclaration(token, declarations, true, true, aOwner);s += (d && declarations.length ? " " : "") + d;
					}token = this.getToken(true, false);
				}
			}
		} else {}if (valid) {
			var rule = new jscsspStyleRule();rule.currentLine = currentLine;rule.parsedCssText = s;rule.declarations = declarations;rule.mSelectorText = selector;if (aIsInsideMediaRule) rule.parentRule = aOwner;else rule.parentStyleSheet = aOwner;aOwner.cssRules.push(rule);return s;
		}this.restoreState();s = this.currentToken().value;this.addUnknownAtRule(aOwner, s);return "";
	}, parseSelector: function parseSelector(aToken, aParseSelectorOnly) {
		var s = "";var specificity = { a: 0, b: 0, c: 0, d: 0 };var isFirstInChain = true;var token = aToken;var valid = false;var combinatorFound = false;while (true) {
			if (!token.isNotNull()) {
				if (aParseSelectorOnly) return { selector: s, specificity: specificity };return "";
			}if (!aParseSelectorOnly && token.isSymbol("{")) {
				valid = !combinatorFound;if (valid) this.ungetToken();break;
			}if (token.isSymbol(",")) {
				s += token.value;isFirstInChain = true;combinatorFound = false;token = this.getToken(false, true);continue;
			} else if (!combinatorFound && (token.isWhiteSpace() || token.isSymbol(">") || token.isSymbol("+") || token.isSymbol("~"))) {
				if (token.isWhiteSpace()) {
					s += " ";var nextToken = this.lookAhead(true, true);if (!nextToken.isNotNull()) {
						if (aParseSelectorOnly) return { selector: s, specificity: specificity };return "";
					}if (nextToken.isSymbol(">") || nextToken.isSymbol("+") || nextToken.isSymbol("~")) {
						token = this.getToken(true, true);s += token.value + " ";combinatorFound = true;
					}
				} else {
					s += token.value;combinatorFound = true;
				}isFirstInChain = true;token = this.getToken(true, true);continue;
			} else {
				var simpleSelector = this.parseSimpleSelector(token, isFirstInChain, true);if (!simpleSelector) break;s += simpleSelector.selector;specificity.b += simpleSelector.specificity.b;specificity.c += simpleSelector.specificity.c;specificity.d += simpleSelector.specificity.d;isFirstInChain = false;combinatorFound = false;
			}token = this.getToken(false, true);
		}if (valid) {
			return { selector: s, specificity: specificity };
		}return "";
	}, isPseudoElement: function isPseudoElement(aIdent) {
		switch (aIdent) {case "first-letter":case "first-line":case "before":case "after":case "marker":
				return true;break;default:
				return false;break;}
	}, parseSimpleSelector: function parseSimpleSelector(token, isFirstInChain, canNegate) {
		var s = "";var specificity = { a: 0, b: 0, c: 0, d: 0 };if (isFirstInChain && (token.isSymbol("*") || token.isSymbol("|") || token.isIdent())) {
			if (token.isSymbol("*") || token.isIdent()) {
				s += token.value;var isIdent = token.isIdent();token = this.getToken(false, true);if (token.isSymbol("|")) {
					s += token.value;token = this.getToken(false, true);if (token.isIdent() || token.isSymbol("*")) {
						s += token.value;if (token.isIdent()) specificity.d++;
					} else return null;
				} else {
					this.ungetToken();if (isIdent) specificity.d++;
				}
			} else if (token.isSymbol("|")) {
				s += token.value;token = this.getToken(false, true);if (token.isIdent() || token.isSymbol("*")) {
					s += token.value;if (token.isIdent()) specificity.d++;
				} else return null;
			}
		} else if (token.isSymbol(".") || token.isSymbol("#")) {
			var isClass = token.isSymbol(".");s += token.value;token = this.getToken(false, true);if (token.isIdent()) {
				s += token.value;if (isClass) specificity.c++;else specificity.b++;
			} else return null;
		} else if (token.isSymbol(":")) {
			s += token.value;token = this.getToken(false, true);if (token.isSymbol(":")) {
				s += token.value;token = this.getToken(false, true);
			}if (token.isIdent()) {
				s += token.value;if (this.isPseudoElement(token.value)) specificity.d++;else specificity.c++;
			} else if (token.isFunction()) {
				s += token.value;if (token.isFunction(":not(")) {
					if (!canNegate) return null;token = this.getToken(true, true);var simpleSelector = this.parseSimpleSelector(token, isFirstInChain, false);if (!simpleSelector) return null;else {
						s += simpleSelector.selector;token = this.getToken(true, true);if (token.isSymbol(")")) s += ")";else return null;
					}specificity.c++;
				} else {
					while (true) {
						token = this.getToken(false, true);if (token.isSymbol(")")) {
							s += ")";break;
						} else s += token.value;
					}specificity.c++;
				}
			} else return null;
		} else if (token.isSymbol("[")) {
			s += "[";token = this.getToken(true, true);if (token.isIdent() || token.isSymbol("*")) {
				s += token.value;var nextToken = this.getToken(true, true);if (token.isSymbol("|")) {
					s += "|";token = this.getToken(true, true);if (token.isIdent()) s += token.value;else return null;
				} else this.ungetToken();
			} else if (token.isSymbol("|")) {
				s += "|";token = this.getToken(true, true);if (token.isIdent()) s += token.value;else return null;
			} else return null;token = this.getToken(true, true);if (token.isIncludes() || token.isDashmatch() || token.isBeginsmatch() || token.isEndsmatch() || token.isContainsmatch() || token.isSymbol("=")) {
				s += token.value;token = this.getToken(true, true);if (token.isString() || token.isIdent()) {
					s += token.value;token = this.getToken(true, true);
				} else return null;if (token.isSymbol("]")) {
					s += token.value;specificity.c++;
				} else return null;
			} else if (token.isSymbol("]")) {
				s += token.value;specificity.c++;
			} else return null;
		} else if (token.isWhiteSpace()) {
			var t = this.lookAhead(true, true);if (t.isSymbol('{')) return "";
		}if (s) return { selector: s, specificity: specificity };return null;
	}, preserveState: function preserveState() {
		this.mPreservedTokens.push(this.currentToken());this.mScanner.preserveState();
	}, restoreState: function restoreState() {
		if (this.mPreservedTokens.length) {
			this.mScanner.restoreState();this.mToken = this.mPreservedTokens.pop();
		}
	}, forgetState: function forgetState() {
		if (this.mPreservedTokens.length) {
			this.mScanner.forgetState();this.mPreservedTokens.pop();
		}
	}, parse: function parse(aString, aTryToPreserveWhitespaces, aTryToPreserveComments) {
		if (!aString) return null;this.mPreserveWS = aTryToPreserveWhitespaces;this.mPreserveComments = aTryToPreserveComments;this.mPreservedTokens = [];this.mScanner.init(aString);var sheet = new jscsspStylesheet();var token = this.getToken(false, false);if (!token.isNotNull()) return;if (token.isAtRule("@charset")) {
			this.parseCharsetRule(token, sheet);token = this.getToken(false, false);
		}var foundStyleRules = false;var foundImportRules = false;var foundNameSpaceRules = false;while (true) {
			if (!token.isNotNull()) break;if (token.isWhiteSpace()) {
				if (aTryToPreserveWhitespaces) this.addWhitespace(sheet, token.value);
			} else if (token.isComment()) {
				if (this.mPreserveComments) this.addComment(sheet, token.value);
			} else if (token.isAtRule()) {
				if (token.isAtRule("@variables")) {
					if (!foundImportRules && !foundStyleRules) this.parseVariablesRule(token, sheet);else {
						this.reportError(kVARIABLES_RULE_POSITION);this.addUnknownAtRule(sheet, token.value);
					}
				} else if (token.isAtRule("@import")) {
					if (!foundStyleRules && !foundNameSpaceRules) foundImportRules = this.parseImportRule(token, sheet);else {
						this.reportError(kIMPORT_RULE_POSITION);this.addUnknownAtRule(sheet, token.value);
					}
				} else if (token.isAtRule("@namespace")) {
					if (!foundStyleRules) foundNameSpaceRules = this.parseNamespaceRule(token, sheet);else {
						this.reportError(kNAMESPACE_RULE_POSITION);this.addUnknownAtRule(sheet, token.value);
					}
				} else if (token.isAtRule("@font-face")) {
					if (this.parseFontFaceRule(token, sheet)) foundStyleRules = true;else this.addUnknownAtRule(sheet, token.value);
				} else if (token.isAtRule("@page")) {
					if (this.parsePageRule(token, sheet)) foundStyleRules = true;else this.addUnknownAtRule(sheet, token.value);
				} else if (token.isAtRule("@media")) {
					if (this.parseMediaRule(token, sheet)) foundStyleRules = true;else this.addUnknownAtRule(sheet, token.value);
				} else if (token.isAtRule("@keyframes")) {
					if (!this.parseKeyframesRule(token, sheet)) this.addUnknownAtRule(sheet, token.value);
				} else if (token.isAtRule("@charset")) {
					this.reportError(kCHARSET_RULE_CHARSET_SOF);this.addUnknownAtRule(sheet, token.value);
				} else {
					this.reportError(kUNKNOWN_AT_RULE);this.addUnknownAtRule(sheet, token.value);
				}
			} else {
				var ruleText = this.parseStyleRule(token, sheet, false);if (ruleText) foundStyleRules = true;
			}token = this.getToken(false);
		}return sheet;
	} };function jscsspToken(aType, aValue, aUnit) {
	this.type = aType;this.value = aValue;this.unit = aUnit;
}jscsspToken.NULL_TYPE = 0;jscsspToken.WHITESPACE_TYPE = 1;jscsspToken.STRING_TYPE = 2;jscsspToken.COMMENT_TYPE = 3;jscsspToken.NUMBER_TYPE = 4;jscsspToken.IDENT_TYPE = 5;jscsspToken.FUNCTION_TYPE = 6;jscsspToken.ATRULE_TYPE = 7;jscsspToken.INCLUDES_TYPE = 8;jscsspToken.DASHMATCH_TYPE = 9;jscsspToken.BEGINSMATCH_TYPE = 10;jscsspToken.ENDSMATCH_TYPE = 11;jscsspToken.CONTAINSMATCH_TYPE = 12;jscsspToken.SYMBOL_TYPE = 13;jscsspToken.DIMENSION_TYPE = 14;jscsspToken.PERCENTAGE_TYPE = 15;jscsspToken.HEX_TYPE = 16;jscsspToken.prototype = (_jscsspToken$prototyp = { isNotNull: function isNotNull() {
		return this.type;
	}, _isOfType: function _isOfType(aType, aValue) {
		return this.type == aType && (!aValue || this.value.toLowerCase() == aValue);
	}, isWhiteSpace: function isWhiteSpace(w) {
		return this._isOfType(jscsspToken.WHITESPACE_TYPE, w);
	}, isString: function isString() {
		return this._isOfType(jscsspToken.STRING_TYPE);
	}, isComment: function isComment() {
		return this._isOfType(jscsspToken.COMMENT_TYPE);
	}, isNumber: function isNumber(n) {
		return this._isOfType(jscsspToken.NUMBER_TYPE, n);
	}, isSymbol: function isSymbol(c) {
		return this._isOfType(jscsspToken.SYMBOL_TYPE, c);
	}, isIdent: function isIdent(i) {
		return this._isOfType(jscsspToken.IDENT_TYPE, i);
	}, isFunction: function isFunction(f) {
		return this._isOfType(jscsspToken.FUNCTION_TYPE, f);
	}, isAtRule: function isAtRule(a) {
		return this._isOfType(jscsspToken.ATRULE_TYPE, a);
	}, isIncludes: function isIncludes() {
		return this._isOfType(jscsspToken.INCLUDES_TYPE);
	}, isDashmatch: function isDashmatch() {
		return this._isOfType(jscsspToken.DASHMATCH_TYPE);
	}, isBeginsmatch: function isBeginsmatch() {
		return this._isOfType(jscsspToken.BEGINSMATCH_TYPE);
	}, isEndsmatch: function isEndsmatch() {
		return this._isOfType(jscsspToken.ENDSMATCH_TYPE);
	}, isContainsmatch: function isContainsmatch() {
		return this._isOfType(jscsspToken.CONTAINSMATCH_TYPE);
	} }, _defineProperty(_jscsspToken$prototyp, "isSymbol", function isSymbol(c) {
	return this._isOfType(jscsspToken.SYMBOL_TYPE, c);
}), _defineProperty(_jscsspToken$prototyp, "isDimension", function isDimension() {
	return this._isOfType(jscsspToken.DIMENSION_TYPE);
}), _defineProperty(_jscsspToken$prototyp, "isPercentage", function isPercentage() {
	return this._isOfType(jscsspToken.PERCENTAGE_TYPE);
}), _defineProperty(_jscsspToken$prototyp, "isHex", function isHex() {
	return this._isOfType(jscsspToken.HEX_TYPE);
}), _defineProperty(_jscsspToken$prototyp, "isDimensionOfUnit", function isDimensionOfUnit(aUnit) {
	return this.isDimension() && this.unit == aUnit;
}), _defineProperty(_jscsspToken$prototyp, "isLength", function isLength() {
	return this.isPercentage() || this.isDimensionOfUnit("cm") || this.isDimensionOfUnit("mm") || this.isDimensionOfUnit("in") || this.isDimensionOfUnit("pc") || this.isDimensionOfUnit("px") || this.isDimensionOfUnit("em") || this.isDimensionOfUnit("ex") || this.isDimensionOfUnit("pt");
}), _defineProperty(_jscsspToken$prototyp, "isAngle", function isAngle() {
	return this.isDimensionOfUnit("deg") || this.isDimensionOfUnit("rad") || this.isDimensionOfUnit("grad");
}), _jscsspToken$prototyp);var kJscsspUNKNOWN_RULE = 0;var kJscsspSTYLE_RULE = 1;var kJscsspCHARSET_RULE = 2;var kJscsspIMPORT_RULE = 3;var kJscsspMEDIA_RULE = 4;var kJscsspFONT_FACE_RULE = 5;var kJscsspPAGE_RULE = 6;var kJscsspKEYFRAMES_RULE = 7;var kJscsspKEYFRAME_RULE = 8;var kJscsspNAMESPACE_RULE = 100;var kJscsspCOMMENT = 101;var kJscsspWHITE_SPACE = 102;var kJscsspVARIABLES_RULE = 200;var kJscsspSTYLE_DECLARATION = 1000;var gTABS = "";function jscsspStylesheet() {
	this.cssRules = [];this.variables = {};
}jscsspStylesheet.prototype = { insertRule: function insertRule(aRule, aIndex) {
		try {
			this.cssRules.splice(aIndex, 1, aRule);
		} catch (e) {}
	}, deleteRule: function deleteRule(aIndex) {
		try {
			this.cssRules.splice(aIndex);
		} catch (e) {}
	}, cssText: function cssText() {
		var rv = "";for (var i = 0; i < this.cssRules.length; i++) {
			rv += this.cssRules[i].cssText() + "\n";
		}return rv;
	}, resolveVariables: function resolveVariables(aMedium) {
		function ItemFoundInArray(aArray, aItem) {
			for (var i = 0; i < aArray.length; i++) {
				if (aItem == aArray[i]) return true;
			}return false;
		}for (var i = 0; i < this.cssRules.length; i++) {
			var rule = this.cssRules[i];if (rule.type == kJscsspSTYLE_RULE || rule.type == kJscsspIMPORT_RULE) break;else if (rule.type == kJscsspVARIABLES_RULE && (!rule.media.length || ItemFoundInArray(rule.media, aMedium))) {
				for (var j = 0; j < rule.declarations.length; j++) {
					var valueText = "";for (var k = 0; k < rule.declarations[j].values.length; k++) {
						valueText += (k ? " " : "") + rule.declarations[j].values[k].value;
					}this.variables[rule.declarations[j].property] = valueText;
				}
			}
		}
	} };function jscsspCharsetRule() {
	this.type = kJscsspCHARSET_RULE;this.encoding = null;this.parsedCssText = null;this.parentStyleSheet = null;this.parentRule = null;
}jscsspCharsetRule.prototype = { cssText: function cssText() {
		return "@charset " + this.encoding + ";";
	}, setCssText: function setCssText(val) {
		var sheet = { cssRules: [] };var parser = new CSSParser(val);var token = parser.getToken(false, false);if (token.isAtRule("@charset")) {
			if (parser.parseCharsetRule(token, sheet)) {
				var newRule = sheet.cssRules[0];this.encoding = newRule.encoding;this.parsedCssText = newRule.parsedCssText;return;
			}
		}throw DOMException.SYNTAX_ERR;
	} };function jscsspErrorRule(aErrorMsg) {
	this.error = aErrorMsg ? aErrorMsg : "INVALID";this.type = kJscsspUNKNOWN_RULE;this.parsedCssText = null;this.parentStyleSheet = null;this.parentRule = null;
}jscsspErrorRule.prototype = { cssText: function cssText() {
		return this.parsedCssText;
	} };function jscsspComment() {
	this.type = kJscsspCOMMENT;this.parsedCssText = null;this.parentStyleSheet = null;this.parentRule = null;
}jscsspComment.prototype = { cssText: function cssText() {
		return this.parsedCssText;
	}, setCssText: function setCssText(val) {
		var parser = new CSSParser(val);var token = parser.getToken(true, false);if (token.isComment()) this.parsedCssText = token.value;else throw DOMException.SYNTAX_ERR;
	} };function jscsspWhitespace() {
	this.type = kJscsspWHITE_SPACE;this.parsedCssText = null;this.parentStyleSheet = null;this.parentRule = null;
}jscsspWhitespace.prototype = { cssText: function cssText() {
		return this.parsedCssText;
	} };function jscsspImportRule() {
	this.type = kJscsspIMPORT_RULE;this.parsedCssText = null;this.href = null;this.media = [];this.parentStyleSheet = null;this.parentRule = null;
}jscsspImportRule.prototype = { cssText: function cssText() {
		var mediaString = this.media.join(", ");return "@import " + this.href + (mediaString && mediaString != "all" ? mediaString + " " : "") + ";";
	}, setCssText: function setCssText(val) {
		var sheet = { cssRules: [] };var parser = new CSSParser(val);var token = parser.getToken(true, true);if (token.isAtRule("@import")) {
			if (parser.parseImportRule(token, sheet)) {
				var newRule = sheet.cssRules[0];this.href = newRule.href;this.media = newRule.media;this.parsedCssText = newRule.parsedCssText;return;
			}
		}throw DOMException.SYNTAX_ERR;
	} };function jscsspNamespaceRule() {
	this.type = kJscsspNAMESPACE_RULE;this.parsedCssText = null;this.prefix = null;this.url = null;this.parentStyleSheet = null;this.parentRule = null;
}jscsspNamespaceRule.prototype = { cssText: function cssText() {
		return "@namespace " + (this.prefix ? this.prefix + " " : "") + this.url + ";";
	}, setCssText: function setCssText(val) {
		var sheet = { cssRules: [] };var parser = new CSSParser(val);var token = parser.getToken(true, true);if (token.isAtRule("@namespace")) {
			if (parser.parseNamespaceRule(token, sheet)) {
				var newRule = sheet.cssRules[0];this.url = newRule.url;this.prefix = newRule.prefix;this.parsedCssText = newRule.parsedCssText;return;
			}
		}throw DOMException.SYNTAX_ERR;
	} };function jscsspDeclaration() {
	this.type = kJscsspSTYLE_DECLARATION;this.property = null;this.values = [];this.valueText = null;this.priority = null;this.parsedCssText = null;this.parentStyleSheet = null;this.parentRule = null;
}jscsspDeclaration.prototype = { kCOMMA_SEPARATED: { "cursor": true, "font-family": true, "voice-family": true, "background-image": true }, kUNMODIFIED_COMMA_SEPARATED_PROPERTIES: { "text-shadow": true, "box-shadow": true, "-moz-transition": true, "-moz-transition-property": true, "-moz-transition-duration": true, "-moz-transition-timing-function": true, "-moz-transition-delay": true }, cssText: function cssText() {
		var prefixes = CssInspector.prefixesForProperty(this.property);if (this.property in this.kUNMODIFIED_COMMA_SEPARATED_PROPERTIES) {
			if (prefixes) {
				var rv = "";for (var propertyIndex = 0; propertyIndex < prefixes.length; propertyIndex++) {
					var property = prefixes[propertyIndex];rv += (propertyIndex ? gTABS : "") + property + ": ";rv += this.valueText + (this.priority ? " !important" : "") + ";";rv += prefixes.length > 1 && propertyIndex != prefixes.length - 1 ? "\n" : "";
				}return rv;
			}return this.property + ": " + this.valueText + (this.priority ? " !important" : "") + ";";
		}if (prefixes) {
			var rv = "";for (var propertyIndex = 0; propertyIndex < prefixes.length; propertyIndex++) {
				var property = prefixes[propertyIndex];rv += (propertyIndex ? gTABS : "") + property + ": ";var separator = property in this.kCOMMA_SEPARATED ? ", " : " ";for (var i = 0; i < this.values.length; i++) {
					if (this.values[i].cssText() != null) rv += (i ? separator : "") + this.values[i].cssText();else return null;
				}rv += (this.priority ? " !important" : "") + ";" + (prefixes.length > 1 && propertyIndex != prefixes.length - 1 ? "\n" : "");
			}return rv;
		}var rv = this.property + ": ";var separator = this.property in this.kCOMMA_SEPARATED ? ", " : " ";var extras = { "webkit": false, "presto": false, "trident": false, "generic": false };for (var i = 0; i < this.values.length; i++) {
			var v = this.values[i].cssText();if (v != null) {
				var paren = v.indexOf("(");var kwd = v;if (paren != -1) kwd = v.substr(0, paren);if (kwd in kCSS_VENDOR_VALUES) {
					for (var j in kCSS_VENDOR_VALUES[kwd]) {
						extras[j] = extras[j] || kCSS_VENDOR_VALUES[kwd][j] != "";
					}
				}rv += (i ? separator : "") + v;
			} else return null;
		}rv += (this.priority ? " !important" : "") + ";";for (var j in extras) {
			if (extras[j]) {
				var str = "\n" + gTABS + this.property + ": ";for (var i = 0; i < this.values.length; i++) {
					var v = this.values[i].cssText();if (v != null) {
						var paren = v.indexOf("(");var kwd = v;if (paren != -1) kwd = v.substr(0, paren);if (kwd in kCSS_VENDOR_VALUES) {
							functor = kCSS_VENDOR_VALUES[kwd][j];if (functor) {
								v = typeof functor == "string" ? functor : functor(v, j);if (!v) {
									str = null;break;
								}
							}
						}str += (i ? separator : "") + v;
					} else return null;
				}if (str) rv += str + ";";else rv += "\n" + gTABS + "/* Impossible to translate property " + this.property + " for " + j + " */";
			}
		}return rv;
	}, setCssText: function setCssText(val) {
		var declarations = [];var parser = new CSSParser(val);var token = parser.getToken(true, true);if (parser.parseDeclaration(token, declarations, true, true, null) && declarations.length && declarations[0].type == kJscsspSTYLE_DECLARATION) {
			var newDecl = declarations.cssRules[0];this.property = newDecl.property;this.value = newDecl.value;this.priority = newDecl.priority;this.parsedCssText = newRule.parsedCssText;return;
		}throw DOMException.SYNTAX_ERR;
	} };function jscsspFontFaceRule() {
	this.type = kJscsspFONT_FACE_RULE;this.parsedCssText = null;this.descriptors = [];this.parentStyleSheet = null;this.parentRule = null;
}jscsspFontFaceRule.prototype = { cssText: function cssText() {
		var rv = gTABS + "@font-face {\n";var preservedGTABS = gTABS;gTABS += "  ";for (var i = 0; i < this.descriptors.length; i++) {
			rv += gTABS + this.descriptors[i].cssText() + "\n";
		}gTABS = preservedGTABS;return rv + gTABS + "}";
	}, setCssText: function setCssText(val) {
		var sheet = { cssRules: [] };var parser = new CSSParser(val);var token = parser.getToken(true, true);if (token.isAtRule("@font-face")) {
			if (parser.parseFontFaceRule(token, sheet)) {
				var newRule = sheet.cssRules[0];this.descriptors = newRule.descriptors;this.parsedCssText = newRule.parsedCssText;return;
			}
		}throw DOMException.SYNTAX_ERR;
	} };function jscsspKeyframesRule() {
	this.type = kJscsspKEYFRAMES_RULE;this.parsedCssText = null;this.cssRules = [];this.name = null;this.parentStyleSheet = null;this.parentRule = null;
}jscsspKeyframesRule.prototype = { cssText: function cssText() {
		var rv = gTABS + "@keyframes " + this.name + " {\n";var preservedGTABS = gTABS;gTABS += "  ";for (var i = 0; i < this.cssRules.length; i++) {
			rv += gTABS + this.cssRules[i].cssText() + "\n";
		}gTABS = preservedGTABS;rv += gTABS + "}\n";return rv;
	}, setCssText: function setCssText(val) {
		var sheet = { cssRules: [] };var parser = new CSSParser(val);var token = parser.getToken(true, true);if (token.isAtRule("@keyframes")) {
			if (parser.parseKeyframesRule(token, sheet)) {
				var newRule = sheet.cssRules[0];this.cssRules = newRule.cssRules;this.name = newRule.name;this.parsedCssText = newRule.parsedCssText;return;
			}
		}throw DOMException.SYNTAX_ERR;
	} };function jscsspKeyframeRule() {
	this.type = kJscsspKEYFRAME_RULE;this.parsedCssText = null;this.declarations = [];this.keyText = null;this.parentStyleSheet = null;this.parentRule = null;
}jscsspKeyframeRule.prototype = { cssText: function cssText() {
		var rv = this.keyText + " {\n";var preservedGTABS = gTABS;gTABS += "  ";for (var i = 0; i < this.declarations.length; i++) {
			var declText = this.declarations[i].cssText();if (declText) rv += gTABS + this.declarations[i].cssText() + "\n";
		}gTABS = preservedGTABS;return rv + gTABS + "}";
	}, setCssText: function setCssText(val) {
		var sheet = { cssRules: [] };var parser = new CSSParser(val);var token = parser.getToken(true, true);if (!token.isNotNull()) {
			if (parser.parseKeyframeRule(token, sheet, false)) {
				var newRule = sheet.cssRules[0];this.keyText = newRule.keyText;this.declarations = newRule.declarations;this.parsedCssText = newRule.parsedCssText;return;
			}
		}throw DOMException.SYNTAX_ERR;
	} };function jscsspMediaRule() {
	this.type = kJscsspMEDIA_RULE;this.parsedCssText = null;this.cssRules = [];this.media = [];this.parentStyleSheet = null;this.parentRule = null;
}jscsspMediaRule.prototype = { cssText: function cssText() {
		var rv = gTABS + "@media " + this.media.join(", ") + " {\n";var preservedGTABS = gTABS;gTABS += "  ";for (var i = 0; i < this.cssRules.length; i++) {
			rv += gTABS + this.cssRules[i].cssText() + "\n";
		}gTABS = preservedGTABS;return rv + gTABS + "}";
	}, setCssText: function setCssText(val) {
		var sheet = { cssRules: [] };var parser = new CSSParser(val);var token = parser.getToken(true, true);if (token.isAtRule("@media")) {
			if (parser.parseMediaRule(token, sheet)) {
				var newRule = sheet.cssRules[0];this.cssRules = newRule.cssRules;this.media = newRule.media;this.parsedCssText = newRule.parsedCssText;return;
			}
		}throw DOMException.SYNTAX_ERR;
	} };function jscsspStyleRule() {
	this.type = kJscsspSTYLE_RULE;this.parsedCssText = null;this.declarations = [];this.mSelectorText = null;this.parentStyleSheet = null;this.parentRule = null;
}jscsspStyleRule.prototype = { cssText: function cssText() {
		var rv = this.mSelectorText + " {\n";var preservedGTABS = gTABS;gTABS += "  ";for (var i = 0; i < this.declarations.length; i++) {
			var declText = this.declarations[i].cssText();if (declText) rv += gTABS + this.declarations[i].cssText() + "\n";
		}gTABS = preservedGTABS;return rv + gTABS + "}";
	}, setCssText: function setCssText(val) {
		var sheet = { cssRules: [] };var parser = new CSSParser(val);var token = parser.getToken(true, true);if (!token.isNotNull()) {
			if (parser.parseStyleRule(token, sheet, false)) {
				var newRule = sheet.cssRules[0];this.mSelectorText = newRule.mSelectorText;this.declarations = newRule.declarations;this.parsedCssText = newRule.parsedCssText;return;
			}
		}throw DOMException.SYNTAX_ERR;
	}, selectorText: function selectorText() {
		return this.mSelectorText;
	}, setSelectorText: function setSelectorText(val) {
		var parser = new CSSParser(val);var token = parser.getToken(true, true);if (!token.isNotNull()) {
			var s = parser.parseSelector(token, true);if (s) {
				this.mSelectorText = s.selector;return;
			}
		}throw DOMException.SYNTAX_ERR;
	} };function jscsspPageRule() {
	this.type = kJscsspPAGE_RULE;this.parsedCssText = null;this.pageSelector = null;this.declarations = [];this.parentStyleSheet = null;this.parentRule = null;
}jscsspPageRule.prototype = { cssText: function cssText() {
		var rv = gTABS + "@page " + (this.pageSelector ? this.pageSelector + " " : "") + "{\n";var preservedGTABS = gTABS;gTABS += "  ";for (var i = 0; i < this.declarations.length; i++) {
			rv += gTABS + this.declarations[i].cssText() + "\n";
		}gTABS = preservedGTABS;return rv + gTABS + "}";
	}, setCssText: function setCssText(val) {
		var sheet = { cssRules: [] };var parser = new CSSParser(val);var token = parser.getToken(true, true);if (token.isAtRule("@page")) {
			if (parser.parsePageRule(token, sheet)) {
				var newRule = sheet.cssRules[0];this.pageSelector = newRule.pageSelector;this.declarations = newRule.declarations;this.parsedCssText = newRule.parsedCssText;return;
			}
		}throw DOMException.SYNTAX_ERR;
	} };function jscsspVariablesRule() {
	this.type = kJscsspVARIABLES_RULE;this.parsedCssText = null;this.declarations = [];this.parentStyleSheet = null;this.parentRule = null;this.media = null;
}jscsspVariablesRule.prototype = { cssText: function cssText() {
		var rv = gTABS + "@variables " + (this.media.length ? this.media.join(", ") + " " : "") + "{\n";var preservedGTABS = gTABS;gTABS += "  ";for (var i = 0; i < this.declarations.length; i++) {
			rv += gTABS + this.declarations[i].cssText() + "\n";
		}gTABS = preservedGTABS;return rv + gTABS + "}";
	}, setCssText: function setCssText(val) {
		var sheet = { cssRules: [] };var parser = new CSSParser(val);var token = parser.getToken(true, true);if (token.isAtRule("@variables")) {
			if (parser.parseVariablesRule(token, sheet)) {
				var newRule = sheet.cssRules[0];this.declarations = newRule.declarations;this.parsedCssText = newRule.parsedCssText;return;
			}
		}throw DOMException.SYNTAX_ERR;
	} };var kJscsspINHERIT_VALUE = 0;var kJscsspPRIMITIVE_VALUE = 1;var kJscsspVARIABLE_VALUE = 4;function jscsspVariable(aType, aSheet) {
	this.value = "";this.type = aType;this.name = null;this.parentRule = null;this.parentStyleSheet = aSheet;
}jscsspVariable.prototype = { cssText: function cssText() {
		if (this.type == kJscsspVARIABLE_VALUE) return this.resolveVariable(this.name, this.parentRule, this.parentStyleSheet);else return this.value;
	}, setCssText: function setCssText(val) {
		if (this.type == kJscsspVARIABLE_VALUE) throw DOMException.SYNTAX_ERR;else this.value = val;
	}, resolveVariable: function resolveVariable(aName, aRule, aSheet) {
		if (aName.toLowerCase() in aSheet.variables) return aSheet.variables[aName.toLowerCase()];return null;
	} };function ParseURL(buffer) {
	var result = {};result.protocol = "";result.user = "";result.password = "";result.host = "";result.port = "";result.path = "";result.query = "";var section = "PROTOCOL";var start = 0;var wasSlash = false;while (start < buffer.length) {
		if (section == "PROTOCOL") {
			if (buffer.charAt(start) == ':') {
				section = "AFTER_PROTOCOL";start++;
			} else if (buffer.charAt(start) == '/' && result.protocol.length() == 0) {
				section = PATH;
			} else {
				result.protocol += buffer.charAt(start++);
			}
		} else if (section == "AFTER_PROTOCOL") {
			if (buffer.charAt(start) == '/') {
				if (!wasSlash) {
					wasSlash = true;
				} else {
					wasSlash = false;section = "USER";
				}start++;
			} else {
				throw new ParseException("Protocol shell be separated with 2 slashes");
			}
		} else if (section == "USER") {
			if (buffer.charAt(start) == '/') {
				result.host = result.user;result.user = "";section = "PATH";
			} else if (buffer.charAt(start) == '?') {
				result.host = result.user;result.user = "";section = "QUERY";start++;
			} else if (buffer.charAt(start) == ':') {
				section = "PASSWORD";start++;
			} else if (buffer.charAt(start) == '@') {
				section = "HOST";start++;
			} else {
				result.user += buffer.charAt(start++);
			}
		} else if (section == "PASSWORD") {
			if (buffer.charAt(start) == '/') {
				result.host = result.user;result.port = result.password;result.user = "";result.password = "";section = "PATH";
			} else if (buffer.charAt(start) == '?') {
				result.host = result.user;result.port = result.password;result.user = "";result.password = "";section = "QUERY";start++;
			} else if (buffer.charAt(start) == '@') {
				section = "HOST";start++;
			} else {
				result.password += buffer.charAt(start++);
			}
		} else if (section == "HOST") {
			if (buffer.charAt(start) == '/') {
				section = "PATH";
			} else if (buffer.charAt(start) == ':') {
				section = "PORT";start++;
			} else if (buffer.charAt(start) == '?') {
				section = "QUERY";start++;
			} else {
				result.host += buffer.charAt(start++);
			}
		} else if (section == "PORT") {
			if (buffer.charAt(start) == '/') {
				section = "PATH";
			} else if (buffer.charAt(start) == '?') {
				section = "QUERY";start++;
			} else {
				result.port += buffer.charAt(start++);
			}
		} else if (section == "PATH") {
			if (buffer.charAt(start) == '?') {
				section = "QUERY";start++;
			} else {
				result.path += buffer.charAt(start++);
			}
		} else if (section == "QUERY") {
			result.query += buffer.charAt(start++);
		}
	}if (section == "PROTOCOL") {
		result.host = result.protocol;result.protocol = "http";
	} else if (section == "AFTER_PROTOCOL") {
		throw new ParseException("Invalid url");
	} else if (section == "USER") {
		result.host = result.user;result.user = "";
	} else if (section == "PASSWORD") {
		result.host = result.user;result.port = result.password;result.user = "";result.password = "";
	}return result;
}function ParseException(description) {
	this.description = description;
}function CountLF(s) {
	var nCR = s.match(/\n/g);return nCR ? nCR.length + 1 : 1;
}function FilterLinearGradientForOutput(aValue, aEngine) {
	if (aEngine == "generic") return aValue.substr(5);if (aEngine == "webkit") return aValue.replace(/\-moz\-/g, "-webkit-");if (aEngine != "webkit20110101") return "";var g = CssInspector.parseBackgroundImages(aValue)[0];var cancelled = false;var str = "-webkit-gradient(linear, ";var position = "position" in g.value ? g.value.position.toLowerCase() : "";var angle = "angle" in g.value ? g.value.angle.toLowerCase() : "";if (angle) {
		var match = angle.match(/^([0-9\-\.\\+]+)([a-z]*)/);var angle = parseFloat(match[1]);var unit = match[2];switch (unit) {case "grad":
				angle = angle * 90 / 100;break;case "rad":
				angle = angle * 180 / Math.PI;break;default:
				break;}while (angle < 0) {
			angle += 360;
		}while (angle >= 360) {
			angle -= 360;
		}
	}var startpoint = [];var endpoint = [];if (position != "") {
		if (position == "center") position = "center center";startpoint = position.split(" ");if (angle == "" && angle != 0) {
			switch (startpoint[0]) {case "left":
					endpoint.push("right");break;case "center":
					endpoint.push("center");break;case "right":
					endpoint.push("left");break;default:
					{
						var match = startpoint[0].match(/^([0-9\-\.\\+]+)([a-z]*)/);var v = parseFloat(match[0]);var unit = match[1];if (unit == "%") {
							endpoint.push(100 - v + "%");
						} else cancelled = true;
					}break;}if (!cancelled) switch (startpoint[1]) {case "top":
					endpoint.push("bottom");break;case "center":
					endpoint.push("center");break;case "bottom":
					endpoint.push("top");break;default:
					{
						var match = startpoint[1].match(/^([0-9\-\.\\+]+)([a-z]*)/);var v = parseFloat(match[0]);var unit = match[1];if (unit == "%") {
							endpoint.push(100 - v + "%");
						} else cancelled = true;
					}break;}
		} else {
			switch (angle) {case 0:
					endpoint.push("right");endpoint.push(startpoint[1]);break;case 90:
					endpoint.push(startpoint[0]);endpoint.push("top");break;case 180:
					endpoint.push("left");endpoint.push(startpoint[1]);break;case 270:
					endpoint.push(startpoint[0]);endpoint.push("bottom");break;default:
					cancelled = true;break;}
		}
	} else {
		if (angle == "") angle = 270;switch (angle) {case 0:
				startpoint = ["left", "center"];endpoint = ["right", "center"];break;case 90:
				startpoint = ["center", "bottom"];endpoint = ["center", "top"];break;case 180:
				startpoint = ["right", "center"];endpoint = ["left", "center"];break;case 270:
				startpoint = ["center", "top"];endpoint = ["center", "bottom"];break;default:
				cancelled = true;break;}
	}if (cancelled) return "";str += startpoint.join(" ") + ", " + endpoint.join(" ");if (!g.value.stops[0].position) g.value.stops[0].position = "0%";if (!g.value.stops[g.value.stops.length - 1].position) g.value.stops[g.value.stops.length - 1].position = "100%";var current = 0;for (var i = 0; i < g.value.stops.length && !cancelled; i++) {
		var s = g.value.stops[i];if (s.position) {
			if (s.position.indexOf("%") == -1) {
				cancelled = true;break;
			}
		} else {
			var j = i + 1;while (j < g.value.stops.length && !g.value.stops[j].position) {
				j++;
			}var inc = parseFloat(g.value.stops[j].position) - current;for (var k = i; k < j; k++) {
				g.value.stops[k].position = current + inc * (k - i + 1) / (j - i + 1) + "%";
			}
		}current = parseFloat(s.position);str += ", color-stop(" + parseFloat(current) / 100 + ", " + s.color + ")";
	}if (cancelled) return "";return str + ")";
}function FilterRadialGradientForOutput(aValue, aEngine) {
	if (aEngine == "generic") return aValue.substr(5);else if (aEngine == "webkit") return aValue.replace(/\-moz\-/g, "-webkit-");else if (aEngine != "webkit20110101") return "";var g = CssInspector.parseBackgroundImages(aValue)[0];var shape = "shape" in g.value ? g.value.shape : "";var size = "size" in g.value ? g.value.size : "";if (shape != "circle" || size != "farthest-corner" && size != "cover") return "";if (g.value.stops.length < 2 || !("position" in g.value.stops[0]) || !g.value.stops[g.value.stops.length - 1].position || !("position" in g.value.stops[0]) || !g.value.stops[g.value.stops.length - 1].position) return "";for (var i = 0; i < g.value.stops.length; i++) {
		var s = g.value.stops[i];if ("position" in s && s.position && s.position.indexOf("px") == -1) return "";
	}var str = "-webkit-gradient(radial, ";var position = "position" in g.value ? g.value.position : "center center";str += position + ", " + parseFloat(g.value.stops[0].position) + ", ";str += position + ", " + parseFloat(g.value.stops[g.value.stops.length - 1].position);var current = parseFloat(g.value.stops[0].position);for (var i = 0; i < g.value.stops.length; i++) {
		var s = g.value.stops[i];if (!("position" in s) || !s.position) {
			var j = i + 1;while (j < g.value.stops.length && !g.value.stops[j].position) {
				j++;
			}var inc = parseFloat(g.value.stops[j].position) - current;for (var k = i; k < j; k++) {
				g.value.stops[k].position = current + inc * (k - i + 1) / (j - i + 1) + "px";
			}
		}current = parseFloat(s.position);var c = (current - parseFloat(g.value.stops[0].position)) / (parseFloat(g.value.stops[g.value.stops.length - 1].position) - parseFloat(g.value.stops[0].position));str += ", color-stop(" + c + ", " + s.color + ")";
	}str += ")";return str;
}function FilterRepeatingGradientForOutput(aValue, aEngine) {
	if (aEngine == "generic") return aValue.substr(5);else if (aEngine == "webkit") return aValue.replace(/\-moz\-/g, "-webkit-");return "";
};

/*

JSONP EXPORT - JSCSS PLUGIN
@clopez 20130612

JSCSSP defines the "jscsspStylesheet" as window global
This chunk adds a simplified method to ease export data management

*/

jscsspStylesheet.prototype.getJSONP = function () {

	var jsonp = {};

	for (var i = 0; i < this.cssRules.length; i++) {

		var cssRule = this.cssRules[i];

		if (!jsonp[cssRule.mSelectorText]) jsonp[cssRule.mSelectorText] = {};

		for (var j = 0; j < cssRule.declarations.length; j++) {

			var declaration = cssRule.declarations[j];

			var value = declaration.priority ? '!' + declaration.valueText : declaration.valueText;

			jsonp[cssRule.mSelectorText][declaration.property] = declaration.valueText;
		}
	}

	return jsonp;
};

exports.default = CSSParser;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TaxonomyProcessor = __webpack_require__(23);

var _TaxonomyProcessor2 = _interopRequireDefault(_TaxonomyProcessor);

var _NodeInterface = __webpack_require__(24);

var _NodeInterface2 = _interopRequireDefault(_NodeInterface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Taxonomy Module
 * @module Taxonomy
 * @memberof smx
 * @description Lorem ipsum dolor sit amet consectetuer adipiscing elit aliquet amet
 */

var Processor = function Processor(xmlDocument, _callback) {

  var doc = xmlDocument;
  var __callback = _callback || function () {};

  _TaxonomyProcessor2.default.processXMLDocument(xmlDocument, {
    callback: function callback(xmlDocument, data) {
      __callback({
        taxonomy: data
      });
    }
  });
};

exports.default = {
  Processor: Processor,
  Node: _NodeInterface2.default
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sizzle = __webpack_require__(0);

var _sizzle2 = _interopRequireDefault(_sizzle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * SMX Taxonomy Processor
 * @module TaxonomyProcessor
 * @memberof smx.module:Taxonomy
 */

/*

CONCEPT...

CATEGORIES
Categories are meant for broad grouping of nodes.
Think of these as general topics or the table of contents
Categories are hierarchical, so you can sub-categories.

TAGS
Tags are meant to describe specific nodes' details.
Think of these as your document’s index words.
They are the micro-data to micro-categorize nodes.
Tags are not hierarchical.

*/

/**
 * Processes the given XMLDocument
 * @param {XMLNode} xmlDocument
 * @param {Object} options
 * @async
 */
var processXMLDocument = function processXMLDocument(xmlDocument, opt) {

    //xmlDocument required!
    if (!xmlDocument) return;

    //normalize options
    var options = _.extend({
        data: {},
        callback: function callback() {
            return;
        },
        total: 0,
        nodes: null
    }, opt);

    // get all unparocessed nodes based on flag attr
    // `taxonomy-processed` attribute is added while processing
    // nodes missing the flag attr are the nodes we need to be processed
    var nodes;
    if (!options.nodes) nodes = (0, _sizzle2.default)('[categories]:not([taxonomy-processed])', xmlDocument);else nodes = options.nodes;

    //calculate percent progress
    if (nodes.length > options.total) options.total = nodes.length;
    var percent = 100 - parseInt(nodes.length * 100 / options.total) || 0;

    log('PROCESSING TAXONOMY... (' + (options.total - nodes.length) + '/' + options.total + ') ' + percent + '%');

    var max_iterations = 100;
    var i = 0;

    while (nodes.length && i < max_iterations) {

        var node = nodes.shift();

        var result = this.processXMLNode(node);

        if (result) {

            //create node data object if does not exists yet
            if (!options.data[result.id]) options.data[result.id] = {};

            //extend parent data object
            if (!_.isEmpty(result.data)) _.extend(options.data[result.id], result.data);
        }

        i++;
    }

    //more nodes to process?
    if (nodes.length) {

        _.delay(_.bind(function () {
            this.processXMLDocument(xmlDocument, {
                data: options.data,
                callback: options.callback,
                total: options.total,
                nodes: nodes
            });
        }, this), 0);
    }
    //complete! all nodes processed
    else {

            log('COMPLETE! (' + options.total + '/' + options.total + ') 100%');

            try {
                options.callback(xmlDocument, options.data);
            } catch (e) {

                log('CALLBACK ERROR! ' + e.toString());
            }
        }

    return;
};

/**
 * Process the given XMLNode
 * @param {XMLNode} xmlNode
 * @return {Object} data
 * @return {String} data.id
 * @return {Object} data.data
 */
var processXMLNode = function processXMLNode(node) {

    if (!node) return;

    //instance returning data object
    var data = {};

    //node id which to attach processed data
    var id = node.getAttribute('id');

    //get taxonomy related data
    var categories = node.getAttribute('categories');
    var tags = node.getAttribute('tags');

    if (categories) data.categories = categories;
    if (tags) data.tags = tags;

    //add "taxonomy-processed" flag attr
    node.setAttribute('taxonomy-processed', 'true');

    return {
        'id': id,
        'data': data
    };
};

exports.default = {
    processXMLDocument: processXMLDocument,
    processXMLNode: processXMLNode
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Extends SMXNode with taxonomy methods
 * @mixin Node-Taxonomy
 * @memberof smx.module:Taxonomy
 */

var NodeInterface = {

  /**
  * Gets the collection of associated tags.
  * @return {Array.<String>}
  * @memberof smx.module:Taxonomy.Node-Taxonomy
  */
  getTags: function getTags(namespace) {

    //default result is an empty array
    var results = [];

    //get comma separetd array from tags attribute
    var values = this.dsv('tags', ',');

    //namespace filter
    if (_.isString(namespace) && namespace.length > 1) {
      var ns = namespace;
      results = _.filter(results, function (r) {
        return (r + '').indexOf(ns + '-') === 0;
      });
    }

    return results;
  },

  /**
  * Gets a collection of associated categories.
  * @return {Array.<String>}
  * @memberof smx.module:Taxonomy.Node-Taxonomy
  */
  getCategories: function getCategories(namespace) {

    //default result is an empty array
    var results = [];

    //get comma separetd array from tags attribute
    var values = this.dsv('categories', ',');

    //namespace filter
    if (_.isString(namespace) && namespace.length > 1) {
      var ns = namespace;
      results = _.filter(results, function (r) {
        return (r + '').indexOf(ns + '-') === 0;
      });
    }

    return results;
  },

  /**
  * Get the collection of associated branches.
  * @return {Array.<String>}
  * @memberof smx.module:Taxonomy.Node-Taxonomy
  */
  getBranches: function getBranches() {

    //default result is an empty array
    var results = [];

    //get comma separetd array from tags attribute
    var ids = this.dsv('branches', ',');

    //get parent document
    var doc = this.root();

    //maps ids into nodes
    results = _.map(values, doc.gid);

    //remove not found ids from results
    results = _.compact(results);

    return results;
  }

};

exports.default = NodeInterface;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @module Ui
 * @memberof smx
 * @description
 * User Interface Module, lorem ipsum dolor sit amet consectetuer adipiscing elit aliquet amet.
 *
 * ### Reserved XML: `[ui-*]`,` :ui`.
 *
 */

var UiAttrController = {

    'MEDIA_TYPES': ['screen', 'print', 'tv'],

    'get': function get(node, key, media_type) {

        //resolve 'media' value
        media_type = this.normalizeMediaType(media_type);

        //get 'ui-type-key' attr
        var asset = node.attr('ui-' + media_type + '-' + key);

        //no typed key? use generic 'ui-key'
        if (_.isEmpty(asset)) asset = node.attr('ui-' + key);

        //resolve asset url
        if (!_.isEmpty(asset)) return this.resolveURL(node, asset);

        return;
    },

    'normalizeMediaType': function normalizeMediaType(type) {

        if (_.isEmpty(type)) return this.MEDIA_TYPES[0];

        if (_.includes(this.MEDIA_TYPES, type)) return type;else return this.MEDIA_TYPES[0];
    },

    'resolveURL': function resolveURL(node, asset) {

        //starts with '$/' means package root
        if (asset.substr(0, 2) == '$/') asset = node.root().get('url') + asset.substr(2);
        //starts with './' means app root
        else if (asset.substr(0, 2) == './') asset = asset.substr(2);
            //else is relative to node
            else asset = node.get('url') + asset;

        return asset;
    }

};

/**
 * Extends {@link smx.Node Node} with UserInterface methods
 * @mixin Node-Ui
 * @memberof smx.module:Ui
 */
var NodeInterface = {

    /**
     * Gets an user interface asset by key and type
     * @memberof smx.module:Ui.Node-Ui
     * @param {String} key
     * @param {String} [type="screen"]
     * @example
     * <!-- language: lang-xml -->
     * <page ui-template="tmpl/page.html">
     *
     * <!-- language: lang-js -->
     * page.ui('template');
     * //-> "tmpl/page.html"
     *
     * //<page ui-screen-template="tmpl/page-screen.html" ui-print-template="tmpl/page-print.html">
     * page.ui('template','print');
     * //-> "tmpl/page-print.html"
     * page.ui('template','screen');
     * //-> "tmpl/page-screen.html"
     * page.ui('template');
     * //-> "tmpl/page-screen.html"
     *
     */
    ui: function ui(key, type) {

        return UiAttrController.get(this, key, type);
    }

};

exports.default = {
    Node: NodeInterface
};

/***/ })
/******/ ]);
//# sourceMappingURL=smx.js.map