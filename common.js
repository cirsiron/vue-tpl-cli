const fs = require('fs');

module.exports = {
    readFile: (url) => {
        return new Promise(function(resolve, reject) {
            fs.readFile(url, 'utf8', function(err, data) {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(data);
            })
        })
    },
    writeFile: (url, data) => {
        return new Promise(function(resolve, reject) {
            fs.writeFile(url, data, 'utf8', function(err) {
                if(err) {
                    reject(err);
                    return;
                }
                resolve('写入成功!')
            })
        })
    }
}