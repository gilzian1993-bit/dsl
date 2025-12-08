ALTER TABLE "dsl_booking" ADD COLUMN "category" varchar(255);--> statement-breakpoint
ALTER TABLE "dsl_booking" ADD COLUMN "car_image" varchar(500) DEFAULT 'N/A';--> statement-breakpoint
ALTER TABLE "dsl_booking" DROP COLUMN "return_flight_number";--> statement-breakpoint
ALTER TABLE "dsl_booking" DROP COLUMN "return_airline_code";