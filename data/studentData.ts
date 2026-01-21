
import { Student } from '../types';

const firstNames = ['Taiwo', 'Abiola', 'Lekan', 'Ibrahim', 'Chidi', 'Emeka', 'Olawale', 'Seyi', 'Bolanle', 'Uche', 'Amina', 'Zainab', 'Fatima', 'Bello', 'Ade', 'Tolu', 'Kunle', 'Funmi', 'Tosin', 'Yetunde'];
const lastNames = ['Eze', 'Fashola', 'Okoro', 'Yusuf', 'Adeyemi', 'Ogunleye', 'Balogun', 'Aderinto', 'Ojo', 'Babatunde', 'Danjuma', 'Garba', 'Nwachukwu', 'Okonkwo', 'Obinna'];

export const generateStudents = (deptId: string): Student[] => {
  const students: Student[] = [];
  const deptCode = deptId.toUpperCase().slice(0, 3);
  
  for (let i = 1; i <= 50; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const paddedId = i.toString().padStart(3, '0');
    students.push({
      id: `student-${deptId}-${i}`,
      name: `${fn} ${ln}`,
      matricNo: `LASU/${deptCode}/2023/${paddedId}`,
      attendancePercentage: 0, // All students start at 0% as requested
    });
  }
  return students;
};
