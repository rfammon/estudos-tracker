import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load .env file manually
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '..', '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing environment variables:')
    console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'set' : 'missing')
    console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'set' : 'missing')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
    console.log('Testing Supabase connection...')
    console.log('URL:', supabaseUrl)

    // Test 1: Check if we can connect to achievements table
    console.log('\n--- Test 1: Achievements Table ---')
    const { data: achievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('count')
        .limit(1)

    if (achievementsError) {
        console.error('❌ Achievements error:', achievementsError.message)
        console.error('Details:', JSON.stringify(achievementsError, null, 2))
    } else {
        console.log('✅ Achievements table accessible')
        console.log('Data:', achievements)
    }

    // Test 2: Check profiles table
    console.log('\n--- Test 2: Profiles Table ---')
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)

    if (profilesError) {
        console.error('❌ Profiles error:', profilesError.message)
        console.error('Details:', JSON.stringify(profilesError, null, 2))
    } else {
        console.log('✅ Profiles table accessible')
        console.log('Data:', profiles)
    }

    // Test 3: Check study_sessions table
    console.log('\n--- Test 3: Study Sessions Table ---')
    const { data: sessions, error: sessionsError } = await supabase
        .from('study_sessions')
        .select('count')
        .limit(1)

    if (sessionsError) {
        console.error('❌ Study sessions error:', sessionsError.message)
        console.error('Details:', JSON.stringify(sessionsError, null, 2))
    } else {
        console.log('✅ Study sessions table accessible')
        console.log('Data:', sessions)
    }

    // Test 4: Check user_achievements table
    console.log('\n--- Test 4: User Achievements Table ---')
    const { data: userAchievements, error: userAchievementsError } = await supabase
        .from('user_achievements')
        .select('count')
        .limit(1)

    if (userAchievementsError) {
        console.error('❌ User achievements error:', userAchievementsError.message)
        console.error('Details:', JSON.stringify(userAchievementsError, null, 2))
    } else {
        console.log('✅ User achievements table accessible')
        console.log('Data:', userAchievements)
    }

    // Test 5: Check leaderboard_entries table
    console.log('\n--- Test 5: Leaderboard Entries Table ---')
    const { data: leaderboard, error: leaderboardError } = await supabase
        .from('leaderboard_entries')
        .select('count')
        .limit(1)

    if (leaderboardError) {
        console.error('❌ Leaderboard entries error:', leaderboardError.message)
        console.error('Details:', JSON.stringify(leaderboardError, null, 2))
    } else {
        console.log('✅ Leaderboard entries table accessible')
        console.log('Data:', leaderboard)
    }

    // Summary
    console.log('\n=== Connection Test Summary ===')
    const errors = [achievementsError, profilesError, sessionsError, userAchievementsError, leaderboardError]
    const successCount = errors.filter(e => !e).length

    if (successCount === 5) {
        console.log('✅ All tables accessible! Connection successful!')
        return true
    } else {
        console.log(`⚠️ ${successCount}/5 tables accessible`)
        return false
    }
}

testConnection()
    .then((success) => {
        console.log('\nTest completed.')
        process.exit(success ? 0 : 1)
    })
    .catch((error) => {
        console.error('\n❌ Test failed with error:', error)
        process.exit(1)
    })
