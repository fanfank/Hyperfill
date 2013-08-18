// code for local user registration
function localReg()
{
	var un = document.getElementById('username').value;
	var pw = document.getElementById('passwd').value;
	
	chrome.extension.sendMessage({localReg: "localReg", username: un, passwd: pw}, 
		function(response)
		{
			if(response.result == "localReg-yes")
				document.getElementById("help_loginbtn").innerText = "注册成功！";
			else
				document.getElementById("help_loginbtn").innerText = "用户名已经存在，请重新选择";
		}
	);
}

function localLogin()
{	
	var un = document.getElementById("username");
	var pw = document.getElementById("passwd");
	
	var unv = un.value;
	var pwv = pw.value;
	
	chrome.extension.sendMessage({localLogin: "localLogin", username: unv, passwd: pwv}, 
		function(response)
		{
			if(response.result == "localLogin-yes")
			{
				console.log("logined");
				un.value = "******";
				pw.value = "******";
				un.disabled = pw.disabled = true;
				document.getElementById("clearbtn").disabled = document.getElementById("savebtn").disabled = false;
				document.getElementById("loginbtn").value = "Logoff";
				document.getElementById("help_loginbtn").innerText = "登录成功";
			}
			else if(response.result == "localLogin-un")
				document.getElementById("help_loginbtn").innerText = "登录失败，用户名错误";
			else if(response.result == "localLogin-pw")
				document.getElementById("help_loginbtn").innerText = "登录失败，密码错误";
			else
				document.getElementById("help_loginbtn").innerText = "登录失败，未知错误";
		}
	);
}

function localLogoff()
{
	chrome.extension.sendMessage({localLogoff: "localLogoff"}, 
		function(response)
		{
			if(response.result == "localLogoff-yes")
			{
				var un = document.getElementById("username");
				var pw = document.getElementById("passwd");
				un.disabled = pw.disabled = false;
				pw.value = "";
			
				un.focus();
				document.getElementById("clearbtn").disabled = document.getElementById("savebtn").disabled = true;
				document.getElementById("loginbtn").value = "Login";
				document.getElementById("help_loginbtn").innerText = "下线成功";
			}

			else
				document.getElementById("help_loginbtn").innerText = "下线失败";
		}
	);
}