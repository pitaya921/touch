var touch = (function(){
	var startTx,startTy,startTime,holdTimer
	var isSwipe = false
	function on(target,evt,cb){
		target.addEventListener(evt,cb,false)
	}
	function fire(el,evt,detail){
		detail = detail || {}
		var e, opt = {
			bubbles: true,
			cancelable: true,
			detail: detail
		}
		if (typeof CustomEvent !== 'undefined') {
			e = new CustomEvent(evt, opt)
			if (el) {
				el.dispatchEvent(e)
			}
		} else {
			e = document.createEvent("CustomEvent")
			e.initCustomEvent(evt, true, true, detail)
			if (el) {
				el.dispatchEvent(e)
			}
		}
	}
	var g={
		tap:function(ev){
			var el = ev.target
			var touches = ev.changedTouches[0],
			endTx = touches.clientX,
			endTy = touches.clientY,
			endTime = Date.now()
			clearTimeout(holdTimer)
			var eventObj = {
				x:endTx,
				y:endTy
			}
			if(Math.abs(startTx - endTx) < 6 && Math.abs(startTy - endTy) < 6 ){
				if((endTime-startTime)<426){
					fire(el,'tap',eventObj)
				}
			}
		},
		hold:function(ev){
			var el = ev.target
			clearTimeout(holdTimer)
			var eventObj = {
				x:startTx,
				y:startTy
			}
			holdTimer = setTimeout(function(){
				fire(el,'hold',eventObj)
			},426)
		},
		swipe:function(ev){
			var el = ev.target
			var touches = ev.changedTouches[0],
				endTx = touches.clientX,
				endTy = touches.clientY
			if(Math.abs(endTx-startTx) > Math.abs(endTy - startTy)){
				if(endTx>startTx){
					fire(el,'swipe',{dir:'right'})
				}else{
					fire(el,'swipe',{dir:'left'})
				}
			}else if(Math.abs(endTx-startTx) < Math.abs(endTy - startTy)){
				if(endTy>startTy){
					fire(el,'swipe',{dir:'down'})
				}else{
					fire(el,'swipe',{dir:'up'})
				}
			}
				isSwipe = false
		}
	}
	function handle(e){
		switch(e.type){
			case 'touchstart':
				var touches = e.touches[0]
				startTx = touches.clientX
				startTy = touches.clientY
				startTime = Date.now()
				g.hold(e)
				break
			case 'touchmove':
				clearTimeout(holdTimer)
				isSwipe = true
				break
			case 'touchend':
				if(isSwipe){
					g.swipe(e)
				}else{
					g.tap(e)
				}
				break
		}
	}
	;['touchstart','touchmove','touchend'].forEach(function(item){
		document.addEventListener(item,handle,false)
		})
	return {
		on:on
	}
})()