var Step = require('step'),
    fs = require('fs'),
    path = require('path'),
    http = require('http'),
    mime = require('mime')

/**
Converts a list of parameters to form data
- `fields` - a property map of key value pairs
- `files` - a list of property maps of content
  - `type` - the type of file data
  - `keyname` - the name of the key corresponding to the file
  - `valuename` - the name of the value corresponding to the file
  - `data` - the data of the file
*/
function getFormDataForPost(fields, files) {
  function encodeFieldPart(boundary,name,value) {
    var returnPart = "--" + boundary + "\r\n"
    returnPart += "Content-Disposition: form-data name=\"" + name + "\"\r\n\r\n"
    returnPart += value + "\r\n"
    return returnPart
  }
  function encodeFilePart(boundary,type,name,filename) {
    var returnPart = "--" + boundary + "\r\n"
    returnPart += "Content-Disposition: form-data; name=\"" + name + "\"; filename=\"" + filename + "\"\r\n"
    returnPart += "Content-Type: " + type + "\r\n\r\n"
    return returnPart
  }
  var boundary = Math.random()
  var postData = []

  if (fields) {
    for (var key in fields) {
      var value = fields[key]
      postData.push(new Buffer(encodeFieldPart(boundary, key, value), 'ascii'))
    }
  }
  if (files) {
    for (var key in files) {
      var value = files[key]
      postData.push(new Buffer(encodeFilePart(boundary, value.type, value.keyname, value.valuename), 'ascii'))

      postData.push(new Buffer(value.data, 'utf8'))
    }
  }
  postData.push(new Buffer("\r\n--" + boundary + "--"), 'ascii')
  var length = 0

  for(var i = 0; i < postData.length; i++) {
    length += postData[i].length
  }
  var params = {
    postData : postData,
    headers : {
      'Content-Type': 'multipart/form-data; boundary='+boundary,
      'Content-Length': length
    }
  }
  return params
}

/**
POSTs a form request via HTTP
- `fields` - a property map of key value pairs
- `files` - a list of property maps of content
  - `type` - the type of file data
  - `keyname` - the name of the key corresponding to the file
  - `valuename` - the name of the value corresponding to the file
  - `data` - the data of the file
- `options` is a set of options
  - host
  - port
  - path
  - method
  - encoding
- `headers` headers to be sent with the request
- `callback` - callback to handle the response
*/
function postData(fields, files, options, headers, callback) {
  var headerParams = getFormDataForPost(fields, files)
  var totalheaders = headerParams.headers
  for (var key in headers) totalheaders[key] = headers[key]

  var requestOptions = {
    host: options.host,
    port: options.port,
    path: options.path,
    method: options.method || 'POST',
    headers: totalheaders
  }
  var request = http.request(requestOptions, function(response) {
    response.body = ''
    response.setEncoding(options.encoding)
    response.on('data', function(chunk){
      response.body += chunk
    })
    response.on('end', function() {
      callback(null, response)
    })
  })
  request.on('error', function(err) {
    callback(err)
  })

  for (var i = 0; i < headerParams.postData.length; i++) {
    request.write(headerParams.postData[i])
  }
  request.end()
}

/**
POSTs a form request via HTTP
- `options` is a set of options
  - host
  - port
  - path
  - method
  - encoding
- `filename` filename being uploaded
- `headers` headers to be sent with the request
- `callback` - callback to handle the response
*/
function postFile(options, filePath, headers, callback) {
  var mimeType = mime.lookup(filePath)
  var filename = path.basename(filePath)
  Step(
    function readImage() {
      fs.readFile(filePath, this)
    },
    function(err, fileContents) {
      if (err) return callback(err)
      postData(null, [{type: mimeType, keyname: options.keyname || 'attachment', valuename: filename, data: fileContents}], options, headers, this)
    },
    function(err, response) {
      callback(err, response)
    }
  )
}

//===== PUBLIC ======

var interface = {
  getFormDataForPost : getFormDataForPost,
  postData : postData,
  postFile : postFile
}

module.exports = interface
