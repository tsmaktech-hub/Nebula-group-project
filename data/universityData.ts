
import { College, Course } from '../types';

const generateEngineeringCourses = (level: number): Course[] => {
  // Fix: Use level + offset to get 3-digit codes like 202, 204, etc.
  return [
    { id: `eng-${level}-1`, code: `GET${level + 2}`, title: `Engineering Analysis ${level === 200 ? 'I' : 'II'}`, semester: 2 },
    { id: `eng-${level}-2`, code: `GET${level + 4}`, title: `Technical Report Writing`, semester: 2 },
    { id: `eng-${level}-3`, code: `MEC${level + 2}`, title: `Workshop Practice III`, semester: 2 },
    { id: `eng-${level}-4`, code: `ELE${level + 6}`, title: `Circuit Theory`, semester: 2 },
    { id: `eng-${level}-5`, code: `CVE${level + 8}`, title: `Strength of Materials`, semester: 2 },
  ];
};

const generateGeneralCourses = (deptCode: string, level: number): Course[] => {
  // Fix: Use level + offset for general courses
  return [
    { id: `${deptCode}-${level}-1`, code: `${deptCode}${level + 2}`, title: `Introduction to ${deptCode} Studies II`, semester: 2 },
    { id: `${deptCode}-${level}-2`, code: `${deptCode}${level + 4}`, title: `Advanced Research Methods`, semester: 2 },
    { id: `${deptCode}-${level}-3`, code: `${deptCode}${level + 6}`, title: `Professional Ethics`, semester: 2 },
    { id: `${deptCode}-${level}-4`, code: `GNS${level + 2}`, title: `Peace and Conflict Resolution`, semester: 2 },
  ];
};

export const COLLEGES: College[] = [
  {
    id: 'engineering',
    name: 'College of Engineering',
    departments: [
      { id: 'mec', name: 'Mechanical Engineering', levels: [100, 200, 300, 400, 500], courses: {
        100: [
          { id: 'get102', code: 'GET102', title: 'Engineering graphics and solid modelling', semester: 2 },
          { id: 'chm102', code: 'CHM102', title: 'General chemistry 11', semester: 2 },
          { id: 'chm108', code: 'CHM108', title: 'General practical chemistry 11', semester: 2 },
          { id: 'mth102', code: 'MTH102', title: 'Elementary mathematics 11', semester: 2 },
          { id: 'phy102', code: 'PHY102', title: 'General practical 11', semester: 2 },
          { id: 'phy108', code: 'PHY108', title: 'General practical physics 11', semester: 2 },
          { id: 'sta112', code: 'STA112', title: 'Probability', semester: 2 },
          { id: 'phy104', code: 'PHY104', title: 'General physics 1V', semester: 2 },
          { id: 'yor102', code: 'YOR102', title: 'Communication in yoruba', semester: 2 }
        ],
        200: generateEngineeringCourses(200),
        300: generateEngineeringCourses(300),
        400: generateEngineeringCourses(400),
        500: generateEngineeringCourses(500)
      }},
      { id: 'mechatronics', name: 'Mechatronics Engineering', levels: [100, 200, 300, 400, 500], courses: { 100: [], 200: [], 300: [], 400: [], 500: [] } },
      { id: 'chemical', name: 'Chemical Engineering', levels: [100, 200, 300, 400, 500], courses: { 100: [], 200: [], 300: [], 400: [], 500: [] } },
      { id: 'elec', name: 'Elect/Electrical Engineering', levels: [100, 200, 300, 400, 500], courses: { 100: [], 200: [], 300: [], 400: [], 500: [] } },
      { id: 'civil', name: 'Civil Engineering', levels: [100, 200, 300, 400, 500], courses: { 100: [], 200: [], 300: [], 400: [], 500: [] } },
      { id: 'computer-eng', name: 'Computer Engineering', levels: [100, 200, 300, 400, 500], courses: { 100: [], 200: [], 300: [], 400: [], 500: [] } },
      { id: 'agric-eng', name: 'Agriculture Engineering', levels: [100, 200, 300, 400, 500], courses: { 100: [], 200: [], 300: [], 400: [], 500: [] } },
      { id: 'food-sci', name: 'Food Science and Technology', levels: [100, 200, 300, 400, 500], courses: { 100: [], 200: [], 300: [], 400: [], 500: [] } },
    ]
  },
  {
    id: 'basic-science',
    name: 'College of Basic Science',
    departments: [
      { id: 'csc', name: 'Computer Science', levels: [100, 200, 300, 400], courses: { 100: generateGeneralCourses('CSC', 100), 200: generateGeneralCourses('CSC', 200), 300: generateGeneralCourses('CSC', 300), 400: generateGeneralCourses('CSC', 400) } },
      { id: 'mth', name: 'Mathematics', levels: [100, 200, 300, 400], courses: {} },
      { id: 'ind-mth', name: 'Industrial Mathematics', levels: [100, 200, 300, 400], courses: {} },
      { id: 'sta', name: 'Statistics', levels: [100, 200, 300, 400], courses: {} },
      { id: 'chm', name: 'Chemistry', levels: [100, 200, 300, 400], courses: {} },
      { id: 'ind-chm', name: 'Industrial Chemistry', levels: [100, 200, 300, 400], courses: {} },
      { id: 'bch', name: 'Biochemistry', levels: [100, 200, 300, 400], courses: {} },
      { id: 'zoo', name: 'Zoology', levels: [100, 200, 300, 400], courses: {} },
      { id: 'bot', name: 'Botany', levels: [100, 200, 300, 400], courses: {} },
      { id: 'mcb', name: 'Microbiology', levels: [100, 200, 300, 400], courses: {} },
    ]
  },
  {
    id: 'applied-social',
    name: 'College of Applied Social-Science',
    departments: [
      { id: 'eco', name: 'Economics', levels: [100, 200, 300, 400], courses: {} },
      { id: 'acc', name: 'Accounting', levels: [100, 200, 300, 400], courses: {} },
      { id: 'oim', name: 'Office and Information Management (OIM)', levels: [100, 200, 300, 400], courses: {} },
      { id: 'ins', name: 'Insurance', levels: [100, 200, 300, 400], courses: {} },
      { id: 'bnf', name: 'Banking and Finance', levels: [100, 200, 300, 400], courses: {} },
      { id: 'act', name: 'Actuarial Science', levels: [100, 200, 300, 400], courses: {} },
      { id: 'bus', name: 'Business Administration', levels: [100, 200, 300, 400], courses: {} },
      { id: 'mcm', name: 'Mass Communication', levels: [100, 200, 300, 400], courses: {} },
    ]
  },
  {
    id: 'environmental',
    name: 'College of Environmental',
    departments: [
      { id: 'arc', name: 'Architecture', levels: [100, 200, 300, 400], courses: {} },
      { id: 'qts', name: 'Quantity Survey', levels: [100, 200, 300, 400], courses: {} },
      { id: 'art', name: 'Art and Design', levels: [100, 200, 300, 400], courses: {} },
      { id: 'urp', name: 'Urban and Regional Planning', levels: [100, 200, 300, 400], courses: {} },
      { id: 'esm', name: 'Estate Management', levels: [100, 200, 300, 400], courses: {} },
      { id: 'bld', name: 'Building Tech', levels: [100, 200, 300, 400], courses: {} },
    ]
  },
  {
    id: 'agriculture',
    name: 'College of Agriculture',
    departments: [
      { id: 'ans', name: 'Department of Animal Science', levels: [100, 200, 300, 400], courses: {} },
      { id: 'aee', name: 'Department of Agricultural Economics and Extension', levels: [100, 200, 300, 400], courses: {} },
      { id: 'agr', name: 'Department of Agronomy', levels: [100, 200, 300, 400], courses: {} },
      { id: 'ffw', name: 'Department of Fisheries and Wildlife Management', levels: [100, 200, 300, 400], courses: {} },
    ]
  }
];

// Helper to populate empty courses
COLLEGES.forEach(college => {
  college.departments.forEach(dept => {
    dept.levels.forEach(level => {
      if (!dept.courses[level] || dept.courses[level].length === 0) {
        dept.courses[level] = generateGeneralCourses(dept.id.toUpperCase(), level);
      }
    });
  });
});
