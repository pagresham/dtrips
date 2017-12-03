var slash         = require('slashes');
var urlencode     = require('urlencode');
var striptags 	  = require('striptags');

module.exports = {


	encode_and_slash: function(string) {
							if(!string) {
								return "";
							}
							return slash.add(urlencode(string));
						},
	decode_and_unslash: function(string) {
							if(!string) {
							return "";
							}
							return slash.strip(urlencode.decode(string));
						},
	strip:              function(string) {
							if(!string) {
							return "";
							}
							return striptags(string);
	}	

};

