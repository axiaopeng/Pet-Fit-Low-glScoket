module.exports = app => {
    return async (ctx, next) =>  {
      const {app, socket, logger,model} = ctx
      const Op = app.Sequelize.Op;
      const query =  socket.handshake.query
      //更新赋值自身socketid
      socket.myself = await app.model.UserInfo.findOne({
        attributes:['id','role_name','position_x','position_y'],
        include:[{
          model: app.model.User,
          attributes: ['id','account','roleid'],
          where: {
            account:query.userCreds,          
            login_status: 1,
            col1: app.Sequelize.where(app.Sequelize.col('user_info.id'),'=', app.Sequelize.col('user.roleid')),
          }
        }]
      })
      await socket.myself.updateOne({
        socketid: socket.id
      })
      socket.roleid = socket.myself.id
      //以自身为圆心，半径1000内其他已登陆用户信息
      let others = await socket.myself.others();
      //首次初始化
      ctx.socket.emit('init',{
        others
      })

      await next();
      // execute when disconnect.
      console.log('disconnection!');
    };
  };