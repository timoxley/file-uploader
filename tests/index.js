var express = require('express')
var busboy = require('connect-busboy')
var path = require('path')
var fs = require('fs')
var bl = require('bl')
var test = require('tape')

var uploader = require('../index.js')

var filename = __filename
var fileContent = fs.readFileSync(filename, 'utf8')

var options = {
  host : 'localhost',
  port : 6879,
  path : '/upload',
  method : 'POST',
  encoding : 'utf8'
}

test('can upload files', function(t) {
  var targetSize = fs.statSync(filename).size

  var app = express()
  app.use(busboy())
  app.use(function(req, res) {
    req.busboy.on('file', function(fieldname, fileStream, filename, encoding, mimetype) {
      fileStream.pipe(bl(function(err, data) {
        if (err) return t.end(err)
        t.equal(String(data), String(fileContent))
        res.end()
      }))
    })
    req.pipe(req.busboy)
  })

  var server = app.listen(options.port, function(err) {
    if (err) return t.end(err)

    app.post(options.path, function(req, res){
      t.ok(req.files)
    })

    uploader.postFile(options, filename, {}, function(err, res) {
      server.close(function(err) {
        t.ifError(err)
        t.end(err)
      })
    })
  })
})
