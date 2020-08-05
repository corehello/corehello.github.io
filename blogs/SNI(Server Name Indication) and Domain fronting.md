# SNI(Server Name Indication) and Domain fronting

# SNI(Server Name Indication)

## what is SNI?

>  **Server Name Indication** (**SNI**) is an extension to the [TLS](https://en.wikipedia.org/wiki/Transport_layer_security) computer networking protocol[[1\]](https://en.wikipedia.org/wiki/Server_Name_Indication#cite_note-1) by which a [client](https://en.wikipedia.org/wiki/Client_(computing)) indicates which [hostname](https://en.wikipedia.org/wiki/Hostname) it is attempting to connect to at the start of the [handshaking](https://en.wikipedia.org/wiki/Handshaking) process. This allows a server to present multiple [certificates](https://en.wikipedia.org/wiki/Public_key_certificate) on the same [IP address](https://en.wikipedia.org/wiki/IP_address) and [TCP port](https://en.wikipedia.org/wiki/TCP_port)number and hence allows multiple secure ([HTTPS](https://en.wikipedia.org/wiki/HTTP_Secure)) websites (or any other [service](https://en.wikipedia.org/wiki/Server_(computing)#Types_of_servers) over TLS) to be served by the same IP address without requiring all those sites to use the same certificate. It is the conceptual equivalent to HTTP/1.1 name-based [virtual hosting](https://en.wikipedia.org/wiki/Virtual_hosting), but for HTTPS. The desired hostname is not encrypted,[[2\]](https://en.wikipedia.org/wiki/Server_Name_Indication#cite_note-Paul's_Journal-2) so an eavesdropper can see which site is being requested. – wikipedia

For now SNI is the fundamental technology for PaaS(platfrom as a service) like kubernetes, openshift, etc.

## what scenario SNI resolved?

With Host http header added in HTTP/1.1, name based virtual hosting is possible, so one server can host many site from different domain name, but point to the same ip address.
But Host http header still can not host sites which is with tls, since http frame is packaged in tls package, so we have to unpack the ttls package which will encounter performance issue.
So later, SNI([RFC 6066](https://tools.ietf.org/html/rfc6066) (obsoletes [RFC 4366](https://tools.ietf.org/html/rfc4366), which obsoleted [RFC 3546](https://tools.ietf.org/html/rfc3546))) is coming as a extension for tls, to extend client hello package with server domain name to make server can forward to different backend or upstream server.

## applications

### Many modern web server program support http virtual hosting and tls SNI now

for instance:

#### nginx[1](https://www.blogger.com/blogger.g?blogID=6097728223805908401#fn1):

```
server {
    listen          443 ssl;
    server_name     www.example.com;
    ssl_certificate www.example.com.crt;
    ...
}
server {
    listen          443 ssl;
    server_name     www.example.org;
    ssl_certificate www.example.org.crt;
    ...
}
```

#### apache[2](https://www.blogger.com/blogger.g?blogID=6097728223805908401#fn2):

```
**NameVirtualHost *:443**

<**VirtualHost *:443**>
 **ServerName www.yoursite.com**
 **DocumentRoot /var/www/site**
 SSLEngine on
 SSLCertificateFile /path/to/www_yoursite_com.crt
 SSLCertificateKeyFile /path/to/www_yoursite_com.key
 SSLCertificateChainFile /path/to/DigiCertCA.crt
</VirtualHost>

<**VirtualHost *:443**>
 **ServerName www.yoursite2.com**
 **DocumentRoot /var/www/site2**
 SSLEngine on
 SSLCertificateFile /path/to/www_yoursite2_com.crt
 SSLCertificateKeyFile /path/to/www_yoursite2_com.key
 SSLCertificateChainFile /path/to/DigiCertCA.crt
</VirtualHost>
```

## domain fronting

### what is domain fronting?

>  **Domain fronting** is a technique that circumvents [Internet censorship](https://en.wikipedia.org/wiki/Internet_censorship) by hiding the true endpoint of a connection. Working in the [application layer](https://en.wikipedia.org/wiki/Application_layer), domain fronting allows a user to connect to a blocked service over [HTTPS](https://en.wikipedia.org/wiki/HTTPS), while appearing to communicate with an entirely different site.[[1\]](https://en.wikipedia.org/wiki/Domain_fronting#cite_note-1)
> Google disabled domain fronting in April 2018, saying that it had “never been a supported feature at Google.”[[2\]](https://en.wikipedia.org/wiki/Domain_fronting#cite_note-2)[[3\]](https://en.wikipedia.org/wiki/Domain_fronting#cite_note-3) Amazon also decided to disable domain fronting for CloudFront in April 2018, claiming it was “already handled as a breach of AWS Terms of Service”.[[4\]](https://en.wikipedia.org/wiki/Domain_fronting#cite_note-4)[[5\]](https://en.wikipedia.org/wiki/Domain_fronting#cite_note-5)[[6\]](https://en.wikipedia.org/wiki/Domain_fronting#cite_note-6) This effort by both Google and Amazon was in part due to pressure from the [Russian government](https://en.wikipedia.org/wiki/Government_of_Russia) over [Telegram](https://en.wikipedia.org/wiki/Telegram_(service)) domain fronting activity using both of the cloud provider’s services. - from wikipedia

### What make domain fronting possible?

From the above sections, we can see that both TLS and http can be given a domain name, if TLS is domain name 1, and http is domain name 2, what will happen?
Yeah, domain fronting is actually this which hide the target domain name with the TLS domain.
Actually doamin fronting still need certificate SAN(Subject Alternative Name) support, means the certificate should be a wild certificate both math frontend domain name and backed domain name.
Take [youtube.com](https://youtube.com/) as a example, you can See the Subject Alternative Name part:

```
openssl x509 -in youtube.crt -text -noout 
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 6483281508665739463 (0x59f93e2ea6e148c7)
    Signature Algorithm: sha256WithRSAEncryption
        Issuer: C=US, O=Google Trust Services, CN=Google Internet Authority G3
        Validity
            Not Before: Jun 19 11:38:11 2018 GMT
            Not After : Aug 28 11:31:00 2018 GMT
        Subject: C=US, ST=California, L=Mountain View, O=Google LLC, CN=*.google.com
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                Public-Key: (2048 bit)
                Modulus:
                    00:cc:fc:51:cf:e3:43:80:79:7a:d8:c3:77:0b:d2:
                    77:73:70:d3:ba:02:eb:e2:6b:00:d8:00:98:d2:df:
                    d8:84:23:c5:61:a9:a6:c1:fe:a8:8f:4e:bb:7c:2b:
                    b8:e6:12:c6:c9:49:b8:bf:b7:f6:ff:70:ce:d2:95:
                    a3:11:e2:4c:90:bb:3d:bd:77:e2:a9:f5:62:bd:a2:
                    0e:0b:94:ea:9d:39:71:7e:3b:5a:83:99:b4:67:94:
                    f1:ed:a5:0e:f8:9b:33:40:a0:81:5e:98:58:36:e0:
                    67:69:32:6c:1b:31:c8:50:d3:82:1b:cc:2c:c2:ad:
                    4d:af:4a:1a:b6:5d:de:d4:dd:7c:cf:26:d1:45:4b:
                    ca:23:51:42:12:b2:d9:db:b5:a8:79:ef:f8:ff:6c:
                    a4:8d:a2:a6:1b:a4:09:a5:0e:42:2d:14:94:2e:72:
                    47:b0:7d:d8:8b:77:a8:ca:e5:45:4b:25:19:0d:cb:
                    3b:7a:db:23:04:c4:52:44:3f:f5:cf:79:66:cb:57:
                    1b:c8:9d:99:8d:aa:0f:03:ef:c8:5a:b6:04:0b:49:
                    9d:aa:c4:3a:ed:0e:2d:3b:53:7f:7c:49:7e:24:c5:
                    6a:9b:a2:82:d9:08:a0:33:70:c5:6b:97:13:29:aa:
                    7c:5b:9e:98:3b:75:d9:9a:7e:6d:e4:7e:c6:1c:a1:
                    fa:27
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Extended Key Usage: 
                TLS Web Server Authentication
            X509v3 Subject Alternative Name: 
                DNS:*.google.com, DNS:*.android.com, DNS:*.appengine.google.com, DNS:*.cloud.google.com, DNS:*.db833953.google.cn, DNS:*.g.co, DNS:*.gcp.gvt2.com, DNS:*.google-analytics.com, DNS:*.google.ca, DNS:*.google.cl, DNS:*.google.co.in, DNS:*.google.co.jp, DNS:*.google.co.uk, DNS:*.google.com.ar, DNS:*.google.com.au, DNS:*.google.com.br, DNS:*.google.com.co, DNS:*.google.com.mx, DNS:*.google.com.tr, DNS:*.google.com.vn, DNS:*.google.de, DNS:*.google.es, DNS:*.google.fr, DNS:*.google.hu, DNS:*.google.it, DNS:*.google.nl, DNS:*.google.pl, DNS:*.google.pt, DNS:*.googleadapis.com, DNS:*.googleapis.cn, DNS:*.googlecommerce.com, DNS:*.googlevideo.com, DNS:*.gstatic.cn, DNS:*.gstatic.com, DNS:*.gvt1.com, DNS:*.gvt2.com, DNS:*.metric.gstatic.com, DNS:*.urchin.com, DNS:*.url.google.com, DNS:*.youtube-nocookie.com, DNS:*.youtube.com, DNS:*.youtubeeducation.com, DNS:*.yt.be, DNS:*.ytimg.com, DNS:android.clients.google.com, DNS:android.com, DNS:developer.android.google.cn, DNS:developers.android.google.cn, DNS:g.co, DNS:goo.gl, DNS:google-analytics.com, DNS:google.com, DNS:googlecommerce.com, DNS:source.android.google.cn, DNS:urchin.com, DNS:www.goo.gl, DNS:youtu.be, DNS:youtube.com, DNS:youtubeeducation.com, DNS:yt.be
            Authority Information Access: 
                CA Issuers - URI:http://pki.goog/gsr2/GTSGIAG3.crt
                OCSP - URI:http://ocsp.pki.goog/GTSGIAG3

            X509v3 Subject Key Identifier: 
                D9:4B:92:A4:75:F4:CD:F5:28:49:D5:EC:57:96:7F:C3:C1:EB:CE:7E
            X509v3 Basic Constraints: critical
                CA:FALSE
            X509v3 Authority Key Identifier: 
                keyid:77:C2:B8:50:9A:67:76:76:B1:2D:C2:86:D0:83:A0:7E:A6:7E:BA:4B

            X509v3 Certificate Policies: 
                Policy: 1.3.6.1.4.1.11129.2.5.3
                Policy: 2.23.140.1.2.2

            X509v3 CRL Distribution Points: 

                Full Name:
                  URI:http://crl.pki.goog/GTSGIAG3.crl

    Signature Algorithm: sha256WithRSAEncryption
         77:7e:d6:09:ff:ca:16:23:c7:9f:14:39:de:71:5e:3d:3f:d1:
         f5:7b:63:5e:a4:8f:85:b4:f0:53:63:f1:fc:33:25:7d:36:00:
         54:b5:c4:90:18:52:64:e5:eb:9d:bc:8f:af:1a:bc:98:c0:71:
         0b:fa:24:0c:c1:26:81:a8:5a:a4:f3:53:cd:a5:d7:4e:81:95:
         94:cc:0c:19:8c:4c:69:8f:27:83:b2:de:78:10:5e:7f:00:0c:
         fb:ed:6d:ae:ce:83:64:91:6a:7b:5b:0a:f3:94:c3:47:92:86:
         fe:9f:67:d6:13:f8:2b:49:06:2d:55:3d:0f:f3:66:6f:a9:6b:
         e0:d1:bd:53:48:3a:c1:16:c0:6a:ef:bb:af:1e:54:47:56:d0:
         31:ef:d9:87:89:34:d9:16:a2:2f:c7:b0:5b:64:a0:d4:46:3d:
         cb:8d:26:7d:f0:67:b9:9a:94:80:dc:86:67:8e:fa:c7:2e:05:
         1e:e0:fc:cf:ba:bd:b7:88:53:4e:3c:57:db:50:2d:7b:38:89:
         3a:24:96:87:5a:14:81:f6:99:8e:87:44:b5:4a:5a:c7:c5:cb:
         a1:0d:65:05:2a:16:b2:3a:bf:cb:d7:f3:ac:17:c8:3a:b8:19:
         70:00:c0:8f:16:9d:1f:b6:0d:a7:4b:44:cd:45:a5:6b:62:23:
         e5:e4:93:f3
```

Since Google have disable domain fronting for [www.google.com.hk](http://www.google.com.hk/), but [youtube.com](https://youtube.com/) still support domain fronting, so for example:

```bash
$ openssl s_client -connect youtube.com:443
... skip certificate detail info
HTTP/1.1 200 OK
Date: Sat, 21 Jul 2018 05:52:33 GMT
Expires: -1
Cache-Control: private, max-age=0
Content-Type: text/html; charset=ISO-8859-1
P3P: CP="This is not a P3P policy! See g.co/p3phelp for more info."
Server: gws
X-XSS-Protection: 1; mode=block
X-Frame-Options: SAMEORIGIN
Set-Cookie: 1P_JAR=2018-07-21-05; expires=Mon, 20-Aug-2018 05:52:33 GMT; path=/; domain=.google.com
Set-Cookie: NID=135=F_8vpIQZ0iBGltkhWhg7mYPqLu2xauw0cYeAlgbFlX1-9-VPstNy_nY7Uf_mpEgY0mk0IojU52Rh9c0dUnBuO5oMHkPGIGwFL9NUcRmBOzA0IS-aLPmLYZ65iHyiiDJx; expires=Sun, 20-Jan-2019 05:52:33 GMT; path=/; domain=.google.com; HttpOnly
Accept-Ranges: none
Vary: Accept-Encoding
Transfer-Encoding: chunked
...
<title>Google</title>
...
```

And you will got the content from google, what amazing!

### Reference:

------

1. http://nginx.org/en/docs/http/configuring_https_servers.html [↩︎](https://www.blogger.com/blogger.g?blogID=6097728223805908401#fnref1)
2. https://www.digicert.com/ssl-support/apache-multiple-ssl-certificates-using-sni.htm [↩︎](https://www.blogger.com/blogger.g?blogID=6097728223805908401#fnref2)