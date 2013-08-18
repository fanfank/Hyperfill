// code for local user registration
function encryptAESLocal(originText, _key)
{
	return CryptoJS.AES.encrypt(originText, _key).toString();
}

function decryptAESLocal(originText, _key)
{
	return CryptoJS.AES.decrypt(originText, _key).toString(CryptoJS.enc.Utf8);;
}

function localReg(un, pw)
{
	un = encryptMD5(un);
	pw = encryptMD5(pw);
	if(!localStorage[un])
	{
		localStorage.setItem(un, pw);
		return true;
	}
	else
		return false;
}

function localLogin(un, pw)
{
	var une = encryptMD5(un);
	var pwe = encryptMD5(pw);
	
	if(!localStorage[une])
		return 1;
	if(localStorage[une] != pwe)
		return 2;
	
	activated = 2;
	username = un;
	passwd = pw;
	return 0;
}

function localLogoff()
{
	activated = 0;
	passwd = username = "";
	return true;
}

function localGetContent(url)
{
	var key = encryptMD5(username + passwd + url);
	if(!localStorage[key])
		return "";
	else
		return decryptAESLocal(localStorage[key], username + passwd);
}

function localDeleteContent(url)
{
	var key = encryptMD5(username + passwd + url);
	localStorage.removeItem(key);
	return "deleteContent-yes";
}

function localSetContent(url, content)
{
	var key = encryptMD5(username + passwd + url);
	var value = encryptAESLocal(content, username + passwd);
	localStorage[key] = value;
	return "setContent-yes";
}