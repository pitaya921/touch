# touch
##example
	var test = document.getElementById('test')
	touch.on(test,'tap',function(e){
		console.log('tap')
	})
	touch.on(test,'hold',function(e){
		console.log('hold')
	})
	touch.on(test,'swipe',function(e){
		console.log(e.detail.dir)
	})
