/**
 * MIT License
 * @author Barret Lee<http://barretlee.com/about/>
 * @datetime 2015-11-16 20:21:27
 * @change fsy0718 <fsy0718@yeah.net>
 * @changeContent
 *  1. 增加图片加载的开关
 *  2. 增加图片加载完成后的回调函数
 *  3. 修复页面打开时rect.top为负的bug
 *  采用Object.assign 与Promise
 */

~function(window, undefined) {

  // exports to global
  umd("Lazyload", Lazyload);

  var conf = {
    TAG: 'data-src',
    DISTANCE: 0,
    //触发时机，open 表示允许加载 close 表示不响应，只注册实例
    enable: 'open'
  }


  // Lazyload Component
  function Lazyload(elements,opts) {
    Object.assign(this,conf,opts)
    this.elements = typeof elements === "string" ? $(elements) : elements;
    this.init();
  };

  // init, bind event
  Lazyload.prototype.init = function() {
    var self = this;
    self._detectElementIfInScreen();

    var timer;
    addEventListener("scroll", function() {
      timer && clearTimeout(timer);
      timer = setTimeout(function() {
        self._detectElementIfInScreen();
      }, 50);
    });
    addEventListener("resize", function(){
      timer && clearTimeout(timer);
      self._detectElementIfInScreen();
    });
  };

  // detect if in screen
  Lazyload.prototype._detectElementIfInScreen = function() {
    if(!this.elements.length) return;
    for (var i = 0, len = this.elements.length; i < len; i++) {
      var ele = this.elements[i];
      var rect = ele.getBoundingClientRect();
      if(this.enable === 'open' && ((rect.top >= this.DISTANCE && rect.left >= this.DISTANCE
         || rect.top < 0 && (rect.top + rect.height) >= this.DISTANCE
         || rect.left < 0 && (rect.left + rect.width >= this.DISTANCE))
        && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
        && rect.left <= (window.innerWidth || document.documentElement.clientWidth))) {
        this.loadItem(ele, i);
        this.elements.splice(i, 1);
        i--; len--;
      }
    }
  };

  // lazyload img or script
  Lazyload.prototype.loadItem = function(ele, i) {
    var imgs = ele.getElementsByTagName("img");
    var self = this;
    var promiseArr = [];
    for(var i = 0, len = imgs.length; i < len; i++) {
      var img = imgs[i];
      var src = img.getAttribute(self.TAG);
      if(src) {
        if(self.callback){
          var promise = new Promise(function(resolve,reject){
            //图片不管完成还是错误，都必须解决这个promise，错误调用错误函数
            img.onerror = function(){
              resolve(this);

              self.error && self.error(this);
            }
            img.onload = function(){
              resolve(this);
            }

          })
          promiseArr.push(promise);
        }
        img.setAttribute("src", src);
      }
    }

    if(promiseArr.length){
      Promise.all(promiseArr).then(function(){
        return self.callback(imgs,ele,self);
      })
    }

    var textareas = ele.getElementsByTagName("textarea");
    for(var j = 0, len = textareas.length; j < len; j++){
      var script = textareas[j].value;
      if(window.execScript) {
        window.execScript(script);
      } else {
        new Function(script)();
      }
    }
  };

  // mini Query
  function $(query) {
    var res = [];
    if (document.querySelectorAll) {
      res = document.querySelectorAll(query);
    } else {
      var firstStyleSheet = document.styleSheets[0] || document.createStyleSheet();
      firstStyleSheet.addRule(query, 'Barret:Lee');
      for (var i = 0, len = document.all.length; i < len; i++) {
        var item = document.all[i];
        item.currentStyle.Barret && res.push(item);
      }
      firstStyleSheet.removeRule(0);
    }
    if(res.item) { /* Fuck IE8 */
      var ret = [];
      for(var i = 0, len = res.length; i < len; i++){
        ret.push(res.item(i));
      }
      res = ret;
    }
    return res;
  };

  function addEventListener(evt, fn){
    window.addEventListener ? this.addEventListener(evt, fn, false) : (window.attachEvent)
        ? this.attachEvent('on' + evt, fn) : this['on' + evt] = fn;
  }

  // UMD
  function umd(name, component) {
    switch (true) {
      case typeof module === 'object' && !!module.exports:
        module.exports = component;
        break;
      case typeof define === 'function' && !!define.amd:
        define(name, function() {
          return component;
        });
        break;
      default:
        try { /* Fuck IE8- */
          if (typeof execScript === 'object') execScript('var ' + name);
        } catch (error) {}
        window[name] = component;
    }
  };

}(window, void 0);
