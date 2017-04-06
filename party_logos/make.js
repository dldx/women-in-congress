'use strict';

var svgstore = require('svgstore');
var fs = require('fs');

var sprites = svgstore()
	.add('Lab', fs.readFileSync('./labour.svg', 'utf8'))
	.add('Green', fs.readFileSync('./greens.svg', 'utf8'))
	.add('SNP', fs.readFileSync('./SNP.svg', 'utf8'))
	.add('LD', fs.readFileSync('./LD.svg', 'utf8'))
	.add('SF', fs.readFileSync('./SF.svg', 'utf8'))
	.add('Con', fs.readFileSync('./conservatives.svg', 'utf8'));

fs.writeFileSync('./party_logos.svg', sprites);
