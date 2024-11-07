import{B as o,l as t,C as i,M as l,T as u,Z as g,a as r}from"./ZeldaGame-COIOrBxJ.js";class w extends o{constructor(a){super(a)}update(a){if(this.handleDefaultKeys(),!this.assetsLoaded){const s={prefix:"treasures.",firstPixelIsTranslucent:!0,images:[{id:"fullHeart",x:0,y:0,s:8},{id:"halfHeart",x:8,y:0,s:8},{id:"emptyHeart",x:16,y:0,s:8},{id:"blueHeart",x:0,y:8,s:8},{id:"yellowRupee",x:72,y:0,w:8,h:16},{id:"blueRupee",x:72,y:16,w:8,h:16},{id:"bomb",x:136,y:0,w:8,h:14}]};this.assetsLoaded=!0;const e=this.game;e.assets.addImage("loading","res/loadingMessage.png"),e.assets.onLoad(()=>{this._loadingImage=e.assets.get("loading"),e.assets.addImage("title","res/title.png"),e.assets.addSpriteSheet("font","res/font.png",9,7,0,0),e.assets.addSpriteSheet("link","res/link.png",16,16,1,1,!0),e.assets.addSpriteSheet("enemies","res/enemies.png",16,16,1,1,!0),e.assets.addSpriteSheet("enemyDies","res/enemyDies.png",16,16,1,1,!0),e.assets.addSpriteSheet("overworld","res/overworld.png",16,16),e.assets.addSpriteSheet("labyrinths","res/level1.png",16,16),e.assets.addImageAtlasContents("treaureAtlas","res/treasures.png",s),e.assets.addImage("hud","res/hud.png"),e.assets.addJson("overworldData","res/data/overworld.json"),e.assets.addJson("level1Data","res/data/level1.json"),e.assets.addSound("sword","res/sounds/sword.wav"),e.assets.addSound("enemyDie","res/sounds/kill.wav"),e.assets.addSound("enemyHit","res/sounds/LOZ_Hit.wav"),e.assets.addSound("stairs","res/sounds/LOZ_Stairs.wav"),e.assets.addSound("overworldMusic","res/sounds/02-overworld.ogg",5.234),e.assets.addSound("labyrinthMusic","res/sounds/04-labyrinth.ogg"),e.assets.addSound("linkDies","res/sounds/LOZ_Die.wav"),e.assets.addSound("text","res/sounds/LOZ_Text.wav"),e.assets.addSound("linkHurt","res/sounds/LOZ_Hurt.wav"),e.assets.addSound("shield","res/sounds/LOZ_Shield.wav"),e.assets.addSound("rupee","res/sounds/LOZ_Get_Rupee.wav"),e.assets.addSound("heart","res/sounds/LOZ_Get_Heart.wav"),e.assets.addSound("bombDrop","res/sounds/LOZ_Bomb_Drop.wav"),e.assets.addSound("bombBlow","res/sounds/LOZ_Bomb_Blow.wav"),e.assets.addSound("getItem","res/sounds/LOZ_Get_Item.wav"),e.assets.onLoad(()=>{t.Utils.getRequestParam("skipTitle")!==null?(this.game.startNewGame(),e.setState(new i(new l))):e.setState(new t.FadeOutInState(this,new u))})})}}}window.init=(d,a)=>{const s=window;if(s.game=new g({assetRoot:a,height:r.CANVAS_HEIGHT,keyRefreshMillis:300,parent:d,targetFps:60,width:r.CANVAS_WIDTH}),s.game.setState(new w),s.game.start(),navigator.userAgent.toLowerCase().indexOf("electron/")>-1){const n=s.game.canvas;window.addEventListener("resize",()=>{console.log("Resize event received"),t.CanvasResizer.resize(n,t.StretchMode.STRETCH_PROPORTIONAL)},!1)}};window.init("gameDiv");
