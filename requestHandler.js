module.exports = function(app){
    getRequests(app);
    postRequests(app);
}

let getRequests = function(app){

    app.get('/home', function(req,res){
        res.sendFile(__dirname + '/public/login.html');
    });

    app.get('/', function(req,res){
        res.redirect('/home');
    });
}

let postRequests = function(app){



}