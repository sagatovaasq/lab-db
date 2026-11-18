DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;

CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    student_group VARCHAR(50) NOT NULL
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    hours INTEGER NOT NULL CHECK (hours > 0),
    teacher_id INTEGER NOT NULL REFERENCES teachers(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE enrollments (
    student_id INTEGER NOT NULL REFERENCES students(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES courses(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    enrolled_at DATE NOT NULL DEFAULT CURRENT_DATE,
    grade NUMERIC(5,2) CHECK (grade >= 0 AND grade <= 100),
    PRIMARY KEY (student_id, course_id)
);
