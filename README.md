# SAP Event Registration app backend

The SAP Event Registration app is a community project licensed under Apache License Version 2.0. The app provides organizers of SAP community events a platform for the participant registration. It's running already in production using the [SAP Mentors](http://sapmentors.sap.com) HANA Cloud Platform Account and can be accessed at:

* [Public Participant List](https://sitregparticipantlist-a5a504e08.dispatcher.hana.ondemand.com/)
* [Participant Registration (SCN Account required)](https://sitregparticipant-a5a504e08.dispatcher.hana.ondemand.com/)
* [Organizer Backend (Additional authorization required)](https://sitregorganizer-a5a504e08.dispatcher.hana.ondemand.com/)
 
If you're organizing a SAP community event please reach out to [Gregor Wolf](mailto:gregor.wolf@gmail.com) to get access to the Organizer Backend. If you want to contribute please check the open issues, fork the project and start coding.

This repository contains the backend for the SITreg app. It is developed on SAP HANA XS Classic (XSC) using mainly XSODATA to expose an OData API. For more details check out the information in the [Wiki](https://github.com/sapmentors/SITreg/wiki). You can find the frontend projects here:

* [SITRegParticipantList](https://github.com/sapmentors/SITRegParticipantList)
* [SITregParticipant](https://github.com/sapmentors/SITregParticipant)
* [SITregReceptionist](https://github.com/sapmentors/SITregReceptionist)
* [SITregOrganizer](https://github.com/sapmentors/SITregOrganizer)

## Setup Guide

In addition to the following expert guide you can check out the setup guide in the  [Wiki](https://github.com/sapmentors/SITreg/wiki/Setup:-1.-Create-MDC-Database-on-HCP).

### Backend

You must have developer authorization in your HANA System. To try this project just spin up your own HANA Multitennant Database Container (MDC) on the [HANA Cloud Platform Trial (HCP)](https://hcp.sap.com/). Open the SAP HANA Web-based Development Workbench and create the package:

    com/sap/sapmentors/sitreg

After you've created the package right click on the **sitreg** package and choose **Syncronize with GitHub**. Provide your GitHub credentials to allow the HANA system to read your GitHub repositories. As you can't specify a GitHub repository URL you have to fork the project so you have it in your repository list. Then choose the cloned repository and GitHub branch **master**. Click **Fetch** to retreive the content. After that step you have to activate the artifacts. Try a right click **activate all**.

To test the different services with the correct authorizations setup the users: 

* PARTICIPANT 
* ORGANIZER
* COORGANIZER
* SITREGADMIN
 
Assign the roles:

* com.sap.sapmentors.sitreg.roles::participant (to PARTICIPANT)
* com.sap.sapmentors.sitreg.roles::organizer (to ORGANIZER and COORGANIZER)
* com.sap.sapmentors.sitreg.roles::admin (to SITREGADMIN)

to be able to test the different services also according the correct implementation of the authorizations.

### Frontend Access to the Data

To be able to test the two frontend apps with the backend you have to create a destination in the **SAP HANA Cloud Platform Cockpit**. If you adjust the following and save it in a file called **HANAMDC** you can use the **Import Destination** function. After that you only have to maintain the password for your user.

For the application sapmentors/SITregParticipantList you need the destination HANAMDC_PUBLIC. The steps of creation are the same as already described.

The user stored in this destination is used for accessing the HANA database in the backend. In order to use the needed OData services the user needs to own the roles 
* "com.sap.sapmentors.sitreg.odataparticipant::participant" and 
* "com.sap.sapmentors.sitreg.odataparticipant::organizer". 

Roles are assigned in the Security part of the SAP HANA Web-based Development Workbench.

```
Type=HTTP
Authentication=BasicAuthentication
Name=HANAMDC
WebIDEEnabled=true
URL=https\://<your-hana-mdc-host>.hanatrial.ondemand.com
ProxyType=Internet
User=<user_on_HANAMDC>
WebIDESystem=HANAMDC
```

For the Setup of the Frontend Application itself refer to the Readme and Setup Guide of sapmentors/SITrefParticipant

### Use of AppToAppSSO (optional)
If you want to use AppToAppSSO as described in the Frontend section, you further must activate the SAML Authentication Method for the odataorganizer and odataparticipant. You do that by calling the XS Admin via the path:

* /sap/hana/xs/admin/#/package/com.sap.sapmentors.sitreg.odataorganizer
* /sap/hana/xs/admin/#/package/com.sap.sapmentors.sitreg.odataparticipant 
 
For the anonymous access you have to activate the SQL Connection Details via the path:

* /sap/hana/xs/admin/#/package/com.sap.sapmentors.sitreg.odatapublic/sqlcc/public

and also enable **Public (No Authentication Required)** access to the package odatapublic. You do this via the path

* /sap/hana/xs/admin/#/package/com.sap.sapmentors.sitreg.odatapublic

If you want to use the HANA MDC XSODATA Service in a HCP HTML5 app with App2AppSSO then follow the great Blog by Martin Raepple: [Principal Propagation between HTML5- or Java-based applications and SAP HANA XS on SAP HANA Cloud Platform](http://scn.sap.com/community/developer-center/cloud-platform/blog/2016/03/21/principal-propagation-between-html5-and-sap-hana-xs-on-sap-hana-cloud-platform). After you've did the setup you can adjust your destination and set

```
Authentication=AppToAppSSO
```
