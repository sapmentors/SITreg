#connect the SAP HANA Integration System
#hdbuserstore set <mykey> <host:port> <user> <password>
hdbuserstore set HXECIKEY "${HANA_HOST}:${HANA_PORT}" "${HANA_USER}" "${HANA_PASSWORD}"

#create workspace local on the Jenkins server
regi create workspace regi_workspace --key=HXECIKEY -f

cd regi_workspace
mkdir -p ${PACKAGE}

# track the package of interest
regi track ${PACKAGE}

# check out a local copy from the SAP HANA repository
regi checkout --force

# Copy top level package directory of sources to regi workspace
rsync -qvrW --delete --exclude="regi_workspace" --exclude=".git" --exclude="._SYS_REGI_settings" "${WORKSPACE}/${top_level_package}" "${WORKSPACE}/regi_workspace/${PACKAGE}"

# Commit the changes
regi commit

# Activate the changes
regi activate

# Unassign the DU to get a proper state
regi unassign ${PACKAGE}

# Run tests
curl -u ${HANA_USER}:${HANA_PASSWORD} --cacert /etc/ssl/certs/hxehostqa.mooo.com.crt "https://${HANA_HOST}:${XS_PORT}/sap/hana/testtools/unit/jasminexs/TestRunner.xsjs?format=json&package=com.sap.sapmentors.sitreg.test" -o test.json
# Output the test suites that where run
jq .suites test.json
# Check test result
FAILURES="$(jq ".failures" test.json)"
if [ ${FAILURES} -ne 0 ]  
    then exit ${FAILURES}
fi

# create the DU if not yet existing
regi show du ${DELIVERY_UNIT} || regi create du ${DELIVERY_UNIT} --key=HXECIKEY

# Add BUILD_ID as Version Patch Number
regi update du ${DELIVERY_UNIT} --versionPatch=${BUILD_ID} --key=KEY

# assign the package to the DU
regi assign ${PACKAGE} ${DELIVERY_UNIT} --key=HXECIKEY

# Full DU export 
mkdir ${WORKSPACE}/target
regi export ${DELIVERY_UNIT} "${WORKSPACE}/target/${DELIVERY_UNIT}.tgz" --key=HXECIKEY

# Make pom.xml available for sequel jobs
cp "${WORKSPACE}/pom.xml" "${WORKSPACE}/target"
