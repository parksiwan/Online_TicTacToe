var gUserName = '';
var gMarker = '';
var gBoard = new Array(9);
var gWS;
var gClicked = false;

window.onload = function() {
    var message;

    gUserName = prompt("Please enter your name.");

    if (gUserName != null) 
        document.getElementById("demo").innerHTML = "Player :  " + gUserName;
    
    message = generateMessage("name", gUserName);
    WebSocketTest(message);
};

function generateMessage(type, contents) {
    var message;

    // n : name, m : mark, 
    switch (type) {
        case "name":
            message = "n:" + contents;
            break;
        case "position":
            message = "p:" + contents;
            break;
    }
    return message;
}

function WebSocketTest(message) {
    if ("WebSocket" in window) {
        gBoard = ['', '', '', '', '', '', '', '', ''];
        // alert("WebSocket is supported by your Browser!");
               
        // Let us open a web socket
        //gWS = new WebSocket("ws://192.168.1.14:8888/");
        gWS = new WebSocket("ws://192.168.1.14:8888/");
                
        gWS.onopen = function() {
            // Web Socket is connected, send data using send()
            gWS.send(message);
            // alert(message);
        };
                
        gWS.onmessage = function (evt) { 
            var received_msg = evt.data;
            var header, position;
            //alert("Message is received...");

            header = received_msg.substr(0,2);
            if (header == "m:") {
                if (received_msg.substr(2) == 'X')
                    gMarker = "  X  ";
                else
                    gMarker = "  O  ";
            } else if (header == "p:") {
                position = received_msg.substr(2);
                yourPosition(position);
                gClicked = false;
            } else if (header == "w:") {
                  alert(received_msg.substr(2));
            }
        };
                
        gWS.onclose = function() { 
            // websocket is closed.
            alert("Connection is closed..."); 
        };
    } else {
        // The browser doesn't support WebSocket
        alert("WebSocket NOT supported by your Browser!");
    }
}

function yourPosition(position) {
    var pos = parseInt(position);
    if (gMarker == "  X  ") {
        gBoard[pos - 1] = 'O';
        switch (pos) {
            case 1:
                document.getElementById("b1").value = "  O  ";
                break;
            case 2:
                document.getElementById("b2").value = "  O  ";
                break;
            case 3:
                document.getElementById("b3").value = "  O  ";
                break;
            case 4:
                document.getElementById("b4").value = "  O  ";
                break;
            case 5:
                document.getElementById("b5").value = "  O  ";
                break;
            case 6:
                document.getElementById("b6").value = "  O  ";
                break;
            case 7:
                document.getElementById("b7").value = "  O  ";
                break;
            case 8:
                document.getElementById("b8").value = "  O  ";
                break;
            case 9:
                document.getElementById("b9").value = "  O  ";
                break;
        }
    } else if (gMarker == "  O  ") {
        gBoard[pos - 1] = 'X'; 
        switch (pos) {
            case 1:
                document.getElementById("b1").value = "  X  ";
                break;
            case 2:
                document.getElementById("b2").value = "  X  ";
                break;
            case 3:
                document.getElementById("b3").value = "  X  ";
                break;
            case 4:
                document.getElementById("b4").value = "  X  ";
                break;
            case 5:
                document.getElementById("b5").value = "  X  ";
                break;
            case 6:
                document.getElementById("b6").value = "  X  ";
                break;
            case 7:
                document.getElementById("b7").value = "  X  ";
                break;
            case 8:
                document.getElementById("b8").value = "  X  ";
                break;
            case 9:
                document.getElementById("b9").value = "  X  ";
                break;
        }
    }
}

function isRightPosition(position) {
    // need to add multiple play
    if (gBoard[position] == '') return true;
}

function myPosition(form, position) {
    var message;

    if ((gClicked == false) && (isRightPosition(position - 1))) {
        gBoard[position - 1] = gMarker;
        switch (position) {
            case 1:
                form.b1.value = gMarker;
                break;   
            case 2:
                form.b2.value = gMarker;
                break; 
            case 3:
                form.b3.value = gMarker;
                break; 
            case 4:
                form.b4.value = gMarker;
                break;
            case 5:
                form.b5.value = gMarker;
                break; 
            case 6:
                form.b6.value = gMarker;
                break;            
            case 7:
                form.b7.value = gMarker;
                break; 
            case 8:
                form.b8.value = gMarker;
                break; 
            case 9:
                form.b9.value = gMarker;
                break; 
        } 
        strPos = String(position);
        message = generateMessage("position", strPos);
        gWS.send(message);
        gClicked = true;
    } else
        alert("Wrong position!");
}
