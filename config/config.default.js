/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {
    io: {
      init: { }, // passed to engine.io
      namespace: {
        '/glSocket': {
          connectionMiddleware: ['connection'], //连接时中间件
          packetMiddleware: ['packet'],         //数据发送接收时中间件
        },
        '/example': {
          connectionMiddleware: ['connection'],  //连接时中间件
          packetMiddleware: ['packet'],          //数据发送接收时中间件
        }, 
      },
    }
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1616562194861_3888';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  config.cluster = {
    listen: {
      path: '',
      port: 7001,
      // hostname: '127.0.0.1',       //本地环境
      hostname: '0.0.0.0',         //生产环境
    }
  }
  config.security = {
    　　csrf: {
    　　　　enable: false
    　　},
    　　domainWhiteList: [ '*' ]
    };
    config.cors = {
        origin: '*',
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
    };
    config.sequelize = {
      dialect: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username:'root',
      // password:'123456',    //本地环境
      password:'cf51d21017bd0951', //生产环境
      database: 'mygame',
      logging: false ,         //控制sql日志
    };
   
    config.bodyParser = {
      enable: true,
      encoding: 'utf8',
      formLimit: '100kb',
      jsonLimit: '100kb',
      strict: true,
      // @see https://github.com/hapijs/qs/blob/master/lib/parse.js#L8 for more options
      queryString: {
        arrayLimit: 100,
        depth: 5,
        parameterLimit: 1000,
      },
      enableTypes: ['json', 'form', 'text'],
      extendTypes: {
        text: ['text/xml', 'application/xml'],
      },
    };

  return {
    ...config,
    ...userConfig,
  };
};