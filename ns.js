#!/usr/bin/env node

var insertLine = require('insert-line'),
    recursive = require("recursive-readdir"),
    fs = require("fs"),
    find = require("find-in-file"),
    arg = require('arg');

const args = arg({
    // Types
    '--path':    String,
    '-p':    '--path',
    '--base-ns':    String,
    '-n':    '--base-ns'
});

if(!args['--path']){
    return console.error("ERROR ERROR");
}

var usePath = args['--path'];
var useNS = args['--base-ns'];

var isDir = false;

try{
    isDir = fs.lstatSync(usePath).isDirectory()
} catch(e) {}

if(!isDir || !useNS) {
    return console.log('this is not dance');
}

function handleFiles(err, files) {
    for (const file of files) {
        var scope = file.split('/'),
            s = scope[scope.length - 2];

        handleFoundFile(
            useNS + '\\' + s,
            file
        )

        console.log(useNS + '\\' + scope + '\\' + scope[scope.length - 1])

    }

}
function handleFoundFile (ns, file) {
    insertLine(file).contentSync('namespace ' + ns + ';').at(2);
}

recursive(usePath, handleFiles);
