var tar     = require('gulp-tar');
var gzip    = require('gulp-gzip');
var gulpSSH = require('gulp-ssh');
var fs      = require('fs');
var exec    = require('child_process').exec;
var moment  = require('moment');

/**
 * GulpDeploy
 *
 * Automatização de deploy com o gulp
 *
 * @access public
 * @author Henrique de Castro
 * @since  01/2017   
 */
var GulpDeploy = (function () {

    //Configurações
    var params = {
        'host'            : '',
        'port'            : 22,
        'username'        : 'ubuntu',
        'projectPath'     : '',
        'projectRealPath' : '',
        'projectName'     : '',
        'key'             : '',
        'env'             : 'stage'
    };

    //Instância do gulp
    var gulp = false;

    //Instância do SSH
    var ssh = false;

    /**
     * GulpDeploy
     *
     * Construtor da classe
     *
     * @access public
     * @author Henrique de Castro
     * @since  01/2017
     */
    function GulpDeploy(objGulp, config){
        gulp   = objGulp;
        params = config;

        //Monta os parâmetros do ssh
        var config = {
            host       : params['host'],
            port       : params['port'],
            username   : params['username'],
            privateKey : fs.readFileSync(params['key'])
        }

        //Monta o path do projeto
        params['projectRealPath'] = '/app/'+params['projectName']+'/releases/';

        //Inicia
        ssh = new gulpSSH({
            ignoreErrors: false,
            sshConfig: config
        });
    }

    /**
     * setup
     *
     * Executa um setup no servidor passado
     *
     * @access public
     * @author Henrique de Castro
     * @since  01/2017
     * @return Object
     */
    GulpDeploy.prototype.setup = function() {
    
        //Executa a criação das pastas
        return ssh
            .shell(['mkdir -p '], {filePath: 'deploy.log'})
            .pipe(gulp.dest('logs'));
    }

    /**
     * targz
     *
     * Executa um tar e um gzip na pasta do projeto
     *
     * @access public
     * @author Henrique de Castro
     * @since  01/2017
     * @return string
     */
    GulpDeploy.prototype.targz = function() {
    
        //Busca os arquivos e aplica a compactação
        gulp.src(['dist/**/*', 'package.json'])
        .pipe(tar('dist.tar'))
        .pipe(gzip())
        .pipe(gulp.dest('/var/tmp/'));

        //Retorna o arquivo na pasta temporária
        return '/var/tmp/dist.tar.gz';
    }

    /**
     * deploy
     *
     * Executa o deploy
     *
     * @access public
     * @author Henrique de Castro
     * @since  01/2017
     * @return object
     */
    GulpDeploy.prototype.deploy = function() {

        //Inicia as variáveis
        var folderDest = params['projectRealPath']+moment().format('YYYYMDDHHmm');
        var fileDest   = folderDest+'/'+params['projectName']+'.tar.gz';

        //Compacta o projeto
        var projectFolder = this.targz(gulp);

        //Cria a pasta
        return ssh.exec(['mkdir -p '+folderDest], {filePath: 'deploy.log'}).pipe(gulp.dest('logs')).on('end', function(err){

            //Deu ruim?
            if(err){
                console.error(err);
                return false;
            }

            //Envia o arquivo
            console.log('Enviando o projeto...');
            var strCommand = 'rsync -avz '+projectFolder+' --progress -e "ssh -i '+params['key']+'" '+params['username']+'@'+params['host']+':'+fileDest;
            exec(strCommand, function (err, stdout, stderr) {
                if(err){
                    console.error(err);
                    return false;
                }

                //Descompacta, limpa tudo, cria o link, roda o install e starta o node
                var untar    = 'tar -xvzf '+fileDest+' -C '+folderDest;
                var clean    = 'rm '+fileDest;
                var cleanLn  = 'rm '+params['projectPath']+params['projectName'];
                var link     = 'ln -s '+folderDest+' '+params['projectPath']+params['projectName'];
                var cd       = 'cd '+folderDest;
                var pm2Clean = 'pm2 delete '+params['projectName'];
                var npm      = 'npm install';
                var pm2Start = 'NODE_ENV='+params['env']+' pm2 start '+folderDest+'/app.js --name="'+params['projectName']+'"';
        
                //Executa os comandos
                ssh.shell([untar, clean, cleanLn, link, cd, pm2Clean, npm, pm2Start], {filePath: 'deploy.log'})
                .pipe(gulp.dest('logs')).on('end', function(err){
                    if(err){
                        console.error(err);
                        return false;
                    }

                    //Verifica quantos ficaram
                    ssh.exec(['ls -tr '+params['projectRealPath']], {filePath: 'deploy_list.log'}).pipe(gulp.dest('logs')).on('data', function(file){
                        
                        //Busca os itens
                        var itens = file.contents.toString().split('\n');

                        //Mais que 5?
                        if(itens.length > 5){
                        
                            //Pega o primeiro item
                            var older = itens[0];

                            //E apaga
                            ssh.exec(['rm -rf '+params['projectRealPath']+older], {filePath: 'deploy_rm_older.log'}).pipe(gulp.dest('logs'));
                        }
                    });

                });
                
            });
        });
    }

    /**
     * rollback
     *
     * Deu ruim? Volta rápido tudo
     *
     * @access public
     * @author Henrique de Castro
     * @since  01/2017
     * @return object
     */
    GulpDeploy.prototype.rollback = function() {

        //Lista os itens
        ssh.exec(['ls -t '+params['projectRealPath']], {filePath: 'deploy.log'}).pipe(gulp.dest('logs')).on('data', function(file){
            
            //Busca os itens
            var itens = file.contents.toString().split('\n');

            //Existe item para fazer rollback?
            if(typeof(itens[1]) == "undefined"){
                console.error('Não existe backup para rollback');
                return false;
            }
            
            //Ações
            var cleanLn  = 'rm '+params['projectPath']+params['projectName'];
            var link     = 'ln -s '+params['projectRealPath']+itens[1]+' '+params['projectPath']+params['projectName'];
            var cleanErr = 'rm -rf '+params['projectRealPath']+itens[0];
            var cd       = 'cd '+params['projectPath']+params['projectName'];
            var pm2Clean = 'pm2 delete '+params['projectName'];
            var npm      = 'npm install';
            var pm2Start = 'NODE_ENV='+params['env']+' pm2 start '+params['projectPath']+params['projectName']+'/app.js --name="'+params['projectName']+'"';

            //Executa
            ssh.shell([cleanLn, link, cleanErr, cd, pm2Clean, npm, pm2Start], {filePath: 'deploy.log'}).pipe(gulp.dest('logs'));
        });
    }

    return GulpDeploy;
})();

module.exports = GulpDeploy;