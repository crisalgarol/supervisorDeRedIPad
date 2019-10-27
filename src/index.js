const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server.listen(4000));
const uuidv4 = require("uuid/v4");

const nodoClientServer = require('./servicio/nodoClient');
const config = require('../config/config');

function main(){
    //Abrimos socker para escuchar nodos y usuarios
    /**Se recibe un evento message en el cual se recibira un json, el json contendra 
     * un parametro from el cual indicara de donde es proveniente el json; from igual a nodo
     * sera cuando un nodo esta enviando sus datos por primera o vez o este mismo este actualizando
     * sus datos. Cuando la condicion anterior no se cumpla sera por que un cliente, es decir el servidor
     * de cofiguracion esta solicitando el arreglo de nodos.
     */
     //let clienteN = null;
    io.on('connection', client => {
        //La variable json es la respuesta que se emite al cliente/servidor de graficacion.
        clienteN = client;
        var json;
        //Esta variable sera mediante la cual se identifique cada conexion de usuarios.
        var userID = uuidv4();

        client.on('message', data => { 
            try {
                const dataFromClient = JSON.parse(data);
                console.log(dataFromClient)
                //let ciclejson = nodoClientServer.verNodos();
                //updateGraphServerInfo(client,JSON.stringify(ciclejson));

                if (dataFromClient.from == config.typesDef.nodo) {
                    console.log("NODO")
                    nodoClientServer.registerNodo(dataFromClient.host, userID);

                }else if(dataFromClient.from == config.typesDef.client){
                    console.log("CLIENT")

                    console.log((new Date()) + ' (Controller) Se recibio petición de un cliente.');// + client + '.');
                    json = nodoClientServer.verNodos();
                    sendMessageToClient(client, JSON.stringify(json),false);

                    
                }else if(dataFromClient.from == config.typesDef.reclient){
                    console.log("RECLIENT")

                    console.log((new Date()) + ' (Controller) Se recibio petición de una tarea anterior de un cliente.');// + client + '.');
                    json = nodoClientServer.verNodos();
                    sendMessageToClient(client, JSON.stringify(json),true);
                    console.log("RESENT DATA");

                }else if(dataFromClient.from == config.typesDef.ready) {
                    console.log("READY")

                    console.log("MUNDO VIRTUAL LISTO");
                    console.log(dataFromClient.enlace);
                    
                }else{
                    console.log("Nigun tipo de definicion de evento")
                }

            } catch (error) {
                console.log((new Date())+ ' (Controller) Error en formato del JSON.');
                console.log(error)
            }

            
        });


        client.on('cancel', (data) => {
            console.log("IDE says "+data);
            io.sockets.emit('cancel-Process',data);
        });


        /**Este evento se ejecuta cuando un nodo se desconecte, por lo que se indica que al servicio que retire
         * al host del arreglo de nodos.
         * Cuando el servidor de graficacion lanzara el try-catch, no se ha considerado el caso.
        */
        client.on('disconnect', () => {
            try {
                var resultado = nodoClientServer.deleteNodo(userID);
                console.log((new Date())+' (Controller) Se un desconecto nodo : '+resultado.hostname+'. ID: '+userID);

            } catch (error) {
                console.log((new Date())+ ' (Controller) Error al desconectar usuario.');

            }
        });
        
    });
    
}



//Envia de Respuestas
/**Metodo mediante el cual se envia una respuesta al cliente,
 * como recibe el mensaje lo envia, no parsea.
 */
const sendMessageToClient = (client, json,resend) =>{
    console.log(resend)
    if(resend){
        //console.log("RESEND IN FUNCTION")
        client.emit('reclient', json);
    }else{
        client.emit('client', json);
    }
    
}

/*
function updateGraphServerInfo(client,ciclejson){
    //Each 5 seonds
    setInterval(()=>{
        
        client.emit('client', ciclejson);
        console.log("Enviando status de los nodos al servidor de graficacion")
    },5000);
}
*/



main();