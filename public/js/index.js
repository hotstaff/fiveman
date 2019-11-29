/* ========================================================================
 * Realtime-Kakeibo Fiveman: index.js
 * ========================================================================
 * Copyright 2016-2019 Hideto Manjo.
 * Licence: Verbatim copying only about comment text on source
 * ======================================================================== */

/* Realtime-Kakeibo Fiveman is created by Hideto Manjo
 * This program works on node.js. write: 2016/12/22
 * Now this script becomes hyper-complex Morisoba 2017/1/12.
 * This script goes more complex 'Morisoba',
 * however, update first major varsion. Congratulations!! 2017/2/2.
 * speed up and code cleanings 2017/2/17.
 * Too late to fix, we make this version 0.7 release. 2017/3/7
 * Speed up 2017/4/12, webpack 2017/4/26
 * Complex and complex, it is morisoba code 2018/4/11
 * More faster and lazy, version 1.4.0 release. 2018/5/29
 */

/*jslint browser, node, devel, for, this, bitwise*/
/*global define, root, CanvasJS */

/* for debugging */
var DEBUG = DEBUG || true;
var CONSOLE_DUMP_TIME = CONSOLE_DUMP_TIME || true;
var DEBUG_TO_CONSOLE = DEBUG_TO_CONSOLE || true;
var REALTIME_UPDATE = REALTIME_UPDATE || true;


//for CommonJS
(function (window, factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        console.log("AMD is not supported");
    } else if (typeof exports === "object" && typeof require === "function") {
         // Browserify
        var $ = require("jquery");//MIT
        var io = require("socket.io-client");//MIT
        var flatpickr = require("flatpickr");//MIT
        var flatpickrl10n = require("./ja.js").ja;//MIT
        var Cookies = require("js-cookie");//MIT
        var PNotify = require("pnotify");//Apache-2.0
        var jsondiffpatch = require("jsondiffpatch");//MIT
        var XXH = require("xxhashjs");//MIT
        var Sifter = require("sifter");//Apache-2.0
        var LeastSquares = require("./leastsquare.js");//MIT
        var FFT = require("jquery.fft");//MIT
        require("./canvasjs.js");//CC BY-NC 3.0
        require("devbridge-autocomplete");//MIT
        require("./jquery.smartWizard.js");//MIT
        flatpickr.localize(flatpickrl10n);
        factory(
            $,
            io,
            CanvasJS,
            flatpickr,
            Cookies,
            PNotify,
            jsondiffpatch,
            XXH,
            Sifter,
            LeastSquares,
            FFT
        );
    } else {
        // Browser globals
        factory(
            window.jQuery,
            window.io,
            window.CanvasJS,
            window.flatpickr,
            window.Cookies,
            window.PNotify,
            window.jsondiffpatch,
            window.XXH,
            window.Sifter,
            window.LeastSquares,
            window.FFT
        );
    }
}(this, function (
    $,
    io,
    CanvasJS,
    flatpickr,
    Cookies,
    PNotify,
    jsondiffpatch,
    XXH,
    Sifter,
    LeastSquares,
    FFT
) {
    "use strict";

    if (CONSOLE_DUMP_TIME) {
        console.time("scriptload");
        console.time("ids");
    }

    //idselectorlist
    var $table_tbody = $("#table tbody");
    var $table = $("#table");
    var $pencil = $("#pencil");
    var $navpencil = $("#navpencil");
    var $log = $("#log");
    var $ashita = $("#ashita");
    var $kyou = $("#kyou");
    var $kinou = $("#kinou");
    var $shitei = $("#shitei");
    var $undo = $("#undo");
    var $johotablerow = $("#johotablerow");
    var $johorefdate = $("#johorefdate");
    var $johorepositorylist = $("#johorepositorylist");
    var $item = $("#item");
    var $price = $("#price");
    var $price2 = $("#price2");
    var $price2label = $("#price2label");
    var $price2unit = $("#price2unit");
    var $inputformprice2 = $("#inputformprice2");
    var $memo = $("#memo");
    var $datepicker = $("#datepicker");
    var $userid = $("#userid");
    var $category = $("#category");
    /*goukei*/
    var $goukeiincome = $("#goukeiincome");
    var $goukeioutcome = $("#goukeioutcome");
    var $goukeisavings = $("#goukeisavings");
    var $goukeiconsumer = $("#goukeiconsumer");
    var $goukeiinvestment = $("#goukeiinvestment");
    var $goukeiwaste = $("#goukeiwaste");
    var $tsukaeruokanelabel = $("#tsukaeruokanelabel");
    var $tsukaeruokanebyday = $("#tsukaeruokanebyday");
    var $tsukaeruokane = $("#tsukaeruokane");
    var $rateconsumer = $("#rateconsumer");
    var $rateinvestment = $("#rateinvestment");
    var $ratewaste = $("#ratewaste");
    var $progressconsumer = $("#progressconsumer");
    var $progressinvestment = $("#progressinvestment");
    var $progresswaste = $("#progresswaste");
    var $radioincome = $("#radioincome");
    var $radiosavings = $("#radiosavings");
    var $radioconsumer = $("#radioconsumer");
    var $radioinvestment = $("#radioinvestment");
    var $radiowaste = $("#radiowaste");
    var $graphinfoyosoku = $("#graphinfoyosoku");
    var $graphinfoimpose = $("#graphinfoimpose");
    var $graphinfofft = $("#graphinfofft");
    var $piechartinfostack = $("#piechartinfostack");
    var $limitedkikan = $("#limitedkikan");
    var $inputrow = $("#input-row");
    var $connectionstatus = $("#connectionstatus");
    var $connectionstatusicon = $("#connectionstatusicon");
    var $retrynumber = $("#retrynumber");
    /**/
    var $kikan = $("#kikan");
    var $buttonkongetsu = $("#buttonkongetsu");
    var $buttonraigetsu = $("#buttonraigetsu");
    var $buttonlastmonth = $("#buttonlastmonth");
    var $buttonlastweek = $("#buttonlastweek");
    var $buttonfuture = $("#buttonfuture");
    var $buttonpast = $("#buttonpast");
    var $buttonall = $("#buttonall");
    var $buttonprevious = $("#buttonprevious");
    var $buttonnext = $("#buttonnext");
    /**/
    var $buttonitem = $("#buttonitem");
    var $buttoncategory = $("#buttoncategory");
    var $buttonincome = $("#buttonincome");
    var $buttonsavings = $("#buttonsavings");
    var $buttonconsumer = $("#buttonconsumer");
    var $buttoninvestment = $("#buttoninvestment");
    var $buttonwaste = $("#buttonwaste");
    /**/
    var $thitemicon = $("#thitemicon");
    var $thcategoryicon = $("#thcategoryicon");
    /**/
    var $chartline = $("#chartline");
    var $chartpie = $("#chartpie");
    var $joho = $("#joho");
    /**/
    var $htmlbody = $("html,body");
    /*modal form input*/
    var $modal_date = $("#modal_date");
    var $modal_price = $("#modal_price");
    var $modal_item = $("#modal_item");
    var $modal_category = $("#modal_category");
    /**/
    var $modal_inputformprice2 = $("#modal_inputformprice2");
    var $modal_price2label = $("#modal_price2label");
    var $modal_price2unit = $("#modal_price2unit");
    var $modal_memo = $("#modal_memo");
    var $modal_submit = $("#modal_submit");
    var $modalinput = $("#modalinput");
    /**/
    var $modal_alert = $("#modal_alert");
    var $modal_alert_title = $("#modal_alert_title");
    var $modal_alert_body = $("#modal_alert_body");
    /*wizard*/
    var $wizard = $("#wizard");
    var $wizardpencil = $("#wizardpencil");
    var $smartwizard = $("#smartwizard");
    /**/
    var $wizardpricebuttons = $("#wizardpricebuttons");
    var $wizardcategorypills = $("#wizardcategorypills");
    var $wizardcategorytabs = $("#wizardcategorytabs");
    var $wizarddatepicker = $("#wizarddatepicker");
    /**/
    var $wizarditemprevious = $("#wizarditemprevious");
    var $wizarditemnext = $("#wizarditemnext");
    /**/
    var $wizardcategorypage = $("#wizardcategorypage");
    var $wizardcategorypagetotal = $("#wizardcategorypagetotal");
    var $wizardcategorypagenumber = $("#wizardcategorypagenumber");
    /**/
    var $wizardnewitemtab = $("#wizardnewitemtab");
    var $wizardnewitemtabopen = $("#wizardnewitemtabopen");
    var $wizardnewitemtabclose = $("#wizardnewitemtabclose");
    var $wizardnewitem = $("#wizardnewitem");
    var $wizardnewitemaddon = $("#wizardnewitemaddon");
    var $wizardnewitembuttons = $("#wizardnewitembuttons");
    var $wizardnewitemnext = $("#wizardnewitemnext");
    /**/
    var $wizardkinou = $("#wizardkinou");
    var $wizardkyou = $("#wizardkyou");
    var $wizardshitei = $("#wizardshitei");
    /**/
    var $wizardprice = $("#wizardprice");
    var $wizardpricenext = $("#wizardpricenext");
    var $wizardmemo = $("#wizardmemo");
    /**/
    var $wizardcalendar = $("#wizardcalendar");
    var $wizardsubmit = $("#wizardsubmit");
    var $wizardrestart = $("#wizardrestart");
    var $wizardsteptitle = $("#wizardsteptitle");
    /**/
    var $lightlist = $("#lightlist");
    var $lightlisttoggle = $("#lightlisttoggle");
    var $searchinput = $("#searchinput");
    var $buttonsearch = $("#buttonsearch");
    /**/
    var $defaultview = $("#defaultview");
    /**/
    var $msg = $("#msg");
    var $send = $("#send");
    /* globalvariable */
    /* instatancies */
    var TaxmanInstance;
    var datepicker;
    var kikancalender;
    var wizarddatepicker;
    var NOTE;
    var socket;
    /* globalstate */
    var keys;
    var supports_html5_storage;
    var port;
    /* congigurations */
    var cookieoption = {
        expires: 100
    };
    /* PNotify configurations*/
    var stack_bottomright = {
        "dir1": "up",
        "dir2": "left",
        "firstpos1": 25,
        "firstpos2": 25
    };
    /* socket.io configurations*/
    var socketopts = {
        "reconnectionAttempts": 100
    };
    var SERVERPORT = 3002;
    if (CONSOLE_DUMP_TIME) {
        console.timeEnd("ids");
    }

    /* initial queue*/
    var __initial_queue =   {
        "text": "input data",
        "optgroup": "収入",
        "category": "預金引出",
        "item": "最初の所持金",
        "producttype": "income",
        "price": "0",
        "memo": ""
    };

    //functions
    //generic functions
    //array
    function returnEgrepArray(select, array) {
        var arraylength = array.length;
        var i = 0;
        for (i = 0; i < arraylength; i = i + 1) {
            if (array[i] === select) {
                array.splice(i, 1);
            }
        }
        return array;
    }

    //date
    function getDiffDate(diffday) {
        var date = new Date();
        date.setDate(date.getDate() + diffday);
        return date;
    }

    function addZero(n) {
        return (
            n < 10
            ? ("0" + n)
            : String(n)
        );
    }

    function formatDate(date) {
        var YYYY = date.getFullYear();
        var MM = addZero(date.getMonth() + 1);
        var DD = addZero(date.getDate());
        return YYYY + "/" + MM + "/" + DD;
    }

    function compareDate(a, b) {
        var adate = new Date(a);
        var bdate = new Date(b);

        if (adate > bdate) {
            return 1;
        }
        if (adate < bdate) {
            return -1;
        }
        return 0;
    }

    function getMonthReferenceDate(
        date,
        diffmonth,
        refday,
        cuttype
    ) {
        var year = date.getFullYear();
        var month = date.getMonth();
        var initday = date.getDate();

        if (cuttype === "begin") {
            if (refday > initday) {
                diffmonth = diffmonth - 1;
            }
        } else if (cuttype === "end") {
            if (refday >= initday) {
                diffmonth = diffmonth - 1;
            }
        }
        return new Date(year, month + diffmonth, refday);
    }

    //app specific

    function saveCommand(command, state) {
        var commandlist = Cookies.getJSON("fivemancommand");
        if (commandlist === undefined) {
            commandlist = {};
        }
        commandlist[command] = state;
        Cookies.set(
            "fivemancommand",
            commandlist,
            cookieoption
        );
    }

    function fivemanCommand(command) {
        if (command === "fiveman") {
            $pencil.removeClass("hidden");
            $navpencil.removeClass("invisible");
            $wizardpencil.removeClass("invisible");
            saveCommand("fiveman", "on");
            $("#pencilstatus").removeClass("hidden");
        }
    }

    function loadCommand() {
        var commandlist = Cookies.getJSON("fivemancommand");

        if (commandlist === undefined) {
            return false;
        }

        Object.keys(commandlist).forEach(function (command) {
            if (commandlist[command] === "on") {
                fivemanCommand(command);
            }
        });
        return true;
    }

    //chatlog
    function writelog(text) {
        $log.html(text + "\n" + $log.html());
    }

    function debuglog(text) {
        if (DEBUG) {
            if (DEBUG_TO_CONSOLE) {
                console.log(text);
            } else {
                $log.html("[debug] " + text + "\n" + $log.html());
            }
        }
    }

    function writechatlog(chatlog) {
        var l = chatlog.length;
        var i;
        for (i = 0; i < l; i = i + 1) {
            writelog(chatlog[i].text);
        }
    }

    //The object for PNotify.
    function showNotify(type, title, text) {
        var opts = {
            title: title || "Notify",
            text: text || "Notify text is none.",
            addclass: "stack-bottomright",
            stack: stack_bottomright
        };
        switch (type) {
        case "error":
            opts.type = "error";
            break;
        case "info":
            opts.type = "info";
            opts.icon = "glyphicon glyphicon-info-sign";
            break;
        case "notice":
            opts.icon = "glyphicon glyphicon-envelope";
            break;
        case "success":
            opts.type = "success";
            opts.icon = "glyphicon glyphicon-ok-sign";
            break;
        }
        new PNotify(opts);

        if (window.navigator.vibrate !== undefined) {
            window.navigator.vibrate(200);
        }
    }

    function showAlert(title, html, open) {
        if (open === undefined || open === true) {
            $modal_alert.modal();
        }
        if (title !== undefined && html !== undefined) {
            $modal_alert_title.text(title);
            $modal_alert_body.html(html);
        }
    }

    //rendering
    function resetPencil(operation) {
        if (!$pencil.hasClass("hidden")) {
            if (operation === "disabled") {
                $ashita.addClass("disabled");
                $kyou.addClass("disabled");
                $kinou.addClass("disabled");
                $shitei.addClass("disabled");
                $navpencil.addClass("invisible");
                $wizardpencil.addClass("invisible");
            } else if (operation === "show") {
                $ashita.removeClass("disabled");
                $kyou.removeClass("disabled");
                $kinou.removeClass("disabled");
                $shitei.removeClass("disabled");
                $navpencil.removeClass("invisible");
                $wizardpencil.removeClass("invisible");
            }
        }
    }

    function resetPencilLabel() {
        var sysDate = new Date();
        var dayOfToday = sysDate.getDay();
        var daylabel = ["日", "月", "火", "水", "木", "金", "土"];
        $ashita.removeClass("disabled").val(
            "明日(" + daylabel[(dayOfToday + 8) % 7] + ")"
        );
        $kyou.removeClass("disabled").val(
            "今日(" + daylabel[(dayOfToday + 7) % 7] + ")"
        );
        $kinou.removeClass("disabled").val(
            "昨日(" + daylabel[(dayOfToday + 6) % 7] + ")"
        );
        $shitei.removeClass("disabled");
    }

    function toggleProducttypeButton(selectproductname) {
        Object.keys(
            NOTE.status.limited.producttype
        ).forEach(function (productname) {
            if (
                selectproductname === productname
                && NOTE.status.limited.producttype[productname] === false
            ) {
                NOTE.status.limited.producttype[productname] = true;
                $("#th" + productname + "icon").addClass("glyphicon-lock");
            } else {
                NOTE.status.limited.producttype[productname] = false;
                $("#th" + productname + "icon").removeClass("glyphicon-lock");
            }
        });
    }

    function togglePeriodButton(selectperiodname) {
        var periodarray = [
            "kongetsu", "raigetsu", "lastmonth", "lastweek", "past", "future"
        ];
        var earray = returnEgrepArray(selectperiodname, periodarray);
        var i = earray.length;

        if (selectperiodname !== undefined) {
            $("#button" + selectperiodname).addClass("active");
        }
        while (i > 0) {
            i = i - 1;
            $("#button" + earray[i]).removeClass("active");
        }
    }

    function moveSelectedKikan(yeardiff, monthdiff, datediff) {
        var begindate;
        var newbegindate;
        var enddate;
        var end_index;
        var newenddate;
        var enableenddate;
        var now;

        begindate = kikancalender.selectedDates[0];
        newbegindate = new Date(
            begindate.getFullYear() + yeardiff,
            begindate.getMonth() + monthdiff,
            begindate.getDate() + datediff
        );

        if (newbegindate < new Date(NOTE.table[0].date)) {
            return false;
        }
        end_index = kikancalender.selectedDates.length - 1;
        enddate = kikancalender.selectedDates[end_index];
        newenddate = new Date(
            enddate.getFullYear() + yeardiff,
            enddate.getMonth() + monthdiff,
            enddate.getDate() + datediff
        );
        now = new Date();
        enableenddate = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
        if (
            (newenddate > enableenddate) &&
            (newenddate > new Date(NOTE.table[NOTE.table.length - 1].date))
        ) {
            return false;
        }
        kikancalender.setDate(
            formatDate(newbegindate) +
            " to " +
            formatDate(newenddate)
        );
        return true;
    }

    function reloadJohoTab() {
        var repname;
        $johotablerow.text(NOTE.table.length);
        $johorefdate.text(NOTE.cover.refferencedate);
        $johorepositorylist.empty();

        Object.keys(NOTE.cover.repository).forEach(function (repnum) {
            repname = NOTE.cover.repository[repnum];
            if (repnum === "1") {
                $johorepositorylist.append(
                    "<li class=\"list-group-item list-group-item-info\"> " +
                    repnum + ": " + repname + "</li>"
                );
            } else {
                $johorepositorylist.append(
                    "<li class=\"list-group-item\">" +
                    repnum + ": " + repname + "</li>"
                );
            }
        });
    }

    function refleshSelectedRows() {
        var selecteduuid = [];

        $table.find("tr.selected").each(function () {
            selecteduuid.push($(this).attr("id"));
        });

        if (selecteduuid.length > 0) {
            resetPencil("disabled");
        } else {
            resetPencil("show");
        }
        return selecteduuid;
    }

    //form

    function clearform() {
        $item.val("");
        $inputformprice2.addClass("hidden");
        $price2label.addClass("hidden");
        $price.val("");
        $price2.val("");
        $memo.val("");
    }

    function querycheck() {
        var dateparent = $datepicker.parent().parent();
        var priceparent = $price.parent();
        var price2parent = $price2.parent();
        var itemparent = $item.parent();
        var validation = true;

        if (datepicker.selectedDates.length === 0) {
            dateparent.addClass("has-error");
            validation = false;
        } else {
            dateparent.removeClass("has-error");
        }

        if ($inputformprice2.hasClass("hidden") === false) {
            if ($price2.val() === "" || $price2.val() === 0) {
                price2parent.addClass("has-error");
                validation = false;
            } else {
                price2parent.removeClass("has-error");
            }
        }

        if ($item.val() === "") {
            itemparent.addClass("has-error");
            validation = false;
        } else {
            itemparent.removeClass("has-error");
        }

        if ($price.val() === "") {
            priceparent.addClass("has-error");
            validation = false;
        } else {
            priceparent.removeClass("has-error");
        }
        return validation;
    }


    function getQueue(selectedDates) {
        var queues = [];
        var queue = {};
        var $categoryselected = $category.find("option:selected");
        var sysDate = new Date();
        var sl = selectedDates.length;
        var i;

        for (i = 0; i < sl; i = i + 1) {
            queue = {
                text: "input data",
                userid: $userid.text(),
                date: formatDate(selectedDates[i]),
                sysdate: sysDate,
                optgroup: $categoryselected.closest("optgroup").attr("label"),
                category: $categoryselected.text(),
                item: $item.val(),
                producttype: $("[name=producttype]:checked").val(),
                price: $price.val(),
                taxs: TaxmanInstance.check(
                    $price.val(),
                    $price2.val(),
                    $categoryselected.text(),
                    $item.val()
                ),
                memo: $memo.val()
            };
            queues.push(queue);
        }
        return queues;
    }

    function setQueue(queue) {
        if (queue.hasOwnProperty("date")) {
            datepicker.setDate(new Date(queue.date));
        }
        $category.find("option").filter(function () {
            return $(this).text() === queue.category;
        }).prop("selected", true).change();
        $item.val(queue.item).change();
        $("[name=producttype]").filter(function () {
            return $(this).val() === queue.producttype;
        }).prop("checked", true).change();
        $price.val(queue.price);
        $memo.val(queue.memo);
    }

    function setQueueToModal(queue) {
        $modal_category.find("option").filter(function () {
            return $(this).text() === queue.category;
        }).prop("selected", true).change();
        $modal_item.val(queue.item).change();
        $("[name=modal_producttype]").filter(function () {
            return $(this).val() === queue.producttype;
        }).prop("checked", true).change();
        $modal_price.val(queue.price);
        $modal_memo.val(queue.memo);
    }

    function sendInputQueue(confirm) {
        var queues;
        var todayoutcome;
        var datestring = formatDate(new Date());
        if (querycheck() === true) {
            queues = getQueue(datepicker.selectedDates);

            //multiple input confirm
            if (queues.length > 1) {
                if (confirm !== true) {
                    (new PNotify({
                        title: "送信確認",
                        text: (
                            "カレンダーが複数選択されています。" +
                            queues.length + "個のキューを送信しますか？"
                        ),
                        icon: "glyphicon glyphicon-question-sign",
                        hide: false,
                        confirm: {
                            confirm: true
                        },
                        buttons: {
                            closer: false,
                            sticker: false
                        },
                        history: {
                            history: false
                        }
                    })).get().on("pnotify.confirm", function () {
                        sendInputQueue(true);
                    }).on("pnotify.cancel", function () {
                        showNotify("info", "送信中止", "送信を中止しました");
                    });
                    return false;
                }
            }

            todayoutcome = Number(queues[0].price);
            if (queues.length === 1 && queues[0].date === datestring) {
                if (
                    queues[0].producttype !== "income"
                    && queues[0].producttype !== "savings"
                ) {
                    if (NOTE.goukei.hasOwnProperty(datestring)) {
                        todayoutcome = (
                            todayoutcome +
                            NOTE.goukei[datestring].consumer +
                            NOTE.goukei[datestring].investment +
                            NOTE.goukei[datestring].waste
                        );
                    }

                    showNotify(
                        "info",
                        "本日の合計",
                        "本日の支出は" + todayoutcome + "円になりました。"
                    );
                }
            }

            socket.emit("input", queues);
            clearform();
            $undo.removeClass("disabled");

            if (socket.connected === true) {
                showNotify("success", "送信完了", "送信を完了しました。");
            } else {
                showNotify(
                    "error",
                    "接続エラー！",
                    "送信待ちに追加しました。リロードすると反映されません。"
                );
            }

        } else {
            showNotify(
                "notice",
                "入力エラー！",
                "日付、品名、金額を正しく入力してください。"
            );
        }
    }

    function sendEditQueue(uuid) {
        if (querycheck() === true) {
            var queue = getQueue(datepicker.selectedDates)[0];
            queue.uuid = uuid;
            socket.emit("edit", queue);
            clearform();
            $undo.removeClass("disabled");

            if (socket.connected === true) {
                showNotify("success", "送信", "編集キューの送信を完了しました");
            } else {
                showNotify(
                    "info",
                    "接続エラー！",
                    "送信待ちに追加しました。リロードすると反映されません。"
                );
            }
            return true;
        }
        showNotify(
            "notice",
            "入力エラー！",
            "日付、品名、金額を正しく入力してください"
        );
        return false;
    }

    function coloringPrice(price, producttype) {
        var spantag;
        switch (producttype) {

        case "income":
            if (Math.abs(price) > 9999) {
                spantag = "<span class = \"lead\">" + price + "円</span>";
            } else {
                spantag = price + "円";
            }
            break;

        case "savings":
            spantag = "<span class= \"text-primary\"> " + price + "円</span>";
            break;

        case "coloronly":
            if (Number(price) >= 0) {
                spantag = price + "円";
            } else {
                spantag = (
                    "<span class= \"text-danger\"> " + price + "円</span>"
                );
            }
            break;

        default:
            if (Math.abs(price) > 9999) {
                spantag = (
                    "<span class = \"lead text-danger\">" + price + "円</span>"
                );
            } else {
                spantag = (
                    "<span class= \"text-danger\">" + price + "円</span>"
                );
            }
        }

        return spantag;
    }


    function offonEventTable() {
        //table click event
        $table_tbody.off("click").on("click", ".clickable-row", function () {

            var $this = $(this);
            var uuid = $this.attr("id");
            //button controll ids
            var $statelabel = $this.find(".statelabel");
            var $editbutton = $this.find("[name=edit]");
            var $okbutton = $this.find("[name=ok]");
            var $cancelbutton = $this.find("[name=cancel]");
            //select color and class selected
            $this.toggleClass("success").toggleClass("selected");

            if ($this.hasClass("editing")) {
                $this.addClass("success").addClass("selected");
                return false;
            }

            if ($this.hasClass("selected")) {

                //grapic
                $statelabel.text(
                    "選択中"
                ).removeClass(
                    "label-danger"
                ).addClass(
                    "label-success"
                ).removeClass("hidden");

                if ($pencil.hasClass("hidden")) {
                    return false;
                }

                $editbutton.removeClass("hidden");

                $editbutton.off("click").on("click", function () {

                    function openEditMenu() {
                        //unselect other buttons
                        $table_tbody.find(".editing").each(function () {
                            var $self = $(this);
                            $self.removeClass("editing");
                            $self.find(
                                ".statelabel"
                            ).text(
                                "選択中"
                            ).removeClass(
                                "label-danger"
                            ).addClass(
                                "label-success"
                            ).removeClass("hidden");

                            $self.find(
                                "[name=edit]"
                            ).removeClass("hidden");

                            $self.find(
                                "[name=ok]"
                            ).off("click").addClass("hidden");

                            $self.find(
                                "[name=cancel]"
                            ).off("click").addClass("hidden");
                        });

                        //button hidden and show;
                        $statelabel.text(
                            "編集中"
                        ).removeClass(
                            "label-success"
                        ).addClass(
                            "label-danger"
                        ).removeClass("hidden");

                        $okbutton.removeClass("hidden");
                        $cancelbutton.removeClass("hidden");
                        $editbutton.addClass("hidden");

                        setQueue(NOTE.table[NOTE.uuid2row[uuid]]);
                        $inputrow.insertBefore($("#" + uuid));
                        datepicker.set("mode", "single");
                        $item.devbridgeAutocomplete("dispose");
                        NOTE.status.editing = true;
                        $limitedkikan.addClass("disabled");
                        $("#" + uuid).addClass("editing");
                        $htmlbody.animate({
                            scrollTop: $inputrow.offset().top - 90
                        });
                    }

                    function closeEditMenu() {
                        $statelabel.text(
                            "選択中"
                        ).removeClass(
                            "label-danger"
                        ).addClass(
                            "label-success"
                        ).removeClass("hidden");
                        $editbutton.removeClass("hidden");
                        $okbutton.off("click").addClass("hidden");
                        $cancelbutton.off("click").addClass("hidden");
                        $("#" + uuid).removeClass("editing");
                        $inputrow.insertBefore($table_tbody.find("tr").eq(0));
                        datepicker.set("mode", "multiple");
                        NOTE.reloadAutoComplete();
                        NOTE.status.editing = false;
                        $limitedkikan.removeClass("disabled");
                    }

                    openEditMenu();

                    $okbutton.off("click").on("click", function () {
                        //submit
                        if (sendEditQueue(uuid) === true) {
                            closeEditMenu();
                        }
                        return false;
                    });

                    $cancelbutton.off("click").on("click", function () {
                        closeEditMenu();
                        //cancel
                        clearform();
                        return false;
                    });

                    return false;
                });

            } else {
                $statelabel.addClass("hidden");
                $editbutton.off("click").addClass("hidden");
            }

            refleshSelectedRows();
        });
    }

    function offonEventLightList() {

        var editLightList = function editLightList() {
            var uuid = $(this).attr("id");
            var queue = NOTE.table[NOTE.uuid2row[uuid]];

            setQueueToModal(queue);
            $modal_submit.addClass("hidden");
            $("#modal_edit").removeClass("hidden");
            $modalinput.modal();

            $modalinput.off(
                "hidden.bs.modal"
            ).on("hidden.bs.modal", function () {
                $modal_submit.removeClass("hidden");
                $("#modal_edit").addClass("hidden");
            });

            $("#modal_edit").off("click").on("click", function () {
                $item.val($modal_item.val());
                $price.val($modal_price.val());
                var date = $modal_date.val();
                if (date !== "") {
                    datepicker.setDate(date);
                }
                $memo.val($modal_memo.val());
                if (querycheck() === true) {
                    $("body").removeClass("modal-open");
                    $(".modal-backdrop").remove();
                    $modalinput.modal("hide");
                    sendEditQueue(uuid);
                }
            });
            return false;

        };

        $lightlist.off(
            "dblclick"
        ).on("dblclick", ".list-group-item", function () {
            editLightList.call(this);
            return false;
        });
    }


    /**
     *  Taxman is japanaese tax calculator.
     *
     */
    function Taxman() {
        var category2taxlist = {
            "税金": "",
            "給料": "所得税",
            "臨時収入": "所得税"
        };
        var item2taxlist = {
            "ガソリン": {
                taxname: "ガソリン税",
                keisuu: 53.8,
                label: "給油量",
                unit: "L"
            },
            "灯油": {
                taxname: "石油石炭税",
                keisuu: 2.8,
                label: "給油量",
                unit: "L"
            },
            "国民健康保険税": {
                taxname: "国民健康保険税",
                keisuu: 1,
                label: "納税額",
                unit: "円"
            },
            "自動車税": {
                taxname: "自動車税",
                keisuu: 1,
                label: "納税額",
                unit: "円"
            },
            "車検": {
                taxname: "自動車重量税",
                keisuu: 1,
                label: "納税額",
                unit: "円"
            },
            "入浴料": {
                taxname: "入湯税",
                keisuu: 150,
                label: "入浴回数",
                unit: "回"
            }
        };
        var taxlist = {
            "国税": {
                "直接税": [
                    "所得税",
                    "法人税",
                    "地方法人特別税",
                    "地価税",
                    "相続税",
                    "贈与税",
                    "復興特別所得税・法人税"
                ],
                "間接税": [
                    "消費税",
                    "酒税",
                    "たばこ税",
                    "揮発油税",
                    "航空機燃料税",
                    "石油ガス税",
                    "石油石炭税",
                    "自動車重量税",
                    "関税",
                    "とん税",
                    "地方道路税",
                    "特別とん税",
                    "電源開発促進税",
                    "登録免許税",
                    "印紙税",
                    "ガソリン税"
                ]
            },
            "地方税": {
                "直接税": [
                    "都道府県民税",
                    "事業税",
                    "市町村民税",
                    "固定資産税",
                    "特別土地保有税",
                    "事業所税",
                    "都市計画税",
                    "水利地益税",
                    "不動産所得税",
                    "自動車税",
                    "軽自動車税",
                    "国民健康保険税",
                    "住民税"
                ],
                "間接税": [
                    "道府県たばこ税",
                    "ゴルフ場利用税",
                    "地方消費税",
                    "自動車所得税",
                    "軽油取引税",
                    "市町村たばこ税",
                    "入湯税",
                    "鉱区税",
                    "狩猟税"
                ]
            }
        };

        //taxlist
        this.taxlist = taxlist;
        this.category2taxlist = category2taxlist;
        this.item2taxlist = item2taxlist;
    }


    Taxman.prototype = {
        check: function check(price, price2, category, item) {
            var taxs = {};

            if (this.category2taxlist.hasOwnProperty(category)) {
                if (this.category2taxlist[category] === "") {
                    taxs[item] = "";
                } else {
                    taxs[this.category2taxlist[category]] = "";
                }
            } else {
                taxs["消費税"] = (
                    Number(price) - Math.floor(Number(price) / 1.08)
                );
            }

            if (price2 !== 0 || price2 !== "") {
                if (this.item2taxlist.hasOwnProperty(item)) {
                    taxs[this.item2taxlist[item].taxname] = (
                        Number(price2) * Number(
                            this.item2taxlist[item].keisuu
                        ).toFixed(0)
                    );
                }
            }
            return taxs;
        },
        search: function search(taxname) {
            var caller = this;
            // for search taxlist
            Object.keys(this.taxlist).forEach(function (osamesaki) {
                Object.keys(caller.taxlist[osamesaki]).forEach(
                    function (taxtype) {
                        var i;
                        var l = caller.taxlist[osamesaki][taxtype];
                        var name;
                        for (i = 0; i < l; i = i + 1) {
                            name = caller.taxlist[osamesaki][taxtype][i];
                            if (taxname === name) {
                                return [osamesaki, taxtype];
                            }
                        }
                    }
                );
            });
            return false;
        }
    };

    TaxmanInstance = new Taxman();

    ///Note() is main object.
    /////////////////////////////////////////
    function Note(note) {

        if (window === this) {
            return new Note();
        }

        //public properties
        this.status = {
            editing: false,
            limited: {
                kikan: true,
                item: false,
                category: false,
                producttype: {
                    income: false,
                    savings: false,
                    consumer: false,
                    investment: false,
                    waste: false
                }
            },
            ready: {
                uuid2row: false,
                goukei: false,
                kikan: false,
                kikangoukei: false,
                kikantable: false,
                sum: false,
                table: false,
                itemlist: false
            },
            show: {
                leastsquare: false,
                superimpose: false,
                fft: false,
                stack: false
            }
        };

        //main array and list
        this.cover = note.cover;
        this.table = note.table;

        this.uuid2row = {}; //getUUid2Row
        this.goukei = {}; //getGoukei()

        //period select arrays
        this.periodname = "";
        this.kikan = {}; //["begindate": dateobject, "enddate": dateobject]

        //kikantable
        this.kikantable = [];

        //goukei in/out list by day.
        this.kikangoukei = {};
        //for infoview
        this.sum = {};

        //for stepline graph
        this.datapoints = [];
        this.param = {};

        //for piechart
        this.categorytotal = {};
        this.piedatapoints = [];

        //for limitedrow
        this.limitedrows = [];

        //for form
        this.itemlist = [];

        //chart object
        this.chartline = false;
        this.chartpie = false;

        //init function.
        this.getUuid2Row();
        this.getGoukei();
    }

    /// Note general functions

    Note.prototype.inKikan = function inKikan(date) {
        if (date >= this.kikan.begindate) {
            if (this.kikan.enddate >= date) {
                return true;
            }
        }
        return false;
    };

    Note.prototype.getUuid2Row = function getUuid2Row() {
        this.uuid2row = {};
        var l = this.table.length;
        var row;
        for (row = 0; row < l; row = row + 1) {
            if (this.uuid2row.hasOwnProperty(this.table[row].uuid)) {
                debuglog("uuid double:" + this.table[row].uuid);
            }
            this.uuid2row[this.table[row].uuid] = row;
        }
        this.status.ready.uuid2row = true;
    };

    Note.prototype.getGoukei = function getGoukei() {
        var datestring;
        var producttype;
        var l = this.table.length;
        var row;
        this.goukei = {};
        for (row = 0; row < l; row = row + 1) {
            datestring = this.table[row].date;
            producttype = this.table[row].producttype;
            if (this.goukei[datestring] === undefined) {
                this.goukei[datestring] = {
                    consumer: 0,
                    investment: 0,
                    waste: 0,
                    income: 0,
                    savings: 0
                };
            }
            this.goukei[datestring][producttype] += Number(
                this.table[row].price
            );
        }
        this.status.ready.goukei = true;
    };

    Note.prototype.renewTable = function renewTable(table) {
        this.table = table;
        this.status.ready.uuid2row = false;
        this.status.ready.goukei = false;
        this.getUuid2Row();
        this.getGoukei();
        this.status.ready.kikan = false;
        this.status.ready.kikangoukei = false;
        this.status.ready.sum = false;
        this.status.ready.table = false;
        this.status.ready.itemlist = false;
    };

    Note.prototype.setPeriod = function setPeriod(periodname) {

        var sysDate = new Date();
        var ref = this.cover.refferencedate;
        var lastmonthrefdate = (
            getMonthReferenceDate(sysDate, 0, ref, "begin")
        );
        var nextmonthrefdate = (
            getMonthReferenceDate(sysDate, 1, ref - 1, "end")
        );
        var begindate = new Date(this.table[0].date);
        var enddate = new Date(this.table[this.table.length - 1].date);
        var lastweekrefdate = new Date(sysDate);
        var end_index;
        lastweekrefdate.setDate(lastweekrefdate.getDate() - 7);

        this.periodname = periodname;
        switch (this.periodname) {
        case "future":
            begindate = sysDate;
            break;
        case "past":
            enddate = sysDate;
            break;
        case "kongetsu":
            begindate = lastmonthrefdate;
            enddate = nextmonthrefdate;
            break;
        case "raigetsu":
            begindate = getMonthReferenceDate(sysDate, 1, ref, "begin");
            enddate = getMonthReferenceDate(sysDate, 2, ref - 1, "end");
            break;
        case "lastmonth":
            begindate = lastmonthrefdate;
            enddate = sysDate;
            break;
        case "lastweek":
            begindate = lastweekrefdate;
            enddate = sysDate;
            break;
        case "free":
            begindate = kikancalender.selectedDates[0];
            end_index = kikancalender.selectedDates.length - 1;
            enddate = kikancalender.selectedDates[end_index];
            break;
        }

        this.status.ready.kikan = true;
        this.status.ready.kikangoukei = false;
        this.status.ready.kikantable = false;
        this.status.ready.sum = false;
        this.kikan = {
            begindate: begindate,
            enddate: enddate 
        };

    };

    Note.prototype.getKikanGoukei = function getKikanGoukei() {
        var caller = this;
        this.kikangoukei = {};

        Object.keys(this.goukei).forEach(function (datestring) {
            if (caller.inKikan(new Date(datestring))) {
                caller.kikangoukei[datestring] = caller.goukei[datestring];
            }
        });

        this.status.ready.kikangoukei = true;
    };

    Note.prototype.getKikanTable = function getKikanTable() {
        this.kikantable = [];

        var l = this.table.length;
        var row;

        for (row = 0; row < l; row = row + 1) {
            if (this.inKikan(new Date(this.table[row].date))) {
                this.kikantable.push(this.table[row]);
            }
        }
        this.status.ready.kikantable = true;
    };

    Note.prototype.getProducttypeSum = function getProducttypeSum() {
        var caller = this;

        if (this.status.ready.kikangoukei === false) {
            this.getKikanGoukei();
        }

        this.sum = {
            consumer: 0,
            investment: 0,
            waste: 0,
            income: 0,
            savings: 0
        };

        Object.keys(this.kikangoukei).forEach(function (datestring) {
            Object.keys(caller.kikangoukei[datestring]).forEach(
                function (producttype) {
                    var diff = caller.kikangoukei[datestring][producttype];
                    caller.sum[producttype] += Number(diff);
                }
            );
        });

        this.sum.outcome = (
            this.sum.consumer + this.sum.investment + this.sum.waste
        );
        this.status.ready.sum = true;
    };

    //infoview

    Note.prototype.reloadInfoView = function reloadInfoView() {
        var caller = this;
        var ref = this.cover.refferencedate;
        var sysDate = new Date();
        var msecondsofday = 86400000;
        var difftime = msecondsofday;
        var diffday;
        var tsukaeruokane = 0;
        var tsukaeruokanebyday = 0;
        var rateconsumer = 0;
        var rateinvestment = 0;
        var ratewaste = 0;

        if (this.status.ready.sum === false) {
            this.getProducttypeSum();
        }

        // infoview sum
        $goukeiconsumer.text(this.sum.consumer + "円");
        $goukeiinvestment.text(this.sum.investment + "円");
        $goukeiwaste.text(this.sum.waste + "円");
        $goukeioutcome.text(this.sum.outcome + "円");

        $goukeiincome.text(this.sum.income + "円");
        $goukeisavings.text(this.sum.savings + "円");

        if (this.periodname === "kongetsu" || this.periodname === "raigetsu") {
            $tsukaeruokanelabel.text("使えるお金");
        } else {
            $tsukaeruokanelabel.text("収入・支出の合計");
        }

        switch (this.periodname) {
        case "kongetsu":
            difftime = (
                getMonthReferenceDate(sysDate, 1, ref, "begin") - sysDate
            );
            break;
        case "raigetsu":
            difftime = this.kikan.enddate - this.kikan.begindate;
            break;
        case "lastweek":
            diffday = 7;
            break;
        case "lastmonth":
            difftime = (
                sysDate - getMonthReferenceDate(sysDate, 0, ref, "begin")
            );
            break;
        case "past":
            difftime = sysDate - new Date(this.table[0].date);
            break;
        case "future":
            difftime = (
                new Date(this.table[this.table.length - 1].date) - sysDate
            );
            break;
        default:
            difftime = this.kikan.enddate - this.kikan.begindate;
        }

        diffday = diffday || Math.ceil(Number(difftime / msecondsofday));

        tsukaeruokane = Number(
            this.sum.income - this.sum.savings - this.sum.outcome
        );
        tsukaeruokanebyday = Math.floor(tsukaeruokane / diffday);
        rateconsumer = Number(this.sum.consumer * 100 / this.sum.outcome);
        rateinvestment = Number(this.sum.investment * 100 / this.sum.outcome);
        ratewaste = Number(this.sum.waste * 100 / this.sum.outcome);

        $tsukaeruokanebyday.html(
            coloringPrice(tsukaeruokanebyday, "coloronly")
        );
        $tsukaeruokane.html(coloringPrice(tsukaeruokane, "coloronly"));

        $progressconsumer.css(
            "width",
            rateconsumer.toFixed(3) + "%"
        ).attr("title", rateconsumer.toFixed(2) + "%");
        $progressinvestment.css(
            "width",
            rateinvestment.toFixed(3) + "%"
        ).attr("title", rateinvestment.toFixed(2) + "%");
        $progresswaste.css(
            "width",
            ratewaste.toFixed(3) + "%"
        ).attr("title", ratewaste.toFixed(2) + "%");

        $rateconsumer.text(rateconsumer.toFixed(2) + "%");
        $rateinvestment.text(rateinvestment.toFixed(2) + "%");
        $ratewaste.text(ratewaste.toFixed(2) + "%");

        setTimeout(function () {
            kikancalender.setDate(
                formatDate(caller.kikan.begindate) +
                " to " +
                formatDate(caller.kikan.enddate)
            );
        }, 0);

    };

    //graph
    Note.prototype.makeDataPoints = function makeDataPoints() {
        var caller = this;
        var money = 0;
        if (this.status.ready.kikangoukei === false) {
            this.getKikanGoukei();
        }
        this.datapoints = [];

        Object.keys(this.kikangoukei).forEach(function (datestring) {
            var days = caller.kikangoukei[datestring];
            var diffmoney = (
                days.income -
                days.savings -
                days.consumer -
                days.investment -
                days.waste
            );
            money += diffmoney;

            caller.datapoints.push({
                x: new Date(datestring),
                y: money,
                toolTipContent: (
                    datestring +
                    "<br />残高 {y}円　<br />前日との差額 " +
                    coloringPrice(diffmoney, "coloronly")
                )
            });
        });
    };

    Note.prototype.plotGraph = function plotGraph() {
        this.makeDataPoints();
        var chertContainerID = "chartContainerline";
        this.chartline = new CanvasJS.Chart(chertContainerID, {
            zoomEnabled: true,
            animationEnabled: false,
            axisX: {
                valueFormatString: "MM/DD",
                labelFontColor: "rgb(0,75,141)",
                intervalType: "day"
            },
            axisY: {
                includeZero: false
            },
            data: []
        });


        if (this.status.show.leastsquare) {
            this.plotStepLine();
            this.reloadLeastSquare();
        } else if (this.status.show.impose) {
            this.plotSuperImposedDataPoints();
        } else if (this.status.show.fft) {
            this.plotFFT();
        } else {
            this.plotStepLine();
        }
    };

    Note.prototype.plotStepLine = function plotStepLine() {
        var table = this.table;
        var data = [];

        function getInfoAtDate(date) {
            var datestring = formatDate(date);
            var contents = "";
            var l = table.length;
            var row;
            for (row = 0; row < l; row = row + 1) {
                if (datestring === table[row].date) {
                    contents += (
                        " " + table[row].optgroup +
                        " " + table[row].category +
                        " " + table[row].item +
                        " <strong>" + table[row].price + "円</strong>" +
                        " " + table[row].memo + "<br>"
                    );
                }
            }
            return {date: datestring, contents: contents};
        }

        data.push({
            click: function (e) {
                showAlert(formatDate(e.dataPoint.x) + "の内訳", "...", true);
                var info = getInfoAtDate(e.dataPoint.x);
                showAlert(info.date + "の内訳", info.contents, false);
            },
            indexLabelFontColor: "darkSlateGray",
            name: "残高",
            type: "stepLine",
            color: "rgba(0,75,141,0.7)",
            lineThickness: 2,
            markerSize: 8,
            dataPoints: this.datapoints
        });

        this.chartline.options.data = data;
    };

    (
        Note.prototype.returnDividedTableByPeriod
    ) = function returnDividedTableByPeriod(kikantable, every) {
        var date;
        var year;
        var month;
        var datenum;
        var dividedtable = {};
        var index;
        var l = kikantable.length;
        var row;

        for (row = 0; row < l; row = row + 1) {
            date = new Date(kikantable[row].date);
            year = date.getFullYear();
            month = date.getMonth() + 1;
            datenum = date.getDate();

            if (every === "year") {
                index = year;
            } else if (every === "month") {
                index = year + "/" + month;
            } else if (every === "monthrefdate") {
                if (datenum < this.cover.refferencedate) {
                    if (month === 1) {
                        year -= 1;
                        month += 12;
                    }
                    index = year + "/" + (month - 1);
                } else {
                    index = year + "/" + month;
                }
            } else {
                index = formatDate(date);
            }
            if (dividedtable[index] === undefined) {
                dividedtable[index] = [];
            }
            dividedtable[index].push(kikantable[row]);
        }
        return dividedtable;
    };

    (
        Note.prototype.plotSuperImposedDataPoints
    ) = function plotSuperImposedDataPoints() {
        var points = {};
        var date;
        var yearmonth;
        var beginingdate;
        var point;
        var l = this.datapoints.length;
        var num;
        var data = [];

        for (num = 0; num < l; num = num + 1) {
            date = this.datapoints[num].x;
            yearmonth = date.getFullYear() + "年" + (date.getMonth() + 1) + "月";
            if (points[yearmonth] === undefined) {
                points[yearmonth] = [];
                beginingdate = new Date(date);
                beginingdate.setDate(1);
            }
            point = {
                x: new Date(date - beginingdate),
                y: this.datapoints[num].y,
                toolTipContent: this.datapoints[num].toolTipContent
            };

            points[yearmonth].push(point);
        }

        Object.keys(points).forEach(function (i) {
            data.push({
                indexLabelFontColor: "darkSlateGray",
                name: i,
                type: "stepLine",
                lineThickness: 2,
                markerSize: 8,
                showInLegend: false,
                dataPoints: points[i]
            });
        });

        this.chartline.options.data = data;
        this.chartline.options.axisX.valueFormatString = "DD";
        this.chartline.options.axisX.intervalType = "day";
    };

    Note.prototype.getLeastSquareParam = function getLeastSquareParam() {
        var ldataPoints = [];
        var leastSquares = new LeastSquares();
        var l = this.datapoints.length;
        var no;

        for (no = 0; no < l; no = no + 1) {
            ldataPoints.push(
                {
                    x: this.datapoints[no].x.getTime(),
                    y: this.datapoints[no].y
                }
            );
        }

        leastSquares.sample = ldataPoints;

        this.param = {
            slope: leastSquares.getSlope(),
            intercept: leastSquares.getIntercept()
        };
    };

    Note.prototype.getLeastSquarePoint = function getLeastSquarePoint(date) {
        var slope = this.param.slope;
        var intercept = this.param.intercept;
        return slope * date.getTime() + intercept;
    };

    Note.prototype.reloadLeastSquare = function reloadLeastSquare() {
        this.getLeastSquareParam();
        var msPerDay = 24 * 60 * 60 * 1000;
        var nextmonthrefdate = getMonthReferenceDate(
            this.kikan.enddate,
            1,
            this.cover.refferencedate,
            "begin"
        );
        var yosouslopetext = Number(
            this.param.slope * msPerDay
        ).toFixed(0) + "円/日";

        this.chartline.options.data.push(
            {
                indexLabelFontColor: "darkSlateGray",
                name: "予測ライン " + yosouslopetext,
                lineThickness: 2,
                type: "line",
                markerSize: 0,
                showInLegend: true,
                dataPoints: [
                    {
                        x: this.datapoints[0].x,
                        y: this.getLeastSquarePoint(this.datapoints[0].x)
                    },
                    {
                        x: this.datapoints[this.datapoints.length - 1].x,
                        y: this.getLeastSquarePoint(
                            this.datapoints[this.datapoints.length - 1].x
                        )
                    },
                    {
                        x: nextmonthrefdate,
                        y: this.getLeastSquarePoint(nextmonthrefdate)
                    }
                ]
            }
        );
    };

    (
        Note.prototype.completeDatapointsDate
    ) = function completeDatapointsDate(datapoints) {
        var newdatapoints = [];
        var msPerDay = 24 * 60 * 60 * 1000;
        var date = datapoints[0].x;
        var yval = datapoints[0].y;
        var diffday;
        var l = datapoints.length;
        var i;
        var j;
        var newdate;

        for (i = 0; i < l; i = i + 1) {
            diffday = ((datapoints[i].x - date) / msPerDay);
            for (j = 1; j < diffday; j = j + 1) {
                newdate = new Date(date);
                newdate.setDate(newdate.getDate() + j);
                newdatapoints.push({x: newdate, y: yval});
            }
            date = this.datapoints[i].x;
            yval = this.datapoints[i].y;
            newdatapoints.push({x: date, y: yval});
        }
        return newdatapoints;
    };

    Note.prototype.plotFFT = function plotFFT() {
        //input data
        var fft = new FFT();
        var real = [];
        var imaginary = [];
        var newdatapoints = this.completeDatapointsDate(this.datapoints);
        var l = newdatapoints.length;
        var i;
        var N;
        var squareN;
        var amp;
        var prd;
        var amplitude = [];

        for (i = 0; i < l; i = i + 1) {
            real.push(newdatapoints[i].y);
            imaginary.push(0);
        }

        //fft
        fft.calc(1, real, imaginary);

        N = fft.dim(real, imaginary);
        squareN = Math.sqrt(N);
        amp = fft.amplitude(real, imaginary);
        prd = fft.periods(real, imaginary, 1);

        for (i = prd.length; i > 1; i = i - 1) {
            amplitude.push({
                x: Number(prd[i]),
                y: Number(amp[i] / squareN),
                toolTipContent: (
                    "周期: " +
                    Number(prd[i]).toFixed(3) + "日 " +
                    "<br/>振幅: " + Number(amp[i] / squareN).toFixed(1)
                )
            });
        }


        this.chartline.options = {
            zoomEnabled: true,
            animationEnabled: false,
            axisX: {
                title: "周期",
                maximum: N / 2
            },
            data: [
                {
                    indexLabelFontColor: "darkSlateGray",
                    name: "スペクトル分布（振幅）",
                    lineThickness: 3,
                    type: "line",
                    markerSize: 3,
                    showInLegend: true,
                    dataPoints: amplitude
                }
            ]
        };

    };

    Note.prototype.getCategoryTotal = function getCategoryTotal() {
        this.categorytotal = {};

        var caller = this;
        var l;
        var row;
        var category;
        var optgroup;

        if (this.status.ready.kikantable === false) {
            this.getKikanTable();
        }

        l = this.kikantable.length;
        for (row = 0; row < l; row = row + 1) {
            optgroup = this.kikantable[row].optgroup;
            category = this.kikantable[row].category;
            if (!(this.categorytotal.hasOwnProperty(optgroup))) {
                this.categorytotal[optgroup] = {};
            }
            if (!(this.categorytotal[optgroup].hasOwnProperty(category))) {
                this.categorytotal[optgroup][category] = 0;
            }
            this.categorytotal[optgroup][category] += Number(
                this.kikantable[row].price
            );
        }

        this.piedatapoints = [];
        Object.keys(this.categorytotal["支出"]).forEach(function (category) {
            caller.piedatapoints.push({
                y: caller.categorytotal["支出"][category],
                label: category,
                legendText: category,
                indexLabel: category
            });
        });
    };

    Note.prototype.plotPieChart = function plotPieChart() {
        var caller = this;

        if (this.status.show.stack) {
            this.plotStackChart();
            return true;
        }

        this.getCategoryTotal();
        this.chartpie = new CanvasJS.Chart("chartContainerpie", {
            title: {},
            animationEnabled: false,
            legend: {
                verticalAlign: "bottom",
                horizontalAlign: "center"
            },
            data: [{
                click: function (e) {
                    caller.plotZoomPieChart(e.dataPoint.legendText);
                },
                explodeOnClick: false,
                indexLabelFontSize: 17,
                indexLabelFontFamily: "Monospace",
                indexLabelFontColor: "darkgrey",
                indexLabelLineColor: "darkgrey",
                indexLabelPlacement: "outside",
                type: "pie",
                showInLegend: true,
                toolTipContent: (
                    "{label} <br />{y}円 - <strong>#percent%</strong>"
                ),
                dataPoints: this.piedatapoints
            }]
        });
    };

    Note.prototype.plotStackChart = function plotStackChart() {
        var dividedtable = this.returnDividedTableByPeriod(
            this.table,
            "monthrefdate"
        );
        var dividedcategorytotal = {};
        var categorylist = {};
        var points = {};
        var data = [];

        Object.keys(dividedtable).forEach(function (name) {
            var categorytotal = {};

            Object.keys(dividedtable[name]).forEach(function (i) {
                var category = "";
                if (dividedtable[name][i].producttype === "income") {
                    return;
                }
                if (dividedtable[name][i].producttype === "savings") {
                    return;
                }

                category = dividedtable[name][i].category;

                if (categorylist[category] === undefined) {
                    categorylist[category] = category;
                }
                if (categorytotal[category] === undefined) {
                    categorytotal[category] = 0;
                }

                categorytotal[category] += Number(
                    dividedtable[name][i].price
                );
            });
            dividedcategorytotal[name] = categorytotal;
        });

        Object.keys(categorylist).forEach(function (category) {
            Object.keys(dividedcategorytotal).forEach(function (name) {
                if (points[category] === undefined) {
                    points[category] = [];
                }

                points[category].push({
                    y: dividedcategorytotal[name][category] || 0,
                    label: name
                });
            });
        });


        Object.keys(points).forEach(function (category) {
            data.push({
                type: "stackedColumn",
                name: category,
                dataPoints: points[category]
            });
        });

        this.chartpie = new CanvasJS.Chart("chartContainerpie", {
            title: {},
            toolTip: {
                content: (
                    "{label}<br/>" +
                    " <span style='\"'color: {color};'\"'>{name}</span>," +
                    " <strong>{y}円 / #total円 = #percent%</strong>"
                )
            },
            animationEnabled: false,
            data: data
        });
        this.chartpie.render();
    };

    Note.prototype.plotZoomPieChart = function plotZoomPieChart(category) {
        var caller = this;
        var itemtotal = {};
        var l = this.kikantable.length;
        var row;
        var piedatapoints = [];

        for (row = 0; row < l; row = row + 1) {
            if (this.kikantable[row].category === category) {
                if (!(itemtotal.hasOwnProperty(this.kikantable[row].item))) {
                    itemtotal[this.kikantable[row].item] = 0;
                }
                itemtotal[this.kikantable[row].item] += Number(
                    this.kikantable[row].price
                );
            }
        }

        Object.keys(itemtotal).forEach(function (item) {
            piedatapoints.push({
                y: itemtotal[item],
                label: item,
                legendText: item,
                indexLabel: item
            });
        });
        this.chartpie.options.data[0].dataPoints = piedatapoints;

        this.chartpie.options.data[0].click = function () {
            caller.plotPieChart();
            caller.chartpie.render();
        };

        this.chartpie.render();
    };

    Note.prototype.reloadGraphTab = function reloadGraphTab() {
        var caller = this;
        var opentab = "";
        $("a[data-toggle=\"tab\"]").each(function () {
            if ($(this).parent().attr("class") === "active") {
                opentab = $(this).attr("href");
            }
        });
        if (opentab === "#tabchartline") {
            caller.plotGraph();
            caller.chartline.render();
        } else if (opentab === "#tabchartpie") {
            caller.plotPieChart();
            caller.chartpie.render();
        }
    };


    //table
    Note.prototype.reloadAutoComplete = function reloadAutoComplete() {

        if (CONSOLE_DUMP_TIME) {
            console.time("autocomplete");
        }
        var caller = this;
        $item.devbridgeAutocomplete({
            lookup: this.itemlist,
            groupBy: "category",
            width: "flex",
            autoSelectFirst: true,
            onSelect: function (suggestion) {
                var queue = $.extend(
                    true,
                    {},
                    caller.table[caller.uuid2row[suggestion.data.uuid]]
                );
                delete queue.date;
                queue.price = "";
                queue.memo = "";
                setQueue(queue);
            }
        });

        if (CONSOLE_DUMP_TIME) {
            console.timeEnd("autocomplete");
        }
    };

    Note.prototype.makeItemList = function makeItemList() {
        var caller = this;
        var items = [];
        var typelist = {};
        var value = "";
        var category = "";
        var l = this.table.length;
        var row;

        if (this.status.ready.itemlist === false) {
            if (CONSOLE_DUMP_TIME) {
                console.time("makeItemlist");
            }

            for (row = 0; row < l; row = row + 1) {
                value = caller.table[row].item;
                category = caller.table[row].category;
                if (typelist[value] === undefined) {
                    typelist[value] = {};
                }
                if (typelist[value][category] === undefined) {
                    typelist[value][category] = [1, ""];
                }
                typelist[value][category][0] += 1;
                typelist[value][category][1] = row;
            }

            Object.keys(typelist).forEach(function (value) {
                Object.keys(typelist[value]).forEach(function (category) {
                    row = typelist[value][category][1];
                    items.push({
                        value: value,
                        data: {
                            category: category,
                            number: typelist[value][category][0],
                            uuid: caller.table[row].uuid
                        }
                    });
                });
            });

            this.itemlist = items.sort(function (a, b) {
                if (a.data.number < b.data.number) {
                    return 1;
                }
                if (a.data.number > b.data.number) {
                    return -1;
                }
                return 0;
            });
            this.status.ready.itemlist = true;
            if (CONSOLE_DUMP_TIME) {
                console.timeEnd("makeItemlist");
            }
            this.reloadAutoComplete();
        }
    };

    Note.prototype.getRow = function getRow(record, sysDate) {
        var toki;
        var trtag = "";
        var writedate = new Date(record.date);
        var uuid = record.uuid;
        var compareAns = compareDate(
            record.date,
            formatDate(sysDate)
        );
        var yoteilabel = {
            future: "<br /><span class=\"label label-warning\">予定</span>",
            today: "<br /><span class=\"label label-primary\">本日</span>",
            normal: ""
        };
        var producttypetag = {
            consumer: (
                "<td></td><td></td><td>" +
                "<button type=\"button\"" +
                " class=\"btn btn-info\">消費</button>" +
                "</td><td></td><td></td>"
            ),
            investment: (
                "<td></td><td></td><td></td><td>" +
                "<button type=\"button\"" +
                " class=\"btn btn-warning\">投資</button>" +
                "</td><td></td>"
            ),
            waste: (
                "<td></td><td></td><td></td><td></td><td>" +
                "<button type=\"button\"" +
                " class=\"btn btn-danger\">浪費</button>" +
                "</td>"
            ),
            income: (
                "<td>" +
                "<button type=\"button\"" +
                " class=\"btn btn-default\">収入</button>" +
                "</td><td></td><td></td><td></td><td></td>"
            ),
            savings: (
                "<td></td><td>" +
                "<button type=\"button\"" +
                " class=\"btn btn-success\">貯蓄</button>" +
                "</td><td></td><td></td><td></td>"
            )
        };
        var statelabel = (
            "<span class=\"statelabel hidden label label-success\">選択中</span>"
        );
        var editbutton = (
            "<button type=\"button\"" +
            " name=\"edit\" class=\"btn btn-default btn-sm hidden\">" +
            "<span class=\"glyphicon glyphicon-edit\"></span></button>"
        );
        var okbutton = (
            "<button type=\"button\"" +
            " name=\"ok\" class=\"btn btn-default btn-sm hidden\">" +
            "<span class=\"text-success glyphicon glyphicon-ok\">" +
            "</span></button>"
        );
        var cancelbutton = (
            "<button type=\"button\"" +
            " name=\"cancel\" class=\"btn btn-default btn-sm hidden\">" +
            "<span class=\"text-danger glyphicon glyphicon-remove\">" +
            "</span></button>"
        );
        var buttons = (
            "<div name=\"tablebutton\">" +
            editbutton + okbutton + cancelbutton +
            " </div>"
        );

        var ROW = "";

        if (compareAns > 0) {
            trtag = (
                "<tr class=\"warning clickable-row hidden\" id=\"" +
                uuid + "\">"
            );
            toki = "future";
        } else if (compareAns === 0) {
            trtag = (
                "<tr class=\"default clickable-row hidden\" id=\"" +
                uuid + "\">"
            );
            toki = "today";
        } else {
            trtag = "<tr class=\"clickable-row hidden\" id=\"" + uuid + "\">";
            toki = "normal";
        }

        if (producttypetag[record.producttype] === undefined) {
            producttypetag = "<td></td><td></td><td></td><td></td><td></td>";
        }

        ROW = (
            trtag + "<td>" + formatDate(writedate) + yoteilabel[toki] +
            statelabel + "<br />" + buttons + "</td>" +
            "<td>" + record.item + "</td>" +
            "<td>" + record.category + "</td>" +
            "<td>" + coloringPrice(record.price, record.producttype) + "</td>" +
            producttypetag[record.producttype] +
            "<td>" + record.memo + "</td>" +
            "</tr>"
        );
        return ROW;
    };


    Note.prototype.reloadRowData = function reloadRowData(startrow, endrow) {

        var caller = this;
        var sysDate = new Date();
        var recursiondepth = 0;


        this.status.ready.table = false;
        if (startrow === undefined) {
            $table.find("tr:gt(1)").remove();
        }
        (function writeDOM(startrow, endrow) {
            var starttime = new Date();
            var DOM = "";
            var row;
            for (
                row = startrow || caller.table.length - 1;
                row > 0;
                row = row - 1
            ) {
                if (new Date() - starttime > 1) {
                    setTimeout(writeDOM(row, endrow), 1);
                    recursiondepth = recursiondepth + 1;
                    break;
                }
                DOM = DOM + caller.getRow(caller.table[row], sysDate);
                if (row === endrow) {
                    break;
                }
            }
            $table.find("tr").eq(1).after(DOM);
            if (row === 0 || row === endrow) {
                caller.status.ready.table = true;
                caller.makeItemList();
            }
        }(startrow, endrow));
        debuglog("DOM recursion depth is " + recursiondepth);
    };

    Note.prototype.getList = function getList(record, sysDate) {
        var toki;
        var atag = "";
        var yoteilabel = {
            future: "<span class=\"label label-warning\">予定</span>",
            today: "<span class=\"label label-primary\">本日</span>",
            normal: ""
        };
        var producttypelabel = {
            consumer: "<span class=\"label label-info\">消費</span>",
            investment: "<span class=\"label label-warning\">投資</span>",
            waste: "<span class=\"label label-danger\">消費</span>",
            income: "<span class=\"label label-default\">収入</span>",
            savings: "<span class=\"label label-success\">貯蓄</span>"
        };
        var writedate = new Date(record.date);
        var uuid = record.uuid;
        var compareAns = compareDate(record.date, formatDate(sysDate));
        var ROW = "";

        if (compareAns > 0) {
            toki = "future";
        } else if (compareAns === 0) {
            toki = "today";
        } else {
            toki = "normal";
        }

        atag = (
            "<a class=\"light-list list-group-item " +
            " col-xs-12 col-sm-22 col-md-12 hidden\"" +
            " id=\"" + uuid + "\">"
        );

        ROW = (
            atag +
            "<h4 class=\"list-group-item-heading\">" +
            producttypelabel[record.producttype] +
            " " + record.item +
            " <small>" + record.category + "</small>" +
            "<div class=\"pull-right\">" +
            coloringPrice(record.price, record.producttype) +
            "</div></h4>" +
            "<p class=\"list-group-item-text\">" +
            "<span class=\"text-muted\">" + record.memo + "</span>" +
            "<span class=\"pull-right\">" + yoteilabel[toki] +
            formatDate(writedate) + "</span></p>"
        );
        return ROW;
    };

    Note.prototype.reloadListData = function reloadListData(startrow, endrow) {

        var caller = this;
        var sysDate = new Date();
        var recursiondepth = 0;

        this.status.ready.table = false;
        if (startrow === undefined) {
            $lightlist.html("<a></a>");
        }
        (function writeDOM(startrow, endrow) {
            var starttime = new Date();
            var DOM = "";
            var row;
            for (
                row = startrow || caller.table.length - 1;
                row > 0;
                row = row - 1
            ) {
                if (new Date() - starttime > 1) {
                    setTimeout(writeDOM(row, endrow), 1);
                    recursiondepth = recursiondepth + 1;
                    break;
                }
                DOM = DOM + caller.getList(caller.table[row], sysDate);
                if (row === endrow) {
                    break;
                }
            }
            $lightlist.children().first().before(DOM);
            if (row === 0 || row === endrow) {
                caller.status.ready.table = true;
                caller.makeItemList();
            }
        }(startrow, endrow));
        debuglog("DOM recursion depth is " + recursiondepth);
    };

    //limited row

    Note.prototype.reloadLimitedRow = function reloadLimitedRow() {

        var caller = this;

        setTimeout(function asyncCallbackLimitedRow() {
            if (caller.status.ready.table === true) {
                if (CONSOLE_DUMP_TIME) {
                    console.time("limited");
                }
                caller.resetLimitedRow();

                if (caller.status.limited.item) {
                    var item = $item.val();
                    caller.addLimited(function (row) {
                        return item === caller.table[row].item;
                    });
                }

                if (caller.status.limited.kikan) {
                    caller.addLimited(function (row) {
                        return caller.inKikan(
                            new Date(caller.table[row].date)
                        );
                    });
                }

                if (caller.status.limited.category) {
                    caller.addLimited(function (row) {
                        var category = $category.find("option:selected").text();
                        return category === caller.table[row].category;
                    });
                }

                if (caller.status.limited.producttype.income) {
                    caller.addLimited(function (row) {
                        return "income" === caller.table[row].roducttype;
                    });
                } else if (caller.status.limited.producttype.savings) {
                    caller.addLimited(function (row) {
                        return "savings" === caller.table[row].producttype;
                    });
                } else if (caller.status.limited.producttype.consumer) {
                    caller.addLimited(function (row) {
                        return "consumer" === caller.table[row].producttype;
                    });
                } else if (caller.status.limited.producttype.investment) {
                    caller.addLimited(function (row) {
                        return (
                            "investment" === caller.table[row].producttype
                        );
                    });
                } else if (caller.status.limited.producttype.waste) {
                    caller.addLimited(function (row) {
                        return "waste" === caller.table[row].producttype;
                    });
                }

                caller.applyLimitedRow2Table();

                if (CONSOLE_DUMP_TIME) {
                    console.timeEnd("limited");
                }
            } else {
                setTimeout(asyncCallbackLimitedRow, 50);
            }
        }, 0);
    };

    Note.prototype.resetLimitedRow = function resetLimitedRow() {
        this.limitedrows = [];
        var l = this.table.length;
        var row;
        for (row = 0; row < l; row = row + 1) {
            this.limitedrows.push(row);
        }
    };

    Note.prototype.addLimited = function addLimited(eqn) {
        var rows = [];
        var l = this.limitedrows.length;
        var i;
        var row;
        for (i = 0; i < l; i = i + 1) {
            row = this.limitedrows[i];
            if (eqn.call(null, row)) {
                rows.push(row);
            }
        }

        this.limitedrows = rows;
    };

    Note.prototype.applyLimitedRow2Table = function applyLimitedRow2Table() {
        var limitedrows = this.limitedrows;
        var table = this.table;
        var rowid;
        var l = table.length;
        var row;
        for (row = 0; row < l; row = row + 1) {
            rowid = $("#" + table[row].uuid);
            if (limitedrows.indexOf(row) >= 0) {
                if (rowid.hasClass("hidden")) {
                    rowid.removeClass("hidden");
                }
            } else {
                if (!rowid.hasClass("hidden")) {
                    rowid.addClass("hidden");
                }
            }
        }
    };

    //switch

    Note.prototype.switchKikan = function switchKikan(periodname) {
        if (CONSOLE_DUMP_TIME) {
            console.time("switchKikan");
        }
        this.setPeriod(periodname);
        this.reloadInfoView();
        this.reloadGraphTab();
        this.reloadLimitedRow();
        if (CONSOLE_DUMP_TIME) {
            console.timeEnd("switchKikan");
        }
    };

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

    //body eventlistener
    function offonEventBody() {
        if (NOTE === undefined) {
            return false;
        }
        if (kikancalender === undefined) {
            return false;
        }
        if (datepicker === undefined) {
            return false;
        }

        $(".checkbox-inline").off(
            "click"
        ).on("click", ".disabled", function () {
            return false;
        });

        $(".radio-inline").off("click").on("click", ".disabled", function () {
            return false;
        });

        //input form
        $item.off("change").on("change", function () {
            var item = String($item.val());
            var item2taxlist = TaxmanInstance.item2taxlist;

            if (item2taxlist.hasOwnProperty(item)) {
                $price2unit.text(item2taxlist[item].unit);
                $price2label.text(
                    item2taxlist[item].label
                ).removeClass("hidden");
                $inputformprice2.removeClass("hidden");
            } else {
                $inputformprice2.addClass("hidden");
                $price2label.addClass("hidden");
            }

            if (NOTE.status.limited.item) {
                NOTE.reloadLimitedRow();
            }
        });

        $category.off("change").on("change", function () {
            var optgroupid = $category.find(
                "option:selected"
            ).closest("optgroup").attr("id");

            if (optgroupid === "group-outgo") {
                $price.attr("min", "0");

                $radioincome.addClass("hidden");
                $radiosavings.addClass("hidden");

                $radioconsumer.removeClass("hidden").prop("checked", true);
                $radioinvestment.removeClass("hidden");
                $radiowaste.removeClass("hidden");

            } else if (optgroupid === "group-income") {
                $price.attr("min", "0");

                $radioincome.removeClass("hidden").prop("checked", true);
                $radiosavings.addClass("hidden");

                $radioconsumer.addClass("hidden");
                $radioinvestment.addClass("hidden");
                $radiowaste.addClass("hidden");

            } else if (optgroupid === "group-savings") {
                $price.removeAttr("min");

                $radioincome.addClass("hidden");
                $radiosavings.removeClass("hidden").prop("checked", true);

                $radioconsumer.addClass("hidden");
                $radioinvestment.addClass("hidden");
                $radiowaste.addClass("hidden");
            }

            if (NOTE.status.limited.category) {
                NOTE.reloadLimitedRow();
            }

        });


        $graphinfoyosoku.off("change").on("change", function () {
            if ($graphinfoyosoku[0].checked) {
                NOTE.status.show.leastsquare = true;
                NOTE.reloadGraphTab();
                $graphinfoimpose.addClass("disabled");
                $graphinfofft.addClass("disabled");
            } else {
                NOTE.status.show.leastsquare = false;
                NOTE.reloadGraphTab();
                $graphinfofft.removeClass("disabled");
                $graphinfoimpose.removeClass("disabled");
            }
        });

        $graphinfoimpose.off("change").on("change", function () {
            if ($graphinfoimpose[0].checked) {
                NOTE.status.show.impose = true;
                NOTE.reloadGraphTab();
                $graphinfoyosoku.addClass("disabled");
                $graphinfofft.addClass("disabled");
            } else {
                NOTE.status.show.impose = false;
                NOTE.reloadGraphTab();
                $graphinfofft.removeClass("disabled");
                $graphinfoyosoku.removeClass("disabled");
            }
        });

        $graphinfofft.off("change").on("change", function () {
            if ($graphinfofft[0].checked) {
                NOTE.status.show.fft = true;
                NOTE.reloadGraphTab();
                $graphinfoimpose.addClass("disabled");
                $graphinfoyosoku.addClass("disabled");
            } else {
                NOTE.status.show.fft = false;
                NOTE.reloadGraphTab();
                $graphinfoimpose.removeClass("disabled");
                $graphinfoyosoku.removeClass("disabled");
            }
        });

        $piechartinfostack.off("change").on("change", function () {
            if ($piechartinfostack[0].checked) {
                NOTE.status.show.stack = true;
                NOTE.reloadGraphTab();
            } else {
                NOTE.status.show.stack = false;
                NOTE.reloadGraphTab();
            }
        });

        //lightlist start
        $lightlisttoggle.off("change").on("change", function () {

            if ($lightlisttoggle[0].checked) {
                $table.addClass("hidden");
                $table.find("tr:gt(1)").remove();
                NOTE.reloadListData();
                offonEventLightList();
            } else {
                $table.removeClass("hidden");
                $lightlist.empty();
                NOTE.reloadRowData();
                refleshSelectedRows();
                offonEventTable();
            }
            NOTE.reloadLimitedRow();

        });

        //lightlist end


        // limited group start
        $limitedkikan.off("change").on("change", function () {
            if ($limitedkikan[0].checked) {
                NOTE.status.limited.kikan = true;
            } else {
                NOTE.status.limited.kikan = false;
            }
            NOTE.reloadLimitedRow();
        });

        $buttonitem.off("click").on("click", function () {
            if (NOTE.status.editing) {
                return false;
            }
            if (NOTE.status.limited.item) {
                NOTE.status.limited.item = false;
                $thitemicon.removeClass("glyphicon-lock");
            } else if ($item.val() !== "") {
                NOTE.status.limited.item = true;
                $thitemicon.addClass("glyphicon-lock");
            }
            NOTE.reloadLimitedRow();
            return false;
        });

        $buttoncategory.off("click").on("click", function () {
            if (NOTE.status.editing) {
                return false;
            }
            if (NOTE.status.limited.category) {
                NOTE.status.limited.category = false;
                $thcategoryicon.addClass(
                    "glyphicon-sort"
                ).removeClass("glyphicon-lock");
            } else {
                NOTE.status.limited.category = true;
                $thcategoryicon.addClass(
                    "glyphicon-lock"
                ).removeClass("glyphicon-sort");
            }

            NOTE.reloadLimitedRow();
            return false;
        });

        $buttonincome.off("click").on("click", function () {
            if (NOTE.status.editing) {
                return false;
            }
            toggleProducttypeButton("income");
            NOTE.reloadLimitedRow();
            return false;
        });

        $buttonsavings.off("click").on("click", function () {
            if (NOTE.status.editing) {
                return false;
            }
            toggleProducttypeButton("savings");
            NOTE.reloadLimitedRow();
            return false;
        });

        $buttonconsumer.off("click").on("click", function () {
            if (NOTE.status.editing) {
                return false;
            }
            toggleProducttypeButton("consumer");
            NOTE.reloadLimitedRow();
            return false;
        });

        $buttoninvestment.off("click").on("click", function () {
            if (NOTE.status.editing) {
                return false;
            }
            toggleProducttypeButton("investment");
            NOTE.reloadLimitedRow();
            return false;
        });

        $buttonwaste.off("click").on("click", function () {
            if (NOTE.status.editing) {
                return false;
            }
            toggleProducttypeButton("waste");
            NOTE.reloadLimitedRow();
            return false;
        });

        //keyboard controll
        $(document).off("keydown.command").on("keydown.command", function (e) {
            if (e.ctrlKey) {
                keys = "";
            }
            $(document).off("keypress.command").on(
                "keypress.command",
                function (e) {
                    keys = keys + String.fromCharCode(e.which);
                    fivemanCommand(keys);
                }
            );
        });

        $("#title-fa").off("click").on("click", function () {
            keys = "f";
            return false;
        });

        $("#title-i").off("click").on("click", function () {
            keys += "i";
            return false;
        });

        $("#title-bu").off("click").on("click", function () {
            keys += "ve";
            return false;
        });

        $("#title-ma").off("click").on("click", function () {
            keys += "ma";
            return false;
        });

        $("#title-n").off("click").on("click", function () {
            keys += "n";
            fivemanCommand(keys);
            return false;
        });

        $("#brand-time").off("click").on("click", function () {
            showNotify("info", "ファイブマン", "タイマー開始");
            setTimeout(function () {
                showNotify("info", "ファイブマン", "３分経過しました");
            }, 180 * 1000);
            return false;
        });


        $chartline.off("shown.bs.tab").on("shown.bs.tab", function () {
            NOTE.plotGraph();
            NOTE.chartline.render();
        });

        $chartpie.off("shown.bs.tab").on("shown.bs.tab", function () {
            NOTE.plotPieChart();
            NOTE.chartpie.render();
        });

        $joho.off("shown.bs.tab").on("shown.bs.tab", function () {
            reloadJohoTab();
        });

        //search


        $searchinput.off("focus").on("focus", function () {
            var sifter = new Sifter(NOTE.table);


            $searchinput.off("keypress").on("keypress", function (e) {
                if (e.which === 13) {
                    $buttonsearch.click();
                    return false;
                }
            });

            $buttonsearch.off("click").on("click", function () {
                var keyword = $searchinput.val();
                var searchword = keyword.replace(/　/g, " ");
                var limitedrows = [];
                var l;
                var result;
                var i = 0;

                if (keyword === "") {
                    NOTE.reloadLimitedRow();
                    showNotify("info", "検索終了", "通常の表示に戻しました");
                    $defaultview.addClass("hidden");
                    return false;
                }
                result = sifter.search(
                    searchword,
                    {
                        fields: [
                            "item",
                            "category",
                            "date",
                            "memo",
                            "price"
                        ],
                        sort: [
                            {
                                field: "item",
                                direction: "asc"
                            }
                        ],
                        limit: 100
                    }
                );
                l = result.items.length;
                showNotify(
                    "success",
                    "検索結果",
                    "キーワード:" + keyword + "に一致するデータ" + l + "件"
                );

                if (l === 0) {
                    return false;
                }
                $defaultview.removeClass("hidden");
                $defaultview.off("click").on("click", function () {
                    $searchinput.val("");
                    $buttonsearch.click();
                    $defaultview.addClass("hidden");
                });
                for (i = 0; i < l; i = i + 1) {
                    limitedrows.push(result.items[i].id);
                }

                NOTE.limitedrows = limitedrows;
                NOTE.applyLimitedRow2Table();
                $searchinput.val("");
                $htmlbody.animate(
                    {scrollTop: $table.offset().top - 90}
                );
            });
        });


        //buttuns

        $kinou.off("click").on("click", function () {
            datepicker.setDate(getDiffDate(-1));
            sendInputQueue();
            return false;
        });

        $kyou.off("click").on("click", function () {
            datepicker.setDate(new Date());
            sendInputQueue();
            return false;
        });

        $ashita.off("click").on("click", function () {
            datepicker.setDate(getDiffDate(1));
            sendInputQueue();
            return false;
        });

        $shitei.off("click").on("click", function () {
            sendInputQueue();
            return false;
        });

        $undo.off("click").on("click", function () {
            if ($undo.hasClass("disabled")) {
                return false;
            }
            socket.emit("undo", {text: "undo", userid: $userid.text()});
            showNotify(
                "success",
                "もとに戻す",
                "直前のキューの取り消しを送信しました"
            );
            $undo.addClass("disabled");
            return false;
        });


        $buttonprevious.off("click").on("click", function () {
            togglePeriodButton("");
            if (moveSelectedKikan(0, -1, 0) === false) {
                return false;
            }
            NOTE.switchKikan("free");
            return false;
        });
        $buttonnext.off("click").on("click", function () {
            togglePeriodButton("");
            if (moveSelectedKikan(0, 1, 0) === false) {
                return false;
            }
            NOTE.switchKikan("free");
            return false;
        });

        $buttonkongetsu.off("click").on("click", function () {
            togglePeriodButton("kongetsu");
            NOTE.switchKikan("kongetsu");
            return false;
        });

        $buttonraigetsu.off("click").on("click", function () {
            togglePeriodButton("raigetsu");
            NOTE.switchKikan("raigetsu");
            return false;
        });

        $buttonlastmonth.off("click").on("click", function () {
            togglePeriodButton("lastmonth");
            NOTE.switchKikan("lastmonth");
            return false;
        });

        $buttonlastweek.off("click").on("click", function () {
            togglePeriodButton("lastweek");
            NOTE.switchKikan("lastweek");
            return false;
        });

        $buttonfuture.off("click").on("click", function () {
            togglePeriodButton("future");
            NOTE.switchKikan("future");
            return false;
        });

        $buttonpast.off("click").on("click", function () {
            togglePeriodButton("past");
            NOTE.switchKikan("past");
            return false;
        });

        $buttonall.off("click").on("click", function () {
            NOTE.switchKikan("all");
            return false;
        });

        //for smartphone form
        $modal_item.off("change").on("change", function () {
            if ($modal_item.text() !== "") {
                $item.val($modal_item.val()).change();
                if (!($inputformprice2.hasClass("hidden"))) {
                    $modal_inputformprice2.removeClass("hidden");
                    $modal_price2label.text($price2label.text());
                    $modal_price2unit.text($price2unit.text());
                } else {
                    $modal_inputformprice2.addClass("hidden");
                }
            }
        });

        $modal_submit.off("click").on("click", function () {
            $item.val($modal_item.val());
            $price.val($modal_price.val());
            $memo.val($modal_memo.val());
            var date = $modal_date.val();
            if (date !== "") {
                datepicker.setDate(date);
            }
            if (querycheck() === true) {
                $shitei.click();
                $("body").removeClass("modal-open");
                $(".modal-backdrop").remove();
                $modalinput.modal("hide");
            }
        });


        $modalinput.off("show.bs.modal").on("show.bs.modal", function () {
            if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                $(".modal").css({
                    "position": "absolute",
                    "marginTop": $(window).scrollTop() + "px",
                    "bottom": "auto",
                    "width": "95%"
                });
            } else {
                flatpickr($modal_date[0], {
                    mode: "multiple",
                    defaultDate: new Date(),
                    dateFormat: "Y/m/d",
                    "locale": "ja"
                });
            }

            $modal_item.devbridgeAutocomplete({
                lookup: NOTE.itemlist,
                groupBy: "category",
                width: "flex",
                autoSelectFirst: true,
                onSelect: function (suggestion) {
                    var queue = $.extend(
                        true,
                        {},
                        NOTE.table[NOTE.uuid2row[suggestion.data.uuid]]
                    );
                    delete queue.date;
                    setQueueToModal(queue);
                }
            });
        });

        //wizard

        $wizard.off("show.bs.modal").on("show.bs.modal", function () {

            if (CONSOLE_DUMP_TIME) {
                console.time("wizard");
            }
            //initialize
            var _STEPTITLE = [
                "STEP1 - 品名の入力",
                "STEP2 - 支出タイプの選択",
                "STEP3 - 金額の入力",
                "STEP4 - 日付の入力",
                "STEP5 - 送信内容確認"
            ];
            var wizardsifter = new Sifter(NOTE.table);
            setTimeout(function () {
                if ($wizarddatepicker.hasClass("flatpickr-input") === false) {
                    wizarddatepicker = flatpickr($wizarddatepicker[0], {
                        mode: "multiple",
                        defaultDate: new Date(),
                        dateFormat: "Y/m/d",
                        "locale": "ja",
                        inline: true
                    });
                }
            }, 0);

            function reloadProducttypeSelect() {
                var category = $wizardcategorypills.find(".active").text();
                var selectedcategory = $category.find(
                    "option"
                ).filter(function () {
                    return $(this).text() === category;
                }).prop("selected", true).change();
                var optgroupid = selectedcategory.closest(
                    "optgroup"
                ).attr("id");

                if (optgroupid === "group-outgo") {
                    $smartwizard.smartWizard("stepState", [1], "enable");
                } else {
                    $smartwizard.smartWizard("stepState", [1], "disable");
                }
            }

            function loadConfirm() {
                var producttype = $("[name=producttype]:checked").val();
                var buttonclass = "";
                var buttontext = "";
                var producttypetag = "";

                switch (producttype) {
                case "consumer":
                    buttonclass = "btn-info";
                    buttontext = "消費";
                    break;
                case "investment":
                    buttonclass = "btn-warning";
                    buttontext = "投資";
                    break;
                case "waste":
                    buttonclass = "btn-danger";
                    buttontext = "浪費";
                    break;
                case "income":
                    buttonclass = "btn-default";
                    buttontext = "収入";
                    break;
                case "savings":
                    buttonclass = "btn-success";
                    buttontext = "貯蓄";
                    break;
                default:
                    buttonclass = "btn-default";
                }
                producttypetag = (
                    "<button class=\"btn " + buttonclass +
                    "\" type=\"button\" >" + buttontext + "</button>"
                );

                $("#wizardconfirmitem").text($item.val());
                $("#wizardconfirmprice").text($price.val());
                $("#wizardconfirmcategory").text(
                    $category.find("option:selected").text()
                );
                $("#wizardconfirmproducttype").html(producttypetag);
                $("#wizardconfirmdate").text($datepicker.val());
            }

            function reloadWizardItemButtons() {

                function offonWizardItemButtonEvent(selector) {
                    $(selector).off("click").on("click", function () {
                        $item.val($(this).text());
                        reloadProducttypeSelect();
                        $smartwizard.smartWizard("next");
                    });
                }

                var buttontagstate = {};
                var category2items = {};
                var itemlist = NOTE.itemlist;
                var l = itemlist.length;
                var i;
                var limitofitem = 9;
                var category = "";
                var litag = "";
                var tabtag = "";
                var ll = $category[0].length;

                function makeButtonGroupTag(category, start, end) {
                    var buttontag = "";
                    var buttongrouptag = "";
                    var items = category2items[category];
                    var itemslength = items.length;
                    var startindex = start || 0;
                    var endindex = end || start + limitofitem;
                    var j;

                    for (j = startindex; j < itemslength; j = j + 1) {
                        buttontag = (
                            buttontag +
                            "<a type=\"button\"" +
                            " class=\"btn btn-default wizard-item-button\"" +
                            " value=\"" + items[j] + " \">" + items[j] + "</a>"
                        );

                        if (
                            j % 3 === 0
                            || j === endindex
                            || j === itemslength - 1
                        ) {
                            buttongrouptag = (
                                buttongrouptag +
                                "<div class=\"btn-group" +
                                " btn-group-justified btn-group-lg\">" +
                                buttontag + "</div>"
                            );
                            buttontag = "";
                        }

                        if (j === endindex) {
                            break;
                        }
                    }
                    /*displayed button tag state update*/
                    buttontagstate[category] = {
                        start: startindex,
                        end: endindex,
                        length: itemslength
                    };

                    return buttongrouptag;
                }

                for (i = 0; i < l; i = i + 1) {
                    if (
                        category2items[itemlist[i].data.category] === undefined
                    ) {
                        category2items[itemlist[i].data.category] = [];
                    }
                    category2items[itemlist[i].data.category].push(
                        itemlist[i].value
                    );
                }

                for (i = 0; i < ll; i = i + 1) {
                    category = $category[0][i].value;
                    litag = (
                        litag + "<li><a data-toggle=\"pill\" href=\"" +
                        "#wizardcategory" + i + "\">" + category +
                        "</a></li>"
                    );

                    tabtag = (
                        tabtag +
                        "<div id=\"" + "wizardcategory" + i + "\"" +
                        " class=\"tab-pane fade\">" +
                        makeButtonGroupTag(category, 0, limitofitem) +
                        "</div>"
                    );
                }

                $wizardcategorypills.html(litag);
                $wizardcategorytabs.html(tabtag);

                offonWizardItemButtonEvent(".wizard-item-button");

                $wizardnewitemtabopen.off("click").on("click", function () {
                    $wizardnewitemaddon.text(
                        $wizardcategorypills.find(".active").text()
                    );
                    $wizardcategorypills.addClass("hidden");
                    $wizardnewitemtab.removeClass("hidden");
                    $wizardcategorytabs.addClass("hidden");
                    $wizardnewitemtabclose.removeClass("hidden");
                    $wizarditemprevious.addClass("hidden");
                    $wizarditemnext.addClass("hidden");
                    $wizardcategorypage.addClass("hidden");
                    $(this).addClass("hidden");
                });

                $wizardnewitemtabclose.off("click").on("click", function () {
                    $wizardnewitemtabopen.removeClass("hidden");
                    $wizardcategorypills.removeClass("hidden");
                    $wizardnewitemtab.addClass("hidden");
                    $wizardcategorytabs.removeClass("hidden");
                    $wizardnewitemtabclose.addClass("hidden");
                    $wizarditemprevious.removeClass("hidden");
                    $wizarditemnext.removeClass("hidden");
                    $wizardcategorypage.removeClass("hidden");
                    $(this).addClass("hidden");
                });
                $wizardnewitemtabclose.click();

                $wizardcategorypills.find(
                    "a"
                ).off("shown.bs.tab").on("shown.bs.tab", function () {
                    var categoryname = $(this).text();
                    var start = buttontagstate[categoryname].start;
                    var length = buttontagstate[categoryname].length;
                    var pagenumber = Math.ceil((start + 1) / limitofitem);
                    var pagetotal = Math.ceil(length / limitofitem);
                    $wizardcategorypagenumber.text(pagenumber);
                    $wizardcategorypagetotal.text(pagetotal);
                    if (pagenumber === 1) {
                        $wizarditemprevious.addClass("disabled");
                    } else {
                        $wizarditemprevious.removeClass("disabled");
                    }
                    if (pagenumber === pagetotal) {
                        $wizarditemnext.addClass("disabled");
                    } else {
                        $wizarditemnext.removeClass("disabled");
                    }
                });
                $wizardcategorypills.find("a").first().tab("show");

                $wizarditemprevious.off("click").on("click", function () {
                    var categoryname = $wizardcategorypills.find(
                        ".active"
                    ).text();
                    var start = buttontagstate[categoryname].start;
                    var end = buttontagstate[categoryname].end;
                    var pagenumber = Math.ceil((start + 1) / limitofitem);

                    $wizardcategorypagenumber.text(pagenumber - 1);
                    if (pagenumber === 1) {
                        return false;
                    }
                    if (pagenumber - 1 === 1) {
                        $(this).addClass("disabled");
                    }
                    $wizarditemnext.removeClass("disabled");
                    $wizardcategorytabs.find(
                        ".active"
                    ).html(
                        makeButtonGroupTag(
                            categoryname,
                            start - limitofitem,
                            end - limitofitem
                        )
                    );
                    offonWizardItemButtonEvent(".wizard-item-button");

                });

                $wizarditemnext.off("click").on("click", function () {
                    var categoryname = $wizardcategorypills.find(
                        ".active"
                    ).text();
                    var start = buttontagstate[categoryname].start;
                    var end = buttontagstate[categoryname].end;
                    var length = buttontagstate[categoryname].length;
                    var pagenumber = Math.ceil((start + 1) / limitofitem);
                    var pagetotal = Math.ceil(length / limitofitem);
                    $wizardcategorypagenumber.text(pagenumber + 1);
                    if (pagenumber === pagetotal) {
                        return false;
                    }
                    if (pagenumber + 1 === pagetotal) {
                        $(this).addClass("disabled");
                    }
                    $wizarditemprevious.removeClass("disabled");

                    $wizardcategorytabs.find(".active").html(
                        makeButtonGroupTag(
                            categoryname,
                            start + limitofitem,
                            end + limitofitem
                        )
                    );
                    offonWizardItemButtonEvent(".wizard-item-button");
                });

                $wizardnewitem.off("keyup").on("keyup", function () {
                    var searchword = $(this).val();
                    var result;
                    var items = [];
                    var rl;
                    var k;
                    var filtereditems;
                    var previous;
                    var exactmatch = false;
                    var buttontag = "";
                    var item;
                    var fil;

                    if (searchword === "") {
                        $wizardnewitembuttons.html("");
                        $wizardnewitemnext.addClass("hidden");
                        return false;
                    }
                    result = wizardsifter.search(searchword, {
                        fields: ["item"],
                        sort: [{field: "item", direction: "desc"}],
                        limit: 10
                    });
                    items = [];
                    rl = result.items.length;
                    if (rl === 0) {
                        $wizardnewitembuttons.html("");
                        $wizardnewitemnext.removeClass("hidden");
                        return false;
                    }
                    for (k = 0; k < rl; k = k + 1) {
                        items.push(NOTE.table[result.items[k].id].item);
                    }
                    filtereditems = items.filter(function (item) {
                        var res = item !== previous;
                        previous = item;
                        return res;
                    });

                    fil = filtereditems.length;
                    for (k = 0; k < fil; k = k + 1) {
                        item = filtereditems[k];
                        if (searchword === item) {
                            exactmatch = true;
                        }
                        buttontag = (
                            buttontag +
                            "<a type=\"button\"" +
                            " class=\"btn btn-default btn-lg" +
                            " wizard-newitem-button\"" +
                            " value=\"" + item + "\">" +
                            item + "</a>"
                        );
                    }

                    $wizardnewitembuttons.html(buttontag);
                    offonWizardItemButtonEvent(".wizard-newitem-button");
                    if (exactmatch) {
                        $wizardnewitemnext.addClass("hidden");
                    } else {
                        $wizardnewitemnext.removeClass("hidden");
                    }

                });

            }

            function reloadWizardPriceButtons() {
                var searchword = $item.val();
                var result = wizardsifter.search(
                    searchword,
                    {
                        fields: ["item"],
                        sort: [{field: "sysdate", direction: "desc"}],
                        limit: 10
                    }
                );
                var prices = [];
                var l = result.items.length;
                var i = 0;
                var previous;
                var filteredprices;
                var buttontag = "";
                var price;
                var fpl;

                for (i = 0; i < l; i = i + 1) {
                    prices.push(
                        Number(NOTE.table[result.items[i].id].price)
                    );
                }

                filteredprices = prices.sort(function (a, b) {
                    return (
                        parseInt(a, 10) > parseInt(b, 10)
                        ? 1
                        : -1
                    );
                }).filter(function (item) {
                    var res = (item !== previous);
                    previous = item;
                    return res;
                });

                fpl = filteredprices.length;
                for (i = 0; i < fpl; i = i + 1) {
                    price = filteredprices[i];
                    buttontag = (
                        buttontag +
                        "<a type=\"button\" " +
                        "class=\"btn btn-default btn-lg wizard-price-button\"" +
                        " value=\"" + price + "\">" + price + "円" + "</a>"
                    );
                }

                $wizardpricebuttons.html(buttontag);
                $(".wizard-price-button").off("click").on("click", function () {
                    var item = $item.val();
                    var priceselect = Number($(this).attr("value"));
                    var res = wizardsifter.search(
                        item + " " + priceselect,
                        {
                            fields: ["item", "price"],
                            sort: [{field: "sysdate", direction: "desc"}],
                            conjunction: "and",
                            limit: 1
                        }
                    );

                    if (res.items.length === 1) {
                        if (item === NOTE.table[res.items[0].id].item) {
                            $("#wizardmemo").val(
                                NOTE.table[res.items[0].id].memo
                            );
                            $("#wizardmemo").off(
                                "focus"
                            ).on("focus", function () {
                                $(this).val("");
                            });
                        }
                    }
                    $wizardprice.val(priceselect);
                    $wizardpricenext.click();

                });
            }

            function reloadWizardPrice2() {
                $item.devbridgeAutocomplete("disable");
                $item.change();
                if ($("#inputformprice2").hasClass("hidden")) {
                    $("#wizardinputformprice2").addClass("hidden");
                    return false;
                }
                $("#wizardprice2unit").text($price2unit.text());
                $("#wizardprice2label").text($price2label.text());
                $("#wizardinputformprice2").removeClass("hidden");
                $item.devbridgeAutocomplete("enable");
            }


            $smartwizard.on("beginReset", function () {

                reloadWizardItemButtons();

                $wizardnewitemnext.off("click").on("click", function () {
                    var item = $wizardnewitem.val();
                    $item.val(item);
                    reloadProducttypeSelect();
                    $smartwizard.smartWizard("next");
                });

                $(".wizard-producttype-button").off(
                    "click"
                ).on("click", function () {
                    var producttype = $(this).attr("rel");
                    $("[name=producttype]").filter(function () {
                        return $(this).val() === producttype;
                    }).prop("checked", true);
                    $smartwizard.smartWizard("next");
                });

                $wizardprice.off("keyup").on("keyup", function () {
                    var price = $wizardprice.val();
                    $price.val(price);
                    if (querycheck() === true) {
                        $wizardpricenext.removeClass("hidden");
                    } else {
                        $wizardpricenext.addClass("hidden");
                    }
                });

                $("#wizardprice2").off("keyup").on("keyup", function () {
                    var price2 = $("#wizardprice2").val();
                    $price2.val(price2);
                    if (querycheck() === true) {
                        $wizardpricenext.removeClass("hidden");
                    } else {
                        $wizardpricenext.addClass("hidden");
                    }
                });

                $wizardpricenext.off("click").on("click", function () {
                    var price = $wizardprice.val();
                    $price.val(price);
                    if (querycheck() === true) {
                        $smartwizard.smartWizard("next");
                    }
                });

                $wizardkinou.off("click").on("click", function () {
                    datepicker.setDate(getDiffDate(-1));
                    $smartwizard.smartWizard("next");
                });

                $wizardkyou.off("click").on("click", function () {
                    datepicker.setDate(new Date());
                    $smartwizard.smartWizard("next");
                });

                $wizardshitei.off("click").on("click", function () {
                    if (wizarddatepicker.selectedDates.length !== 0) {
                        datepicker.setDate(wizarddatepicker.selectedDates);
                        $smartwizard.smartWizard("next");
                    }
                });

                $wizardcalendar.collapse("hide");

                $wizardmemo.val("");

                $wizardsubmit.off("click").on("click", function () {
                    $memo.val($wizardmemo.val());
                    if (querycheck() === true) {
                        setTimeout(function () {
                            $shitei.click();
                        }, 0);
                        $("body").removeClass("modal-open");
                        $(".modal-backdrop").remove();
                        $wizard.modal("hide");
                    }
                });

                $wizardrestart.off("click").on("click", function () {
                    $smartwizard.smartWizard("reset");
                    wizarddatepicker.setDate(new Date());
                });
                return true;
            });

            $smartwizard.on("showStep", function (
                e,
                anchorObject,
                stepNumber,
                stepDirection,
                stepPosition
            ) {

                $wizardsteptitle.text(
                    _STEPTITLE[stepNumber] || "unknown step number"
                );
                switch (stepNumber) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    reloadWizardPriceButtons();
                    reloadWizardPrice2();
                    break;
                case 3:
                    break;
                case 4:
                    loadConfirm();
                    break;
                default:
                    /* unknown stepNumber */
                    console.table(
                        e,
                        anchorObject,
                        stepNumber,
                        stepDirection,
                        stepPosition
                    );
                }

            });

            //smartwizard reset
            $smartwizard.smartWizard("reset");

            if (CONSOLE_DUMP_TIME) {
                console.timeEnd("wizard");
            }

        });


        //chat
        $send.off("click").on("click", function () {
            var msg = $msg.val();
            var userid = $userid.text();
            if (!msg) {
                showNotify("notice", "送信エラー", "メッセージを入力してください");
                return;
            }
            socket.emit("msg", {text: msg, userid: userid});
            $msg.val("");
            return false;
        });

    }


    function recievedNote(note, fastforward) {
        var sysDate = new Date();
        var selectperiod = "kongetsu";
        var tablebegindate = new Date();
        var tableenddate = new Date();
        var enableenddate = new Date(
            sysDate.getTime() + 60 * 24 * 60 * 60 * 1000
        );


        // initialize
        if (NOTE !== undefined) {
            selectperiod = NOTE.periodname;
        }

        if (CONSOLE_DUMP_TIME) {
            console.time("newNote");
        }
        if (fastforward !== true) {
            NOTE = new Note(note);
        } else {
            NOTE.renewTable(note.table);
        }
        if (CONSOLE_DUMP_TIME) {
            console.timeEnd("newNote");
        }

        if (note.table.length > 0) {
            tablebegindate = new Date(note.table[0].date);
            tableenddate = new Date(note.table[note.table.length - 1].date);
            togglePeriodButton(selectperiod);
            NOTE.switchKikan(selectperiod);
        } else {
            setTimeout( function() {
                showNotify(
                    "notice",
                    "新規のノート",
                    "初期品目を登録をしてください"
                );
                setQueue(__initial_queue);
            }, 0);
        }

        // table aync load
        setTimeout(function () {
            if (CONSOLE_DUMP_TIME) {
                console.time("row");
            }
            if ($lightlisttoggle[0].checked) {
                $table.addClass("hidden");
                if (fastforward !== true) {
                    NOTE.reloadListData();
                } else {
                    NOTE.status.ready.table = true;
                    NOTE.makeItemList();
                }
                offonEventLightList();
            } else {
                if (fastforward !== true) {
                    NOTE.reloadRowData();
                } else {
                    NOTE.status.ready.table = true;
                    NOTE.makeItemList();
                }
                refleshSelectedRows();
                offonEventTable();
            }
            if (CONSOLE_DUMP_TIME) {
                console.timeEnd("row");
            }
        }, 0);

        // unlock button
        $buttonkongetsu.removeClass("disabled");
        $buttonraigetsu.removeClass("disabled");
        $buttonlastweek.removeClass("disabled");
        $buttonlastmonth.removeClass("disabled");
        $buttonfuture.removeClass("disabled");
        $buttonpast.removeClass("disabled");

        kikancalender.set("disable", [
            function (date) {
                if (date < tablebegindate) {
                    return true;
                }
                if (date > enableenddate && date > tableenddate) {
                    return true;
                }
                return false;
            }
        ]);
        setTimeout(function () {
            if (supports_html5_storage === true) {
                localStorage.setItem("note", JSON.stringify(note));
            }
        }, 0);
        return true;
    }

    function checkDeltaOperation(delta) {
        var moverows = {};
        var success_flag = true;
        console.table(delta);

        // delete and move
        Object.keys(delta).filter(function (deltaitem) {
            return (
                deltaitem.slice(0, 1) === "_"
                && deltaitem !== "_t"
            );
        }).forEach(function (deltaitem) {
            var row = deltaitem.slice(1, deltaitem.length);

            if (delta[deltaitem][2] === 0 && delta[deltaitem][1] === 0) {
                // delete
                $("#" + NOTE.table[row].uuid).remove();
            } else if (
                delta[deltaitem][1] !== undefined
                && NOTE.table[row] !== undefined
                && delta[deltaitem][2] === 3
            ) {
                // move
                moverows[row] = delta[deltaitem][1];
                success_flag = false;
            } else {
                // unknown
                showNotify(
                    "error",
                    "差分更新",
                    "不明な操作があるため高速更新を中止しました"
                );
                return false;
            }
        });

        // append, edit
        Object.keys(delta).filter(function (deltaitem) {
            return deltaitem.slice(0, 1) !== "_";
        }).forEach(function (deltaitem) {
            var row = parseInt(deltaitem, 10);
            if (delta[deltaitem][1] !== undefined) {
                // edit
                if (row > 0 && NOTE.table[row - 1] !== undefined) {
                    $("#" + NOTE.table[row].uuid).remove();
                    if ($lightlisttoggle[0].checked) {
                        $("#" + NOTE.table[row - 1].uuid).before(
                            NOTE.getList(delta[deltaitem][1], new Date())
                        );
                    } else {
                        $("#" + NOTE.table[row - 1].uuid).before(
                            NOTE.getRow(delta[deltaitem][1], new Date())
                        );
                    }
                } else {
                    success_flag = false;
                }

            } else if (delta[deltaitem][0] !== undefined) {
                // add
                if (row > 0 && NOTE.table[row - 1] !== undefined) {
                    if ($lightlisttoggle[0].checked) {
                        $("#" + NOTE.table[row - 1].uuid).before(
                            NOTE.getList(delta[deltaitem][0], new Date())
                        );
                    } else {
                        $("#" + NOTE.table[row - 1].uuid).before(
                            NOTE.getRow(delta[deltaitem][0], new Date())
                        );
                    }
                } else {
                    success_flag = false;
                }

            } else if (moverows[deltaitem] !== undefined) {
                showNotify(
                    "error",
                    "差分更新",
                    "デバッグが必要な操作 " + deltaitem
                );
                success_flag = false;
            } else if (
                delta[deltaitem].sysdate !== undefined
                && NOTE.table[deltaitem] !== undefined
            ) {
                // part edit
                showNotify(
                    "error",
                    "差分更新",
                    "デバッグ中、一部編集 更新中断"
                );
                success_flag = false;
            } else {
                // unkwown
                showNotify(
                    "error",
                    "差分更新",
                    "不明な操作があるため高速更新を中止しました"
                );
                success_flag = false;
            }
        });

        if (success_flag === false) {
            return false;
        }

        return true;
    }

    function recievedDelta(hashdeltas) {
        var str = JSON.stringify(NOTE.table);
        var table = JSON.parse(str);
        var hash = XXH.h32(str, 0x0005).toString(16);
        var l = hashdeltas.length;
        var i = 0;
        var note = {};
        var fastforward = true;

        for (i = 0; i < l; i = i + 1) {
            if (i !== 0) {
                str = JSON.stringify(table);
                table = JSON.parse(str);
                hash = XXH.h32(str, 0x0005).toString(16);
            }
            if (hash === hashdeltas[i].hash) {
                // for delta reload test
                if (checkDeltaOperation(hashdeltas[i].delta) === false) {
                    fastforward = false;
                }

                jsondiffpatch.patch(table, hashdeltas[i].delta);
            } else {
                debuglog(
                    "hash conflicts. local:" + hash +
                    " remote:" + hashdeltas[i].hash
                );
                socket.emit("hash", hash);
                return false;
            }
        }

        note = {
            cover: NOTE.cover,
            table: table
        };

        if (table.length < 3) {
            fastforward = false;
        }

        recievedNote(note, fastforward);

        showNotify(
            "success",
            (
                fastforward === true
                ? "ノートの更新（高速）"
                : "ノートの更新"
            ),
            l + "件の差分データを更新しました"
        );
        return true;
    }

    if (CONSOLE_DUMP_TIME) {
        console.timeEnd("scriptload");
    }
    ////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////
    ///calender instancies
    kikancalender = flatpickr($kikan[0], {
        mode: "range",
        dateFormat: "Y/m/d",
        "locale": "ja",
        onClose: function () {
            if (NOTE !== undefined) {
                NOTE.switchKikan("free");
            }
        }
    });
    datepicker = flatpickr($datepicker[0], {
        mode: "multiple",
        defaultDate: new Date(),
        dateFormat: "Y/m/d",
        "locale": "ja"
    });

    //wizard
    $smartwizard.smartWizard({
        //theme: "arrows",
        keyNavigation: false,
        lang: {
            next: "次へ",
            previous: "戻る"
        },
        toolbarSettings: {
            toolbarPosition: "none",
            showNextButton: false,
            showPreviousButton: false
        }
    });

    ////////////////////////////////////////////////////////////////////////////
    //Main loop functions begin at this line
    ////////////////////////////////////////////////////////////////////////////

    /*localStorage supports*/
    supports_html5_storage = (function () {
        var test = "test";
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }());

    //Browser width detection
    if ($(window).width() < 767) {
        $lightlisttoggle[0].checked = true;
    }

    //JSON Loader (AJAX)
    function requestNoteByAjax(cache) {
        if (CONSOLE_DUMP_TIME) {
            console.time("ajax");
        }
        $.ajax({
            url: "./../book/note.json",
            cache: cache || true,
            dataType: "json"
        }).done(function (note) {
            recievedNote(note);
            if (offonEventBody() === false) {
                debuglog(
                    "Error: Instance of datepicker and NOTE are not ready"
                );
            }
            setTimeout(function () {
                var hash = (
                    XXH.h32(JSON.stringify(note.table), 0x0005).toString(16)
                );
                if (socket !== undefined) {
                    socket.emit("hash", hash);
                }
            }, 500);
            if (CONSOLE_DUMP_TIME) {
                console.timeEnd("ajax");
            }
        }).fail(function (jqXHR) {
            debuglog("AjaxError：" + jqXHR.status + ", note.json not found.");
        });
    }

    //JSON Loader (localStorage)
    function requestNoteBylocalStorage() {
        var notestring = localStorage.getItem("note");
        var note;
        var hash;
        if (notestring === null) {
            requestNoteByAjax();
        } else {
            if (CONSOLE_DUMP_TIME) {
                console.time("localStorage");
            }
            note = JSON.parse(notestring);
            recievedNote(note);
            if (offonEventBody() === false) {
                debuglog(
                    "Error: Instance of datepicker and NOTE are not ready"
                );
            }
            hash = XXH.h32(JSON.stringify(note.table), 0x0005).toString(16);
            socket.emit("hash", hash);
            if (CONSOLE_DUMP_TIME) {
                console.timeEnd("localStorage");
            }
        }
        return true;
    }

    if (supports_html5_storage === true && REALTIME_UPDATE === true) {
        setTimeout(requestNoteBylocalStorage, 0);
    } else {
        setTimeout(requestNoteByAjax, 0);
    }

    console.timeEnd("html");

    if (REALTIME_UPDATE) {

        port = SERVERPORT || location.port;
        socket = io.connect(
            "//" + location.hostname + ":" + port + "/",
            socketopts
        );

        socket.on("connect", function () {

            $connectionstatus.attr(
                "data-content",
                "接続"
            ).find(
                ".visible-xs-inline"
            ).text("接続");

            $connectionstatusicon.removeClass(
                "glyphicon-hdd"
            ).addClass("glyphicon-signal");

            $retrynumber.addClass("hidden");
            var messagenumber = 0;

            loadCommand();

            socket.off("info");
            socket.on("info", function (data) {
                writelog(data.text);
                $userid.text(data.userid);
                resetPencilLabel();
            });

            socket.off("note");
            socket.on("note", function (data) {
                recievedNote(data);
                showNotify(
                    "success",
                    "ノートの更新",
                    "全件のデータを更新しました"
                );
            });

            socket.off("delta");
            socket.on("delta", function (data) {
                recievedDelta(data);
            });

            socket.off("chatlog");
            socket.on("chatlog", function (data) {
                writechatlog(data);
            });

            socket.off("reload");
            socket.on("reload", function () {
                location.reload();
            });

            socket.off("msg");
            socket.on("msg", function (data) {
                if (data.userid !== "Server") {
                    messagenumber = messagenumber + 1;
                    showNotify("notice", "メッセージ", data.text);
                    $("#messagenumber").removeClass(
                        "hidden"
                    ).text(messagenumber);

                }
                $("#chatstatus").attr(
                    "data-content",
                    data.text
                ).find(".visible-xs-inline").text(data.text);
                writelog(data.text);
            });

        });

        //socket connection events
        socket.on("connect_error", function (err) {
            writelog("接続エラー -> " + err.message);
            $connectionstatus.attr("data-content", "接続エラー").find(
                ".visible-xs-inline"
            ).text("接続エラー");

            $connectionstatusicon.removeClass(
                "glyphicon-signal"
            ).addClass("glyphicon-repeat");
        });

        socket.on("connect_timeout", function (obj) {
            writelog("接続タイムアウト -> " + obj.message);
            $connectionstatus.attr("data-content", "接続タイムアウト").find(
                ".visible-xs-inline"
            ).text("接続タイムアウト");

            $connectionstatusicon.removeClass(
                "glyphicon-signal"
            ).addClass("glyphicon-repeat");
        });

        socket.on("reconnect", function (num) {
            $connectionstatusicon.removeClass("glyphicon-repeat");
            setTimeout(function emitHashonReconect() {
                var hash = (
                    XXH.h32(JSON.stringify(NOTE.table), 0x0005).toString(16)
                );
                socket.emit("hash", hash);
            }, 500);
            writelog("再接続完了 " + num);
        });

        socket.on("reconnect_attempt", function () {
            writelog("再接続試行開始");
            $connectionstatus.attr("data-content", "再接続試行開始").find(
                ".visible-xs-inline"
            ).text("再接続試行開始");

            $connectionstatusicon.removeClass(
                "glyphicon-signal"
            ).addClass("glyphicon-repeat");
        });

        socket.on("reconnecting", function (num) {
            writelog("再接続中... " + num);
            $retrynumber.removeClass("hidden").text(num);
            $connectionstatus.attr("data-content", "再接続中...").find(
                ".visible-xs-inline"
            ).text("再接続中...");

            $connectionstatusicon.removeClass(
                "glyphicon-signal"
            ).addClass("glyphicon-repeat");
        });

        socket.on("reconnect_error", function (err) {
            writelog("再接続エラー " + err.message);
            $connectionstatus.attr("data-content", "再接続エラー").find(
                ".visible-xs-inline"
            ).text("再接続エラー");

            $connectionstatusicon.removeClass(
                "glyphicon-signal"
            ).addClass("glyphicon-repeat");
        });

        socket.on("reconnect_failed", function (obj) {
            writelog("再接続タイムアウト -> " + obj.message);
            $connectionstatus.attr("data-content", "再接続タイムアウト").find(
                ".visible-xs-inline"
            ).text("再接続タイムアウト");

            $connectionstatusicon.removeClass(
                "glyphicon-signal"
            ).addClass("glyphicon-repeat");
        });
        // socket.io.engine.on("heartbeat", function () {
        //     /*heart beat*/
        // });
    }

}));

/* 2024 */