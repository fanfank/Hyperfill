Hyperfill
=========

A Chrome extension to auto fill the forms, current __version: 2.7__  
You are free to download/use/modify these codes for __non-commercial__ uses  
__Version 1.0 DemoVideo - 1.0版本 演示视频__: http://v.youku.com/v_show/id_XNTM0MzQzMDI0.html  
__if you understand chinese, skip this README.md and directly view the *最简单的安装方法.txt*__

###Description
1. This extension enables two account types: local account and web account.
2. Local account requires nothing but a length of 3 characters of username when you register, while the length of a 
web account's username is at least 4.
3. Local account stores data locally, and I ensured data security as best as I can. Yet, I am not a security specialist,
so I can't make a promise that this extension won't get your accounts into troubles, serious uses please avoid storing 
sensitive data on the extension.
4. Web account stores data on a web database. __However__, I __haven't__ bought such a database, so don't register a web 
account unless you are a developer, and will set up PHP, MySQL on your machine, later in this document I'll tell you 
how to do it.

###Installation
1. This plug-in can be used almost all web browsers that incoporate chrome's core, this README will guide you 
assuming that you are using chrome/chromium.
2. Type `chrome://extensions/` in your address bar and open it
3. Tick *developer's mode* in the upper right corner
4. Then click a button named *load a developing extension* or something like that (because I'm using a chinese version, 
dont't exactly know what the button says in English)
5. Choose `./hyperfill` then click OK.
6. __If you just use local account or you are not a developer, then congratulations! Installation complete!__ 
Else keep on ...
7. You are a developer! __Welcome!__ First you have to install PHP, and make sure it works, detailed installation of php 
can be found on web.
8. Then you have to set up MySQL database, please search the web for detailed installation. __Remeber that__, initially my
MySQL setting is *password* for *root* account is *123abc*, you can change it as long as you change the default settings 
int `./PHP/*.php` files
9. Copy all the files from `./PHP` to your *localhost* directory
10. Create a database named *hyperfill* using *root* account and password *123abc*, then create two tables according to 
`./附录/MySQL数据库建表命令.pdf`.
11. All set. 

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

+           Git: fanfank
+   Code authors: Reetsee.Xu, Harry.Xiao, Shenghua.Xu, Junhua.He
+ Contact email: reetsee.xu@gmail.com  

###VERSION LOGs
####Version 2.7 2013-09-01
1. Change all "GET" method to "POST"
2. Fixed codes in PHP which can't run in the last version
    
####Version 2.5 2013-08-30
1. Users can both have their forms filled no matter in *https://mail.qq.com/xxx/yyy?12345...* or
*https://mail.qq.com/xxx/yyy?54321...*, as long as their prefixes are the same. It means that if you save your forms
when URL is *https://mail.qq.com/*, then auto filling also works when the URL is 
*https://mail.qq.com/cgi-bin/loginpage?autologin...*.    

===    
<div class = "footer">
    &copy; 2013 XiaoHe Team
</div>

*README.md Last update: 20130901*

