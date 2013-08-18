/******************************
RSA Related Start
******************************/
function rsaDecode(code)
{
	console.log("rsaDecode function");
	var i=0;
	var ti=0;
	var tii=0;
	var ts1="";
	var ts2="";
	var str="";
	var str2="";
	for(;i<32;i=i+4)
	{
	    ti=parseInt(code.substring(i,i+4));
		tii=1;
		var cnt=rsa_key.d;
		while(cnt!=0)
		{
		  cnt=cnt-1;
		  tii=(tii*ti)%rsa_key.n;
		}
		str=str+cc[parseInt(tii.toString().substring(0,2))];
		str=str+cc[parseInt(tii.toString().substring(2,4))];
	}
	//console.log("aes_key:"+str);
	//return str;
	//aes_server_key=str;
	//console.log("aeskey:"+aes_key);
	str2=ts1=ts2="";
	for(;i<64;i=i+4)
	{
	    ti=parseInt(code.substring(i,i+4));
		tii=1;
		var cnt=rsa_key.d;
		while(cnt!=0)
		{
		  cnt=cnt-1;
		  tii=(tii*ti)%rsa_key.n;
		}
		str2=str2+cc[parseInt(tii.toString().substring(0,2))];
		str2=str2+cc[parseInt(tii.toString().substring(2,4))];
	}
	//aes_iv=str;
	//console.log("aeskey&aesiv:"+aes_key+" "+aes_iv);
	return {aes_server_key:str, aes_server_iv:str2};
}
function modRev(e,m)
{
	var i=1;
	while( (1+m*i)%e!=0 )
	 i=i+1;
	return (1+m*i)/e;
}
function gcd(x,y)
{
    if(x<y)
	{
	  var tt=x;
	  x=y;
	  y=x;
    }
	if(!x||!y) return x>y?x:y;
	for(var t; t=x%y;x=y,y=t){};
	return y;
}
function rsakey(ee,dd,nn)
{
	this.e=ee;
	this.d=dd;
	this.n=nn;
}
function keyGen()
{
	var len=primes.length;
	var p=primes[Math.ceil(Math.random()*len)];
	
	var maxl=len-1;
	var minl=0;
	while(primes[maxl]*p>9999)
	 maxl--;
	while(primes[minl]*p<1000)
	 minl++;
	if(minl>maxl)
	  maxl=minl;
	
	var q=primes[minl+Math.floor(Math.random()*(maxl-minl))];
	//console.log("p&q1:"+p+" "+q);
	while(q==p || p*q>9999 || p*q<1000)
	 q=primes[minl+Math.floor(Math.random()*(maxl-minl))];
	var n=p*q;
	var _e=(p-1)*(q-1);
	
	var e=primes[Math.ceil(Math.random()*len)];
	while(e>=_e || e==p || e==q)  //循环需要优化
	 e=Math.ceil(Math.random()*len);
	d=modRev(e,_e);
	//console.log("keyGen");
	//console.log("e&d&n:"+e+" "+d+" "+n);
	
	var kk=new rsakey(e,d,n);
	return kk;
}
/******************************
RSA Related End
******************************/