export const WORKFLOW_DATA = {
  faculties: [
    { id: 'sci', name: 'Faculty of Science' },
    { id: 'mgmt', name: 'Faculty of Management' },
    { id: 'hum', name: 'Faculty of Humanities' },
  ],
  schools: {
    sci: [
      { id: 'cs', name: 'School of Computer Science' },
      { id: 'phys', name: 'School of Physics' },
    ],
    mgmt: [
      { id: 'bus', name: 'School of Business' },
      { id: 'econ', name: 'School of Economics' },
    ],
    hum: [
      { id: 'lit', name: 'School of Literature' },
      { id: 'art', name: 'School of Arts' },
    ],
  },
  courses: {
    cs: [
      { id: 'bca', name: 'BCA' },
      { id: 'bsc_cs', name: 'BSC' },
      { id: 'bsc_ai', name: 'BSC AI & ML' },
    ],
    phys: [
      { id: 'bsc_phys', name: 'BSC Physics' },
      { id: 'msc_phys', name: 'MSC Physics' },
    ],
    bus: [
      { id: 'bba', name: 'BBA' },
      { id: 'mba', name: 'MBA' },
    ],
  },
  years: [
    { id: '1', name: '1st Year' },
    { id: '2', name: '2nd Year' },
    { id: '3', name: '3rd Year' },
    { id: '4', name: '4th Year' },
  ],
  staff: {
    bca: [
      { id: 's1', name: 'Dr. Ramesh Kumar', subject: 'Python Programming' },
      { id: 's2', name: 'Prof. Sanya Patil', subject: 'Database Management' },
    ],
    bsc_cs: [
      { id: 's3', name: 'Dr. Anirudh Iyer', subject: 'Data Structures' },
      { id: 's4', name: 'Prof. Meera Nair', subject: 'Operating Systems' },
    ],
    bsc_ai: [
      { id: 's5', name: 'Dr. Sanjay V.', subject: 'Machine Learning' },
      { id: 's6', name: 'Prof. Deepa L.', subject: 'Neural Networks' },
    ],
  }
};

export const FACULTY_WORKFLOW_DATA = {
  faculties: WORKFLOW_DATA.faculties,
  schools: WORKFLOW_DATA.schools,
  courses: WORKFLOW_DATA.courses,
  years: WORKFLOW_DATA.years,
  classes: {
    bca_1: [
      { id: 'bca_1_s1', semester: 'Semester 1', subject: 'Python', submissions: 42, students: [
        { name: 'Vijay Raghavan', roll: 'BCA26001', submitted: true },
        { name: 'Meera Iyer', roll: 'BCA26002', submitted: true },
        { name: 'Sanjay V.', roll: 'BCA26003', submitted: false },
      ]},
      { id: 'bca_1_s2', semester: 'Semester 2', subject: 'Web Dev', submissions: 38, students: [
        { name: 'Arun Karthik', roll: 'BCA26010', submitted: true },
        { name: 'Deepa Lakshmi', roll: 'BCA26011', submitted: true },
      ]}
    ],
    bsc_cs_1: [
      { id: 'bsc_1_s1', semester: 'Semester 1', subject: 'Data Structures', submissions: 127, students: [
        { name: 'Sneha Reddy', roll: 'BSC26101', submitted: true },
        { name: 'Rahul M.', roll: 'BSC26102', submitted: true },
      ]}
    ]
  }
};
