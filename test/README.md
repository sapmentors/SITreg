# Tests

As manual testing of an API with 4 different user roles can become quite tedious automated tests are the way to go. SAP is using Jasmine also in the DU HANA_TEST_TOOLS we stick with that. The test is fully automated and will create the users, assigns roles, deletes the content of the DB tables and deletes the users after execution of the test.

## Setup Guide

To run the tests you have to install [Jasmine](https://jasmine.github.io/) into the HANA repository. Do that by executing the following steps in the SAP HANA Web-based Development Workbench (Path: /sap/hana/ide/editor/):

* Download [Jasmine 2.4.1](https://github.com/jasmine/jasmine/releases/download/v2.4.1/jasmine-standalone-2.4.1.zip)
* Create the package **jasmine** below the content root
* Right click on the **jasmine** package and choose **import > archive**
* **Copy** the **.xsaccess** and **.xsapp** file from this folder to the **jasmine** package
* Adjust the **.xsaccess**  in the **jasmine** package to have the following content

  ```
  {
     "exposed":true,
     "force_ssl" : true,
     "prevent_xsrf" : true
  }
  ```

The following step will enable a service that automatically creates users, assigns roles, deletes the content of the DB tables and deletes the users again. So **NEVER** execute this steps on a productive instance of this app. The HANA user running this steps need the Roles:

* sap.hana.security.base.roles::XSUserAdmin
* sap.hana.xs.admin.roles::SQLCCAdministrator
* sap.hana.xs.admin.roles::RuntimeConfAdministrator
* sap.hana.xs.admin.roles::SAMLAdministrator
* sap.hana.xs.lm.roles::Administrator

Now you should be able to execute the following steps:

* Switch to the HANA XS Admin (Path: /sap/hana/xs/admin/#/package/jasmine)
* Click the **Edit** button
* Tick the checkbox **Public (No Authentication Required)**
* Click **Save** 
* Switch to the HANA XS Admin (Path: /sap/hana/xs/admin/#/package/com.sap.sapmentors.sitreg.test)
* Click the **Edit** button
* Tick the checkbox **Public (No Authentication Required)**
* Click **Save** 
* Navigate further to the path /sap/hana/xs/admin/#/package/com.sap.sapmentors.sitreg.test/sqlcc/public
* Click the **Edit** button
* Tick the checkbox **Active**
* Click **Save**
* Open SAP HANA Coockpit via the Link Administration Tools in the SAP HANA Cockpit -> Persistence -> MDC (see image below)
![Image of SAP HANA Coockpit](http://i.imgur.com/Pc6eiUO.png)
* Click on the Install Products and Software Components tile
![Image of Install Products tile](http://i.imgur.com/BSohUFJ.png)
* Select HANATESTTOOLS10_11-70000164.zip from your local machine
* Press Install
![Image of Install](http://i.imgur.com/TgvwjI7.png)
* After some time you should see success message "Installation Finished Successfully"
* In order to run XSUnits via HANA Test Tools you need to configure localhost.xshttpdest file
* Open SAP HANA Web-based Development Workbench and navigate to /sap/hana/testtools/unit/jasminexs/lib/
* Open in edit mode file localhost.xshttpdest and adjust as shown below. Dont forget to activate your changes.
```
description = "HTTP connection to own system";
// change host to your HCP trial instance
host = "xxxtrial.hanatrial.ondemand.com";
port = 443;
pathPrefix = "";
useProxy = false;
authType = none;
useSSL = true;
sslAuth = anonymous;
sslHostCheck = false;
```

## Test execution

Open an **Incognito Window** (Chrome) or **Private Window** (Firefox) and call the path /com/sap/sapmentors/sitreg/test/ on your HANA System.
Note **run the test twice** first run creates data and second run then can verify tests
