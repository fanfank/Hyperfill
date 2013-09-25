var req = new XMLHttpRequest();
var bgPage = chrome.extension.getBackgroundPage();
var input_invalid = true;
var input2_invalid = true;
var rsa_key = new rsakey();
var aes_key="";
var aes_server_key="";
var aes_server_iv="";
var cc = new Array("0","0","0","0","0","0","0","0","0","0","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z");

function aesGen()
{
	aes_key = document.getElementById("username").value + document.getElementById("passwd").value;;
}

function setStyle(element, value, innerText, color, backgroundColor, fontSize)
{
	if(!element)
		return;
	
	if(value!=null)
		element.value = value;
	if(innerText!=null)
		element.innerText = innerText;
	if(color)
		element.style.color = color;
	if(backgroundColor)
		element.style.backgroundColor = backgroundColor;
	if(fontSize)
		element.style.font = fontSize;
}

function init()
{
	chrome.extension.sendMessage({logined: "logined?"}, 
		function(response)
		{
			if(response.result && response.result == "login-yes")
			{
				console.log("init: logined");
				input_invalid = false;
				aes_server_key = response.aesserverkey;
				aes_server_iv = response.aesserveriv;
				aes_key = response.aeskey;
				showResult("login", response);
			}
			else
			{	
				showResult("logoff",{result:"firsttime"});
				document.getElementById("help_loginbtn").innerText = "";
			}
		}
	);
}

function showResult(type, response)
{
	var un = document.getElementById("username");
	var pw = document.getElementById("passwd");
	
	if(type == "login")
	{
		if(response.result == "login-yes")
		{
			console.log("logined");
			un.value = "******";
			pw.value = "******";
			un.disabled = pw.disabled = true;
			document.getElementById("clearbtn").disabled = document.getElementById("savebtn").disabled = false;
			document.getElementById("loginbtn").value = "Logoff";
			document.getElementById("help_loginbtn").innerText = "";
		}
		else if(response.result == "login-no")
		{
			document.getElementById("help_loginbtn").innerText = "用户名或密码错误";
		}
	}
	else if(type == "logoff")
	{
		un.disabled = pw.disabled = false;
		un.value = pw.value = "";
			
		un.focus();
		document.getElementById("clearbtn").disabled = document.getElementById("savebtn").disabled = true;
		document.getElementById("loginbtn").value = "Login";
		document.getElementById("help_loginbtn").innerText = "下线成功";
	}
	else if(type == "register")
	{
	
		if(response.result == "register-yes")
		{
			document.getElementById("help_loginbtn").innerText = "注册成功！";
		}	
		else
			document.getElementById("help_loginbtn").innerText = "用户名已经存在，请重新选择";
	}
	else
		document.getElementById("help_loginbtn").innerText = "提交失败，请稍后重试"; 
}

function handleServerResponse()
{
	if(req.readyState == 4 && req.status == 200)
	{
		//console.log("ResponseText: "+req.responseText);
		var un = document.getElementById("username").value;
		var pw = document.getElementById("passwd").value;
		
		if(req.responseText == "login-no")
			showResult("login", {result: req.responseText});
		else if(req.responseText == "login-yes")
		{	
			aesGen();
			chrome.extension.sendMessage({validate: "yes", username: un, passwd: pw, aeskey:aes_key, aesserverkey:aes_server_key, aesserveriv:aes_server_iv});
			showResult("login", {result: req.responseText, username: un});
		}
		else if(req.responseText == "register-yes" || req.responseText == "register-no")
		{
			showResult("register", {result: req.responseText});
		}
		else if(req.responseText.match(/^\d.*$/))
		{
		    //console.log(req.responseText);
			//获得的是密文，开始解密										*******************************
			var keys = rsaDecode(req.responseText);			        //         重点检测
			//解密完毕，发送登录消息										*******************************
			aes_server_key = keys.aes_server_key;
			aes_server_iv = keys.aes_server_iv;
			
			send("login");
		}
		else if(req.responseText == "logoff-yes")
		  showResult("logoff");
		else if(req.responseText.substring(0, 6) == "i am: ")
		{
			if(rsaServerVerify(req.responseText.substring(6)))
			{
				send("getrsa"); //获取rsa
			}
			else
			{
				document.getElementById("help_loginbtn").innerText = "服务器不可信，连接终止";
			}
		}
		else
			showResult("non");
	}
	/*else
		showResult("non");
	*/
}

function sendXHR(dataToSend, URL)
{
    console.log(URL);
	//console.log(URL + "?" + dataToSend);
	req.onreadystatechange = handleServerResponse;
	req.open("post", URL, true);
	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	req.send(dataToSend);
}

function send(type)
{  
    var un = document.getElementById("username").value;
    var pw = document.getElementById("passwd").value;
	if(type == "login")//一旦send，则直接从这里与服务器通信
	{
			//var dataToSend = "?username=" + encryptAES(encryptMD5(un), aes_server_key, aes_server_iv)+"&passwd="+ encryptAES(encryptMD5(pw), aes_server_key, aes_server_iv);
			var dataToSend = "username=" + encryptAES(encryptMD5(un), aes_server_key, aes_server_iv)+"&passwd="+ encryptAES(encryptMD5(pw), aes_server_key, aes_server_iv);
			//var dataToSend = "?username=" + encryptForServer(encryptMD5(un,'un'))+"&passwd="+ encryptForServer(encryptMD5(pw,'pw'));
			sendXHR(dataToSend, "http://localhost/hyperfill_validate.php");	
	}
	else if(type == "verify")
	{
		var dataToSend = "req=whoareyou";
		sendXHR(dataToSend, "http://localhost/hyperfill_serverVerify.php");
	}
	else if(type == "getrsa")
	{
			//生成rsa公钥、私钥对
			rsa_key=keyGen();
			var dataToSend = "pubke=" + rsa_key.e.toString() + "&pubkn=" + rsa_key.n.toString();
			//console.log("http://localhost/hyperfill_getrsa.php"+dataToSend);
			sendXHR(dataToSend, "http://localhost/hyperfill_getrsa.php");
	}
	else if(type == "register")
	{
			var dataToSend = "username=" + encryptMD5(un)+"&passwd="+encryptMD5(pw);
			sendXHR(dataToSend, "http://localhost/hyperfill_register.php");	
	}
	else
	{
			chrome.extension.sendMessage({validate: "no"});
			sendXHR("", "http://localhost/hyperfill_logoff.php");
			showResult("logoff");
	}
}

function register()
{
	var un = document.getElementById("username").value;
	if(input_invalid || input2_invalid)
	{	
		document.getElementById("help_loginbtn").innerText = "请正确填写";
		return;
	}
	
	if(un.length != 3)
	{
		send("register");
	}
	else
		localReg();
}

function validate()
{
    if(input_invalid)
    {
	    document.getElementById("help_loginbtn").innerText = "请正确填写";
	    return;
    }
  
    document.getElementById("help_loginbtn").innerText = "";
    var un = document.getElementById("username").value;
    if(document.getElementById("loginbtn").value == "Logoff")
    {
	    if(un.length == 3)
	    {
		    localLogoff();  //本地账户登出
	    }
	    else
	    {
		    document.getElementById("help_loginbtn").innerText = "提交中...";
		    send("logoff");
	    }
    }
  
    else
    {	
	    if(un.length == 3)
	    {
		    localLogin();  //本地账户登录
	    }
	    else
	    {
		    document.getElementById("help_loginbtn").innerText = "提交中...";
			send("verify");
		    //send("getrsa"); //获取rsa
	    }
    } 
}

function checkContent(e)
{
	if(e.target.id == "passwd")
	{
		setStyle(document.getElementById("passwd2"), "", null, "#ffffff", null, null);
		document.getElementById("help_passwd2").innerText = "";
		input2_invalid = true;
	}
	var owner = document.getElementById(e.target.id);
	var help_text = document.getElementById("help_" + owner.id);
	var reg = new RegExp("[a-zA-Z0-9_]{3,16}");
	if(reg.test(owner.value))
	{	
		input_invalid = false;
		help_text.innerText = "有效输入";
		owner.style.backgroundColor = help_text.style.color = "#bcee68";
	}
	else
	{
		input_invalid = true;
		owner.style.backgroundColor = "#ffec8b";
		setStyle(help_text, null, "请输入3~16位的输入数字、字母或下划线", "#ff3030", null, "6px");
	}
}

function saveForm()
{
	chrome.tabs.executeScript(null, {code: "csAction('save');"});
	
	var help_savebtn = document.getElementById("help_savebtn");
	var help_clearbtn = document.getElementById("help_clearbtn");
	
	setStyle(help_savebtn, null, "保存成功", "#bcee68", null, null);
	setStyle(help_clearbtn, null, "", null, null, null);
}

function clearForm()
{
	chrome.tabs.executeScript(null, {code: "csAction('clear');"});
	
	var help_savebtn = document.getElementById("help_savebtn");
	var help_clearbtn = document.getElementById("help_clearbtn");
	
	setStyle(help_savebtn, null, "", null, null, null);
	setStyle(help_clearbtn, null, "清除成功", "#bcee68", null, null);
}

document.addEventListener('DOMContentLoaded', function () {
    var inputtext = document.getElementsByTagName("input");
	for(var i = 0; i<inputtext.length; i++)
	 if(inputtext[i].type == "button")
	  continue;
	 else if(inputtext[i].id == "passwd2")
	 { 
		
		inputtext[i].addEventListener("focus",
			function(e)
			{
				//focus
				if(!input_invalid)
				{	
					setStyle(document.getElementById("help_username"), null, "用户名小于3位注册为本地账号，否则为网络账号", "#ee7600", null, null);
				}	
			});
		
		inputtext[i].addEventListener("keyup",
			function(e)
			{
				//keyup
				var pw = document.getElementById("passwd");
				var owner = document.getElementById(e.target.id);
				var help_text = document.getElementById("help_" + owner.id);
				
				if(owner.value == pw.value)
				{
					input2_invalid = false;
					help_text.innerText = "密码一致";
					owner.style.backgroundColor = help_text.style.color = "#bcee68";
				}
				else
				{
					input2_invalid = true;
					owner.style.backgroundColor = "#ffec8b";
					
					setStyle(help_text, null, "密码不一致", "#ff3030", null, null);
				}
			});
		inputtext[i].addEventListener("blur",
			function(e)
			{
				var owner = document.getElementById(e.target.id);
				var help_text = document.getElementById("help_" + owner.id);
				if(owner.value == "")
				{
					input2_invalid = true;
					owner.style.backgroundColor = "#FFFFFF";
					help_text.value = "";
				}
				else if(input2_invalid == false)
				{
					setStyle(document.getElementById("help_username"), null, "注册为网络账号", "#ee7600", null, null);
				}
			});
	 }
	 else
	  inputtext[i].addEventListener("keyup",checkContent);
	  
	var loginbtn = document.getElementById("loginbtn");
	loginbtn.addEventListener('click', validate);
	
	var regbtn = document.getElementById("regbtn")
	regbtn.addEventListener('click', register);
	
	var savebtn = document.getElementById("savebtn");
	savebtn.addEventListener('click', saveForm);
	
	var clearbtn = document.getElementById("clearbtn");
	clearbtn.addEventListener('click', clearForm);
  
});

init();