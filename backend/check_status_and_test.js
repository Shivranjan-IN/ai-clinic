const prisma = require('./config/database');

async function main() {
    try {
        // Check status master
        const statuses = await prisma.appointment_status_master.findMany();
        console.log('=== appointment_status_master ===');
        console.log(JSON.stringify(statuses, null, 2));

        // Try creating a minimal test appointment
        // First get a real patient_id
        const patient = await prisma.patients.findFirst();
        console.log('\n=== Sample Patient ===');
        console.log('patient_id:', patient?.patient_id);

        // Get a real doctor
        const doctor = await prisma.doctors.findFirst();
        console.log('\n=== Sample Doctor ===');
        console.log('doctor id:', doctor?.id);

    } catch (e) {
        console.error('Error:', e.message);
        if (e.meta) console.error('Meta:', e.meta);
    } finally {
        await prisma.$disconnect();
    }
}

main();
