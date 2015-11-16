## Lazyload

A mini lazyload component within 100 lines code, support amd/cmd require.

Live demo: <http://barretlee.github.io/lazyload/demo/index.html>

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
new Lazyload('.box .item');
```


### Params 

There are two param your can set:

- `Lazyload.TAG`, default is 'data-src', we set the lazyload image 'src' to null, then read 'data-src' attribute. for example:
```html
<img src data-src="THE-REAL-PATH" />
```
- `Lazyload.DISTANCE`, default is 0, if you want to show the lazyload element in advance, you can set it to a positive number;

### Liscese

Under MIT Liscese. Copyright (c) 2015 小胡子哥(Barret Lee)
