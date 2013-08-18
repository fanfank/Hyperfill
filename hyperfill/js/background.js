var activated = 0;
var username = "";
var passwd = "";
var storage = chrome.storage.local;
var aes_key="";
var aes_server_key="";
var aes_server_iv="";

function init()
{
	//if last user doesn't logoff, clear the storage.
	storage.get('hyperfill_lastUser',
		function(item)
		{
			if(item.hyperfill_lastUser)
			  clear(item.hyperfill_lastUser);
		});
	//if(storage.get('hyperfill_lastUser'))
}
function clearStorage(un)
{
	activated = 0;
	passwd = username = "";
	storage.remove('hyperfill_lastUser');
}
function setStorage(un,pw)
{
	activated = 1;
	username = un;
	passwd = pw;
	storage.set({'hyperfill_lastUser': un});
}

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse)
  {
    if(request.logined && request.logined=="logined?")	//from content script
	{  
	   var isLogined = activated ? "login-yes" : "login-no";
	   sendResponse({result: isLogined, username: username, passwd: passwd, aeskey:aes_key, aesserverkey:aes_server_key, aesserveriv:aes_server_iv, loginType: activated});
	}
	
	else if(request.validate)	//from popup.html
	{
		if(request.validate == "yes")
		{	
			//activated = true;
			//username = request.username;
			setStorage(request.username, request.passwd);
			aes_key=request.aeskey;
			aes_server_key=request.aesserverkey;
			aes_server_iv=request.aesserveriv;
			console.log("Activated: "+ username);
		}
		else if(request.validate == "no")
		{
			console.log("validate-no");
			//activated = false;
			clearStorage(username);
			aes_key="";
			aes_server_key="";
			aes_server_iv="";
			//username = "";	
		}
	}
	
	else if(request.localReg && request.localReg == "localReg")
	{
		if(localReg(request.username, request.passwd) == true)
			sendResponse({result: "localReg-yes"});
		else
			sendResponse({result: "localReg-no"});
	}
	
	else if(request.localLogin && request.localLogin == "localLogin")
	{
		var errorcode = localLogin(request.username, request.passwd);
		if(errorcode == 0)
			sendResponse({result: "localLogin-yes"});
		else if(errorcode == 1)
			sendResponse({result: "localLogin-un"});
		else if(errorcode == 2)
			sendResponse({result: "localLogin-pw"});
	}
	else if(request.localLogoff && request.localLogoff == "localLogoff")
	{
		if(localLogoff() == true)
			sendResponse({result: "localLogoff-yes"});
		else
			sendResponse({result: "localLogoff-no"});
	}
	else if(request.getContent)
	{
		var content = localGetContent(request.getContent);
		sendResponse({result: content});
	}
	
	else if(request.deleteContent)
	{
		var res = localDeleteContent(request.deleteContent);
		sendResponse({result: res});
	}
	
	else if(request.setContent)
	{
		var res = localSetContent(request.setContent, request.contents);
		sendResponse({result: res});
	}
  });
  
init();