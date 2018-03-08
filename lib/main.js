$(function() {
	$('#story-container').hide();
	$('#story-container-branch').hide();

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
				},{
					storyId :"1",
					display :"Unfortunate Choices",
					link    :"1-unfortunate_choices.json",
					type    :"branch",
					color   :"red"
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
						loadStory(this.gamelist[selectedIndex]);
					}
				}catch(e) {
					console.log('browser not supported');
				}
			}
		}
	});

	function loadStory(selectedStory){
		var jdata;
		$.getJSON('./src/'+selectedStory.link,function(data){
			jdata = data;
			if(selectedStory.type=="linear"){
				var story = new Vue({
					el: "#story-container", 
					data: {
						storyTitle      : selectedStory.display,
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
			}else if(selectedStory.type="branch"){
				var story = new Vue({
					el: "#story-container-branch", 
					data: {
						storyTitle      : selectedStory.display,
						steps           : 0,
						code            : jdata[0].title.key,
						title           : jdata[0].title.disp,
						reads           : jdata[0].story,
						options         : jdata[0].options,
						selectedOption  : [],
						visibility      : false
					},
					methods: {
						advance:function(storyId){
							var selectedIndex = jdata.findIndex(obj => obj.title.key == storyId);
							this.code        = jdata[selectedIndex].title.key;
							this.title       = jdata[selectedIndex].title.disp;
							this.reads       = jdata[selectedIndex].story;
							this.options     = jdata[selectedIndex].options;
						}
					},
					mounted: function() {
						this.visibility = true;
					}
				});
			}
		});
	}
});