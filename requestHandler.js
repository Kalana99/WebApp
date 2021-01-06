module.exports = function(app) {

    app.get('/home', function(req,res){
        res.sendFile(__dirname + '/public/test.html');
    });

};