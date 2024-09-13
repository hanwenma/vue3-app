(function (designWidth) {
    const dEl = document.documentElement;
    let meta = document.querySelector("meta[name=viewport]");
  
    // 页面中不存在 <meta name="viewport" /> 时，手动创建一个   
    if(!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'viewport');
      document.head.appendChild(meta);
    }
  
    function setMetaContent(){
      const deviceWidth = dEl.clientWidth;
      const scale = deviceWidth / designWidth;
  
      const content = `width=${deviceWidth}, initial-scale=${scale}`;
  
      meta.setAttribute("content", content);
    }
  
  
    setMetaContent();
  
  
    window.addEventListener("resize", setMetaContent)
  
  })(750);