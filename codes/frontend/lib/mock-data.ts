export const students = [
  {
    id: "STU001",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@university.edu",
    department: "Computer Science",
    fyp: {
      id: "FYP001",
      title: "AI-Powered Document Classification System",
      description: "Machine learning system for automated document classification",
      domain: "Machine Learning",
      status: "internal_review",
      stage: 4,
      supervisor: "Dr. Fatima Khan",
      supervisorId: "SUP001",
    },
    clearanceStatus: {
      department: "approved",
      academic: "approved",
      student_affairs: "in_review",
      accounts: "pending",
    },
  },
  {
    id: "STU002",
    name: "Zainab Ahmed",
    email: "zainab.ahmed@university.edu",
    department: "Computer Science",
    fyp: {
      id: "FYP002",
      title: "Cloud-Based Inventory Management",
      description: "Scalable inventory system using microservices",
      domain: "Cloud Computing",
      status: "proposal_approved",
      stage: 2,
      supervisor: "Prof. Omar Hassan",
      supervisorId: "SUP002",
    },
    clearanceStatus: {
      department: "pending",
      academic: "pending",
      student_affairs: "pending",
      accounts: "pending",
    },
  },
  {
    id: "STU003",
    name: "Hassan Omar",
    email: "hassan.omar@university.edu",
    department: "Computer Science",
    fyp: {
      id: "FYP003",
      title: "Mobile Banking Application",
      domain: "Mobile Development",
      status: "srs_review",
    },
    clearanceStatus: {
      department: "pending",
      academic: "pending",
      student_affairs: "pending",
      accounts: "pending",
    },
  },
]

export const supervisors = [
  {
    id: "SUP001",
    name: "Dr. Fatima Khan",
    email: "fatima.khan@university.edu",
    department: "Computer Science",
    assignedStudents: 4,
    expertise: ["Machine Learning", "NLP", "Data Science"],
  },
  {
    id: "SUP002",
    name: "Prof. Omar Hassan",
    email: "omar.hassan@university.edu",
    department: "Computer Science",
    assignedStudents: 3,
    expertise: ["Cloud Computing", "DevOps", "Microservices"],
  },
]

export const fypStages = [
  { id: 1, name: "Idea", icon: "Lightbulb", color: "bg-blue-100" },
  { id: 2, name: "Proposal", icon: "FileText", color: "bg-purple-100" },
  { id: 3, name: "SRS", icon: "CheckCircle", color: "bg-indigo-100" },
  { id: 4, name: "Internal Review", icon: "Users", color: "bg-orange-100" },
  { id: 5, name: "External Review", icon: "Globe", color: "bg-green-100" },
  { id: 6, name: "Completed", icon: "Award", color: "bg-emerald-100" },
]

export const notifications = [
  {
    id: 1,
    message: "Your FYP proposal has been approved by Dr. Fatima Khan",
    timestamp: "Today at 2:30 PM",
    read: false,
  },
  {
    id: 2,
    message: "Degree clearance reminder: Submit accounts clearance",
    timestamp: "Today at 10:15 AM",
    read: false,
  },
  {
    id: 3,
    message: "New feedback on your SRS document from supervisor",
    timestamp: "Yesterday at 3:45 PM",
    read: true,
  },
]

export const supervisorStudents = [
  {
    id: "STU001",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@university.edu",
    fyp: {
      id: "FYP001",
      title: "AI-Powered Document Classification System",
      domain: "Machine Learning",
      status: "internal_review",
    },
    stage: 4,
    pendingActions: ["Approve Final Submission"],
  },
  {
    id: "STU002",
    name: "Zainab Ahmed",
    email: "zainab.ahmed@university.edu",
    fyp: {
      id: "FYP002",
      title: "Cloud-Based Inventory Management",
      domain: "Cloud Computing",
      status: "proposal_review",
    },
    stage: 2,
    pendingActions: ["Review Proposal", "Provide Feedback"],
  },
  {
    id: "STU003",
    name: "Hassan Omar",
    email: "hassan.omar@university.edu",
    fyp: {
      id: "FYP003",
      title: "Mobile Banking Application",
      domain: "Mobile Development",
      status: "srs_review",
    },
    stage: 3,
    pendingActions: ["Review SRS"],
  },
]

export const evaluationRubric = [
  { category: "Problem Definition", maxMarks: 10, description: "Clarity and relevance of problem" },
  { category: "Literature Review", maxMarks: 10, description: "Comprehensiveness of research" },
  { category: "Methodology", maxMarks: 15, description: "Soundness of approach" },
  { category: "Implementation", maxMarks: 20, description: "Code quality and completeness" },
  { category: "Results & Analysis", maxMarks: 15, description: "Quality of results" },
  { category: "Presentation", maxMarks: 10, description: "Clarity and organization" },
]

export const clearanceRequests = [
  {
    id: "CLR001",
    studentId: "STU001",
    studentName: "Ahmed Hassan",
    status: "approved",
    department: "department",
    createdDate: "2024-12-01",
    approvalDate: "2024-12-01",
    officer: "Dr. Sarah Johnson",
    remarks: "All requirements fulfilled",
  },
  {
    id: "CLR002",
    studentId: "STU001",
    studentName: "Ahmed Hassan",
    status: "approved",
    department: "academic",
    createdDate: "2024-12-01",
    approvalDate: "2024-12-02",
    officer: "Prof. David Miller",
    remarks: "Academic records verified",
  },
  {
    id: "CLR003",
    studentId: "STU001",
    studentName: "Ahmed Hassan",
    status: "in_review",
    department: "student_affairs",
    createdDate: "2024-12-03",
    approvalDate: null,
    officer: "Ms. Aisha Patel",
    remarks: "Under review",
  },
  {
    id: "CLR004",
    studentId: "STU001",
    studentName: "Ahmed Hassan",
    status: "pending",
    department: "accounts",
    createdDate: "2024-12-03",
    approvalDate: null,
    officer: "Mr. James Wilson",
    remarks: "Pending financial clearance",
  },
  {
    id: "CLR005",
    studentId: "STU002",
    studentName: "Zainab Ahmed",
    status: "pending",
    department: "department",
    createdDate: "2024-12-03",
    approvalDate: null,
    officer: "Dr. Sarah Johnson",
    remarks: "Awaiting submission of final documents",
  },
]
