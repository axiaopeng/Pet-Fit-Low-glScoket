'use strict';

const Controller = require('egg').Controller;

class DefaultController extends Controller {
  //通知他人初始化 我
  async initInOther() {
    const { ctx, app } = this;
    const {socket, logger,model} = ctx
    let others = await socket.myself.others();
    if(others&&others.length){
      for(let i = 0; i< others.length;i++){
        app.io.of("/glSocket").sockets[others[i].socketid]&&(await app.io.of("/glSocket").sockets[others[i].socketid].emit('otherEnter', socket.myself)) 
      }
    }  
  }
  //移动
  async behavior() {
    const { ctx, app } = this;
    const Op = app.Sequelize.Op;
    const {socket, logger,model} = ctx
    const query = ctx.args[0];
    let updateField = {}
    if(Object.keys(query)[0] === 'positionX'){
      updateField.position_x = query.positionX
    }else if(Object.keys(query)[0] === 'positionY'){
      updateField.position_y = query.positionY
    }
    try{
      //更新自身信息
      await  socket.myself.updateOne(updateField)
      //向指定范围内其他人发送自身最新信息
      let others = await socket.myself.others();
      if(others&&others.length){
        for(let i = 0; i< others.length;i++){
          //只向真正在线的指定用户发送信息
          app.io.of("/glSocket").sockets[others[i].socketid]&&(await app.io.of("/glSocket").sockets[others[i].socketid].emit('behavior', socket.myself))
        }
      }
    }catch(err){
      await socket.emit('err',{
        message: '发送失败！',
        err
      })
    }
  }
  //谈话框
  async dialogBoxMessage() {
    const { ctx, app } = this;
    const Op = app.Sequelize.Op;
    const {socket, logger,model} = ctx
    const query = ctx.args[0];
    
    try{
      //向指定范围内其他人发送 自身说的话
      let others = await socket.myself.others();
      if(others&&others.length){
        for(let i = 0; i< others.length;i++){
           //只向真正在线的指定用户发送信息
          app.io.of("/glSocket").sockets[others[i].socketid]&&(await app.io.of("/glSocket").sockets[others[i].socketid].emit('dialogBoxMessage',{
            roleid: socket.roleid,
            message: query.message
          }))
        }
      }
    }catch(err){
      await socket.emit('err',{
        message: '请求失败！',
        err
      })
    }

  }
  //离开 退出
  async quit() {
    const { ctx, app } = this;
    const {socket, logger,model} = ctx    
    try{
      //向指定范围内其他人发送 自身说的话
        let others = await socket.myself.others();
        if(others&&others.length){
          for(let i = 0; i< others.length;i++){
            //只向真正在线的指定用户发送信息
            app.io.of("/glSocket").sockets[others[i].socketid]&&(await app.io.of("/glSocket").sockets[others[i].socketid].emit('otherQuit',{
              roleid: socket.roleid,
            }))
          }
        }
    }catch(err){
      await socket.emit('err',{
        message: '请求失败！',
        err,
      })
    }

  }
}

module.exports = DefaultController;
