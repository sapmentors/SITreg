SELECT * FROM "com.sap.sapmentors.sitreg.data::SITreg.Event" 
  WHERE "EventDate" < CURRENT_DATE
  ORDER BY "EventDate" DESC;
UPDATE "com.sap.sapmentors.sitreg.data::SITreg.Event"
   SET "Visible" = 'N'
   WHERE "EventDate" < CURRENT_DATE;
