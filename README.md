# doodlejs

## Overview

JavaScript library for hand-drawn doodle sharing services.


## How to use

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

ID value('#cdiv') is the ones of &lt;div&gt; above(1).
```


## Licensing

This code is licensed under MIT.


## Copyright

2020 K.Kimura @ Juge.Me all rights reserved.

