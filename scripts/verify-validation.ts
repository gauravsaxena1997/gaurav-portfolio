import { validate } from '../src/lib/validation';
import { contactFormSchema } from '../src/lib/validation/schemas';
import { AppError } from '../src/lib/errors/AppError';

// eslint-disable-next-line no-console
console.log('\n🔍 Testing Validation Layer...\n');

async function runTests() {
    // Test 1: Valid Data
    // eslint-disable-next-line no-console
    console.log('1️⃣  Testing Valid Data...');
    try {
        const validData = {
            name: 'John Doe',
            email: 'john@example.com',
            message: 'Hello, I would like to work with you on a project.',
            subject: 'Project Inquiry'
        };
        await validate(contactFormSchema, validData);
        // eslint-disable-next-line no-console
        console.log('✅ Success: Valid data passed validation.');
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('❌ Failed: Valid data should pass.', error);
    }

    // Test 2: Invalid Email
    // eslint-disable-next-line no-console
    console.log('\n2️⃣  Testing Invalid Email...');
    try {
        const invalidEmailData = {
            name: 'John Doe',
            email: 'not-an-email',
            message: 'Hello world.'
        };
        await validate(contactFormSchema, invalidEmailData);
        // eslint-disable-next-line no-console
        console.error('❌ Failed: Invalid email should throw error.');
    } catch (error) {
        if (error instanceof AppError && error.code === 'VALIDATION_ERROR') {
            // eslint-disable-next-line no-console
            console.log('✅ Success: Caught expected Validation Error.');
            // eslint-disable-next-line no-console
            console.log('Context:', JSON.stringify(error.context, null, 2));
        } else {
            // eslint-disable-next-line no-console
            console.error('❌ Failed: Unexpected error type.', error);
        }
    }

    // Test 3: Message Too Short
    // eslint-disable-next-line no-console
    console.log('\n3️⃣  Testing Short Message...');
    try {
        const shortMessageData = {
            name: 'John Doe',
            email: 'john@example.com',
            message: 'Hi'
        };
        await validate(contactFormSchema, shortMessageData);
        // eslint-disable-next-line no-console
        console.error('❌ Failed: Short message should throw error.');
    } catch {
        // eslint-disable-next-line no-console
        console.log('✅ Success: Caught expected Validation Error (Message too short).');
    }
}

runTests().then(() => {
    // eslint-disable-next-line no-console
    console.log('\n✅ Verification Complete');
});
