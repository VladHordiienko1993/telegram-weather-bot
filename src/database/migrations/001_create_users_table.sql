-- Create users table for storing user preferences
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT PRIMARY KEY,                    -- Telegram user ID
    username VARCHAR(255),                         -- Telegram @username (может быть null)
    first_name VARCHAR(255),                       -- Имя пользователя
    last_name VARCHAR(255),                        -- Фамилия пользователя  
    language VARCHAR(5) NOT NULL DEFAULT 'en',     -- Язык: 'en', 'ru', 'uk', 'pl'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster language lookups
CREATE INDEX IF NOT EXISTS idx_users_language ON users(language);

-- Create index for username lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username) WHERE username IS NOT NULL;

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some test data (optional)
INSERT INTO users (user_id, first_name, language) 
VALUES (123456789, 'Test User', 'en')
ON CONFLICT (user_id) DO NOTHING;