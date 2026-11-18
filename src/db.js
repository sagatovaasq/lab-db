require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL .env файлында көрсетілмеген');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

const common = (tableName) => ({
  tableName,
  underscored: true,
  timestamps: false
});

const Teacher = sequelize.define('Teacher', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullName: { type: DataTypes.STRING(150), allowNull: false, field: 'full_name' },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true }
}, common('teachers'));

const Student = sequelize.define('Student', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullName: { type: DataTypes.STRING(150), allowNull: false, field: 'full_name' },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  studentGroup: { type: DataTypes.STRING(50), allowNull: false, field: 'student_group' }
}, common('students'));

const Course = sequelize.define('Course', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(150), allowNull: false },
  description: { type: DataTypes.TEXT },
  hours: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
  teacherId: { type: DataTypes.INTEGER, allowNull: false, field: 'teacher_id' }
}, common('courses'));

const Enrollment = sequelize.define('Enrollment', {
  studentId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, field: 'student_id' },
  courseId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, field: 'course_id' },
  enrolledAt: { type: DataTypes.DATEONLY, allowNull: false, field: 'enrolled_at' },
  grade: { type: DataTypes.DECIMAL(5, 2), allowNull: true }
}, common('enrollments'));

Teacher.hasMany(Course, { foreignKey: 'teacherId', as: 'courses' });
Course.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });
Student.belongsToMany(Course, { through: Enrollment, foreignKey: 'studentId', otherKey: 'courseId', as: 'courses' });
Course.belongsToMany(Student, { through: Enrollment, foreignKey: 'courseId', otherKey: 'studentId', as: 'students' });
Student.hasMany(Enrollment, { foreignKey: 'studentId', as: 'enrollments' });
Enrollment.belongsTo(Student, { foreignKey: 'studentId' });
Course.hasMany(Enrollment, { foreignKey: 'courseId', as: 'enrollments' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId' });

module.exports = { sequelize, Teacher, Student, Course, Enrollment };
