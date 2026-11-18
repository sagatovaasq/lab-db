const { sequelize, Teacher, Student, Course, Enrollment } = require('./db');

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Дерекқорға қосылу сәтті орындалды.');

    const courses = await Course.findAll({ include: [{ model: Teacher, as: 'teacher' }] });
    console.log('Курстар және оқытушылар:', JSON.stringify(courses, null, 2));

    const course = await Course.findByPk(1, {
      include: [{ model: Student, as: 'students' }]
    });
    console.log('Курс студенттері мен жазылу бағалары:', JSON.stringify(course, null, 2));

    const [student] = await Student.findOrCreate({
      where: { email: 'test.student@example.com' },
      defaults: { fullName: 'Тест Студент', studentGroup: 'SE-404' }
    });
    console.log('Студент:', student.toJSON());

    const enrollment = await Enrollment.findOne({
      where: { studentId: student.id, courseId: 1 }
    });
    if (enrollment) {
      await enrollment.update({ grade: 95 });
      console.log('Баға өзгертілді.');
      await enrollment.destroy();
      console.log('Тест жазбасы жойылды.');
    } else {
      console.log('Студенттің 1-курсқа жазбасы жоқ; баға өзгерту/жою өткізіліп кетті.');
    }
  } catch (error) {
    console.error('Қате:', error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

main();
