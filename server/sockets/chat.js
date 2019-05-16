const { io } = require('../server');
const ChatConversation = require('../models/chatConversation');
const ChatMessage = require('../models/chatMessage');
const siofu = require("socketio-file-upload");
const path = require('path');

io.on('connection', function(socket) {
    const uploader = new siofu();
    uploader.dir = path.join(__dirname, '/uploads');
    uploader.listen(socket);

    socket.on('messagesA', (data) => {
        var deliveries = ['Grupo.rar', 'adios.rar'];
        socket.emit('messagesA', deliveries);
    });

    socket.on('user', (data) => {
        let id = data.id;
        let owner = data.email;
        ChatConversation.findById(id, function (err, conversationDB) {
            if (err) {
                console.log("La conversacion no existe")
                return false;
            }
            ChatConversation.findOne({members: owner, _id: id}, function (err, userInConversationDB) {

                if (err) {
                    console.log("No te encuentras en esta conversacion")
                    return false;
                }
    
                if (!userInConversationDB) {
                    console.log("No te encuentras en esta conversacion")                    
                    return false;
                }
                let idConversation = conversationDB.id;
                let members = conversationDB.members;
                let deliveries = conversationDB.deliveries;
                uploader.on('saved', function(event){
                    let name = event.file.name;
                    let extension = name.split('.')[1];
                    conversationDB.deliveries.push(event.file.base + '.' + extension);
                    conversationDB.save();
                    console.log('Se ha guardado en la conversacion ' + conversationDB.id);
                    socket.emit('reload', 'reload');
                });

                // Si estás en esta conversación cargamos el chat
                cargarChat(idConversation, members, deliveries);
            });
        });   

        function cargarChat(idConversation, members, deliveries){
            function getIdConversation(){
                return idConversation;
            }
            ChatMessage.find({idConversation: getIdConversation()}, function (err, messagesDB) {
                if (err) {
                    console.log("Error al obtener mensajes")
                    return false;
                }

                if (!messagesDB) {
                    console.log("Error al obtener mensajes 2")               
                    return false;
                }

                socket.emit('messages', {messagesDB, members, deliveries});
            });

            socket.on('chat message', function(data) {
                let email = data.email;
                let content = data.content;
                let idConversation = getIdConversation();
                
                ChatConversation.findById(idConversation, function (err, conversationDB) {
                    if (err) {
                        console.log("La conversacion no existe")
                        return false;
                    }

                    ChatConversation.findOne({members: email, _id: id}, function (err, userInConversationDB) {
        
                        if (err) {
                            console.log("No te encuentras en esta conversacion")
                            return false;
                        }
                        
                        if (!userInConversationDB) {
                            console.log("No te encuentras en esta conversacion")                    
                            return false;
                        }
                        
                        let message = new ChatMessage({
                            email: email,
                            idConversation: idConversation,
                            content: content,                
                        });
                        
                        message.save();
                        io.emit('chat message', message);
                    });
                });   

                
            });
        }  
        socket.on('disconnect', function() {
            console.log('Un usuario ha sido desconectado')
        });
    });
});