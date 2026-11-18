const express = require('express');
const { sequelize, Course, Teacher, Student, Enrollment } = require('./db');

const app = express();
app.use(express.json());

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Барлық курстарды оқытушысымен бірге алу.
app.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({ include: [{ model: Teacher, as: 'teacher' }] });
  res.status(200).json(courses);
}));

// ID бойынша бір курсты алу.
app.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    include: [{ model: Teacher, as: 'teacher' }]
  });
  if (!course) return res.status(404).json({ error: 'Курс табылмады' });
  res.status(200).json(course);
}));

// Жаңа курс қосу.
app.post('/courses', asyncHandler(async (req, res) => {
  const { title, description, hours, teacherId } = req.body;
  if (!title || !Number.isInteger(Number(hours)) || Number(hours) <= 0 || !teacherId) {
    return res.status(400).json({ error: 'title, hours (>0) және teacherId міндетті' });
  }
  const teacher = await Teacher.findByPk(teacherId);
  if (!teacher) return res.status(404).json({ error: 'Оқытушы табылмады' });
  const course = await Course.create({ title, description, hours: Number(hours), teacherId });
  res.status(201).json(course);
}));

// Курстың мәліметтерін өзгерту.
app.put('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) return res.status(404).json({ error: 'Курс табылмады' });
  const { title, description, hours, teacherId } = req.body;
  if (hours !== undefined && (!Number.isInteger(Number(hours)) || Number(hours) <= 0)) {
    return res.status(400).json({ error: 'hours нөлден үлкен бүтін сан болуы керек' });
  }
  if (teacherId !== undefined && !(await Teacher.findByPk(teacherId))) {
    return res.status(404).json({ error: 'Оқытушы табылмады' });
  }
  await course.update({
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(hours !== undefined && { hours: Number(hours) }),
    ...(teacherId !== undefined && { teacherId })
  });
  res.status(200).json(course);
}));

// Курсты жою.
app.delete('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) return res.status(404).json({ error: 'Курс табылмады' });
  await course.destroy();
  res.status(200).json({ message: 'Курс жойылды' });
}));

// Студентті курсқа тіркеу.
app.post('/enrollments', asyncHandler(async (req, res) => {
  const { studentId, courseId } = req.body;
  if (!studentId || !courseId) {
    return res.status(400).json({ error: 'studentId және courseId міндетті' });
  }
  const student = await Student.findByPk(studentId);
  const course = await Course.findByPk(courseId);
  if (!student || !course) return res.status(404).json({ error: 'Студент немесе курс табылмады' });

  try {
    const enrollment = await Enrollment.create({
      studentId, courseId, enrolledAt: new Date().toISOString().slice(0, 10), grade: null
    });
    res.status(201).json(enrollment);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeDatabaseError') {
      return res.status(409).json({ error: 'Студент бұл курсқа бұрын тіркелген болуы мүмкін' });
    }
    throw error;
  }
}));

// Студент тіркелген курстарды және бағаларын алу.
app.get('/students/:id/courses', asyncHandler(async (req, res) => {
  const student = await Student.findByPk(req.params.id, {
    include: [{ model: Course, as: 'courses', through: { attributes: ['enrolledAt', 'grade'] } }]
  });
  if (!student) return res.status(404).json({ error: 'Студент табылмады' });
  res.status(200).json(student.courses);
}));

app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'Бірегей мән қайталанды' });
  }
  res.status(500).json({ error: 'Сервер қатесі' });
});

const PORT = process.env.PORT || 3000;
sequelize.authenticate()
  .then(() => app.listen(PORT, () => console.log(`API: http://localhost:${PORT}/courses`)))
  .catch((err) => {
    console.error('Дерекқорға қосылу қатесі:', err.message);
    process.exit(1);
  });
