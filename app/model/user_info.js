
'use strict';
 
module.exports = app => {
  const { STRING, INTEGER, DATE,BIGINT ,Op} = app.Sequelize;
  const UserInfo = app.model.define('user_info', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    uid: INTEGER,             //外键 user表id
    role_name: STRING(8),     //角色名称
    position_x: BIGINT,       //角色x轴坐标
    position_y: BIGINT,       //角色y轴坐标
    role_type: INTEGER,       //角色类型
    socketid: STRING(30),       //角色类型
  },{
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,
  });
  //更新自身
  UserInfo.prototype.updateOne = async function(obj) {
    return await this.update({ 
      socketid: obj.socketid,
      position_x: obj.position_x,
      position_y: obj.position_y,
    });
  }
  //查找自身半径 1000 以内其他人
  UserInfo.prototype.others = async function() {
    return await app.model.UserInfo.findAll({
      where: {
        position_x: {
          [Op.between]: [this.position_x-1000, this.position_x-0+1000]
        },
        position_y: {
          [Op.between]: [this.position_y-1000, this.position_y-0+1000]
        },
        socketid :{                            //不获取自己的
          [Op.not]: this.socketid
        },  
      },
      attributes: ['id','role_name','position_x','position_y','socketid'],
      include:[{
        model: app.model.User,
        attributes: ['id','account','roleid'],
        where: {         
          login_status: 1,
          col1: app.Sequelize.where(app.Sequelize.col('user_info.id'),'=', app.Sequelize.col('user.roleid')),
        }
      }]
    })
  }
  return UserInfo;

};