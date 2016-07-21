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
* sap.hana.security.base.roles::XSUserAdmin
* sap.hana.xs.admin.roles::RuntimeConfAdministrator
* sap.hana.xs.admin.roles::SAMLAdministrator

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

## Test execution

Open an **Incognito Window** (Chrome) or **Private Window** (Firefox) and call the path /com/sap/sapmentors/sitreg/test/ on your HANA System.
Note **run the test twice** first run creates data and second run then can verify tests
