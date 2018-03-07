/**
 * Created by Jimmy on 2017/6/15.
 */
var gulp = require('gulp');
var minimist = require('minimist');
var GulpSSH = require('gulp-ssh');
var prompt = require('gulp-prompt');
//获取通过命令行传进来的值
var knownOptions = {
    string: 'env',
    default: { env: process.env.NODE_ENV || 'production' }
};
var options = minimist(process.argv.slice(2), knownOptions);
var env = options.env;
//载入配置文件
var config = require(`./config/ssh.config.${env}.js`);
var sshConfig = config.ssh;
// sshConfig.password = process.argv.slice(2)[3]?process.argv.slice(2)[3]:sshConfig.password;
var uIndex = process.argv.slice(2).indexOf('--u');
var pdIndex = process.argv.slice(2).indexOf('--p');
sshConfig.username = pdIndex>0?process.argv.slice(2)[uIndex+1]:sshConfig.username;
sshConfig.password = pdIndex>0?process.argv.slice(2)[pdIndex+1]:sshConfig.password;
//打开ssh通道
var gulpSSH = new GulpSSH({
    ignoreErrors: false,
    sshConfig: sshConfig
});

console.log(sshConfig);

gulp.task('default', ['deployFile'], function() {
    // 将你的默认的任务代码放在这


});

/**
 * 上传文件
 */
gulp.task('deployFile', ['execSSH'],() => {
    console.log('5s后开始上传文件...');
    setTimeout(function(){
        return gulp
            .src(['./dist/**', '!**/node_modules/**'])
            .pipe(gulpSSH.dest(config.remoteDir));
    },5000);

});
/**
 * 输入用户名密码
 */
gulp.task('passwd',() => {
        return gulp
            .src('')
            .pipe(prompt.prompt([{
                type: 'input',
                name: 'username',
                message: '服务器用户名：'
            },
                {
                    type: 'password',
                    name: 'password',
                    message: '服务器密码：'
                }], function(res){
                //value is in res.first and res.second
                if(res.username||res.password){
                    gulpSSH.options.sshConfig.username=res.username;
                    gulpSSH.options.sshConfig.password=res.password;
                }
            }));

});

/**
 * 执行命令
 */
gulp.task('execSSH', [], () => {
    console.log('备份服务器上现有文件...');
    return gulpSSH.shell(config.commands, {filePath: 'commands.log'})
        .pipe(gulp.dest('logs'));
});
