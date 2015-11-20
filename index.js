/**
 * MIT License
 * @author Barret Lee<http://barretlee.com/about/>
 * @datetime 2015-11-16 20:21:27
 */

~function(window, undefined) {

  // exports to global
  umd("Lazyload", Lazyload);

  Lazyload.TAG = "data-src";
  Lazyload.DISTANCE = 0;

  // Lazyload Component
  function Lazyload(elements) {
    this.elements = typeof elements === "string" ? $(elements) : elements;
    this.init();
  };

  // init, bind event
  Lazyload.prototype.init = function() {
	this._getSize();
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
	  self._getSize();
      timer && clearTimeout(timer);
      self._detectElementIfInScreen();
    });
  };
  
  // get screen size
  Lazyload.prototype._getSize = function() { 
	this.screenHeight = window.innerHeight || document.documentElement.clientHeight; //browser height
	this.screenWidth = window.innerWidth || document.documentElement.clientWidth; //browser width
  };  

  // detect if in screen
  Lazyload.prototype._detectElementIfInScreen = function() {
    if(!this.elements.length) return;
    for (var i = 0, len = this.elements.length; i < len; i++) {
      var ele = this.elements[i];
      var rect = ele.getBoundingClientRect();
      if((rect.top >= Lazyload.DISTANCE && rect.left >= Lazyload.DISTANCE
         || rect.top < 0 && (rect.top + rect.height) >= Lazyload.DISTANCE
         || rect.left < 0 && (rect.left + rect.width >= Lazyload.DISTANCE))
        && rect.top <= this.screenHeight && rect.left <= this.screenWidth) {
        this.loadItem(ele);
        this.elements.splice(i, 1);
        i--; len--;
      }
    }
  };

  // lazyload img or script
  Lazyload.prototype.loadItem = function(ele) {
    var imgs = ele.getElementsByTagName("img");
    for(var i = 0, len = imgs.length; i < len; i++) {
      var img = imgs[i];
      var src = img.getAttribute(Lazyload.TAG);
      if(src) {
        img.setAttribute("src", src);
      }
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
