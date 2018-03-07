/**
 * Created by Jimmy on 2017/6/15.
 */
const appName = 'web';
module.exports = {
    version: '1.0.0',
    env: 'web server',
    //上传配置
    ssh: {
        host: '0.0.0.0',
        port: 22,
        username: 'username',
        password: 'password',
    },
    remoteDir: `/js/h5_sites/${appName}/public/${appName}`,
    commands: [
        //删除原有备份
        `rm -rf /js/h5_sites/${appName}/public/${appName}_bak`,
        //备份现有文件
        `mv /js/h5_sites/${appName}/public/${appName}/* /js/h5_sites/${appName}/public/${appName}_bak`
    ]
};