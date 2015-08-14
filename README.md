[![build status](https://secure.travis-ci.org/timoxley/file-uploader.png)](http://travis-ci.org/timoxley/file-uploader)
# File Uploader

Easily perform programmatic multi-part file uploads. Designed for use within test suites. 

## Usage

```javascript

var uploader = require('file-uploader')

var file   // set to the path of the file you want to upload
var cookie // set a cookie if you require authorisation

var options = {
  host : 'localhost',
  port : 4000,
  path : '/upload',
  method : 'POST',
  encoding : 'utf8'
}

uploader.postFile(options, file, {Cookie: cookie}, function(err, res) {
  console.log(res.statusCode)
})

```

## See Also

* [superagent](http://visionmedia.github.com/superagent/#multipart-requests)
* [supertest](https://github.com/visionmedia/supertest)

## Credit

Originally inspired by [Anand Prakash](http://www.anandprakash.net/2011/10/20/server-side-multipartform-data-uploads-from-nodejs/).
