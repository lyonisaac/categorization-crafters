# Configuration Guide

## Environment Setup

### Environment Variables

The application uses environment variables for configuration. Create a `.env` file in the root directory using the [.env.template](cci:7://file:///c:/Users/lyoni/python-projects/categorization-crafters/.env.template:0:0-0:0) as a reference.

Required environment variables:

```plaintext
SUPABASE_URL=your_supabase_url_here
SUPABASE_API_KEY=your_supabase_api_key_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
YNAB_API_KEY=your_ynab_api_key_here
YNAB_BUDGET_ID=your_ynab_budget_id_here