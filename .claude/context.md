# Project Context: Sustainable Certification Manager
The project is an internal web system for a real estate developer (CGL Incorporadora). The objective is to centralize the data, metrics, and supporting files required for sustainable certification audits (such as LEED and AQUA) at construction sites.

The main flow consists of an engineer/admin logging into the system, selecting a Project (Obra), viewing the Certification requirements, and uploading metrics (e.g., waste volume, resource consumption) and files (e.g., Transport Manifests, Invoices) into a single dashboard.

# Initial Prisma Schema
Below is the initial data model. Use it as the foundation to generate TypeScript types, Server Actions, and UI interfaces.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

enum Role {
  ADMIN
  ENGINEER
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  role      Role     @default(ENGINEER)
  name      String?
  createdAt DateTime @default(now())
  
  // Relationships
  metrics   Metric[]
}

model Project {
  id          String   @id @default(uuid())
  name        String   // e.g., Atmos Building
  location    String?
  status      String   // e.g., IN_PROGRESS, COMPLETED
  createdAt   DateTime @default(now())

  metrics     Metric[]
  files       File[]
}

model Certification {
  id          String   @id @default(uuid())
  name        String   // e.g., LEED v4
  level       String?  // e.g., Gold, Platinum
  description String?
  
  metrics     Metric[]
}

model Metric {
  id              String   @id @default(uuid())
  value           Float    // The numerical value
  unit            String   // e.g., kg, tons, USD
  description     String   // e.g., Class A Waste Volume Discarded
  dateLogged      DateTime @default(now())

  // Foreign Keys
  projectId       String
  certificationId String
  loggedById      String

  // Relationships
  project         Project       @relation(fields: [projectId], references: [id])
  certification   Certification @relation(fields: [certificationId], references: [id])
  loggedBy        User          @relation(fields: [loggedById], references: [id])
  files           File[]        // Evidence files linked to this specific metric
}

model File {
  id          String   @id @default(uuid())
  fileName    String
  fileUrl     String   // Supabase Storage URL
  fileType    String   // e.g., application/pdf, image/jpeg
  uploadedAt  DateTime @default(now())

  // Foreign Keys
  projectId   String
  metricId    String?  // Optional: can be a general project file or linked to a specific metric

  project     Project  @relation(fields: [projectId], references: [id])
  metric      Metric?  @relation(fields: [metricId], references: [id])
}