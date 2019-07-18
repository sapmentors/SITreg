SELECT COUNT( * ) AS COUNTER FROM "SITREG"."com.sap.sapmentors.sitreg.data::SITreg.Participant" AS "Participant"
  LEFT JOIN "com.sap.sapmentors.sitreg.data::SITreg.Event" AS "Event" ON "Participant"."EventID" = "Event"."ID"
  WHERE "Event"."EventDate" < ADD_DAYS (TO_DATE (CURRENT_DATE), -14);

DELETE FROM "SITREG"."com.sap.sapmentors.sitreg.data::SITreg.Participant" AS "Participant"
  WHERE "Participant"."EventID" IN ( 
      SELECT "Event"."ID" FROM "com.sap.sapmentors.sitreg.data::SITreg.Event" AS "Event"
        WHERE "Event"."EventDate" < ADD_DAYS (TO_DATE (CURRENT_DATE), -14)
  );
