## Lazyload

A mini lazyload component within 100 lines code, support amd/cmd require.

文章导读 in Chinese: <http://www.barretlee.com/blog/2015/11/16/lazyload-component/>

Live Demo: <http://barretlee.github.io/lazyload/demo/index.html>

### Usage

Include the lazyload scirpt to your html:

```html
<script src="https://raw.githubusercontent.com/barretlee/lazyload/master/index.js"></script>

<div class="box">
  <div class="item"><img src data-src="img-path"></div>
  <div class="item"><textarea>alert(1)</textarea></div>
</div>
```

It exports an api to global:

```js
new Lazyload('.box .item', {
  callback: function(){
    console.log("All item loaded");
  }
});
```

### Params 

There are two param your can set when get an Lazyload instance:

```js
new Lazyload('.item', {
  tag: "data-src",
  distance: 0,
  callback: function(){
    // ...
  }
});
```

- `tag`, default is 'data-src', we set the lazyload image 'src' to null, then read 'data-src' attribute;
- `distance`, default is 0, if you want to show the lazyload element in advance, you can set it to a positive number;
- `callback`, when all item loaded, it will trigger.

Also, two more api:

```js
var lazyload = new Lazyload();
lazyload.pause();
setTimeout(function(){
  lazyload.restart();
});
```

- `.pause()`, pause the lazyload use the inner variable `_pause`;
- `.resetart()`, set `_pause` false;


### Liscese

Under MIT Liscese. Copyright (c) 2015 小胡子哥(Barret Lee)

### changelog

- 2015-11-20
  * add `callback` function
  * add `pause` and `restart` function
