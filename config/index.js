var dbconfig = require('./dbconfig');

module.exports = {
    getDbConnStr: function () {
        var string = `mongodb://${dbconfig.user}:${dbconfig.pwd}@ds151348.mlab.com:51348/multerdemo`;
        return string;
    }
}