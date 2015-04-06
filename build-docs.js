// jscs:disable
/* eslint-disable */
require('shelljs/global');

var i;
var tags = process.argv.splice(2);

if (exec('git diff-index --quiet HEAD --').code !== 0) {
	console.log('Dirty repository. Please stash changes before continuing.');
	process.exit(1);
}

for (i = 0; i < tags.length; i++) {
	gitCheckoutTag(tags[i]);
	if (tags[i] === 'master') {
		genDocs('latest');
	}
	else {
		genDocs(tags[i]);
	}
}

function gitCheckoutTag(tag) {
	if (exec('git rev-parse ' + tag, {silent: true}).code === 0) {
		if (exec('git checkout ' + tag, {silent: true}).code !== 0) {
			console.log('Could not checkout the tag, ' + tag + ': skipping');
			process.exit(1);
		}
	}
	else {
		console.log('The tag, ' + tag + ', was not found: skipping');
		process.exit(1);
	}
}

function genDocs(version) {
	rm('-rf', 'docs/' + version + '/');
	rm('-rf', 'coverage-report/' + version + '/');
	rm('-rf', '.docs/');
	rm('-rf', '.coverage/');

	exec('istanbul cover --dir .coverage -- ./node_modules/.bin/_mocha');
	exec('jsdoc -c .jsdocrc -d .docs');
	exec('git checkout gh-pages');

	rm('-rf', 'documentation/' + version + '/');
	mkdir('-p', 'documentation/' + version + '/');
	cp('-R', '.docs/*', 'documentation/' + version + '/');

	rm('-rf', 'coverage/' + version + '/');
	mkdir('-p', 'coverage/' + version + '/');
	cp('-R', '.coverage/*', 'coverage/' + version + '/');
}
