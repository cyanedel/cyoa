$(function() {
	var jdata;
	$.getJSON('./src/1-init.json',function(data){
		jdata = data;

		var story1 = new Vue({
			el: "#story1",
			data: {
				maxstep         : jdata.length - 1,
				steps           : 0,
				code            : jdata[0].title.key,
				title           : jdata[0].title.disp,
				reads           : jdata[0].story,
				options         : jdata[0].options,
				selectedOption  : [],
				showoptions     : true,
			},
			methods: {
				save: function(x){
					var obj = {};
					obj[this.code] = x;
					var strObj = JSON.stringify(obj);

					this.selectedOption.push(strObj);
					console.log(this.selectedOption);
					this.advance();
				},
				advance:function(){
					this.steps += 1;
					this.stories(this.steps);
				},
				stories:function(x){
					this.code        = jdata[this.steps].title.key;
					this.title       = jdata[this.steps].title.disp;
					this.reads       = jdata[this.steps].story;
					this.options     = jdata[this.steps].options;
					if(x == this.maxstep && jdata[this.steps].title.key == "end"){
						this.showoptions = false;
					}
				}
			}
		});
	});
});