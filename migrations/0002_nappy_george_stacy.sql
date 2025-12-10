CREATE TABLE "dsl_admin" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'admin',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "dsl_admin_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "dsl_booking" ADD COLUMN "payment_status" varchar(50) DEFAULT 'pending';