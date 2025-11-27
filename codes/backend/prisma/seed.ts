import { PrismaClient, Role, FYPStage, DocumentType, EvaluationType, ClearanceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.clearanceRemark.deleteMany();
  await prisma.degreeClearance.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.plagiarismReport.deleteMany();
  await prisma.fYPDocument.deleteMany();
  await prisma.fYP.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@acadflow.edu',
      password: await bcrypt.hash('admin123', 10),
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
      department: 'Administration',
    },
  });
  console.log('✅ Created admin user');

  // Create 5 Supervisors
  const supervisors = [];
  for (let i = 1; i <= 5; i++) {
    const supervisor = await prisma.user.create({
      data: {
        email: `supervisor${i}@acadflow.edu`,
        password: await bcrypt.hash('supervisor123', 10),
        firstName: `Supervisor`,
        lastName: `${i}`,
        role: Role.SUPERVISOR,
        department: 'Computer Science',
      },
    });
    supervisors.push(supervisor);
  }
  console.log('✅ Created 5 supervisors');

  // Create 10 Students
  const students = [];
  for (let i = 1; i <= 10; i++) {
    const student = await prisma.user.create({
      data: {
        email: `student${i}@acadflow.edu`,
        password: await bcrypt.hash('student123', 10),
        firstName: `Student`,
        lastName: `${i}`,
        studentId: `STU${String(i).padStart(4, '0')}`,
        role: Role.STUDENT,
        department: 'Computer Science',
      },
    });
    students.push(student);
  }
  console.log('✅ Created 10 students');

  // Create 2 Examiners
  const examiners = [];
  for (let i = 1; i <= 2; i++) {
    const examiner = await prisma.user.create({
      data: {
        email: `examiner${i}@acadflow.edu`,
        password: await bcrypt.hash('examiner123', 10),
        firstName: `Examiner`,
        lastName: `${i}`,
        role: Role.EXAMINER,
        department: 'Computer Science',
      },
    });
    examiners.push(examiner);
  }
  console.log('✅ Created 2 examiners');

  // Create HOD, Dean, Student Affairs, Accounts
  const hod = await prisma.user.create({
    data: {
      email: 'hod@acadflow.edu',
      password: await bcrypt.hash('hod123', 10),
      firstName: 'HOD',
      lastName: 'Department',
      role: Role.HOD,
      department: 'Computer Science',
    },
  });

  const dean = await prisma.user.create({
    data: {
      email: 'dean@acadflow.edu',
      password: await bcrypt.hash('dean123', 10),
      firstName: 'Dean',
      lastName: 'Academic',
      role: Role.DEAN,
      department: 'Academic Affairs',
    },
  });

  const studentAffairs = await prisma.user.create({
    data: {
      email: 'affairs@acadflow.edu',
      password: await bcrypt.hash('affairs123', 10),
      firstName: 'Student',
      lastName: 'Affairs',
      role: Role.STUDENT_AFFAIRS,
      department: 'Student Affairs',
    },
  });

  const accounts = await prisma.user.create({
    data: {
      email: 'accounts@acadflow.edu',
      password: await bcrypt.hash('accounts123', 10),
      firstName: 'Accounts',
      lastName: 'Officer',
      role: Role.ACCOUNTS,
      department: 'Accounts',
    },
  });
  console.log('✅ Created department officers');

  // Create 15 FYPs in different stages
  const fypTitles = [
    'AI-Powered Learning Management System',
    'Blockchain-Based Academic Credential Verification',
    'Smart Campus IoT Monitoring System',
    'Virtual Reality Classroom Experience',
    'Automated Code Review System',
    'E-Learning Platform with AI Tutoring',
    'Digital Library Management System',
    'Student Performance Analytics Dashboard',
    'Mobile Health Monitoring App',
    'Cloud-Based Collaboration Platform',
    'Cybersecurity Threat Detection System',
    'Smart Attendance System using Face Recognition',
    'Online Examination Proctoring System',
    'Automated Thesis Formatting Tool',
    'Student Career Guidance Platform',
  ];

  const fypDescriptions = [
    'An intelligent LMS that adapts to student learning patterns',
    'Secure and tamper-proof academic credential storage',
    'Real-time monitoring of campus facilities using IoT sensors',
    'Immersive VR experiences for remote education',
    'ML-powered automated code review and suggestions',
    'Personalized learning experience with AI tutors',
    'Digital repository with advanced search capabilities',
    'Data-driven insights into student performance',
    'Health tracking and monitoring mobile application',
    'Seamless collaboration tools for academic teams',
    'Advanced threat detection and prevention system',
    'Contactless attendance using facial recognition',
    'AI-powered online exam monitoring system',
    'Automated formatting for academic papers',
    'Career matching platform for students',
  ];

  const stages = [
    FYPStage.IDEA_PENDING,
    FYPStage.IDEA_APPROVED,
    FYPStage.SUPERVISOR_ASSIGNED,
    FYPStage.PROPOSAL_PENDING,
    FYPStage.PROPOSAL_APPROVED,
    FYPStage.SRS_PENDING,
    FYPStage.SRS_APPROVED,
    FYPStage.INTERNAL_PENDING,
    FYPStage.INTERNAL_DONE,
    FYPStage.EXTERNAL_PENDING,
    FYPStage.EXTERNAL_DONE,
    FYPStage.COMPLETED,
  ];

  const fyps = [];
  for (let i = 0; i < 15; i++) {
    const student = students[i % students.length];
    const supervisor = supervisors[i % supervisors.length];
    const stage = stages[i % stages.length];
    
    const fyp = await prisma.fYP.create({
      data: {
        title: fypTitles[i],
        description: fypDescriptions[i],
        stage,
        studentId: student.id,
        supervisorId: stage !== FYPStage.IDEA_PENDING && stage !== FYPStage.IDEA_APPROVED 
          ? supervisor.id 
          : null,
        ideaApprovedAt: [
          FYPStage.SUPERVISOR_ASSIGNED,
          FYPStage.PROPOSAL_PENDING,
          FYPStage.PROPOSAL_APPROVED,
          FYPStage.SRS_PENDING,
          FYPStage.SRS_APPROVED,
          FYPStage.INTERNAL_PENDING,
          FYPStage.INTERNAL_DONE,
          FYPStage.EXTERNAL_PENDING,
          FYPStage.EXTERNAL_DONE,
          FYPStage.COMPLETED,
        ].includes(stage) ? new Date() : null,
        proposalApprovedAt: [
          FYPStage.SRS_PENDING,
          FYPStage.SRS_APPROVED,
          FYPStage.INTERNAL_PENDING,
          FYPStage.INTERNAL_DONE,
          FYPStage.EXTERNAL_PENDING,
          FYPStage.EXTERNAL_DONE,
          FYPStage.COMPLETED,
        ].includes(stage) ? new Date() : null,
        srsApprovedAt: [
          FYPStage.INTERNAL_PENDING,
          FYPStage.INTERNAL_DONE,
          FYPStage.EXTERNAL_PENDING,
          FYPStage.EXTERNAL_DONE,
          FYPStage.COMPLETED,
        ].includes(stage) ? new Date() : null,
        internalCompletedAt: [
          FYPStage.EXTERNAL_PENDING,
          FYPStage.EXTERNAL_DONE,
          FYPStage.COMPLETED,
        ].includes(stage) ? new Date() : null,
        externalCompletedAt: [
          FYPStage.COMPLETED,
        ].includes(stage) ? new Date() : null,
        completedAt: stage === FYPStage.COMPLETED ? new Date() : null,
      },
    });
    fyps.push(fyp);

    // Add documents for FYPs in later stages
    if ([FYPStage.PROPOSAL_PENDING, FYPStage.PROPOSAL_APPROVED, FYPStage.SRS_PENDING].includes(stage)) {
      await prisma.fYPDocument.create({
        data: {
          fypId: fyp.id,
          type: DocumentType.PROPOSAL,
          fileUrl: `https://storage.acadflow.edu/documents/${fyp.id}/proposal-v1.pdf`,
          version: 1,
        },
      });
    }

    if ([FYPStage.SRS_PENDING, FYPStage.SRS_APPROVED, FYPStage.INTERNAL_PENDING].includes(stage)) {
      await prisma.fYPDocument.create({
        data: {
          fypId: fyp.id,
          type: DocumentType.SRS,
          fileUrl: `https://storage.acadflow.edu/documents/${fyp.id}/srs-v1.pdf`,
          version: 1,
        },
      });
    }

    if ([FYPStage.EXTERNAL_PENDING, FYPStage.EXTERNAL_DONE, FYPStage.COMPLETED].includes(stage)) {
      await prisma.fYPDocument.create({
        data: {
          fypId: fyp.id,
          type: DocumentType.FINAL,
          fileUrl: `https://storage.acadflow.edu/documents/${fyp.id}/final-v1.pdf`,
          version: 1,
        },
      });
    }

    // Add plagiarism reports for approved proposals
    if ([FYPStage.SRS_PENDING, FYPStage.SRS_APPROVED].includes(stage)) {
      await prisma.plagiarismReport.create({
        data: {
          fypId: fyp.id,
          similarity: 5 + Math.random() * 10, // 5-15%
          reportUrl: `https://storage.acadflow.edu/plagiarism/${fyp.id}/report.pdf`,
          uploadedById: supervisor.id,
        },
      });
    }

    // Add evaluations for internal/external stages
    if (stage === FYPStage.INTERNAL_DONE) {
      await prisma.evaluation.create({
        data: {
          fypId: fyp.id,
          evaluatorId: examiners[0].id,
          type: EvaluationType.INTERNAL,
          marks: 75 + Math.random() * 20, // 75-95
          feedback: 'Excellent work! Good progress on implementation.',
        },
      });
    }

    if (stage === FYPStage.EXTERNAL_DONE || stage === FYPStage.COMPLETED) {
      await prisma.evaluation.create({
        data: {
          fypId: fyp.id,
          evaluatorId: examiners[1].id,
          type: EvaluationType.EXTERNAL,
          marks: 80 + Math.random() * 15, // 80-95
          feedback: 'Outstanding final submission. Well done!',
        },
      });
    }

    // Create notifications for stage changes
    await prisma.notification.create({
      data: {
        userId: student.id,
        title: 'FYP Stage Updated',
        message: `Your FYP "${fyp.title}" is now in ${stage} stage`,
        fypId: fyp.id,
        read: false,
      },
    });
  }
  console.log('✅ Created 15 FYPs in various stages');

  // Create degree clearances for some students
  const clearanceStatuses = [
    ClearanceStatus.PENDING,
    ClearanceStatus.IN_REVIEW,
    ClearanceStatus.APPROVED,
  ];

  for (let i = 0; i < 5; i++) {
    const student = students[i];
    const status = clearanceStatuses[i % clearanceStatuses.length];
    
    const clearance = await prisma.degreeClearance.create({
      data: {
        studentId: student.id,
        status,
        departmentStatus: status === ClearanceStatus.APPROVED 
          ? ClearanceStatus.APPROVED 
          : ClearanceStatus.PENDING,
        academicStatus: status === ClearanceStatus.APPROVED 
          ? ClearanceStatus.APPROVED 
          : ClearanceStatus.PENDING,
        affairsStatus: status === ClearanceStatus.APPROVED 
          ? ClearanceStatus.APPROVED 
          : ClearanceStatus.PENDING,
        accountsStatus: status === ClearanceStatus.APPROVED 
          ? ClearanceStatus.APPROVED 
          : ClearanceStatus.PENDING,
        completedAt: status === ClearanceStatus.APPROVED ? new Date() : null,
      },
    });

    // Add remarks if approved
    if (status === ClearanceStatus.APPROVED) {
      await prisma.clearanceRemark.create({
        data: {
          clearanceId: clearance.id,
          department: 'DEPARTMENT',
          message: 'All department requirements met.',
          officerId: hod.id,
        },
      });

      await prisma.clearanceRemark.create({
        data: {
          clearanceId: clearance.id,
          department: 'ACADEMIC',
          message: 'Academic records verified.',
          officerId: dean.id,
        },
      });
    }

    await prisma.notification.create({
      data: {
        userId: student.id,
        title: 'Degree Clearance Status',
        message: `Your degree clearance is ${status}`,
        read: false,
      },
    });
  }
  console.log('✅ Created 5 degree clearances');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📝 Test Credentials:');
  console.log('Admin: admin@acadflow.edu / admin123');
  console.log('Student: student1@acadflow.edu / student123');
  console.log('Supervisor: supervisor1@acadflow.edu / supervisor123');
  console.log('Examiner: examiner1@acadflow.edu / examiner123');
  console.log('HOD: hod@acadflow.edu / hod123');
  console.log('Dean: dean@acadflow.edu / dean123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

