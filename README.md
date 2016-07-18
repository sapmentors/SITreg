# SAP Inside Track Registration app backend

This repository contains the backend for the SITreg app. It is developed on SAP HANA native using XSODATA. For more details check out the information in the [Wiki](https://github.com/sapmentors/SITreg/wiki). You can find the frontend projects here:

* [SITregParticipant](https://github.com/sapmentors/SITregParticipant)
* [SITregOrganizer](https://github.com/sapmentors/SITregOrganizer)

## Setup Guide

You must have developer authorization in your HANA System. To try this project just spin up your own HANA Multitennant Database Container (MDC) on the [HANA Cloud Platform Trial (HCP)](https://hcp.sap.com/). Open the SAP HANA Web-based Development Workbench and create the package:

    com/sap/sapmentors/sitreg

After you've created the package right click on the **sitreg** package and choose **Syncronize with GitHub**. Provide your GitHub credentials to allow the HANA system to read your GitHub repositories. As you can't specify a GitHub repository URL you have to fork the project so you have it in your repository list. Then coose the cloned repository and GitHub branch **master**. Click **Fetch** to retreive the content. After that step you have to activate the artifacts. Try a right click **activate all**.

To test the different services with the correct authorizations setup the users: 

* PARTICIPANT 
* ORGANIZER
* SITREGADMIN
 
Assign the roles:

* com.sap.sapmentors.sitreg.roles::participant (to PARTICIPANT)
* com.sap.sapmentors.sitreg.roles::organizer (to ORGANIZER)
* com.sap.sapmentors.sitreg.roles::admin (to SITREGADMIN)

to be able to test the different services also according the correct implementation of the authorizations.
