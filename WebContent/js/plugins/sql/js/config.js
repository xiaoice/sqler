seajs.config({
  base: "../js",
  paths: {
	 'plugins': 'plugins'
  },
  alias: {
    "jquery": "jquery.min.js",
    "bootstrapCss": "plugins/bootstrap/css/bootstrap.min.css",
    "bootstrap": "plugins/bootstrap/js/bootstrap.min.js",
    "font-awesome": "plugins/bootstrap/css/font-awesome.css",
    "easyuiCss-black": "plugins/jquery-easyui/themes/black/easyui.css",
    "easyui": "plugins/jquery-easyui/jquery.easyui.min.js",
    "message": "plugins/sql/js/message.js",
    "messageCss": "plugins/sql/css/message.css",
    "layout": "plugins/sql/js/layout.js",
    "menu": "plugins/sql/js/menu.js",
    "tree": "plugins/sql/js/tree.js",
    "login": "plugins/sql/js/login.js",
    "util": "plugins/sql/js/util.js",
    "sql": "plugins/sql/js/sql.js",
    "table": "plugins/sql/js/table.js"
  },
  preload: [
     this.JSON ? '' : 'plugins/json.js',
     this.$?'':'jquery'
  ],
  debug: true,
  charset: 'utf-8'
});

//加载入口模块
seajs.use(["layout"],function(layout){
	console.log("page was init!",layout);
});