import { errorHandler } from '../src/lib/errors/ErrorHandler';
import { AppError } from '../src/lib/errors/AppError';
import { logger } from '../src/lib/logger';

// Mock logger to verify output
logger.error = (msg, meta) => {
    // eslint-disable-next-line no-console
    console.log('--- LOGGER OUTPUT ---');
    // eslint-disable-next-line no-console
    console.log('Message:', msg);
    // eslint-disable-next-line no-console
    console.log('Meta:', JSON.stringify(meta, null, 2));
    // eslint-disable-next-line no-console
    console.log('---------------------');
};

// eslint-disable-next-line no-console
console.log('\n🔍 Testing Error Handling Infrastructure...\n');

// Test 1: Standard Error
// eslint-disable-next-line no-console
console.log('1️⃣  Simulating Standard Error...');
try {
    throw new Error('Standard JS Error');
} catch (err) {
    errorHandler.handleError(err);
}

// Test 2: AppError (Trusted)
// eslint-disable-next-line no-console
console.log('\n2️⃣  Simulating AppError (Trusted)...');
try {
    throw new AppError({
        message: 'Validation Failed',
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        isOperational: true,
        context: { field: 'email' }
    });
} catch (err) {
    errorHandler.handleError(err);
}

// Test 3: String Error
// eslint-disable-next-line no-console
console.log('\n3️⃣  Simulating String Error...');
try {
    throw 'Something went badly wrong';
} catch (err) {
    errorHandler.handleError(err);
}

// eslint-disable-next-line no-console
console.log('\n✅ Verification Complete');
