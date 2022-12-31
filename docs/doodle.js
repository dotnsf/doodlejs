var THIS = null;
var OPTION = null;

var uuid = generateUUID();
console.log( 'uuid = ' + uuid );

var base_url = location.origin + '/';
var undos = [];
var redos = [];
var stroke = null; //. { color: color, width: width, xys: [] }
var backgroundcolor = null;

var custom_color = '#000000';

$.fn.doodlejs = function( option ){
  //. this = $('#cdiv')
  THIS = this;
  OPTION = option;

  //. ヒストリバック無効化
  /*
  if( window.history && window.history.pushState ){
    history.pushState( "nohb", null, null );
    $(window).on( "popState", function( evt ){
      if( !event.originalEvent.state ){
        history.pushState( "nohb", null, null );
        return;
      }
    });
  }
  */

  init();
};

function init(){
  THIS.html( '<canvas width="80%" height="50%" id="mycanvas"></canvas>' );

  //. CSS after <canvas> creation
  $('html').css( 'text-align', 'center' );
  $('html').css( 'background-color', '#fafafa' );
  $('html').css( 'font-size', '20px' );
  $('html').css( 'color', '#333' );
  $('body').css( 'text-align', 'center' );
  $('body').css( 'background-color', '#fafafa' );
  $('body').css( 'font-size', '20px' );
  $('body').css( 'color', '#333' );
  $('#mycanvas').css( 'border', '1px solid #333' );

  var canvas = document.getElementById( 'mycanvas' );
  if( !canvas || !canvas.getContext ){
    return false;
  }
  var ctx = canvas.getContext( '2d' );
  //. マウスの座標を取得
  var mouse = {
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    color: "black",
    isDrawing: false
  };
  var borderWidth = 1;
  canvas.addEventListener( "mousemove", function( e ){
    //. マウスが動いたら座標値を取得
    var rect = e.target.getBoundingClientRect();
    mouse.x = e.clientX - rect.left - borderWidth;
    mouse.y = e.clientY - rect.top - borderWidth;

    //. isDrawがtrueのとき描画
    if( mouse.isDrawing ){
      var color = $('#'+OPTION.select_color).val();
      if( color == 'custom' ){
        color = custom_color;
      }
      if( color == 'transparent' ){
        ctx.globalCompositeOperation = 'destination-out';
      }else{
        ctx.globalCompositeOperation = 'source-over';
      }

      ctx.beginPath();
      ctx.lineWidth = parseInt( $('#'+OPTION.select_linewidth).val() );
      ctx.lineCap = 'round';
      ctx.moveTo( mouse.startX, mouse.startY );
      ctx.lineTo( mouse.x, mouse.y );
      if( color != 'transparent' ){
        ctx.strokeStyle = color;
      }
      ctx.stroke();
      mouse.startX = mouse.x;
      mouse.startY = mouse.y;

      if( stroke ){
        stroke.xys.push( [ mouse.x, mouse.y ] );
      }
    }
  });
  //. マウスを押したら、描画OK(myDrawをtrue)
  canvas.addEventListener( "mousedown", function( e ){
    mouse.isDrawing = true;
    mouse.startX = mouse.x;
    mouse.startY = mouse.y;

    stroke = {};
    stroke.color = $('#'+OPTION.select_color).val();
    if( stroke.color == 'custom' ){
      stroke.color = custom_color;
    }
    stroke.width = parseInt( $('#'+OPTION.select_linewidth).val() );
    stroke.xys = [ [ mouse.x, mouse.y ] ];
  });
  //. マウスを上げたら、描画禁止(myDrawをfalse)
  canvas.addEventListener( "mouseup", function( e ){
    mouse.isDrawing = false;

    if( stroke ){
      undos.push( stroke );
      $('#'+OPTION.undo_btn).prop( 'disabled', false );
      stroke = null;
      redos = [];
      $('#'+OPTION.redo_btn).prop( 'disabled', true );
    }
  });
  canvas.addEventListener( 'mouseleave', function( e ){
    mouse.isDrawing = false;

    if( stroke ){
      undos.push( stroke );
      $('#'+OPTION.undo_btn).prop( 'disabled', false );
      stroke = null;
      redos = [];
      $('#'+OPTION.redo_btn).prop( 'disabled', true );
    }
  });

  canvas.addEventListener( "touchmove", function( e ){
    //. タッチが動いたら座標値を取得
    var t = e.changedTouches[0];
    var rect = e.target.getBoundingClientRect();
    //mouse.x = e.pageX - rect.left - borderWidth;
    //mouse.y = e.pageY - rect.top - borderWidth;
    mouse.x = ( isAndroid() ? t.pageX : e.pageX ) - rect.left - borderWidth;
    mouse.y = ( isAndroid() ? t.pageY : e.pageY ) - rect.top - borderWidth;

    //. isDrawがtrueのとき描画
    if( mouse.isDrawing ){
      var color = $('#'+OPTION.select_color).val();
      if( color == 'custom' ){
        color = custom_color;
      }
      if( color == 'transparent' ){
        ctx.globalCompositeOperation = 'destination-out';
      }else{
        ctx.globalCompositeOperation = 'source-over';
      }

      ctx.beginPath();
      ctx.lineWidth = parseInt( $('#'+OPTION.select_linewidth).val() );
      ctx.lineCap = 'round';
      ctx.moveTo( mouse.startX, mouse.startY );
      ctx.lineTo( mouse.x, mouse.y );
      if( color != 'transparent' ){
        ctx.strokeStyle = color;
      }
      ctx.stroke();
      mouse.startX = mouse.x;
      mouse.startY = mouse.y;

      if( stroke ){
        stroke.xys.push( [ mouse.x, mouse.y ] );
      }
    }
  });
  //. タッチしたら、描画OK(myDrawをtrue)
  canvas.addEventListener( "touchstart", function( e ){
    var t = e.changedTouches[0];
    var rect = t.target.getBoundingClientRect();
    mouse.isDrawing = true;
    mouse.startX = t.pageX - rect.left - borderWidth;
    mouse.startY = t.pageY - rect.top - borderWidth;

    stroke = {};
    stroke.color = $('#'+OPTION.select_color).val();
    if( stroke.color == 'custom' ){
      stroke.color = custom_color;
    }
    stroke.width = parseInt( $('#'+OPTION.select_linewidth).val() );
    stroke.xys = [ [ mouse.startX, mouse.startY ] ];
  });
  //. タッチを上げたら、描画禁止(myDrawをfalse)
  canvas.addEventListener( "touchend", function( e ){
    mouse.isDrawing = false;

    if( stroke ){
      undos.push( stroke );
      $('#'+OPTION.undo_btn).prop( 'disabled', false );
      stroke = null;
      redos = [];
      $('#'+OPTION.redo_btn).prop( 'disabled', true );
    }
  });
  canvas.addEventListener( 'touchcancel', function( e ){
    mouse.isDrawing = false;

    if( stroke ){
      undos.push( stroke );
      $('#'+OPTION.undo_btn).prop( 'disabled', false );
      stroke = null;
      redos = [];
      $('#'+OPTION.redo_btn).prop( 'display', true );
    }
  });

  //. Pointer Events
  canvas.addEventListener( "pointermove", function( e ){
    //. ポインターが動いたら座標値を取得
    var t = e; //e.changedTouches[0];
    var rect = e.target.getBoundingClientRect();
    //mouse.x = e.pageX - rect.left - borderWidth;
    //mouse.y = e.pageY - rect.top - borderWidth;
    mouse.x = ( isAndroid() ? t.pageX : e.pageX ) - rect.left - borderWidth;
    mouse.y = ( isAndroid() ? t.pageY : e.pageY ) - rect.top - borderWidth;

    //. isDrawがtrueのとき描画
    if( mouse.isDrawing ){
      var color = $('#'+OPTION.select_color).val();
      if( color == 'custom' ){
        color = custom_color;
      }
      if( color == 'transparent' ){
        ctx.globalCompositeOperation = 'destination-out';
      }else{
        ctx.globalCompositeOperation = 'source-over';
      }

      ctx.beginPath();
      ctx.lineWidth = parseInt( $('#'+OPTION.select_linewidth).val() );
      ctx.lineCap = 'round';
      ctx.moveTo( mouse.startX, mouse.startY );
      ctx.lineTo( mouse.x, mouse.y );
      if( color != 'transparent' ){
        ctx.strokeStyle = color;
      }
      ctx.stroke();
      mouse.startX = mouse.x;
      mouse.startY = mouse.y;

      if( stroke ){
        stroke.xys.push( [ mouse.x, mouse.y ] );
      }
    }
  });
  //. ポインターにタッチしたら、描画OK(myDrawをtrue)
  canvas.addEventListener( "pointerdown", function( e ){
    var t = e; //e.changedTouches[0];
    var rect = t.target.getBoundingClientRect();
    mouse.isDrawing = true;
    mouse.startX = t.pageX - rect.left - borderWidth;
    mouse.startY = t.pageY - rect.top - borderWidth;

    stroke = {};
    stroke.color = $('#'+OPTION.select_color).val();
    if( stroke.color == 'custom' ){
      stroke.color = custom_color;
    }
    stroke.width = parseInt( $('#'+OPTION.select_linewidth).val() );
    stroke.xys = [ [ mouse.startX, mouse.startY ] ];
  });
  //. ポインターを上げたら、描画禁止(myDrawをfalse)
  canvas.addEventListener( "pointerup", function( e ){
    mouse.isDrawing = false;

    if( stroke ){
      undos.push( stroke );
      $('#'+OPTION.undo_btn).prop( 'disabled', false );
      stroke = null;
      redos = [];
      $('#'+OPTION.redo_btn).prop( 'disabled', true );
    }
  });

  $('#'+OPTION.select_color).change( function(){
    var color = $(this).val();
    if( color == 'custom' ){
      openColorModal();
    }else{
      if( color == 'white' ){
        color = 'lightgray';
      }else if( color == 'transparent' ){
        color = 'black';
      }
      $(this).css( { 'color': color } );
      $('#'+OPTION.select_linewidth).css( { 'color': color } );
      $('#'+OPTION.setbg_btn).css( { 'background': color } );
    }
  });

  //. リサイズ時に Canvas サイズを変更する
  $(window).on( 'load resize', function(){
    resized();
  });

  //. スクロール禁止
  /*
  $(window).on('touchmove.noScroll', function( e ){
    e.preventDefault();
  });
  */
  var movefun = function( event ){
    event.preventDefault();
  }
  window.addEventListener( 'touchmove', movefun, { passive: false } );
}

function resized(){
  var browserWidth = window.innerWidth;
  var browserHeight = window.innerHeight;
  var canvas = document.getElementById( 'mycanvas' );
  if( canvas && canvas.getContext ){
    canvas.width = browserWidth * 0.8;
    canvas.height = browserHeight * 0.6;
  }
}

function resetCanvas( no_reset_unredo ){
  //if( confirm( 'キャンバスをリセットしますか？' ) ){
    init();
    resized();

    if( !no_reset_unredo ){
      undos = [];
      redos = [];
      backgroundcolor = null;
    }
  //}
}

function isAndroid(){
  return ( navigator.userAgent.indexOf( 'Android' ) > 0 );
}

function undo(){
  if( undos && undos.length > 0 ){
    var last_stroke = undos.pop();
    if( undos.length == 0 ){
      $('#'+OPTION.undo_btn).prop( 'disabled', true );
    }
    redos.push( last_stroke );
    $('#'+OPTION.redo_btn).prop( 'disabled', false );

    redrawCanvas();
  }
}

function redo(){
  if( redos && redos.length > 0 ){
    var last_stroke = redos.pop();
    if( redos.length == 0 ){
      $('#'+OPTION.redo_btn).prop( 'disabled', true );
    }
    undos.push( last_stroke );
    $('#'+OPTION.undo_btn).prop( 'disabled', false );

    redrawCanvas();
  }
}

function setBG(){
  var color = $('#'+OPTION.select_color).val();
  if( color ){
    if( color == 'custom' ){
      color = custom_color;
    }
    if( color != 'transparent' ){
      backgroundcolor = color;
    }else{
      backgroundcolor = null;
    }
    redrawCanvas();
  }
}

function redrawCanvas(){
  if( undos && undos.length >= 0 ){
    resetCanvas( true );

    if( backgroundcolor ){
      var canvas = document.getElementById( 'mycanvas' );
      if( !canvas || !canvas.getContext ){
        return false;
      }
      var ctx = canvas.getContext( '2d' );

      //. 全体をベタ塗り
      ctx.beginPath();
      ctx.fillStyle = backgroundcolor; //"rgb( 255, 255, 255 )";
      ctx.fillRect( 0, 0, canvas.width, canvas.height );
      ctx.stroke();
    }

    for( var i = 0; i < undos.length; i ++ ){
      var stroke = undos[i];

      for( var j = 1; j < stroke.xys.length; j ++ ){
        var canvas = document.getElementById( 'mycanvas' );
        if( !canvas || !canvas.getContext ){
          return false;
        }
        var ctx = canvas.getContext( '2d' );

        var color = stroke.color;
        if( color == 'transparent' ){
          ctx.globalCompositeOperation = 'destination-out';
        }else{
          ctx.globalCompositeOperation = 'source-over';
        }

        ctx.beginPath();
        ctx.lineWidth = stroke.width;
        ctx.lineCap = 'round';
        ctx.moveTo( stroke.xys[j-1][0], stroke.xys[j-1][1] );
        ctx.lineTo( stroke.xys[j][0], stroke.xys[j][1] );
        if( color != 'transparent' ){
          ctx.strokeStyle = color;
        }
        ctx.stroke();
      }
    }
  }
}

function generateUUID(){
  //. Cookie の値を調べて、有効ならその値で、空だった場合は生成する
  var did = null;
  cookies = document.cookie.split(";");
  for( var i = 0; i < cookies.length; i ++ ){
    var str = cookies[i].split("=");
    if( unescape( str[0] ) == " deviceid" ){
      did = unescape( unescape( str[1] ) );
    }
  }

  if( did == null ){
    var s = 1000;
    did = ( new Date().getTime().toString(16) ) + Math.floor( s * Math.random() ).toString(16);
  }
  var maxage = 60 * 60 * 24 * 365 * 100; //. 100years
  document.cookie = ( "deviceid=" + did + '; max-age=' + maxage );

  return did;
}

function timestamp2datetime( ts ){
  if( ts ){
    var dt = new Date( ts );
    var yyyy = dt.getFullYear();
    var mm = dt.getMonth() + 1;
    var dd = dt.getDate();
    var hh = dt.getHours();
    var nn = dt.getMinutes();
    var ss = dt.getSeconds();
    var datetime = yyyy + '-' + ( mm < 10 ? '0' : '' ) + mm + '-' + ( dd < 10 ? '0' : '' ) + dd
      + ' ' + ( hh < 10 ? '0' : '' ) + hh + ':' + ( nn < 10 ? '0' : '' ) + nn + ':' + ( ss < 10 ? '0' : '' ) + ss;
    return datetime;
  }else{
    return "";
  }
}

function sendCanvas(){
  var canvas = document.getElementById( 'mycanvas' );
  if( !canvas || !canvas.getContext ){
    return false;
  }
  var ctx = canvas.getContext( '2d' );

  //. 画像データ
  var png = canvas.toDataURL( 'image/png' );
  png = png.replace( /^.*,/, '' );

  var obj = new DOODLEJS();
  obj.postCanvas( png );
}

//. #3
var DOODLEJS = function(){};
DOODLEJS.prototype.postCanvas = function( png ){
  console.log( 'png', png );
};

//. #33
function changeColor( c ){
  $('#'+OPTION.select_color).css( 'color', c );
  $('#'+OPTION.select_color).val( 'custom' );
  custom_color = c;

  $('#'+OPTION.select_linewidth).css( { 'color': c } );
  $('#'+OPTION.setbg_btn).css( { 'background': c } );
}

function openColorModal(){
  $('#'+OPTION.colorModal).modal( 'show' );
}

function closeColorModal(){
  $('#'+OPTION.colorModal).modal( 'hide' );
  var c = $('#'+OPTION['color-picker']).val();
  changeColor( c );
}
