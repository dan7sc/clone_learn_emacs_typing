const fs = require('fs');

const variableRegExp = /\$([0-9a-zA-Z\.]+)/g;

module.exports = function renderFile(fileName, options, callback) {
    function onReadFile(err, str) {
	if (err) {
	    callback(err);
	    return;
	}

	try {
	    str = str.replace(variableRegExp, generateVariableLookup(options));
	} catch (e) {
	    err = e;
	    err.name = 'RenderError';
	}

	callback(err, str);
    }

    fs.readFile(fileName, 'utf-8', onReadFile);
};

function generateVariableLookup(data) {
    return function variableLookup(str, path) {
	const parts = path.split('.');
	let value = data;

	for (let i = 0; i < parts.length; i++) {
	    value = value[parts[i]];
	}

	return value;
    };
}

