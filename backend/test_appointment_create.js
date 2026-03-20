const prisma = require('./config/database');

async function testCreateAppointment() {
    try {
        // Get real patient and doctor from DB
        const patient = await prisma.patients.findFirst();
        const doctor = await prisma.doctors.findFirst();

        if (!patient || !doctor) {
            console.error('No patient or doctor found in DB');
            return;
        }

        const now = new Date();
        const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
        const testTime = '1970-01-01T10:00:00.000Z';

        const appointmentData = {
            appointment_id: `APT-TEST-${Date.now()}`,
            patient_id: patient.patient_id,
            doctor_id: doctor.id,
            appointment_date: tomorrow,
            appointment_time: new Date(testTime),
            appointment_type: 'in-clinic',
            mode: 'offline',
            status: 'scheduled',
            consult_duration: 30,
            earnings: 500,
            reason_for_visit: 'Test booking'
        };

        console.log('Creating test appointment with data:', JSON.stringify(appointmentData, null, 2));

        const result = await prisma.appointments.create({ data: appointmentData });
        console.log('\n✅ Appointment created successfully!');
        console.log('appointment_id:', result.appointment_id);
        console.log('status:', result.status);

        // Clean up the test record
        await prisma.appointments.delete({ where: { appointment_id: result.appointment_id } });
        console.log('🧹 Test appointment cleaned up');

    } catch (e) {
        console.error('\n❌ Error creating appointment:', e.message);
        if (e.meta) console.error('Meta:', JSON.stringify(e.meta, null, 2));
        if (e.code) console.error('Code:', e.code);
    } finally {
        await prisma.$disconnect();
    }
}

testCreateAppointment();
