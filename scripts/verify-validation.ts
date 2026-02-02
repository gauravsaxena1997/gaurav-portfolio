import { validate } from '../src/lib/validation';
import { contactFormSchema } from '../src/lib/validation/schemas';
import { AppError } from '../src/lib/errors/AppError';

console.log('\n🔍 Testing Validation Layer...\n');

async function runTests() {
    // Test 1: Valid Data
    console.log('1️⃣  Testing Valid Data...');
    try {
        const validData = {
            name: 'John Doe',
            email: 'john@example.com',
            message: 'Hello, I would like to work with you on a project.',
            subject: 'Project Inquiry'
        };
        await validate(contactFormSchema, validData);
        console.log('✅ Success: Valid data passed validation.');
    } catch (error) {
        console.error('❌ Failed: Valid data should pass.', error);
    }

    // Test 2: Invalid Email
    console.log('\n2️⃣  Testing Invalid Email...');
    try {
        const invalidEmailData = {
            name: 'John Doe',
            email: 'not-an-email',
            message: 'Hello world.'
        };
        await validate(contactFormSchema, invalidEmailData);
        console.error('❌ Failed: Invalid email should throw error.');
    } catch (error) {
        if (error instanceof AppError && error.code === 'VALIDATION_ERROR') {
            console.log('✅ Success: Caught expected Validation Error.');
            console.log('Context:', JSON.stringify(error.context, null, 2));
        } else {
            console.error('❌ Failed: Unexpected error type.', error);
        }
    }

    // Test 3: Message Too Short
    console.log('\n3️⃣  Testing Short Message...');
    try {
        const shortMessageData = {
            name: 'John Doe',
            email: 'john@example.com',
            message: 'Hi'
        };
        await validate(contactFormSchema, shortMessageData);
        console.error('❌ Failed: Short message should throw error.');
    } catch (err) {
        console.log('✅ Success: Caught expected Validation Error (Message too short).');
    }
}

runTests().then(() => console.log('\n✅ Verification Complete'));
