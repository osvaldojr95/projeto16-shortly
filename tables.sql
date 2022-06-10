CREATE TABLE "customers" (
  "id" serial NOT NULL PRIMARY KEY ,
  "name" varchar(60) NOT NULL,
  "email" varchar(80) NOT NULL,
  "password" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "shortLinks" (
  "id" serial NOT NULL PRIMARY KEY,
  "customerId" integer NOT NULL REFERENCES "customers"("id"),
  "shortUrl" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "visitCount" integer NOT NULL DEFAULT '0',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "sessions" (
  "id" serial NOT NULL PRIMARY KEY,
  "customerId" integer NOT NULL REFERENCES "customers"("id"),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);