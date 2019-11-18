const  mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

//Connect to mongodb
mongo.connect('mongodb://127.0.0.1/mongochat',(err, db) =>{
    if(err){
        throw err;
    }

    console.log('MongoDB connected succefully');

    //Connect to socket io
    client.on('connection', ()=>{
        let chat = db.collection('chats');

         //create function to send status
         sendStatus = function(message){

             socket.emit('status',message);

    }

    //Get chats from mongo collection
    chat.find().limit(100).sort({_id:1})._.toArray((err,res) =>{
        if(err){
            throw err;
        }

        //Emit the messages
        socket.emit('output',res);
    });


     //Handle inputs events
     socket.on('input',(data)=>{
        let name = data.name;
        let message = data.message;

        //Check for name and message

        if(name == '' || message == '' ){
            //send error status
            sendStatus('Please enter a name and message');
        }else{
            //insert message in db
            chat.insert({name: name,message: message }, ()=>{
                client.emit('output',[data]);

                //send status object
                sendStatus({
                    message: 'message sent',
                    clear: true
                })
            });
        }
    });


    //Handle clear
    socket.on('clear',(data)=>{
        //Remove all chats from collection
        chat._.remove({},()=>{
            //emit cleared
            socket.emit('cleared');
        });
    });

    });
   
});