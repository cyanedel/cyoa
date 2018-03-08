$(function() {
	$('#story-container').hide();

	var gametitles;
	var gamelist = new Vue({
		el: "#gametitles",
		data: {
			gamelist:[
				{
					storyId :"0",
					display :"Vampire Hunter",
					link    :"1-vampire_hunter.json",
					type    :"linear",
					color   :"blue"
				}
			],
			types:[
				{ display:"topic", color:"yellow" },
				{ display:"topic", color:"green" },
				{ display:"topic", color:"red" },
				{ display:"topic", color:"purple" },
				{ display:"topic", color:"blue" }
			],
		visibility: true
		},
		methods:{
			loadStory: function(storyId){
				try {
					var selectedIndex = this.gamelist.findIndex(obj => obj.storyId == storyId);
					if(selectedIndex >= 0){
						this.visibility = false;
						loadStory(this.gamelist[selectedIndex].type, this.gamelist[selectedIndex].link);
					}
				}catch(e) {
					console.log('browser not supported');
				}
			}
		}
	});

	function loadStory(type, link){
		if (type=="linear"){
			var jdata;
			$.getJSON('./src/'+link,function(data){
				jdata = data;

				var story = new Vue({
					el: "#story-container", 
					data: {
						maxstep         : jdata.length - 1,
						steps           : 0,
						code            : jdata[0].title.key,
						title           : jdata[0].title.disp,
						reads           : jdata[0].story,
						options         : jdata[0].options,
						selectedOption  : [],
						showoptions     : true,
						visibility      : false
					},
					methods: {
						save: function(x){
							var obj      = {};
							obj['key']   = this.code;
							obj['value'] = x;
							
							this.selectedOption.push(obj);
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
					},
					mounted: function() {
						this.visibility = true;
					}
				});
			});
		}
	}
});