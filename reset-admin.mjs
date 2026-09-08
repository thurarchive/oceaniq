import { createClient } from "@supabase/supabase-js";

// You must use your SERVICE ROLE KEY here, not the public anon key!
const supabaseUrl = "https://qflujeowdxinhofmorqm.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmbHVqZW93ZHhpbmhvZm1vcnFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTc3NTg3NSwiZXhwIjoyMDk3MzUxODc1fQ.v2tXkKToohVQC1Z7bhgbNJ-iGhPT30gVakuipmqjk58"; // Replace this

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function resetPassword() {
    const { data, error } = await supabase.auth.admin.updateUserById(
        "67587ca2-13cd-41eb-950b-723f4e03af49", // The user ID from your script
        {
            password: "admin123", // Put your new desired password here
            email_confirm: true
        }
    );

    if (error) {
        console.error("Error updating user:", error.message);
    } else {
        console.log("Password successfully updated for user:", data.user.email);
    }
}

resetPassword();
