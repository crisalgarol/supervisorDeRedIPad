//En este arreglo se almacenan todo los host
nodos = [];

/**
 * Este metodo regresa el array de nodos registrado en el sistema.
 */
exports.verNodos = function(){

    nodos.sort(function(a, b){
        return a.Ram_Libre - b.Ram_Libre;
    });

    return nodos;
};

/**
 * Este metodo se ejecuta para registrar un nuevo nodo al array 
 * se revisa el status del host para identificar si de actualiza 
 * o se agrega un nuevo host al arreglo de nodos.
 */
exports.registerNodo = function(host, userID){

    if(host.status == 'registrar'){
        console.log((new Date())+' Se conecto nuevo nodo: '+host.hostname+'. ID: '+userID);
        host.id = userID;
        nodos.push(host)
    }
    else{
        console.log((new Date())+' Se actualizo información de nodo: '+host.hostname+'.');
        const resultado = nodos.find( nodo => nodo.ip === host.ip );
        nodos.splice(nodos.indexOf(resultado), nodos.indexOf(resultado)+1);
        host.id = userID;

        nodos.push(host);
    }
}

/**Este metodo se ejecuta para eliminar el host que se desconecte 
 * y dejar el array listo.
 */
exports.deleteNodo = function(userID){
    const resultado = nodos.find( nodo => nodo.id === userID );
    nodos.splice(nodos.indexOf(resultado), nodos.indexOf(resultado)+1);
    console.log((new Date())+' Se actualizo información de nodo: '+resultado.hostname+'.');

    return resultado;
}
