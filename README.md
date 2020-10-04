1. Install the Cloudbreak deployer and unzip the platform-specific single binary to your PATH. For example:
~~~
yum -y install unzip tar
curl -Ls public-repo-1.hortonworks.com/HDP/cloudbreak/cloudbreak-deployer_2.9.1_$(uname)_x86_64.tgz | sudo tar -xz -C /bin cbd
cbd --version
~~~
Once the Cloudbreak deployer is installed, you can set up the Cloudbreak application.

2. Create a Cloudbreak deployment directory and navigate to it:

~~~
mkdir cloudbreak-deployment
cd cloudbreak-deployment
~~~
3. In the directory, create a file called Profile with the following content:
~~~
export UAA_DEFAULT_SECRET=[$MY-SECRET]
export UAA_DEFAULT_USER_PW=[$MY-PASSWORD]
export UAA_DEFAULT_USER_EMAIL=[$MY-EMAIL]
export PUBLIC_IP=[$MY_VM_IP]
~~~
For example:

~~~
export UAA_DEFAULT_SECRET=MySecret123
export UAA_DEFAULT_USER_PW=MySecurePassword123
export UAA_DEFAULT_USER_EMAIL=test@cloudera.com
export PUBLIC_IP=172.26.231.100
~~~
You will need to provide the email and password when logging in to the Cloudbreak web UI and when using the Cloudbreak CLI. The secret will be used by Cloudbreak for authentication.

You should set the CLOUDBREAK_SMTP_SENDER_USERNAME variable to the username you use to authenticate to your SMTP server. You should set the CLOUDBREAK_SMTP_SENDER_PASSWORD variable to the password you use to authenticate to your SMTP server.

4. Generate configurations by executing:
~~~
rm *.yml
cbd generate
~~~
The cbd start command includes the cbd generate command which applies the following steps:

* Creates the docker-compose.yml file, which describes the configuration of all the Docker containers required for the Cloudbreak deployment.
* Creates the uaa.yml file, which holds the configuration of the identity server used to authenticate users with Cloudbreak.
5. Start the Cloudbreak application by using the following commands:
~~~
cbd pull-parallel
cbd start
~~~
This will start the Docker containers and initialize the application. The first time you start the Cloudbreak application, the process will take longer than usual due to the download of all the necessary docker images.

6. Next, check Cloudbreak application logs:
~~~
cbd logs cloudbreak
~~~
You should see a message like this in the log: Started Cloudbreak Application in 36.823 seconds. Cloudbreak normally takes less than a minute to start.
