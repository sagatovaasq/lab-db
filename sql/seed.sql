INSERT INTO teachers (full_name, email) VALUES
('Айдана Ермекова', 'aidana@example.com'),
('Нұрлан Сейітов', 'nurlan@example.com'),
('Дана Қасымова', 'dana@example.com'),
('Әлихан Омаров', 'alikhan@example.com');

INSERT INTO students (full_name, email, student_group) VALUES
('Аружан Нұрлан', 'aruzhan@example.com', 'SE-401'),
('Мирас Әли', 'miras@example.com', 'SE-402'),
('Әсем Болат', 'asem@example.com', 'SE-401'),
('Данияр Қанат', 'daniyar@example.com', 'SE-403'),
('Мадина Серік', 'madina@example.com', 'SE-402');

INSERT INTO courses (title, description, hours, teacher_id) VALUES
('PostgreSQL негіздері', 'Реляциялық дерекқор және SQL', 40, 1),
('JavaScript', 'JavaScript бағдарламалау тілі', 36, 2),
('Python бағдарламалау', 'Python тілінің негіздері', 48, 3),
('Web әзірлеу', 'HTML, CSS және веб негіздері', 32, 2),
('Алгоритмдер', 'Алгоритмдер және деректер құрылымы', 24, 4);

INSERT INTO enrollments (student_id, course_id, enrolled_at, grade) VALUES
(1, 1, '2026-09-01', 88),
(2, 1, '2026-09-02', 76),
(3, 1, '2026-09-03', 92),
(1, 2, '2026-09-04', 81),
(4, 2, '2026-09-05', 69),
(2, 3, '2026-09-06', 85),
(5, 3, '2026-09-07', 73),
(3, 4, '2026-09-08', NULL);
