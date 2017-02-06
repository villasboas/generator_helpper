var gulp       = require('gulp');
var nodemon    = require('gulp-nodemon');
var ts         = require('gulp-typescript');
var tslint     = require('ionic-gulp-tslint');
var gulpDeploy = require('./gulp-deploy');

//Monta a compilação
var tsProject = ts.createProject('./tsconfig.json');
gulp.task('build', function () {
    var tsResult = gulp.src(['typings/**/*.ts', 'src/**/*.ts']).pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('dist'));
});

//Cria o watch que restarta o nodemon a cada novo build
gulp.task('watch', function () {
    
    //Escuta os arquivos
    gulp.watch('src/**/*.ts', ['build']);

    //Inicia o servidor
    nodemon({
        script: 'dist/app.js',
        watch: ['dist/*.js']
    });
}); 

//Build como padrão
gulp.task('default', ['test', 'build']);

//Só deixa passar se o código não estiver porco
gulp.task('test', function () {
    return tslint({
        src: 'src/**/*.ts',
            tslintOptions: {
            configuration: './tslint.json'
        },
        reporter: "prose",
        reportOptions: {
            emitError: true
        }
    });
});

//Seta o deploy
var config = {
    'host'        : '52.67.116.189',
    'port'        : 22,
    'username'    : 'ubuntu',
    'projectPath' : '/var/www/',
    'projectName' : 'mais_minas_api',
    'key'         : '/home/henrique/chaves/mais_minas.pem'
};

//Faz setup do deploy no servidor
gulp.task('deploy:setup', function() {

    //Instancia e executa o setup
    var deploy = new gulpDeploy(gulp, config);    
    return deploy.setup();
    
});

//Faz o deploy para stage
gulp.task('deploy:stag', function() {
    return false;
});

//Faz o deploy para produção
gulp.task('deploy:prod', ['default'], function() {
    
    //Seta o env e instancia
    config['env'] = 'production';
    var deploy = new gulpDeploy(gulp, config);    
    
    //Executa 
    return deploy.deploy();
});

//Faz o rollback
gulp.task('deploy:rollback', function() {
    
    //Seta o env e instancia
    config['env'] = 'production';
    var deploy = new gulpDeploy(gulp, config);    
    
    //Executa 
    return deploy.rollback();
});