/*
    SimpleSerial index.js
    Created 7 May 2013
    Modified 12 Mar 2014
    by Tom Igoe and Robyn Overstreet
*/


var app = {
    itemName:"",
    macAddress: "",  // get your mac address from bluetoothSerial.listPorts()
    chars: "",
  
/*
    Application constructor
 */
    initialize: function() {
        this.bindEvents();
        connectedPage.hidden = true; //hides the HTML elements for the second page

        console.log("Starting BT Serial app");
    },
/*
    bind any events that are required on startup to listeners:

    //For my notes: this is the listerners that connects the html to the java
*/
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
       // connectButton.addEventListener('touchend', app.manageConnection, false);
        homeButton.addEventListener('touchend', app.disconnect, false); //>>> make home function
        button1.addEventListener('touchend', app.send1, false);
        button0.addEventListener('touchend', app.send0, false);
        showStart.addEventListener('touchend', app.showStartPage, false);
        showConnected.addEventListener('touchend', app.showConnectedPage, false);
       // selectDevice.addEventListener('change',app.PickDevice, false);
    },

/*
    this runs when the device is ready for user interaction:
*/
    onDeviceReady: function() {
        // check to see if Bluetooth is turned on.         
         var address;
     
        console.log('device ready!');
 
        //if isEnabled(), below, returns success:
        var listPorts = function() {
                app.clear();
                app.display("Searching for BT Serial devices...");
            // list the available BT ports:
            bluetoothSerial.list(
                function(results) {
                    app.display(JSON.stringify(results));
                    app.display(results);
   
                    // result is an array of JSON objects. 
                    // iterate over it and pull out relevant elements.
                    // on iOS, address is called uuid. On Android it's called address:                  
                    for (i=0; i<results.length; i++) {
                            if (results[i].uuid) {
                                address = results[i].uuid;
                            }
                    if (results[i].address) {
                                address = results[i].address;
                            }
                    // selectDevice.innerHTML += '<option value="' +
                    //     address + '">' +
                    //     results[i].name +
                    //     ' </option>';  

                     //make separate buttons  
                    var btn = document.createElement("BUTTON");        // Create a <button> element
                    var blName = results[i].name;
                    var t = document.createTextNode(blName);       // Create a text node
                    // btn.setAttribute("id", address);
                    btn.appendChild(t); 
                    btn.id = address;
                    btn.name = results[i].name;

                    btn.onclick = function() { 
                        app.itemName = this.name; //need one global, will fix it later :)
                        app.macAddress = this.id;
                        app.clear();
                        app.display("selected is: " + app.macAddress);
                        //alert("macAddress is: " + app.macAddress);
                   
                        //app.manageConnection();
                        app.connect();
                    };

                    var toDiv = document.getElementById("buttons");  
                    toDiv.appendChild(btn);          // Append <button> to <div>

                    }//end if adress

                    if (results.length == 0) {
                        app.display("No BT Serial devices found");
                    }
                    // use the first item from the list as your address:
                    // app.macAddress = selectDevice.options[selectDevice.selectedIndex].value;
                    // app.display(selectDevice.options[selectDevice.selectedIndex].value);                
                },
                function(error) {
                    app.display(JSON.stringify(error));
                }
            );       
        };

        // if isEnabled returns failure, this function is called:
        var notEnabled = function() {
            app.display("Bluetooth is not enabled.");
        };

         // check if Bluetooth is on:
        bluetoothSerial.isEnabled(
            listPorts,
            notEnabled
        );
    },
/*
    Connects if not connected, and disconnects if connected:
*/
    // manageConnection: function() {
    //     // connect() will get called only if isConnected() (below)
    //     // returns failure. In other words, if not connected, then connect:
    //     var connect = function () {
    //         // if not connected, do this:
    //         // clear the screen and display an attempt to connect
    //         console.log("Attempting to connect...");

    //         app.clear();
    //         app.display("Attempting to connect. " +
    //             "Make sure the serial port is open on the target device.");
    //         // attempt to connect:
    //         bluetoothSerial.connect(
    //             app.macAddress,  // device to connect to
    //             app.openPort,    // start listening if you succeed
    //             app.showError    // show the error if you fail
    //         );
    //     };

    //     // disconnect() will get called only if isConnected() (below)
    //     // returns success  In other words, if  connected, then disconnect:
    //     var disconnect = function () {
    //         app.display("attempting to disconnect");
    //         // if connected, do this:
    //         bluetoothSerial.disconnect(
    //             app.closePort,     // stop listening to the port
    //             app.showError      // show the error if you fail
    //         );
    //     };

    //     // here's the real action of the manageConnection function:
    //     bluetoothSerial.isConnected(disconnect, connect);
    // },

     connect: function () {
        // if not connected, do this:
        // clear the screen and display an attempt to connect
        console.log("Attempting to connect...");

        app.clear();
        app.display("Attempting to connect. " +
            "Make sure the serial port is open on the target device.");
        // attempt to connect:
        bluetoothSerial.connect(
            app.macAddress,  // device to connect to
            app.openPort,    // start listening if you succeed
            app.showError    // show the error if you fail
        );
    },

    disconnect: function () {
        app.display("attempting to disconnect");
        // if connected, do this:
        bluetoothSerial.disconnect(
            app.closePort,     // stop listening to the port
            app.showError      // show the error if you fail
        );
    },

    goHome: function(){
        app.display("attempting to disconnect");
        // if connected, do this:
        bluetoothSerial.disconnect(
            app.closePort,     // stop listening to the port
            app.showError      // show the error if you fail
        );
        //go to home page
        app.showStartPage();
    },

/*
    subscribes to a Bluetooth serial listener for newline
    and changes the button:
*/
    openPort: function() {
        // if you get a good Bluetooth serial connection:
        app.display("Connected to: " + app.itemName);
        // change the button's name:
       // connectButton.innerHTML = "Disconnect";
        // set up a listener to listen for newlines
        // and display any new data that's come in since
        // the last newline:
        bluetoothSerial.subscribe('\r\n', function (data) {
               app.clear();
               app.display(data);          
        });

        //when it's connected, switch pages
        app.showConnectedPage();
    },

/*
    unsubscribes from any Bluetooth serial listener and changes the button:
*/
    closePort: function() {
        // if you get a good Bluetooth serial connection:
        app.display("Disconnected");
        // change the button's name:
        //connectButton.innerHTML = "Connect";
        // unsubscribe from listening:
        bluetoothSerial.unsubscribe(
                function (data) {
                    app.display(data);
                },
                app.showError
        );

        //when disconects, bring the start page
        app.showStartPage();
    },
    
  
    //send to serial, talk to magnet

    send1: function(){
        bluetoothSerial.write('1', function() {
            app.clear();
            app.display(" sending 1");           
        });

    },
     send0: function(){
        bluetoothSerial.write('0', function() {
            app.clear();
            app.display(" sending 0");           
        });

    },

    //////////////////////////////
    
    // pickDevice: function(){
    //   app.display('pick device fired');
    //    app.macAddress = selectDevice.options[selectDevice.selectedIndex].value;
    //    app.display(selectDevice.options[selectDevice.selectedIndex].value);
    // },
/*
    appends @error to the message div:
*/
    showError: function(error) {
        app.display(error);
    },

/*
    appends @message to the message div:
*/
    display: function(message) {
        var display = document.getElementById("message"), // the message div
            lineBreak = document.createElement("br"),     // a line break
            label = document.createTextNode(message);     // create the label

        display.appendChild(lineBreak);          // add a line break
        display.appendChild(label);              // add the message node
    },
/*
    clears the message div:
*/
    clear: function() {
        var display = document.getElementById("message");
        display.innerHTML = "";
    },

    showStartPage: function() {
    startPage.hidden = false;
    connectedPage.hidden = true;
    },

    showConnectedPage: function() {
        startPage.hidden = true;
        connectedPage.hidden = false;
    }



};      // end of app

