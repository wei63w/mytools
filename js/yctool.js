/*
 *
 * 1. var tool = new tool();
 * 
 * 2.
 * tool({
 * 	isInsertJq:true,
 *  isOpenLog:true,
 *  isOpenLoadScriptProgress:true
 * });
 * 
 * 
 * 
 * */

(function(window,undefined){
	if(!window.imgCache){ 
		window.imgCache={}; 
		//window.setTimeout(function(){ console.log(window.imgCache) },10000);
	}
	
	
	var name = 'wyc',
		tool = function(elems,options){
			return new tool.prototype.init(elems, options);
		},
		imgArr = [],
		isOpenLog = true,//是否输出 log 默认 true
		isOpenLoadScriptProgress = true,
		argOptions = {//初始化默认参数
			'name':'wyc',
			'age':18,
			'isOpenLog':isOpenLog,
			isOpenLoadScriptProgress:isOpenLoadScriptProgress
		},
		isMobilePlayer = false,//是否是移动环境
		isNeedCache = true,//是否需要 css js image 缓存
		loaderLength = 0,
		loaderProgress = 0,
		loaderTarget = document.querySelector('#loading'),
		isInsetJq = true;//是否需要插入 JQ
	//
	function getIsMobilePlayer(){
		// 判断是否为移动端运行环境
		if (/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))) {
		    if (window.location.href.indexOf("?mobile") < 0) {
		        try {
		            if (/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)) {
		                // 判断访问环境是 Android|webOS|iPhone|iPod|BlackBerry 则加载以下样式
		                isMobilePlayer = true;
		            } else {
		                // 判断访问环境是 其他移动设备 则加载以下样式
		            }
		        } catch (e) {}
		    }
		} else {
		    // 如果以上都不是，则加载以下样式
		}
	}
	// 日志控制
	function log() {
		if (argOptions.isOpenLog) {
			console.log.apply(console, arguments);
		}
	}
	//加载自定义 JS 文件
	function loadJsFiles(filePath,callback){
		var ref = window.document.getElementsByTagName("script")[0],
			script = window.document.createElement("script");
		if(filePath == '' || typeof filePath === 'undefined' || filePath.indexOf('.js')<0 ){
			return;
		}
		loaderLength += 1;
		script.src = isNeedCache?filePath:filePath+'?r='+Math.random();
		script.type = 'text/javascript';
		script.async = false;
		//use before or append
//		ref.parentNode.insertBefore(script, ref);
		//use append
	 	document.head.appendChild(script);
	 	
		if (callback && typeof(callback) === "function") {
			script.onload = callback;
		}
	}
	//加载 css 文件
	function loadCssFiles(filePath,callback){
		if(filePath && filePath.indexOf('.css')>0){
			loaderLength += 1;
			var mylink=document.createElement('link');
				mylink.type='text/css';
				mylink.rel='stylesheet';
				mylink.href=isNeedCache?filePath:filePath+'?r='+Math.random();
		    	document.head.appendChild(mylink);
		    	if (callback && typeof(callback) === "function") {
				mylink.onload = callback;
			}
		}else{
			log('css 路径错误');
		}
	}
	//加载 image 文件
	function loadImageFiles(filePath,callback){
		var img;
		if(filePath){
			loaderLength += 1;
			img = new Image();
			img.src= isNeedCache?filePath:filePath+'?r='+Math.random();
//			img.onload=function(e){ 
//				window.imgCache[e.target.src.substring(e.target.src.lastIndexOf('/')+1, e.target.src.indexOf('?')>0?e.target.src.indexOf('?'):999)]=e.target;
//			}
			if (callback && typeof(callback) === "function") {
				img.onload = callback;
			}
			img.onerror=function(e){ 
				log('image 缓存错误---'+e.target.outerHTML)
			}
			
		}
	}
	
	
	tool.prototype = {
		init : function(options){
			var argLength = arguments.length;
			if (arguments[0] !== undefined) {
				//默认值为 true 或者传参为 true 都进行插入操作
				if(isInsetJq || arguments[0].isInsetJq == true){
					var jqUrl = 'https://cdn.bootcss.com/jquery/3.1.0/jquery.js';
					loadJsFiles(jqUrl,function(){
						if (argLength) {
							argOptions = $.extend(argOptions, options);
							loaderProgress += 1;
							
							loaderTarget.innerText =  Math.floor(loaderProgress / loaderLength * 100)+'%';
							log('参数个数为:'+argLength);
							log('argOptions is ');
							log('jq load complate ');
							log(argOptions);
						}
					});
				}
			}
			getIsMobilePlayer();
			return this;	
		},
		loadJsByPaths:function(paths){
			if(arguments.length > 0 && arguments[0] != undefined){
				var a = '';
				for(var i = 0;i < arguments[0].length;i++){
					loadJsFiles(arguments[0][i],function(){
						loaderProgress += 1;
						log(`加载进度为${loaderLength}/${loaderProgress}`);
						loaderTarget.innerText =  Math.floor(loaderProgress / loaderLength * 100)+'%';
					});
				}
			}
		},
		loadCssByPaths:function(paths){
			if(arguments.length > 0 && arguments[0] != undefined){
				var a = '';
				for(var i = 0;i < arguments[0].length;i++){
					loadCssFiles(arguments[0][i],function(){
						loaderProgress += 1;
						log(`加载进度为${loaderLength}/${loaderProgress}`);
						loaderTarget.innerText =  Math.floor(loaderProgress / loaderLength * 100)+'%';
					});
				}
			}
		},
		loadImageByPaths:function(paths){
			if(arguments.length > 0 && arguments[0] != undefined){
				var a = '';
				for(var i = 0;i < arguments[0].length;i++){
					loadImageFiles(arguments[0][i],function(e){
						window.imgCache[e.target.src.substring(e.target.src.lastIndexOf('/')+1, e.target.src.indexOf('?')>0?e.target.src.indexOf('?'):999)]=e.target;
						loaderProgress += 1;
						log(`加载进度为${loaderLength}/${loaderProgress}`);
						loaderTarget.innerText =  Math.floor(loaderProgress / loaderLength * 100)+'%';
					});
				}
			}
		},
		jsLoaderProgress:function(){
			log('js总数:'+loaderLength+'');
		}
	}
	
	
	
	
	
	tool.prototype.init.prototype = tool.prototype;
	window.tool = tool;
})(window)
