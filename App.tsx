
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import AuthPage from './components/Auth/AuthPage';
import CollegeList from './components/Dashboard/CollegeList';
import DepartmentList from './components/Dashboard/DepartmentList';
import LevelList from './components/Dashboard/LevelList';
import CourseList from './components/Dashboard/CourseList';
import AttendanceSheet from './components/Attendance/AttendanceSheet';
import { User, College, Department, Course } from './types';
import { COLLEGES } from './data/universityData';

enum View {
  Auth = 'auth',
  Colleges = 'colleges',
  Departments = 'departments',
  Levels = 'levels',
  Courses = 'courses',
  Attendance = 'attendance'
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.Auth);
  
  // Navigation State
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Auth check
  useEffect(() => {
    const savedUser = localStorage.getItem('lasustech_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setCurrentView(View.Colleges);
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('lasustech_user', JSON.stringify(user));
    setCurrentView(View.Colleges);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView(View.Auth);
    localStorage.removeItem('lasustech_user');
    // Reset navigation
    setSelectedCollege(null);
    setSelectedDept(null);
    setSelectedLevel(null);
    setSelectedCourse(null);
  };

  const renderView = () => {
    switch (currentView) {
      case View.Auth:
        return <AuthPage onLogin={handleLogin} />;
      case View.Colleges:
        return (
          <CollegeList 
            colleges={COLLEGES} 
            onSelect={(c) => {
              setSelectedCollege(c);
              setCurrentView(View.Departments);
            }} 
          />
        );
      case View.Departments:
        return selectedCollege ? (
          <DepartmentList 
            college={selectedCollege} 
            onBack={() => setCurrentView(View.Colleges)}
            onSelect={(d) => {
              setSelectedDept(d);
              setCurrentView(View.Levels);
            }} 
          />
        ) : null;
      case View.Levels:
        return selectedDept ? (
          <LevelList 
            department={selectedDept} 
            onBack={() => setCurrentView(View.Departments)}
            onSelect={(l) => {
              setSelectedLevel(l);
              setCurrentView(View.Courses);
            }} 
          />
        ) : null;
      case View.Courses:
        return selectedDept && selectedLevel ? (
          <CourseList 
            department={selectedDept}
            level={selectedLevel}
            onBack={() => setCurrentView(View.Levels)}
            onSelect={(c) => {
              setSelectedCourse(c);
              setCurrentView(View.Attendance);
            }} 
          />
        ) : null;
      case View.Attendance:
        return selectedCourse && selectedDept ? (
          <AttendanceSheet 
            course={selectedCourse}
            dept={selectedDept}
            onBack={() => setCurrentView(View.Courses)}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <Layout 
      user={currentUser} 
      onLogout={handleLogout} 
      activeCourse={selectedCourse?.code}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
