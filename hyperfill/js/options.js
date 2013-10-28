var btnView;
var btnChangePasswd;
var btnViewHide;
var btnSubmit;
var divView;
var divChangePasswd;
var divViewTable;
var textOldPasswd;
var textNewPasswd;
var textNewPasswd2;
var divChangePasswdTable;
var divChangePasswdResult;
var btnBack;
var divResult;
var spanResultIcon;
var spanResultText;
var divLoading;
var tableView;
var spanRecordNum;
var spanDelete;
var spanSelectAll;
var spanSelectInverse;
var spanDeleting;
var spanUsername;
var aes_key="";
var aes_server_iv = "";
var aes_server_key = "";

var curUsername;
var username = -1;

var urlbase = "http://hyperfill.duapp.com/";


function getObjByID(id) {
    return document.getElementById(id);
}

function getDomObject(){
    btnView = getObjByID("viewbtn");
    btnChangePasswd = getObjByID("changepasswdbtn");
    btnViewHide = getObjByID("vieworhide");
    btnSubmit = getObjByID("submitbutton");
    divView = getObjByID("viewcontent");
    divChangePasswd = getObjByID("changepasswdcontent");
    divViewTable = getObjByID("tablediv");
    textOldPasswd = getObjByID("oldpasswd");
    textNewPasswd = getObjByID("newpasswd");
    textNewPasswd2 = getObjByID("newpasswd2");
    divChangePasswdTable = getObjByID("changepasswdmain");
    divChangePasswdResult = getObjByID("changepasswdresult");
    btnBack = getObjByID("backbtn");
    divResult = getObjByID("result");
    spanResultIcon = getObjByID("resulticon");
    spanResultText = getObjByID("resulttext");
    divLoading = getObjByID("waitforloading");
    tableView = getObjByID("viewtable");
    spanRecordNum = getObjByID("recordnum");
    spanDelete = getObjByID("delete");
    spanSelectAll = getObjByID("selectall");
    spanSelectInverse = getObjByID("selectinverse");
    spanDeleting = getObjByID("deleting");
    spanUsername = getObjByID("username");
}


function hasClass(el, classNm) {
    var names = el.className.split(' ');
    for(var i = 0; i < names.length; i++)
        if(classNm == names[i])
            return true;
    return false;
}

function addClass(el, classNm){
    if(hasClass(el, classNm))
        return false;
    else
    {
        if (el.className[el.className.length - 1]!= " ")
            el.className += ' ';
        el.className += classNm;
        return true;
    }
}

function removeClass(el, classNm){
    var re = false;
    var names = el.className.split(' ');
    for(var i = 0;i < names.length; i++)
    {
        if(classNm == names[i])
        {
            names[i] = "";
            re = true;
            break;
        }
    }
    el.className = names.join(' ');
    return re;
}

function showPrompt(id, correct) {
    var icon = getObjByID(id + "icon");
    var prompt = getObjByID(id + "prompt");
    if (correct) {
        removeClass(icon, "iconwrong");
        addClass(icon, "iconcorrect");
        removeClass(icon, "hide");
        addClass(prompt, "hide");
    }
    else {
        removeClass(icon, "iconcorrect");
        addClass(icon, "iconwrong");
        removeClass(icon, "hide");
        removeClass(prompt, "hide");
    }
}

function passwdChecker(passwd){
    var passmode = new RegExp("^[a-zA-Z0-9_]{4,16}$");
    //alert(passmode.valueOf());
    return passmode.test(passwd);
}

function confirmPasswd() {
    var Confirm = getObjByID("newpasswd2confirm");
    var Prompt = getObjByID("newpasswd2prompt");
    var Icon = getObjByID("newpasswd2icon");
    if (textNewPasswd.value == textNewPasswd2.value) {
        addClass(Confirm, "hide");
        addClass(Prompt, "hide");
        removeClass(Icon, "hide");
        removeClass(Icon, "iconwrong");
        addClass(Icon, "iconcorrect");
        return true;
    }
    else {
        removeClass(Confirm, "hide");
        addClass(Prompt, "hide");
        removeClass(Icon, "hide");
        removeClass(Icon, "iconcorrect");
        addClass(Icon, "iconwrong");
        return false;
    }
}

function checkOldPasswd() {
    checkLoginState();
    var result = passwdChecker(textOldPasswd.value);
    showPrompt("oldpasswd", result);
    return result;
}

function checkNewPasswd() {
    checkLoginState();
    var result = passwdChecker(textNewPasswd.value);
    showPrompt("newpasswd", result);
    if (result && textNewPasswd2.value != "") {
        confirmPasswd();
    }
    return result;
}

function checkNewPasswd2() {
    checkLoginState();
    if (!passwdChecker(textNewPasswd2.value)) {
        showPrompt("newpasswd2", false);
        return false;
    }
    else {
        return confirmPasswd();
    }
}

function checkAllPasswd() {
    var r1 = checkOldPasswd();
    var r2 = checkNewPasswd();
    var r3 = checkNewPasswd2();
    return r1 && r2 && r3;
}

function checkLoginState() {
    getUserInfo();
    setUsername();
}

function getUserInfo() {
    chrome.extension.sendMessage({ logined: "logined?" },
          function (response) {
              //usernameResponsed = true;
              if (response.result && response.result == "login-yes") {
                  username = response.username;
                  //curUsername = username;
                  aes_key = response.aeskey;
                  aes_server_iv = response.aesserveriv;
                  aes_server_key = response.aesserverkey;
                  //alert("login: "+curUsername);
                  //alert(curUsername);
              }
              else {
                  username = "请先登陆";
                  alert("请先登陆");
                  this.close();
              }
          }
      );

}

function setUsername() {
    if (username != -1) {
        if (username != curUsername) {
            curUsername = username;
            spanUsername.innerHTML = curUsername;
            //alert(curUsername);
        }
    }
    else {
       // alert("timeout");
        setTimeout(setUsername, 100);
    }
    
}

function parseRecord(xml) {

    var content = "<tr class=\"tablehead\"><th class=\"col1\">网址</th><th colspan=\"1\" class=\"col2\">信息</th></tr>"; //<th class=\"col3\">密码</th></tr>";
    records = xml.getElementsByTagName("record");
    var length = records.length;
    spanRecordNum.innerHTML = "记录数：" + length;
    var tdclass1;
    var tdclass2;
    for (var i = 0; i < length; i++) {
        var url = decodeURIComponent(records[i].getElementsByTagName("url")[0].childNodes[0].nodeValue);
        //var up = decryptForServer(records[i].getElementsByTagName("content")[0].childNodes[0].nodeValue);
        //console.log("be: " + records[i].getElementsByTagName("content")[0].childNodes[0].nodeValue);
        var up = decryptAES(records[i].getElementsByTagName("content")[0].childNodes[0].nodeValue, aes_key, "");
        //alert(up);
        var a = up.split('\n');
        //alert(url + " " +curUsername+ " " + passwd);
        var rownums = a.length / 2;

        if (i % 2 == 0) {
            tdclass1 = "tdwithbgcolor";
            tdclass2 = "";
        }
        else {
            tdclass1 = "";
            tdclass2 = "tdwithbgcolor";
        }

        //        content += '<tr class="' + tdclass1 + '"><td rowspan="' + (rownums + 1) + '"><input type="checkbox" name = "recordurl" value="' + url + '" />' + url + '</td></tr>';
        content += '<tr><td class="' + tdclass1 + '"><input type="checkbox" name = "recordurl" value="' + url + '" />' + url + '</td>';

        content += '<td class="' + tdclass2 + '"><table>';
        for (var j = 0; j < a.length; j += 2) {
            if (curUsername.length == 3)
                content += '<tr><td>' + decryptForLocal(a[j]) + ': ' + decryptForLocal(a[j + 1]) + '</td></tr>';
            else
                content += '<tr><td>' + a[j] + ': ' + a[j + 1] + '</td></tr>';
            //content += '<td>' + a[j] + ': ' + a[j + 1] + '</td>';

        }
        content += '</table></td></tr>';
        //content += '</tr>';
    }
    tableView.innerHTML = content;
    
}

function getRecord() {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            //alert(xhr.response);
            //alert(xhr.responseText);
            console.log(xhr.responseText);
            parseRecord(xhr.responseXML);
            addClass(divLoading, "hide");
            btnViewHide.disabled = false;
        }
    }

    xhr.open("post", urlbase + "hyperfill_view.php", true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    //console.log();
    //console.log( "http://localhost/hyperfill_view.php"+"?username=" + encryptAES(encryptMD5(curUsername, ""), aes_server_key, aes_server_iv));
    xhr.send("username=" + encryptAES(encryptMD5(curUsername, ""), aes_server_key, aes_server_iv));
}

function showChangePasswdResult(result) {
    if (result == 0) {
        addClass(spanResultIcon, "iconcorrectbig");
        spanResultText.innerText = "密码修改成功，请牢记新密码。";
    }
    else if (result == 1) {
        addClass(spanResultIcon, "iconwrongbig");
        spanResultText.innerText = "密码修改失败：用户名或原密码不正确。";
    }
    else if (result == 2) {
        addClass(spanResultIcon, "iconwrongbig");
        spanResultText.innerText = "密码修改失败：数据库连接失败";
    }
    else if (result == 3) {
        addClass(spanResultIcon, "iconwrongbig");
        spanResultText.innerText = "密码修改失败：数据库更新失败";
    }
    else {
        addClass(spanResultIcon, "iconwrongbig");
        spanResultText.innerText = "密码修改失败：未知错误 " + result;
    }

    removeClass(spanResultIcon, "hide");
}

function submitChangePasswd() {
    checkLoginState();
    if (!checkAllPasswd())
        return;

    addClass(divChangePasswdTable, "hide");
    removeClass(divChangePasswdResult, "hide");

    textOldPasswd.disabled = textNewPasswd.disabled = textNewPasswd2.disabled = btnSubmit.disabled = btnBack.disabled = true;
    var oldPasswd = textOldPasswd.value;
    var newPasswd = textNewPasswd.value;
    //alert("ab");
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            //alert(xhr.responseText);
            var records = xhr.responseXML.getElementsByTagName("record");
            var newcontents = "";
            var num = records.length;

            //var re = records[0].getElementsByTagName("content")[0].childNodes[0].nodeValue;
            for (var i = 0; i < num; i++) {
                //alert(records[i].getElementsByTagName("content")[0].childNodes[0].nodeValue + " " + curUsername+oldPasswd);
                newcontents += decodeURIComponent(records[i].getElementsByTagName("url")[0].childNodes[0].nodeValue) + " ";
                newcontents += encryptAES(decryptAES(records[i].getElementsByTagName("content")[0].childNodes[0].nodeValue, curUsername + oldPasswd, ""), curUsername + newPasswd, "") + " "; //先用旧密码解密再用新密码加密
                //alert(encryptAES(decryptAES(records[i].getElementsByTagName("content")[0].childNodes[0].nodeValue, curUsername + oldPasswd, ""), curUsername + newPasswd, "") + " " + curUsername + newPasswd);
            }

            var xhrc = new XMLHttpRequest();
            xhrc.onreadystatechange = function () {
                if (xhrc.readyState == 4 && xhrc.status == 200) {
                    //alert(xhrc.responseText);
                    showChangePasswdResult(xhrc.responseText);
                    if (xhrc.responseText == "0") {
                        chrome.extension.sendMessage({ validate: "yes", username: curUsername, passwd: newPasswd, aeskey: curUsername + newPasswd, aesserverkey: aes_server_key, aesserveriv: aes_server_iv });
                        getUserInfo();
                        //console.log("cur: " + curUsername + newPasswd);
                        //console.log("new aes_key: " + aes_key);
                    }
                    textOldPasswd.disabled = textNewPasswd.disabled = textNewPasswd2.disabled = btnSubmit.disabled = btnBack.disabled = false;
                }
            }

            xhrc.open("post", urlbase + "hyperfill_changepasswd.php", true);
            xhrc.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            var sendcontent = "username=" + encryptAES(encryptMD5(curUsername, ""), aes_server_key, aes_server_iv) + "&oldpasswd=" + encryptAES(encryptMD5(oldPasswd, ""),
                aes_server_key, aes_server_iv) + "&newpasswd=" + encryptAES(encryptMD5(newPasswd, ""), aes_server_key, aes_server_iv) +
                "&newcontents=" + encodeURIComponent(newcontents);
            xhrc.send(sendcontent);

        }
    }

    //alert("a");
    xhr.open("post", urlbase + "hyperfill_view.php", true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var sendcontent = "username=" + encryptAES(encryptMD5(curUsername, ""), aes_server_key, aes_server_iv);
    //alert(sendcontent);
    xhr.send(sendcontent);
}

function getUrlCheckBoxes() {
    return document.getElementsByName("recordurl");
}

function deleteRecords() {
    removeClass(spanDeleting, "hide");
    var urlCheckBoxes = getUrlCheckBoxes();
    var checkedURL = "";
    for (var i = 0; i < urlCheckBoxes.length; i++) {
        if (urlCheckBoxes[i].checked)
            checkedURL += urlCheckBoxes[i].getAttribute("value") + " ";
    }

    //alert(checkedURL);
    //alert(encryptForServer(checkedURL, ""));
    //alert(checkedURL);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            //alert(xhr.responseText);
            if (xhr.responseText != -1) {
                //alert(xhr.responseText);
                //alert("deletion completes");
                var i;
                for (i = 0; i < urlCheckBoxes.length;) {
                    if (urlCheckBoxes[i].checked) {
                        var rowIndex = urlCheckBoxes[i].parentNode.parentNode.rowIndex;
                        tableView.deleteRow(rowIndex);
                        
                    }
                    else i++;
                }
                spanRecordNum.innerHTML = "记录数：" + i;

                var trs = getObjByID("viewtable").childNodes[0].childNodes;
                for (var j = 1; j <= i; j++) {
                    if (j % 2 == 1) {
                        //if (!trs[j].getElementsByTagName("td").childNodes)
                        //    alert("kkk");
                        addClass(trs[j].childNodes[0], "tdwithbgcolor");
                        removeClass(trs[j].childNodes[1], "tdwithbgcolor");
                    }
                    else {
                        addClass(trs[j].childNodes[1], "tdwithbgcolor");
                        removeClass(trs[j].childNodes[0], "tdwithbgcolor");
                    }
                }
                removeClass(getObjByID("deleted"), "hide");
                addClass(spanDeleting, "hide");
            }
            spanDelete.disabled = false;
        }
    }

    xhr.open("post", urlbase + "hyperfill_delete.php", true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("username=" + encryptAES(encryptMD5(curUsername, ""), aes_server_key, aes_server_iv) + "&urls=" + encodeURIComponent(checkedURL));

}

function main()
{
   
    getDomObject();

    checkLoginState();
    //setUsername();

    btnView.addEventListener("click", function () {
        checkLoginState();
        removeClass(btnView, "menubtn");
        addClass(btnView, "menubtncurrent");
        removeClass(btnChangePasswd, "menubtncurrent");
        addClass(btnChangePasswd, "menubtn");

        removeClass(divView, "hide");
        addClass(divChangePasswd, "hide");
    });

    btnChangePasswd.addEventListener("click", function () {
        checkLoginState();
        removeClass(btnChangePasswd, "menubtn");
        addClass(btnChangePasswd, "menubtncurrent");
        removeClass(btnView, "menubtncurrent");
        addClass(btnView, "menubtn");

        removeClass(divChangePasswd, "hide");
        addClass(divView, "hide");

    });

    btnViewHide.addEventListener("click", function () {
        if (btnViewHide.disabled)
            return;
        checkLoginState();
        addClass(document.getElementById("deleted"), "hide");
        if (btnViewHide.innerText == "↓查看↓") {
            btnViewHide.disabled = true;
            btnViewHide.innerHTML = "↑隐藏↑";
            removeClass(divLoading, "hide");
            getRecord();
            removeClass(divViewTable, "hide");
        }
        else {
            btnViewHide.innerHTML = "↓查看↓";
            tableView.innerHTML = "";
            addClass(divViewTable, "hide");
        }

    });

    textOldPasswd.addEventListener("blur", checkOldPasswd);
    textNewPasswd.addEventListener("blur", checkNewPasswd);
    textNewPasswd2.addEventListener("blur", checkNewPasswd2);

    btnSubmit.addEventListener("click", function () {
        if (btnSubmit.disabled)
            return;
        checkLoginState();
        submitChangePasswd();
    });

    btnBack.addEventListener("click", function () {
        if (btnBack.disabled)
            return;
        checkLoginState();
        document.location.reload();
    });

    spanSelectAll.addEventListener("click", function () {
        checkLoginState();
        var urlCheckBoxes = getUrlCheckBoxes();
        for (var i = 0; i < urlCheckBoxes.length; i++) {
            urlCheckBoxes[i].checked = true;
        }
    });

    spanSelectInverse.addEventListener("click", function () {
        checkLoginState();
        var urlCheckBoxes = getUrlCheckBoxes();
        for (var i = 0; i < urlCheckBoxes.length; i++) {
            urlCheckBoxes[i].checked = !urlCheckBoxes[i].checked;
        }
    });

    spanDelete.addEventListener("click", function () {
        checkLoginState();
        if (spanDelete.disabled)
        {
            //alert("dis");
            return;
        }
        spanDelete.disabled = true;
        deleteRecords();
    });
    //alert("2: " + username);
}

//getUserInfo();
//alert("getUserInfo:"+ curUsername);
window.addEventListener("load", main);



    /*
    $("viewbtn").addEventListener("click", function(){
        $("viewbtn").removeClass("menubtn");
        $("viewbtn").addClass("menubtncurrent");
        $("changepasswdcontent").removeClass("menubtncurrent");
        $("changepasswdcontent").addClass("menubtn");
    })
    
    $("changepasswdbtn").addEventListener("click", function () {
        $("viewbtn").removeClass("menubtncurrent");
        $("viewbtn").addClass("menubtn");
        $("changepasswdcontent").removeClass("menubtn");
        $("changepasswdcontent").addClass("menubtncurrent");
    })
    */

