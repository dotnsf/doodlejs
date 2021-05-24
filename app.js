//. app.js
var express = require( 'express' ),
    fs = require( 'fs' ),
    multer = require( 'multer' ),
    bodyParser = require( 'body-parser' ),
    app = express();

app.use( multer( { dest: './tmp/' } ).single( 'image' ) );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.use( express.static( __dirname + '/docs' ) );

//. #3
app.post( '/image', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  if( req.file ){
    var imgpath = req.file.path;
    var imgtype = req.file.mimetype;
    var imgsize = req.file.size;
    //var imgfilename = req.file.filename;
    //var filename = req.file.originalname;

    var timestamp = parseInt( req.body.timestamp );

    var img = fs.readFileSync( imgpath );
    var img64 = new Buffer( img ).toString( 'base64' );
    fs.unlink( imgpath, function( err ){} );

    var params = {
      path: imgpath,
      type: imgtype,
      size: imgsize,
      timestamp: timestamp
    };
    console.log( params );
    var p = JSON.stringify( params, null, 2 );
    res.write( p );
    res.end();
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'not initialized.' } ) );
    res.end();
  }
});

var port = process.env.PORT || 8080;
app.listen( port );
console.log( "server starting on " + port + " ..." );
