-- Read Participants
SELECT *
FROM "SITREG"."com.sap.sapmentors.sitreg.data::SITreg.Participant" AS "Participant";
-- Read Tickets
SELECT *
FROM "SITREG"."com.sap.sapmentors.sitreg.data::SITreg.Ticket" AS "Ticket";
-- Delete Participants of a specific Event
DELETE FROM "SITREG"."com.sap.sapmentors.sitreg.data::SITreg.Participant" AS "Participant"
WHERE "Participant"."EventID" = '93';
-- Count Participants of Events older than 14 days 
SELECT COUNT(*) AS COUNTER
FROM "SITREG"."com.sap.sapmentors.sitreg.data::SITreg.Participant" AS "Participant"
  LEFT JOIN "com.sap.sapmentors.sitreg.data::SITreg.Event" AS "Event" ON "Participant"."EventID" = "Event"."ID"
WHERE "Event"."EventDate" < ADD_DAYS (TO_DATE (CURRENT_DATE), -14);
-- Delete Participants of Events older than 14 days
DELETE FROM "SITREG"."com.sap.sapmentors.sitreg.data::SITreg.Participant" AS "Participant"
WHERE "Participant"."EventID" IN (
    SELECT "Event"."ID"
    FROM "com.sap.sapmentors.sitreg.data::SITreg.Event" AS "Event"
    WHERE "Event"."EventDate" < ADD_DAYS (TO_DATE (CURRENT_DATE), -14)
  );
-- To avoid issue https://github.com/sapmentors/SITreg/issues/56 also delete Tickets must be executed
-- Delete Ticket of Events older than 14 days
DELETE FROM "SITREG"."com.sap.sapmentors.sitreg.data::SITreg.Ticket" AS "Ticket"
WHERE "Ticket"."EventID" IN (
    SELECT "Event"."ID"
    FROM "com.sap.sapmentors.sitreg.data::SITreg.Event" AS "Event"
    WHERE "Event"."EventDate" < ADD_DAYS (TO_DATE (CURRENT_DATE), -14)
  );