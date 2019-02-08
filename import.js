#!/usr/bin/env node

var classes = require('./classes.json'),
    insertLine = require('insert-line'),
    recursive = require("recursive-readdir"),
    fs = require("fs"),
    find = require("find-in-file"),
    arg = require('arg');

const args = arg({
    // Types
    '--path':    String,
    '-p':    '--path'
});

if(!args['--path']){
    return console.error("ERROR ERROR");
}

var usePath = args['--path'];

var isDir = false;
try{
    isDir = fs.lstatSync(usePath).isDirectory()
} catch(e) {}

if(!isDir) {
    return console.log('this is not dance');
}

function handleFiles(err, files) {
    for (const useClass of classes) {
        var klass = useClass.split('\\'),
            klass = klass[klass.length - 1];
            console.log(klass);

        find({
            files: files,
            find: new RegExp('\\b' + klass + '\\b', 'g')
        }, function(error, files) {
            console.log(files);
            for (const file of files) {
                if(file.file){
                    handleFoundFile(file.file, useClass, klass);
                }
            }
        });
    }

}
function handleFoundFile (file, klass, classname) {
    if( file.indexOf('/' + classname + '.php') == -1) {
        insertLine(file).contentSync('use ' + klass + ';').at(3);
        console.log('done ' + file + ' @ ' + klass);
    }
}

recursive(usePath, handleFiles);
