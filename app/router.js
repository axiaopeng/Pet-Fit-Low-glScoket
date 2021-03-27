'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io } = app;
  router.get('/', controller.home.index);

  // 通知他人初始化 我
  io.of('/glSocket').route('initInOther', io.controller.glInit.initInOther)
  // 行为改变 坐标
  io.of('/glSocket').route('behavior', io.controller.glInit.behavior)
  // 谈话框
  io.of('/glSocket').route('dialogBoxMessage', io.controller.glInit.dialogBoxMessage)
  // 离开 退出
  io.of('/glSocket').route('quit', io.controller.glInit.quit)
};
