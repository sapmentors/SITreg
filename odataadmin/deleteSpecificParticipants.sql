-- Delete specific Participant
DELETE FROM "SITREG"."com.sap.sapmentors.sitreg.data::SITreg.Participant" AS "Participant"
WHERE "Participant"."History.CreatedBy" = 'USER';
-- Delete specific Ticket
DELETE FROM "SITREG"."com.sap.sapmentors.sitreg.data::SITreg.Ticket" AS "Ticket"
WHERE "Ticket"."History.CreatedBy" = 'USER';