var isLogined = -1;
var isLocal = -1;
var hyper_fill_username = "", hup="";
var un_md5="", pw_md5="";
var req = new XMLHttpRequest();
var url = (window.location.href + "").substring(0, (window.location.href + "").indexOf("/", 8));
var aes_key="";
var aes_server_key="";
var aes_server_iv="";
var timeout = 0;

function handleServerResponseGet()   //Reply to content_script
{
	if(req.readyState == 4 && req.status == 200)
	{
		if(req.responseText == "failed")
		    console.log("Database connection failed");
		else if(req.responseText == "fill-no")
		    console.log("Validation failed");
		else if(req.responseText == "fill-empty")
		{  
		    console.log("Not any filled form");
		}
		else
		{
		    sessionStorage.setItem("autofill_"+hyper_fill_username, decryptAES(req.responseText, aes_key, ""));  //服务器返回内容经过本地AES加密，无需IV
		    //console.log("In HSRG:"+req.responseText+" "+decryptAES(req.responseText, aes_key, ""));
		    autoFill("session")
		}
	}
	else
	{
		console.log("Server connection failed");
	}
}
function handleServerResponseDelete()   //Reply to content_script
{
	if(req.readyState == 4 && req.status == 200)
	{
		if(req.responseText == "failed")
		    console.log("Database connection failed");
		else if(req.responseText == "delete-no")
		    console.log("Validation failed");
		else if(req.responseText == "delete-empty")
		{  
		    console.log("Not any filled form");
		    //whether should we set the browser not to check this url next time?
		}
		else
		{
		    console.log("Succeeded");
		    sessionStorage.removeItem("autofill_"+hyper_fill_username);
		}
	}
	else
	{
		console.log("Sever connection failed");
	}
}

function handleServerResponseSet()
{
	if(req.readyState == 4 && req.status == 200)
	{
		if(req.responseText == "failed")
		  console.log("Database connection failed");
		else if(req.responseText == "set-no")
		  console.log("Validation failed");
		else
		  console.log("Successfully saved");
	}
	else
	{
		console.log("Server connection failed");
	}
}

function sendXHR(dataToSend, URL, type)
{
	if(type=="get")
		req.onreadystatechange = handleServerResponseGet;
	else if(type=="delete")
		req.onreadystatechange = handleServerResponseDelete;
	else
		req.onreadystatechange = handleServerResponseSet;
	
	req.open("post", URL, true);
	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	//console.log("In sendXHR, data:"+URL+"?"+dataToSend);
	//console.log("In sendXHR, un pw:"+hyper_fill_username+" "+hup)
	req.send(dataToSend);
}

function getSessionStorage()
{
	if(isLogined == 1)
	{
		var dataToSend = "username=" + encryptAES(un_md5,aes_server_key,aes_server_iv)+"&passwd="+encryptAES(pw_md5,aes_server_key,aes_server_iv)+"&url="+encodeURIComponent(url);
		sendXHR(dataToSend, "http://localhost/hyperfill_getForm.php", "get");
	}
	else if(isLogined == 2)
	{
		chrome.extension.sendMessage({getContent: encodeURIComponent(url)}, 
			function(response)
			{
				if(response.result && response.result != "")
				{	
					sessionStorage["autofill_" + hyper_fill_username] = response.result;
					autoFill("session");
				}
				else
					console.log("Not any form filled");
			}
		);
	}
}
function deleteSessionStorage()
{
	if(isLogined == 2)  //local user
	{
		chrome.extension.sendMessage({deleteContent: encodeURIComponent(url)}, 
			function(response)
			{
				if(response.result && response.result == "deleteContent-yes")
				{	
					sessionStorage.removeItem("autofill_" + hyper_fill_username);
				}
				else
					alert("deletion failed!");
			}
		);
	}
	else
	{
		//var dataToSend = "?username=" + encryptAES(un_md5,aes_server_key,aes_server_iv)+"&passwd="+encryptAES(pw_md5, aes_server_key,aes_server_iv)+"&url="+encodeURIComponent(url);
		var dataToSend = "username=" + encryptAES(un_md5,aes_server_key,aes_server_iv)+"&passwd="+encryptAES(pw_md5, aes_server_key,aes_server_iv)+"&url="+encodeURIComponent(url);
		sendXHR(dataToSend, "http://localhost/hyperfill_deleteForm.php", "delete");
	}
}

function setSessionStorage(content)
{	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	if(isLogined == 2)  //local user
	{
		chrome.extension.sendMessage({setContent: encodeURIComponent(url), contents: content}, 
			function(response)
			{
				if(response.result && response.result == "setContent-yes")
					sessionStorage["autofill_" + hyper_fill_username] = content;
				else
					alert("save failed!");
			}
		);
	}
	else
	{
		sessionStorage["autofill_"+hyper_fill_username] = content;
		//var dataToSend = "?username=" + encryptAES(un_md5,aes_server_key,aes_server_iv)+"&passwd="+encryptAES(pw_md5,aes_server_key,aes_server_iv)+"&url="+encodeURIComponent(url)+"&ct="+encryptAES(content, aes_key, "");
		var dataToSend = "username=" + encryptAES(un_md5,aes_server_key,aes_server_iv)+"&passwd="+encryptAES(pw_md5,aes_server_key,aes_server_iv)+"&url="+encodeURIComponent(url)+"&ct="+encryptAES(content, aes_key, "");
		sendXHR(dataToSend,"http://localhost/hyperfill_setForm.php", "set");
	}
}

function init()
{
	//console.log("URL:" + url);
	chrome.extension.sendMessage({logined: "logined?"}, 
		function(response)
		{
			if(response.result)
			 if(response.result == "login-yes")
			 { 
				isLogined = response.loginType;
				hyper_fill_username = response.username;
				hup = response.passwd;
				aes_key=response.aeskey;
				aes_server_key=response.aesserverkey;
				aes_server_iv=response.aesserveriv;
				
				un_md5=encryptMD5(hyper_fill_username);
				pw_md5=encryptMD5(hup);
			 }
			 else if(response.result == "login-no")
			  isLogined = 0;
		}
	);
	if(isLogined == -1)
	    setTimeout(init, 100);
	 
	else if(isLogined >= 1)
	{
		if(!sessionStorage["autofill_"+hyper_fill_username])
		    getSessionStorage(); //连接数据库或后台页面
		else
		    autoFill("session");
		
		/*
		if(isLogined == 2)
	    {	
			console.log("local user");
			if(!sessionStorage["autofill_"+hyper_fill_username])
			 getSessionStorage(); //连接后台页面
			else
			 autoFill("session");
		}
		else if(isLogined == 1)
		{
			if(!sessionStorage["autofill_"+hyper_fill_username])
			 getSessionStorage(); //连接数据库
			else
			 autoFill("session");
		}
		*/
	}
}

function autoFill(type)  //type用于指定是local还是session
{
	if(!document.getElementsByTagName("input")[0])
	{
		if(timeout++ < 500)
		{
			console.log("Paused");
			setTimeout(autoFill(type), 2000);
			return;
		}
		else
		{
			timeout = 0;
			console.log("Waiting for input objects timeout!");
			return;
		}
	}
	
	var storage = window[type + "Storage"];
	if (storage["autofill_" + hyper_fill_username]) {
	    var formContent = storage["autofill_" + hyper_fill_username];

	    var fields = formContent.split("\n");
	    for (var i = 0; i < fields.length; i += 2) {
	        if(fields[i] == "")
			    continue;
			var fn = fields[i];
	        fv = fields[i + 1];
	        document.getElementsByName(fn)[0].value = fv;
	    }
	}
}

function csAction(action) // save/clear form
{
	console.log("actionForm clicked");
	if(action == "save")
	{
		var formContent = "";
		var inputs = document.getElementsByTagName("input");
		for(var i = 0; i<inputs.length; i++)
			if(inputs[i].type != "text" && inputs[i].type!= "password")
				continue;
			else
			{
				if(!inputs[i].name || !inputs[i].value)
					continue;
				var b = inputs[i];
				/*if(formContent)
				{  
				    formContent += "\n" + b.name + "\n" + b.value;
				}
				else
				{*/
				formContent += b.name+ "\n" + b.value + "\n";
				//}
			}
			
		if(formContent)
		{	
			setSessionStorage(formContent);
		}
	}
	else if(action == "clear")
	{
		deleteSessionStorage();
	}
}

init();