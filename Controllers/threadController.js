module.exports.getThreadData_get = (req, res) => {

    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        db.collection('users').findOne({_id: mongoose.Types.ObjectId(id)}).then(user => {
            
            db.collection('threads').find({"studentID": id}).toArray().then(array => {
                
                console.log(array);
            });

        });
    });
};