### How to open socket with shell without nc command

Recently, my jenkins job with irc notification is not working since the nc command is removed from the jenkins slave.

And my irc notification command is something like:
```bash
(
echo NICK $USER
echo USER $USER 8 * : $USER
sleep 1
\#echo PASS $USER:$MYPASSWORD                                                                           
echo "JOIN $CHANNEL"
echo "PRIVMSG $CHANNEL" :$MSG
echo QUIT
) | nc $SERVER 6667
```


Which is rely on nc command.


After think a while, I am not want to add the nc command back, since I have to explain why I have to add it back to the jenkins slave. And I remember there are some ways to open socket use shell via some special dev files

After some google and a couple times tries, I make it work well.
```bash
(
echo NICK $USER
echo USER $USER 8 * : $USER
sleep 1
\#echo PASS $USER:$MYPASSWORD                                                                           
echo "JOIN $CHANNEL"
echo "PRIVMSG $CHANNEL" :$MSG
echo QUIT
) > /dev/tcp/$SERVER/6667
```

And thanks god that irc is plain text protocol and our irc server is not tls only.

The above command can not have the feedback from the server.

```bash
exec 3<> /dev/tcp/$SERVER/6667
(
echo NICK $USER
echo USER $USER 8 * : $USER
sleep 1
\#echo PASS $USER:$MYPASSWORD                                                                           
echo "JOIN $CHANNEL"
echo "PRIVMSG $CHANNEL" :$MSG
echo QUIT
) >&3
timeout 1 cat <&3
```



So that's all