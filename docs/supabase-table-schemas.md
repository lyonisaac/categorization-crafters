# Supabase Database Schema

This document outlines the complete database schema for the Categorization Crafters application, including tables, indexes, constraints, and Row Level Security (RLS) policies.

## Core Tables

### Users Table
Automatically created and managed by Supabase Auth.

### Profiles

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(id)
);

-- Add RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);
```

### YNAB Connections

```sql
CREATE TABLE public.ynab_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  budget_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, budget_id)
);

-- Add constraint to ensure token_expires_at is in the future
ALTER TABLE public.ynab_connections 
  ADD CONSTRAINT check_token_expires 
  CHECK (token_expires_at IS NULL OR token_expires_at > NOW());

-- Add index for performance
CREATE INDEX idx_ynab_connections_user_id ON public.ynab_connections(user_id);

-- Add documentation
COMMENT ON TABLE public.ynab_connections IS 'Stores YNAB API connection information for users';
COMMENT ON COLUMN public.ynab_connections.access_token IS 'OAuth access token for YNAB API';
COMMENT ON COLUMN public.ynab_connections.refresh_token IS 'OAuth refresh token for YNAB API';
```

### Categorization Rules

```sql
CREATE TABLE public.categorization_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  criteria JSONB NOT NULL,
  actions JSONB NOT NULL,
  relation_operator TEXT CHECK (relation_operator IN ('AND', 'OR')) DEFAULT 'AND',
  status TEXT CHECK (status IN ('active', 'inactive', 'pending')) DEFAULT 'active',
  priority INTEGER DEFAULT 100,
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add constraint to ensure priority is non-negative
ALTER TABLE public.categorization_rules 
  ADD CONSTRAINT check_priority 
  CHECK (priority >= 0);

-- Add index for performance
CREATE INDEX idx_categorization_rules_user_id ON public.categorization_rules(user_id);

-- Add documentation
COMMENT ON TABLE public.categorization_rules IS 'Stores user-defined categorization rules for transactions';
COMMENT ON COLUMN public.categorization_rules.criteria IS 'JSONB array containing rule criteria';
COMMENT ON COLUMN public.categorization_rules.actions IS 'JSONB array containing rule actions';
```

### YNAB Categories

```sql
CREATE TABLE public.ynab_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  budget_id TEXT NOT NULL,
  ynab_category_id TEXT NOT NULL,
  name TEXT NOT NULL,
  parent_category_id TEXT,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, ynab_category_id)
);

-- Add index for performance
CREATE INDEX idx_ynab_categories_user_id_budget_id ON public.ynab_categories(user_id, budget_id);

-- Add documentation
COMMENT ON TABLE public.ynab_categories IS 'Stores YNAB categories for each user and budget';
```

## Supporting Tables

### Transaction Previews

```sql
CREATE TABLE public.transaction_previews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  payee TEXT NOT NULL,
  memo TEXT,
  amount DECIMAL(15,2) NOT NULL,
  date DATE NOT NULL,
  account TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add constraint to ensure amount is positive
ALTER TABLE public.transaction_previews 
  ADD CONSTRAINT check_amount 
  CHECK (amount > 0);

-- Add index for performance
CREATE INDEX idx_transaction_previews_user_id ON public.transaction_previews(user_id);

-- Add documentation
COMMENT ON TABLE public.transaction_previews IS 'Stores sample transactions for testing rules';
```

### Rule Executions

```sql
CREATE TABLE public.rule_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_id UUID REFERENCES categorization_rules(id) NOT NULL,
  transaction_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  execution_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  success BOOLEAN NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for performance
CREATE INDEX idx_rule_executions_user_id_rule_id ON public.rule_executions(user_id, rule_id);

-- Add documentation
COMMENT ON TABLE public.rule_executions IS 'Tracks rule execution history and results';
```

### User Preferences

```sql
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  default_budget_id TEXT,
  theme TEXT DEFAULT 'light',
  auto_sync BOOLEAN DEFAULT TRUE,
  sync_frequency INTEGER DEFAULT 60, -- minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add index for performance
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);

-- Add documentation
COMMENT ON TABLE public.user_preferences IS 'Stores user preferences and settings';
```

### Audit Logs

```sql
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  operation_type TEXT NOT NULL CHECK (operation_type IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for performance
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs(table_name);

-- Add documentation
COMMENT ON TABLE public.audit_logs IS 'Tracks changes to sensitive data for auditing purposes';
```

## Row Level Security (RLS) Policies

### Enable RLS for All Tables

```sql
-- Enable RLS for each table
ALTER TABLE public.ynab_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorization_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ynab_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_previews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rule_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

### RLS Policies for YNAB Connections

```sql
CREATE POLICY "Allow select on own ynab_connections" ON public.ynab_connections
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow insert on own ynab_connections" ON public.ynab_connections
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow update on own ynab_connections" ON public.ynab_connections
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow delete on own ynab_connections" ON public.ynab_connections
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
```

### RLS Policies for Categorization Rules

```sql
CREATE POLICY "Allow select on own categorization_rules" ON public.categorization_rules
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow insert on own categorization_rules" ON public.categorization_rules
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow update on own categorization_rules" ON public.categorization_rules
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow delete on own categorization_rules" ON public.categorization_rules
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
```

### RLS Policies for YNAB Categories

```sql
CREATE POLICY "Allow select on own ynab_categories" ON public.ynab_categories
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow insert on own ynab_categories" ON public.ynab_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow update on own ynab_categories" ON public.ynab_categories
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow delete on own ynab_categories" ON public.ynab_categories
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
```

### RLS Policies for Transaction Previews

```sql
CREATE POLICY "Allow select on own transaction_previews" ON public.transaction_previews
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow insert on own transaction_previews" ON public.transaction_previews
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow update on own transaction_previews" ON public.transaction_previews
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow delete on own transaction_previews" ON public.transaction_previews
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
```

### RLS Policies for Rule Executions

```sql
CREATE POLICY "Allow select on own rule_executions" ON public.rule_executions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow select rule_executions for user's rules" ON public.rule_executions
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.categorization_rules
    WHERE categorization_rules.id = rule_executions.rule_id
    AND categorization_rules.user_id = auth.uid()
  ));

CREATE POLICY "Allow insert on own rule_executions" ON public.rule_executions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow update on own rule_executions" ON public.rule_executions
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow delete on own rule_executions" ON public.rule_executions
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
```

### RLS Policies for User Preferences

```sql
CREATE POLICY "Allow select on own user_preferences" ON public.user_preferences
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow insert on own user_preferences" ON public.user_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow update on own user_preferences" ON public.user_preferences
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow delete on own user_preferences" ON public.user_preferences
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
```

### RLS Policies for Audit Logs

```sql
CREATE POLICY "Allow select on own audit_logs" ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow insert on audit_logs" ON public.audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- No update or delete policies for audit logs to maintain integrity
```

### RLS Policies for Profiles

```sql
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);