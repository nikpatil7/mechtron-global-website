require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');
const Service = require('../models/Service');
const Inquiry = require('../models/Inquiry');
const SiteSettings = require('../models/SiteSettings');
const User = require('../models/User');

// ====================================
// CONFIGURATION
// ====================================
// Source database (old Mechtron database)
const SOURCE_DB = 'mongodb+srv://nikhilpatil4714:tg8Yf7HrTgYY4nt5@mindforgecluster1.97272zf.mongodb.net/mechtron';

// Target database (new KataVerse database - from .env)
const TARGET_DB = process.env.MONGODB_URI || 'mongodb+srv://nikhilpatil4714:tg8Yf7HrTgYY4nt5@mindforgecluster1.97272zf.mongodb.net/KataVerseBIMDB';

// ====================================
// HELPER FUNCTIONS
// ====================================
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function connectToDatabase(uri, dbName) {
  try {
    await mongoose.connect(uri);
    console.log(`✅ Connected to ${dbName}`);
    return mongoose.connection;
  } catch (error) {
    console.error(`❌ Error connecting to ${dbName}:`, error.message);
    throw error;
  }
}

async function fetchCollection(Model, collectionName) {
  try {
    const data = await Model.find({}).lean();
    console.log(`📦 Fetched ${data.length} documents from ${collectionName}`);
    return data;
  } catch (error) {
    console.error(`❌ Error fetching ${collectionName}:`, error.message);
    return [];
  }
}

async function insertCollection(Model, data, collectionName) {
  try {
    if (data.length === 0) {
      console.log(`⏭️  No data to insert for ${collectionName}`);
      return;
    }
    
    // Remove _id field to let MongoDB generate new ones
    const cleanData = data.map(doc => {
      const { _id, __v, ...rest } = doc;
      return rest;
    });
    
    await Model.insertMany(cleanData);
    console.log(`✅ Inserted ${cleanData.length} documents into ${collectionName}`);
  } catch (error) {
    console.error(`❌ Error inserting ${collectionName}:`, error.message);
    throw error;
  }
}

// ====================================
// MAIN MIGRATION FUNCTION
// ====================================
async function migrateData() {
  let sourceConnection;
  let targetConnection;

  try {
    console.log('\n🚀 KataVerse BIM Services - Database Migration Tool\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`📌 Source DB: ${SOURCE_DB.split('@')[1]?.split('/')[1] || 'mechtron'}`);
    console.log(`📌 Target DB: ${TARGET_DB.split('@')[1]?.split('/')[1] || 'KataVerseDB'}`);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Confirm before proceeding
    const confirm = await askQuestion('⚠️  This will OVERWRITE all data in the target database. Continue? (yes/no): ');
    if (confirm.toLowerCase() !== 'yes') {
      console.log('\n❌ Migration cancelled.\n');
      rl.close();
      return;
    }

    console.log('\n📊 Step 1: Connecting to SOURCE database...');
    sourceConnection = await connectToDatabase(SOURCE_DB, 'Source (Mechtron)');

    // Fetch all data from source
    console.log('\n📊 Step 2: Fetching data from SOURCE database...\n');
    const projects = await fetchCollection(Project, 'projects');
    const testimonials = await fetchCollection(Testimonial, 'testimonials');
    const services = await fetchCollection(Service, 'services');
    const inquiries = await fetchCollection(Inquiry, 'inquiries');
    const siteSettings = await fetchCollection(SiteSettings, 'siteSettings');
    const users = await fetchCollection(User, 'users');

    console.log('\n📊 Step 3: Disconnecting from SOURCE database...');
    await mongoose.disconnect();
    console.log('✅ Disconnected from source\n');

    // Connect to target
    console.log('📊 Step 4: Connecting to TARGET database...');
    targetConnection = await connectToDatabase(TARGET_DB, 'Target (KataVerse)');

    // Clear existing data
    console.log('\n📊 Step 5: Clearing existing data in TARGET database...\n');
    await Project.deleteMany({});
    await Testimonial.deleteMany({});
    await Service.deleteMany({});
    await Inquiry.deleteMany({});
    await SiteSettings.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Target database cleared\n');

    // Insert data into target
    console.log('📊 Step 6: Inserting data into TARGET database...\n');
    await insertCollection(Project, projects, 'projects');
    await insertCollection(Testimonial, testimonials, 'testimonials');
    await insertCollection(Service, services, 'services');
    await insertCollection(Inquiry, inquiries, 'inquiries');
    await insertCollection(SiteSettings, siteSettings, 'siteSettings');
    await insertCollection(User, users, 'users');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🎉 Migration completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Projects: ${projects.length}`);
    console.log(`   - Testimonials: ${testimonials.length}`);
    console.log(`   - Services: ${services.length}`);
    console.log(`   - Inquiries: ${inquiries.length}`);
    console.log(`   - Site Settings: ${siteSettings.length}`);
    console.log(`   - Users: ${users.length}`);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from database\n');
    rl.close();
  }
}

// ====================================
// RUN MIGRATION
// ====================================
migrateData().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
