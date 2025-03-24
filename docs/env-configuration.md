# Configuration Guide

## Environment Setup

### Environment Variables

The application uses environment variables for configuration. Create a `.env` file in the root directory using the [.env.template](cci:7://file:///c:/Users/lyoni/python-projects/categorization-crafters/.env.template:0:0-0:0) as a reference.

Required environment variables:

```plaintext
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
YNAB_API_KEY=your_ynab_api_key_here
YNAB_BUDGET_ID=your_ynab_budget_id_here
```

### Notes

1. The Supabase environment variables must be prefixed with `VITE_` to be exposed to the client-side code in a Vite application.
2. The `VITE_SUPABASE_URL` should be your Supabase project URL (e.g., `https://your-project-id.supabase.co`).
3. The `VITE_SUPABASE_ANON_KEY` is your Supabase anonymous key, which can be found in your Supabase project settings.
4. The YNAB API key and budget ID are used for the YNAB integration.