import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
	"https://txonxnqwiebkgonjgvsm.supabase.co",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4b254bnF3aWVia2dvbmpndnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU0NDM0NjYsImV4cCI6MTk5MTAxOTQ2Nn0.Uritgf07N2ay8vdAkPt1JYPz9VMvhY4Rvs92kJzUozQ"
);
