-- Add metadata used by the automatic blog generation pipeline.
ALTER TABLE "BlogPost"
ADD COLUMN "sourceUrl" TEXT,
ADD COLUMN "sourceUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "contentHash" TEXT,
ADD COLUMN "imageOriginalUrl" TEXT,
ADD COLUMN "imageDescriptionUrl" TEXT,
ADD COLUMN "imageCredit" TEXT,
ADD COLUMN "imageLicense" TEXT,
ADD COLUMN "imageLicenseUrl" TEXT,
ADD COLUMN "publishedAtReference" TIMESTAMP(3);

CREATE UNIQUE INDEX "BlogPost_sourceUrl_key" ON "BlogPost"("sourceUrl");
CREATE UNIQUE INDEX "BlogPost_contentHash_key" ON "BlogPost"("contentHash");

