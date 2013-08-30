function encryptMD5(originText)
{
	return CryptoJS.MD5(originText).toString();
}

function decryptAES(encryptedText, _key, _iv)  //解密服务器的信息
{
	encryptedText = decodeURIComponent(encryptedText);
	if(_iv=="" || typeof(_iv)=="undefined")
    {  
		var result = CryptoJS.AES.decrypt(encryptedText, _key);
		return result.toString(CryptoJS.enc.Utf8);  //很关键
	}
	else
	{
		var key = CryptoJS.enc.Utf8.parse(_key);
		var iv = CryptoJS.enc.Utf8.parse(_iv);
		var result = CryptoJS.AES.decrypt(encryptedText,key,{iv:iv,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.ZeroPadding});
		return result.toString(CryptoJS.enc.Utf8);  //很关键
	}
}

function encryptAES(originText, _key, _iv)  //加密传送给服务器的信息
{
	if(_iv=="" || typeof(_iv)=="undefined")
	{  
		var result = CryptoJS.AES.encrypt(originText, _key);
		return encodeURIComponent(result);
	}
	else
	{  
		var key  = CryptoJS.enc.Utf8.parse(_key);
		var iv   = CryptoJS.enc.Utf8.parse(_iv);	
		var result = CryptoJS.AES.encrypt(originText,key,{iv:iv,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.ZeroPadding});
		return encodeURIComponent(result);
	}
}