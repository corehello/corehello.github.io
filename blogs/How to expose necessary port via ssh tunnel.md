### How to expose necessary port via ssh tunnel

Recently we receive a task for testing openshift on openstack.

But bad news is that the OpenShift cluster is in the private openstack which means the ip address is allocated via the private -subnet of openstack which we can not reach directly.

If we want to ssh into the masters, we have to first log into the hypervisor machine dell-r730, and then ssh into the instance openstack cluster, and then we can finally reach the clusters.


Since we can not access the cluster directly, so something should be changed to match our requirements.

After lunch, some ideas came to my mind. I remember we can exposed necessary port to our local machines or any machines we can reach directly via ssh tunnel.

So I prepare the command with `ssh -C [-f] -N -g -R xxx:8443:127.0.0.1:8443 user@xxx`.
After I tried with the command to bind to my machine with `ssh -C -f -N -g -R 0.0.0.0:8443:127.0.0.1:8443 user@10.0.0.123`, I found that It only bind to lo interface.
After read the manual of ssh, I found that bind to any ip address need open a option `GatewayPorts yes` in the configuration for my ssh daemon.

So all things are ready, and even it is a little slower, but it works!


For ssh tunnel, we can expose any tcp port and there is a tool called ngrok can expose to the public domain.

So, that's all.