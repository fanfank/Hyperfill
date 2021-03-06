Hyperfill
=========
__Good news! Now everyone can run this app as a net user(rather than a local user) because I put the background of this app on BAE__    
__好消息！现在各位可以在安装插件后直接使用插件的所有功能（而不像之前只能使用本地账户），因为我把插件的后台放在了BAE上面__    
But remember that __Don't save anything important on this extension since its only an INCOMPLETE software__! I'm not responsible for any loss caused by this software   
但是请记住 __千万不要将重要的信息保存在这个插件上！因为这个插件是一个在安全性上还有欠缺的软件__ !对于该软件对您做成的损失我不能负任何责任！敬请谅解！

A Chrome extension to auto fill the forms, current __version: 3.0__  
You are free to download/use/modify these codes for __non-commercial__ uses  
__Version 1.0 DemoVideo - 1.0版本 演示视频__: http://v.youku.com/v_show/id_XNTM0MzQzMDI0.html  
__if you understand chinese, skip this README.md and directly view the *最简单的安装方法.txt*__   

===  
![Frame](https://raw.github.com/fanfank/Hyperfill/master/%E9%99%84%E5%BD%95/screenshots/hyperfill_frame.png)  
###Description
1. This extension enables two account types: local account and web account.
2. Local account requires nothing but a length of 3 characters of username when you register, while the length of a 
web account's username is at least 4.
3. Local account stores data locally, and I ensured data security as best as I can. Yet, I am not a security specialist,
so I can't make a promise that this extension won't get your accounts into troubles, serious uses please avoid storing 
sensitive data on the extension.
4. Web account stores data on a web database. <del>__However__, I __haven't__ bought such a database, so don't register a web account unless you are a developer, and will set up PHP, MySQL on your machine, later in this document I'll tell you 
how to do it.</del>

###Installation
####For Normal Users    
1. This plug-in can be used almost all web browsers that incoporate chrome's core, this README will guide you 
assuming that you are using chrome/chromium.
2. Type `chrome://extensions/` in your address bar and open it
3. Tick *developer's mode* in the upper right corner
4. Then click a button named *load a developing extension* or something like that (because I'm using a chinese version, 
dont't exactly know what the button says in English)
5. Choose `./hyperfill` then click OK.    

####For developers, continue    
1. __If you just use local account or you are not a developer, then congratulations! Installation complete!__ 
Else keep on ...
2. You are a developer! __Welcome!__ First you have to install PHP, and make sure it works, detailed installation of php 
can be found on web.
3. Then you have to set up MySQL database, please search the web for detailed installation. __Remeber that__, initially my
MySQL setting is *password* for *root* account is *123abc*, you can change it as long as you change the default settings 
int `./PHP/*.php` files
4. Copy all the files from `./PHP` to your *localhost* directory
5. Create a database named *hyperfill* using *root* account and password *123abc*, then create two tables according to 
`./附录/MySQL数据库建表命令.pdf`.
6. All set. 

###Usage
1. Strongly recommend you directly refer to the Demo Video (even though it's a v1.0) first. Else move forward.
2. After installation, just register a local account(length of username <= 3) or a web account(length of username > 3), 
fill all three rows, and be aware that if your don't finish 7~10 in *Installation* above, you can't register or use a web account.
3. Login with your account. Open a new tab ( __old tabs must be refreshed to load the extension__ ), fill in any forms, 
then click the extionsion icon, and click *保存当前表单* to save.
4. You can click *清除保存内容* to clean what you have saved on the current page.
5. When you shut the broweser, your account will automatically logoff.
6. More functions I don't write in detailed, if you are interested, contact my email.

###TODO
> 1. Find a way to reduce code redundancy
> 2. ~~Every php file contains databases's username and password, group it into a single file~~
> 3. Waiting for some advices
> 4. Enable both using *tab* key to switch between inputs and using *enter* to trigger *Login* button
> 5. ~~Forms of dynamic URLs, say *https://mail.qq.com/xxx/yyy?12345...* and *https://mail.qq.com/xxx/yyy?54321...* can both get the forms filled~~
> 6. Make the server remember who has logged in
> 7. ~~Make it run on web~~

===
###VERSION LOGs    
####Vesrion 3.0 2013-10-29    
1. Firstly let me announce a good news that I had gone through Baidu's interview, cheer up for me    
2. Secondly it's a great news that you no longer need to set up the whole environment yourself! Just run it! This extension's background is running on BAE   
     
####Version 2.8 2013-09-25    
1. Added a server verifying process. Before sending username and password's MD5 to the server, client will first request
 for server's identity message. It's encrypted using RSA, and then the client will use a public key to decode it, and see
 if it is from the server
    
####Version 2.7 2013-09-01
1. Change all "GET" method to "POST"
2. Fixed codes in PHP which can't run in the last version
    
####Version 2.5 2013-08-30
1. Users can both have their forms filled no matter in *https://mail.qq.com/xxx/yyy?12345...* or
*https://mail.qq.com/xxx/yyy?54321...*, as long as their prefixes are the same. It means that if you save your forms
when URL is *https://mail.qq.com/*, then auto filling also works when the URL is 
*https://mail.qq.com/cgi-bin/loginpage?autologin...*.    

####Version 2.0 2013-08-19
1. Readd a user type: local user. Local user can use *Hyperfill* without deploying anything except the extension itself
2. Greatly improved local user's security level, before this version, local user's security problem is so severe that I
finally decided to remove this user type.  

####Version 1.0 2013-06
1. Made hyperfill, because of local user's security problem, only net user was preserved.
2. After registration, net users can have their forms auto filled.    

===     
+           Git: fanfank
+   Code authors: Reetsee.Xu, Harry.Xiao, Shenghua.Xu, Junhua.He
+ Contact email: reetsee.xu@gmail.com    

<div class = "footer">
    &copy; 2013 XiaoHe Team
</div>

*README.md Last update: 20140107*

