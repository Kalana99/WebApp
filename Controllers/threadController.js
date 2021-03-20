const jwt = require('jsonwebtoken');
const database = require('../database');
const User = require('../models/User');
const mongoose = require('mongoose');
const db = mongoose.connection;
const archiver = require('archiver');
const path = require('path');

let threadsPerPage = 8;

const maxAge = 1 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', {
        expiresIn: maxAge
    });
};

module.exports.submitRequests_post = (req, res) => {

    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', async (err, decodedToken) => {
        
        let id = decodedToken.id;

        let bodyData = req.body;
        data = {};

        data['studentID'] = id;
        data['StaffID'] = bodyData.staffId;
        data['type'] = bodyData.type;
        data['status'] = 'active';
        data['message'] = bodyData.message;
        if(bodyData.requiredModule)
            data['additionalData'] = {'requiredModule': bodyData.requiredModule};
        data['module'] = bodyData.module;

        //set unread 
        data['staffUnread'] = true;
        data['studentUnread'] = false;
        

        let message = data.message;
        delete data.message;

        let messageObject = {'from': id, 'text': message};
        if(bodyData.fileName)
            messageObject['files'] = bodyData.fileName;
        else
            messageObject['files'] = [];

        let messageId = database.addMessage(messageObject);

        //create the main message for add/drop requests
        let user = await db.collections.users.findOne({_id: mongoose.Types.ObjectId(id)});
        let message2;
        if(bodyData.type == 'repeat' || bodyData.type == 'submission'){
            message2 = (user.name + ' has a request regarding the module ' + bodyData.module);
        }
        else{
            message2 = (user.name + ' requested the module ' + bodyData.module + ' to be changed to ' + bodyData.requiredModule);
        }
        let messageId2 = database.addMessage({'from': id, 'text': message2});

        data['messageID_list'] = [messageId2, messageId];

        database.addThread(data);
        res.redirect('/userProfile');
    });

};

module.exports.download_get = async (req, res) => {


    let fileName = req.params.fileName;

    res.download('uploads/' + fileName);

}

module.exports.downloadDocuments = async (req, res) => {

    let messageId = req.params.id;
    let message = await db.collections.messages.findOne({_id: mongoose.Types.ObjectId(messageId)});
    let fileNames = message.files;

    const archive = archiver('zip');
    archive.on('error', function(err) {
        res.status(500).send({error: err.message});
    });

    //on stream closed we can end the request
    archive.on('end', function() {
        console.log('Archive wrote %d bytes', archive.pointer());
    });

    res.attachment('documents.zip');
    let files = [];

    for(let i = 0; i < fileNames.length; i++){
        
        files.push('uploads/' + fileNames[i]);

    }

    archive.pipe(res);

    for(const i in files) {
        archive.file(files[i], { name: path.basename(files[i]) });
    }


    archive.finalize();

};

module.exports.getThreadData_post = (req, res) => {

    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        db.collections.users.findOne({_id: mongoose.Types.ObjectId(id)}).then(async user => {

            //select the threads according to filter by editing the searchquery object
            filter = req.body.filter;
            pageNumber = req.body.pageNumber;

            let searchQuery = {
                $or:[{"studentID": id}, {'StaffID': id}]
            }

            if(filter.status == 'unread'){

            }
            else if(filter.status != 'allStatus')
                searchQuery['status'] = filter.status;

            if(filter.type != 'allReqType')
                searchQuery['type'] = filter.type;

            let filterThreads = async (thread, filter) => {
                let string = filter.string.toLowerCase();
                let searchWords = string.split(' ');

                let student = await db.collections.users.findOne({_id: mongoose.Types.ObjectId(thread.studentID)});
                let staff = await db.collections.users.findOne({_id: mongoose.Types.ObjectId(thread.StaffID)});
                let deleted = await db.collections.users.findOne({_id: mongoose.Types.ObjectId(thread.deletedID)});
                let flag = false;

                if(filter.status == 'unread'){
                    if(user.type == 'student' && !thread.studentUnread){
                        return false;
                    }
                    if(user.type == 'staff' && !thread.staffUnread){
                        return false;
                    }
                    filter.status = 'allStatus';
                }

                if(filter.type != 'allReqType' && thread.type != filter.type){
                    return false;
                }

                if(filter.status != 'allStatus' && thread.status != filter.status){
                    return false;
                }
                //if we come here, that means the thread is inside the filters
                // now the string filters
                for(let j = 0; j < searchWords.length; j++){

                    if(student){
                        if(student.name.toLowerCase().includes(searchWords[j])
                            || student.index.toLowerCase().includes(searchWords[j])
                            || student.email.toLowerCase().includes(searchWords[j])
                            || student.faculty.toLowerCase().includes(searchWords[j])
                            //|| student.department.includes(searchWords[j])
                            ){
                                flag = true;
                                break;
                            }
                    }
                    if(staff){
                        if(staff.name.toLowerCase().includes(searchWords[j])
                            || staff.index.toLowerCase().includes(searchWords[j])
                            || staff.email.toLowerCase().includes(searchWords[j])
                            || staff.faculty.toLowerCase().includes(searchWords[j])
                            //|| staff.department.includes(searchWords[j])
                            ){
                                flag = true;
                                break;
                            }
                    }
                    if(deleted){
                        if(deleted.name.toLowerCase().includes(searchWords[j])
                            || deleted.index.toLowerCase().includes(searchWords[j])
                            || deleted.email.toLowerCase().includes(searchWords[j])
                            || deleted.faculty.toLowerCase().includes(searchWords[j])
                            //|| staff.department.includes(searchWords[j])
                            ){
                                flag = true;
                                break;
                            }
                    }

                    //check the messages
                    let messageIdList = thread.messageID_list;
                    
                    for(let i = 0; i < messageIdList.length; i++){
                        let message = await db.collections.messages.findOne({_id: mongoose.Types.ObjectId(messageIdList[i])});
                        
                        for(let j = 0; j < searchWords.length; j++){
                            if(message.text.toLowerCase().includes(searchWords[j])){
                                flag = true;
                                break;
                            }
                        }
                    }

                }
                return flag;

            };
            
            //calculate the skip value and the limit value to determine which 
            //documents gets returned
            let skipValue = (req.body.pageNumber - 1) * threadsPerPage;

            let cursor = db.collections.threads.find({$or: [{StaffID: id}, {studentID: id}]});

            let searchedArray = [];
                
            //do the string based searches
            while(await cursor.hasNext()){

                let thread = await cursor.next();

                let contains = await filterThreads(thread, filter);

                if(contains){
                    searchedArray.push(thread);
                }
            }

            let numberOfPages = Math.ceil(searchedArray.length / threadsPerPage);
            searchedArray.reverse();
            searchedArray = searchedArray.slice(skipValue, skipValue + threadsPerPage);

            let  addNameToArray = async () => {

                for(let i = 0; i < searchedArray.length; i++){
                    if(user.type === 'student'){
                        let staffUser = await User.findOne({_id: mongoose.Types.ObjectId(searchedArray[i].StaffID)});
                        if (!staffUser){
                            staffUser = await User.findOne({_id: mongoose.Types.ObjectId(searchedArray[i].deletedID)});
                        }
                        searchedArray[i].name = staffUser.name;
                    }
                    else if(user.type === 'staff'){
                        let studentUser = await User.findOne({_id: mongoose.Types.ObjectId(searchedArray[i].studentID)});
                        if (!studentUser){
                            studentUser = await User.findOne({_id: mongoose.Types.ObjectId(searchedArray[i].deletedID)});
                        }
                        searchedArray[i].name = studentUser.name;
                    }
                }

                res.json({array: searchedArray, numberOfPages});
            };

            addNameToArray();

        });
    });
};

module.exports.getMessages_post = (req, res) => {

    let threadId = req.body.threadId;
    
    let getData = async () => {

        let thread = await db.collections.threads.findOne({_id: mongoose.Types.ObjectId(threadId)});
        const token = req.cookies.jwt;

        let decodedToken = await jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4');
        let userId = decodedToken.id;
        let user = await db.collections.users.findOne({_id: mongoose.Types.ObjectId(userId)});
        let setObject = {};
        if(user.type == 'student'){
            setObject['studentUnread'] = false;
        }
        else{
            setObject['staffUnread'] = false;
        }
        db.collections.threads.updateOne({_id: mongoose.Types.ObjectId(threadId)}, {$set: setObject});

        let messageIdList = thread.messageID_list;
        
            messages = []

            messageIdList.forEach((element) => {
                
                
            });

            for(let i = 0; i < messageIdList.length; i++){
                let message = await db.collections.messages.findOne({_id: mongoose.Types.ObjectId(messageIdList[i])});
                messages.push(message);
            }

            res.json({messages, status:thread.status});
    
    };
    getData();

    

};

module.exports.reply_post = (req, res) => {

    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        db.collections.users.findOne({_id: mongoose.Types.ObjectId(id)}).then(user => {
            
            let message = {
                "from": id,
                "text": req.body.message,
            };

            if(req.body.fileName)
                message['files'] = req.body.fileName;

            let messageId = database.addMessage(message);

            //set unread according to account type
            let setObject = {};

            if(user.type == 'student'){
                setObject['staffUnread'] = true;
            }
            else if(user.type == 'staff'){
                console.log('here');
                setObject['studentUnread'] = true;
            }
            db.collections.threads.updateOne({_id: mongoose.Types.ObjectId(req.body.threadId)}, {$set: setObject});

            db.collections.threads.updateOne({_id: mongoose.Types.ObjectId(req.body.threadId)}, {$push: {messageID_list: messageId.toString()}});
            res.redirect('/threads');
        });
    });
    
};

module.exports.acceptOrDeclineRequest_post = (req, res) => {
    data = req.body;

    db.collections.threads.updateOne({_id: mongoose.Types.ObjectId(data.threadId)}, {$set:{status: data.status}});

    res.json({'status': 'success'});
};

module.exports.getUserType_get = (req, res) => {
    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        db.collections.users.findOne({_id: mongoose.Types.ObjectId(id)}).then(user => {
            
            res.json({type: user.type});

        });
    });
};

module.exports.getStaff_post = (req, res) => {
    let searchTerm = req.body.input;

    db.collections.users.find({type: 'staff'}).toArray().then(lecturers => {

        let suggestions = lecturers.filter((lecturer) => {
            return lecturer.name.toLowerCase().includes(searchTerm);
        });

        let result = [];

        suggestions.forEach(lecturer => {
            result.push({name: lecturer.name, id: lecturer._id, index: lecturer.index});
        });

        res.json({lecturers:result, time: req.body.time});
    });

    
};

module.exports.getUnread_get = (req, res) => {
    const token = req.cookies.jwt;

    jwt.verify(token, 'esghsierhgoisio43jh5294utjgft*/*/4t*4et490wujt4*/w4t*/t4', (err, decodedToken) => {
        let id = decodedToken.id;

        db.collections.users.findOne({_id: mongoose.Types.ObjectId(id)}).then(async user => {
            
            let cursor = db.collections.threads.find({$or:[{StaffID: id}, {studentID: id}]});
            let exists = false;
            while(await cursor.hasNext()){
                let thread = await cursor.next();
                
                if(user.type == 'staff' && thread.staffUnread == true || user.type == 'student' && thread.studentUnread == true){
                    exists = true
                    break;
                }
            }

            res.json({unreadExists: exists});

        });
    });
}