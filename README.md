# doodlejs

## Overview

JavaScript library for hand-drawn doodle sharing services.


## How to use

(See sample [index.html](https://github.com/dotnsf/doodlejs/blob/master/docs/index.html) for your reference.)

1. Code &lt;div&gt; element with **id** :

`<div id="cdiv"></div>`


2. Prepare 5 elements with ids :

- &lt;select id="select_color"&gt;

  - Foreground color

- &lt;select id="select_linewidth"&gt;

  - Line width

- &lt;button id="undo_btn"&gt;

  - Undo button

- &lt;button id="redo_btn"&gt;

  - Redo button

- &lt;button id="setbg_btn"&gt;

  - Set Background color button

- &lt;div id="colorModal"&gt;

  - Color Modal Dialog

- &lt;input type="color" id="color-picker"&gt;

  - Color Picker


* &lt;select&gt;s can be &lt;input&gt; which can set/get values with **.val()** method.

* &lt;button&gt;s can be &lt;input&gt; or &lt;a&gt; with button attributes.


3. Run following JavaScript method with options : 

```
$('#cdiv').doodlejs({
  select_color: 'select_color',
  select_linewidth: 'select_linewidth',
  undo_btn: 'undo_btn',
  redo_btn: 'redo_btn',
  setbg_btn: 'setbg_btn'
});

ID value('#cdiv') is the ones of <div> above(1).
```


4. (Option)Customize `DOODLEJS.prototype.postCanvas()` function, as send button handler if needed :

```
DOODLEJS.prototype.postCanvas = function( png ){
  //. バイナリ変換
  var bin = atob( png );
  var buffer = new Uint8Array( bin.length );
  for( var i = 0; i < bin.length; i ++ ){
    buffer[i] = bin.charCodeAt( i );
  }
  var blob = new Blob( [buffer.buffer], {
    type: 'image/png'
  });

  //. フォームにして送信
  var formData = new FormData();
  formData.append( 'image', blob );
  formData.append( 'timestamp', ( new Date() ).getTime() );

  $.ajax({
    type: 'POST',
    url: '/image',
    data: formData,
    contentType: false,
    processData: false,
    success: function( data, dataType ){
      console.log( data );
    },
    error: function( jqXHR, textStatus, errorThrown ){
      console.log( textStatus + ': ' + errorThrown );
    }
  });
};
```

You need to implement `POST /image` backend API handler in this case.


## Licensing

This code is licensed under MIT.


## Copyright

2020-2021 K.Kimura @ Juge.Me all rights reserved.

