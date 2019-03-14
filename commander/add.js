const chalk = require('chalk');
const {prompt} = require('inquirer');
const ora = require('ora');

const tplList = require(`${__dirname}/../tpl`);
const { readFile, writeFile } = require('../common');

module.exports = function(templateName) {
    let promptList = [
        {
            type: 'input',
            name: 'gitUrl',
            message: 'git http-link [host:prot:xxx] \r\n (eg: http://gitlab.com:aaa/xxx)',
            filters(val) {
                return val.trim().replace(/[\u0000-\u0019]/g, '')
            },
            validate(val) {
                const validate = (val.trim().split(' ')).length === 1;
                return validate || ' http-link is not allowed to have space';
            }
        },
        {
            type: 'input',
            name: 'gitBranch',
            message: 'git branch(eg: #master)',
            default: '#master',
            filters(val) {
                return val.trim()
            },
            validate(val) {
                const validate = (val.trim().split(' ')).length === 1;
                return validate || 'git branch is not allowed to have space';
            }
        }
    ];
    console.log('template name: ', templateName);
    if(!templateName) {
        promptList = promptList.unshift({
            type: 'input',
            name: 'templateName',
            message: 'Template Name',
            filters(val) {
                return val.trim()
            },
            validate(val) {
                const validate = (val.trim().split(' ')).length === 1;
                return validate || 'Template Name is not allowed to have space';
            }
        })
    }

    prompt(promptList).then(function({gitUrl, gitBranch,tplName}) {
        if(tplName && tplList[tplName]) {
            console.log(chalk.red('模板名称已存在,请重新输入!'));
            process.exit(1);
            return;
        }
        const tplName = templateName || tplName
        const spiner = ora('writing...');
        const tplUrl = `./tpl.json`;
        readFile(tplUrl).then(function(data) {
            const tplJson = JSON.parse(data);
            tplJson[tplName] = {};
            tplJson[tplName].url = gitUrl;
            tplJson[tplName].branch = gitBranch;
            
            const updatedJson = JSON.stringify(tplJson, null, 2);
            return updatedJson;
        }, function(err) {
            console.log(chalk.red(err))
        }).then(function(res) {
            writeFile(tplUrl, res).then(function() {
                spiner.succeed();
                console.log('')
                console.log(chalk.green('Template write successful!'))
                console.log('')
            }, function(err) {
                spiner.fail();
                console.log(chalk.red(err))
            })
        })

    },function(err) {
        console.log(chalk.red(err))
        process.exit(1);
    })
}