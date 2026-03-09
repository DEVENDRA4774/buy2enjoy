/**
 * One-time script to ensure all database indexes are created.
 * Run with: node scripts/addIndexes.js
 * 
 * This is optional — Mongoose auto-creates indexes defined in schemas
 * on first connection. This script forces immediate index creation.
 */

const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Import all models to register their schemas + indexes
require('../models/User');
require('../models/Product');
require('../models/Order');
require('../models/Booking');
require('../models/HealthRecord');
require('../models/WalletTransaction');
require('../models/Partner');
require('../models/Notification');
require('../models/Review');
require('../models/VendorProfile');
require('../models/VendorKYC');
require('../models/CommissionTier');
require('../models/DisputeTicket');
require('../models/PayoutLog');
require('../models/SponsoredListing');
require('../models/SubscriptionTier');
require('../models/UserTrustScore');

const syncIndexes = async () => {
    try {
        await connectDB();
        console.log('Syncing all indexes...\n');

        const models = mongoose.modelNames();
        for (const modelName of models) {
            const model = mongoose.model(modelName);
            await model.syncIndexes();
            const indexes = await model.collection.indexes();
            console.log(`✅ ${modelName}: ${indexes.length} indexes`);
            indexes.forEach(idx => {
                console.log(`   - ${JSON.stringify(idx.key)}`);
            });
        }

        console.log('\n✅ All indexes synced successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error syncing indexes:', error.message);
        process.exit(1);
    }
};

syncIndexes();
