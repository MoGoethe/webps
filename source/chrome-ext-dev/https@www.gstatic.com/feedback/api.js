(function(){var b=this;Math.random();function h(f,n,p){f.timeOfStartCall=(new Date).getTime();if(n&&JSON&&JSON.stringify){var a=JSON.stringify(n);200>=a.length&&(f.psdJson=a)}a=p||b;a.GOOGLE_FEEDBACK_START_ARGUMENTS=arguments;var g=f.serverUri||"../../https@www.google.com/tools/feedback",c=a.GOOGLE_FEEDBACK_START;if(c)c.apply(a,arguments);else{var g=g+"/load.js?",d;for(d in f){var c=f[d],e;if(e=null!=c)e=typeof c,e=!("object"==e&&null!=c||"function"==e);e&&(g+=encodeURIComponent(d)+"="+encodeURIComponent(c)+"&")}d=a.document;a=d.createElement("script");
a.src=g;d.body.appendChild(a)}}var k=["userfeedback","api","startFeedback"],l=b;k[0]in l||!l.execScript||l.execScript("var "+k[0]);for(var m;k.length&&(m=k.shift());)k.length||void 0===h?l=l[m]?l[m]:l[m]={}:l[m]=h;})();
