var express = require('express')
var assert = require('chai').assert
var path = require('path')
var fs = require('fs')

var uploader = require('../index.js')

var options = {
  host : 'localhost',
  port : 4000,
  path : '/upload',
  method : 'POST',
  encoding : 'utf8'
}

var file = path.join(__dirname, 'fixtures', 'test_image.jpg')
suite('uploader', function() {
  suite('postFile', function() {

    test('can upload files', function(done) {
      var targetSize = fs.statSync(file).size

      var app = express.createServer()
      app.use(express.bodyParser())
      app.listen(options.port)

      app.post(options.path, function(req, res){
        assert.ok(req.files)
        res.json(req.files.attachment)
      })

      uploader.postFile(options, file, {}, function(err, res) {
        var body = JSON.parse(res.body)
        assert.equal(targetSize, body.size)
        done()
      })
    })
  })
})
