const prisma = require('./config/database');

async function seedStatusMaster() {
    const statuses = [
        { status_code: 'scheduled',   description: 'Appointment is scheduled' },
        { status_code: 'completed',   description: 'Appointment has been completed' },
        { status_code: 'cancelled',   description: 'Appointment was cancelled' },
        { status_code: 'no-show',     description: 'Patient did not show up' },
        { status_code: 'in_progress', description: 'Appointment is currently in progress' },
    ];

    try {
        for (const s of statuses) {
            await prisma.appointment_status_master.upsert({
                where: { status_code: s.status_code },
                update: { description: s.description },
                create: s,
            });
            console.log(`✅ Upserted status: ${s.status_code}`);
        }
        console.log('\nDone seeding appointment_status_master!');
    } catch (e) {
        console.error('Error seeding status master:', e.message);
        if (e.meta) console.error('Meta:', e.meta);
    } finally {
        await prisma.$disconnect();
    }
}

seedStatusMaster();
