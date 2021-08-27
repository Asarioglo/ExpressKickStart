\c appdata

CREATE TABLE "Student" (
  "ID" CHAR(36),
  "ParentID" CHAR(36),
  "FirstName" VARCHAR(50),
  "MiddleName" VARCHAR(50),
  "LastName" VarChar(100),
  PRIMARY KEY ("ID")
);

CREATE TABLE "Staff" (
  "ID" CHAR(36),
  "FirstName" VARCHAR(50),
  "MiddleName" VARCHAR(50),
  "LastName" VarChar(100),
  PRIMARY KEY ("ID")
);

CREATE TABLE "Post" (
  "ID" VARCHAR(36),
  "CreatorID" VARCHAR(36),
  "TimeStamp" TIMESTAMP,
  PRIMARY KEY ("ID"),
  CONSTRAINT "FK_Post.CreatorID"
    FOREIGN KEY ("CreatorID")
      REFERENCES "Staff"("ID")
);

CREATE TABLE "Content" (
  "ID" CHAR(36),
  "PostID" CHAR(36),
  PRIMARY KEY ("ID"),
  CONSTRAINT "FK_Content.PostID"
    FOREIGN KEY ("PostID")
      REFERENCES "Post"("ID")
);

CREATE TABLE "Parent" (
  "ID" CHAR(36),
  "FirstName" VARCHAR(50),
  "MiddleName" VARCHAR(50),
  "LastName" VarChar(100),
  PRIMARY KEY ("ID")
);

CREATE TABLE "StudentParent" (
  "StudentID" CHAR(36),
  "ParentID" CHAR(36),
  CONSTRAINT "FK_StudentParent.StudentID"
    FOREIGN KEY ("StudentID")
      REFERENCES "Student"("ID") ON DELETE CASCADE,
  CONSTRAINT "FK_StudentParent.ParentID"
    FOREIGN KEY ("ParentID")
      REFERENCES "Parent"("ID") ON DELETE CASCADE
);

CREATE TABLE "TextContent" (
  "ID" CHAR(36),
  "ContentID" CHAR(36),
  "Text" TEXT,
  PRIMARY KEY ("ID"),
  CONSTRAINT "FK_TextContent.ContentID"
    FOREIGN KEY ("ContentID")
      REFERENCES "Content"("ID") ON DELETE CASCADE
);

CREATE TABLE "Group" (
  "ID" CHAR(36),
  "Name" VARCHAR(100),
  PRIMARY KEY ("ID")
);

CREATE TABLE "StaffGroup" (
  "StaffID" CHAR(36),
  "GroupID" CHAR(36),
  CONSTRAINT "FK_StaffGroup.StaffID"
    FOREIGN KEY ("StaffID")
      REFERENCES "Staff"("ID") ON DELETE CASCADE,
  CONSTRAINT "FK_StaffGroup.GroupID"
    FOREIGN KEY ("GroupID")
      REFERENCES "Group"("ID") ON DELETE CASCADE
);

CREATE TABLE "StudentGroup" (
  "StudentID" CHAR(36),
  "GroupID" CHAR(36),
  CONSTRAINT "FK_StudentGroup.StudentID"
    FOREIGN KEY ("StudentID")
      REFERENCES "Student"("ID") ON DELETE CASCADE,
  CONSTRAINT "FK_StudentGroup.GroupID"
    FOREIGN KEY ("GroupID")
      REFERENCES "Group"("ID") ON DELETE CASCADE
);

CREATE TABLE "StudentPost" (
  "PostID" CHAR(36),
  "StudentID" CHAR(36),
  CONSTRAINT "FK_StudentPost.StudentID"
    FOREIGN KEY ("StudentID")
      REFERENCES "Student"("ID") ON DELETE CASCADE,
  CONSTRAINT "FK_StudentPost.PostID"
    FOREIGN KEY ("PostID")
      REFERENCES "Post"("ID") ON DELETE CASCADE
);

