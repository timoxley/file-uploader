# File Uploader

This module allows you to easily test the file uploading capabilities of
your API by alowing you to perform a multipart file upload programatically. 

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

See tests for more details.

## TODO
Way more tests.

## Credits
Code originally taken(stolen?) from Anand Prakash: http://www.anandprakash.net/2011/10/20/server-side-multipartform-data-uploads-from-nodejs/

Current version has slight modification and bugfixes.

If Anand Prakash wants to take ownership this repository, he's more than welcome to.

Test Image By Microchip08 (talk) as well as those of Image:Recycled kitten.jpg (Image:Recycled kitten.jpg) [GFDL (www.gnu.org/copyleft/fdl.html) or CC-BY-SA-3.0 (www.creativecommons.org/licenses/by-sa/3.0/)], via Wikimedia Commons
