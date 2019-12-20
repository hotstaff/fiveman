/*jslint node: true, for */

"use strict";

// randam seed
var SEED = 0x0005;

// module load
var express = require("express");
var compression = require("compression");
var app = express();
var config = require("./config.json")[app.get("env")];
var uuidv1 = require("uuid/v1");
var uuidv4 = require("uuid/v4");
var XXH = require("xxhashjs");
var fs = require("fs");

var jsondiffpatch = require("jsondiffpatch").create({
    objectHash: function (obj) {
        return obj.uuid;
    },
    arrays: {
        detectMove: true,
        includeValueOnMove: false
    },
    cloneDiffValues: false
});

var readJsonSync = function readJsonSync(fname) {
    var json = null;
    try {
        json = JSON.parse(fs.readFileSync(fname, "utf-8"));
    } catch (err) {
        if (err) {
            console.log(err.message);
            if (err.code === "ENOENT") {
                return "ENOENT";
            }
            return null;
        }
    }
    return json;
};

// config
var Familydesk = Familydesk || {};
Familydesk.port = process.env.PORT || config.port || 3002;
Familydesk.standalone = process.env.STANDALONE || config.standalone || false;
Familydesk.bookdir =  config.bookdir || __dirname + "/../book/";
Familydesk.filename = config.filename ||  "note.json";
Familydesk.chatfilename  = config.chatfilename || "chat.json";

// ssl config
Familydesk.ssl = config.ssl || false;
Familydesk.sslkey = config.sslkey || null;
Familydesk.sslcert = config.sslcert || null;
Familydesk.sslca = config.sslca || null;

// convert bool
Familydesk.standalone = String(Familydesk.standalone) === "true";
Familydesk.ssl = String(Familydesk.ssl) === "true";

var server;
if (Familydesk.ssl) {
    if (Familydesk.sslkey === null || Familydesk.sslcert === null) {
        console.log("SSL configuration Error.");
        process.exit(1);
    } else {
        var credentials;
        try {
            Familydesk.sslkey = fs.readFileSync(Familydesk.sslkey).toString();
            Familydesk.sslcert = fs.readFileSync(Familydesk.sslcert).toString();
            credentials = {key: Familydesk.sslkey, cert: Familydesk.sslcert};
            if (Familydesk.sslca !== null) {
                Familydesk.sslca = fs.readFileSync(Familydesk.sslca).toString();
                credentials.ca =  Familydesk.sslca;
            }
            server = require("https").Server(credentials, app);
        } catch (err) {
            throw err;
        }
    }
} else {
    server = require("http").Server(app);
}

app.get("/status", function (req, res) {
    res.writeHead(200, { "Content-Type": "tObjecttml" });
    res.write("*************************\n");
    res.write(" Welcome to fiveman !!\n");
    res.end("*************************\n");
});
if (Familydesk.standalone) {
    app.use(compression({level: 8}));
    app.use("/", express.static(__dirname + "/../public"));
    app.use("/book", express.static(Familydesk.bookdir));
}


server.listen(Familydesk.port, function () {
    var banner = `************************
Starting Familydesk
Mode: ${(Familydesk.standalone ? "Standalone" : "Normal")}${(Familydesk.ssl ? "\nSSL: on" : "")}
************************
Server listening at port *:${parseInt(Familydesk.port)} `;
    console.log(banner);
});

function formatDate(date) {
    function addZero(n) {
        return (n < 10 ? "0" + n : "" + n);
    }
    var YYYY = date.getFullYear();
    var MM = addZero(date.getMonth() + 1);
    var DD = addZero(date.getDate());
    return YYYY + "/" + MM + "/" + DD;
}

function compareTableDate(a, b) {
    var adate = new Date(a.date);
    var bdate = new Date(b.date);
    var asysdate = new Date(a.sysdate);
    var bsysdate = new Date(b.sysdate);

    if (adate > bdate) { return 1; }
    if (adate < bdate) { return -1; }
    if (asysdate > bsysdate) { return 1; }
    if (asysdate < bsysdate) { return -1; }

    return 0;
}

function addQueue(queue) {
    // insert queue to table
    var row = note.table.length;
    while (row--) {
        if (compareTableDate(queue, note.table[row]) > 0) {
            row += 1;
            break;
        }
    }
    note.table.splice(row, 0, queue);
    return row;
}

function getTableHash() {
    return XXH.h32(JSON.stringify(note.table), SEED).toString(16);
}

function writeNote() {
    // json save
    var str = JSON.stringify(note, null, "    ");
    fs.writeFile(Familydesk.bookdir + Familydesk.filename, str, function (err) {
        if (err) {
            throw err;
        }
        console.log("write note at " + new Date()
                    + ", hash -> " + getTableHash());
    });
}

function deltaIn() {
    var str = JSON.stringify(note.table);
    var hash = XXH.h32(str, SEED).toString(16);
    return {hash, oldtable: JSON.parse(str)};
}

function deltaOut(deltain, stacked) {
    var delta = jsondiffpatch.diff(deltain.oldtable, note.table);
    var hashdelta = {hash: deltain.hash, delta};
    if (stacked !== undefined) {
        if (stacked === false) {
            return hashdelta;
        }
    }
    deltastack.push(hashdelta);
    return hashdelta;
}

function inTable(queue) {
    var row;
    var l = note.table.length;
    for (row = 0; row < l; row = row + 1) {
        if (queue.uuid === note.table[row].uuid) {
            return row;
        }
    }
    return -1;
}

// book load sync
var note = readJsonSync(Familydesk.bookdir + Familydesk.filename);
if (note === null) {
    console.log("Note read Error");
    process.exit(1);
} else if (note === "ENOENT") {
    note = {
        "cover": {
            "title": "title",
            "author": "author",
            "repository": {
                "1": "wallet"
            },
            "refferencedate": 1
        },
        "table": []
    };
    console.log("Note not found. Initial blank note.json loaded.\n" +
                "Please edit book/note.json after write first item.");
    writeNote();
}

var chatlog = readJsonSync(Familydesk.bookdir + Familydesk.chatfilename);
if (chatlog === null) {
    console.log("Chatlog read Error");
    process.exit(1);
} else if (chatlog === "ENOENT") {
    chatlog = [];
    console.log("Chatlog not found. Initial chat.json loaded." );
}

var stack = [];
var deltastack = [];
var uuidrow = {};

process.on("SIGTERM", function() {
     console.log("Got SIGTERM. ");
     process.exit(128+15);
});

// table sort
// This process take a while.
note.table.sort(compareTableDate);

var io = require("socket.io").listen(server);

io.sockets.on("connection", function (socket) {
    var UUID = uuidv4().substr(0, 8);
    socket.emit("info",
                {
                    text: "info: connection confirmed (" + UUID + ")",
                    userid: UUID
                });
    io.sockets.emit("msg", { text: "ようこそ " + UUID, userid: "Server" });
    io.sockets.emit("chatlog", chatlog);

    socket.on("msg", function (data) {
        var msg = { text: data.text, userid: data.userid };
        io.sockets.emit("msg", msg);
        // chatlog write
        chatlog.push(msg);
        var str = JSON.stringify(chatlog, null, "    ");
        fs.writeFile(Familydesk.bookdir + Familydesk.chatfilename,
                     str,
                     function (err) {
            console.log(err);
        });
    });

    socket.on("input", function (data) {
        //for delta
        var deltain = deltaIn();
        var queues = data;
        if (Array.isArray(queues)) {
            var i;
            var l = queues.length;
            for (i = 0; i < l; i = i + 1) {
                queues[i].uuid = uuidv1();
                addQueue(queues[i]);
                stack.push(queues[i]);
            }
        } else if (typeof queues === "object"
                   || queues.sysdate !== undefined) {
            //single
            queues.uuid = uuidv1();
            addQueue(queues);
            stack.push(queues);
        } else {
            return false;
        }

        var hashdelta = deltaOut(deltain);
        io.sockets.emit("delta", [hashdelta]);
        writeNote();
    });

    socket.on("edit", function (data) {
        //for delta
        var deltain = deltaIn();
        var row = inTable(data);
        if (row > 0) {
            note.table.splice(row, 1);
            addQueue(data);
            var hashdelta = deltaOut(deltain);
            io.sockets.emit("delta", [hashdelta]);
            writeNote();
        }
    });

    socket.on("undo", function () {
        //delta unpatch
        var lasthashdelta = deltastack.pop();
        if (lasthashdelta !== undefined) {
            var deltain = deltaIn();
            jsondiffpatch.unpatch(note.table, lasthashdelta.delta);

            var hashdelta = deltaOut(deltain, false);
            io.sockets.emit("delta", [hashdelta]);
            writeNote();
        }
    });

    socket.on("hash", function (data) {
        var hash = data;
        var i = deltastack.length;
        while (i--) {
            if (deltastack[i].hash === hash) {
                break;
            }
        }

        if (i < 0) {
            if (hash === getTableHash()) {
                console.log("request:" + hash + " -> hash is the latest.");
                return 1;
            }
            socket.emit("note", note);
            console.log("request:" + hash + " -> hash is not found.");
            return 1;
        }

        socket.emit("delta", deltastack.slice(i));
        console.log("request:" + hash + " -> answer " + i + " deltas.");
    });

    socket.on("disconnect", function () {
        io.sockets.emit("msg", { text: "bye " + UUID, userid: "Server" });
    });
});
