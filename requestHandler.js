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

    app.get('/signup', function(req,res){
        res.sendFile(__dirname + '/public/SignUp.html');
    });
}

let postRequests = function(app){



}