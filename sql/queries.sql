-- 1. 30 сағаттан асатын курстарды сағат саны бойынша кему ретімен көрсету (WHERE, ORDER BY, LIMIT).
SELECT id, title, hours
FROM courses
WHERE hours > 30
ORDER BY hours DESC
LIMIT 10;

-- 2. Курстарды оқытушыларымен бірге көрсету (INNER JOIN).
SELECT c.title AS course, t.full_name AS teacher
FROM courses c
INNER JOIN teachers t ON t.id = c.teacher_id;

-- 3. Бірде-бір студент жазылмаған курстарды табу (LEFT JOIN).
SELECT c.id, c.title
FROM courses c
LEFT JOIN enrollments e ON e.course_id = c.id
WHERE e.course_id IS NULL;

-- 4. Студент, курс және баға туралы мәлімет (үш кестені JOIN).
SELECT s.full_name AS student, c.title AS course, e.grade
FROM enrollments e
INNER JOIN students s ON s.id = e.student_id
INNER JOIN courses c ON c.id = e.course_id
ORDER BY s.full_name, c.title;

-- 5. Орташа бағасы 70-тен жоғары курстар (GROUP BY және HAVING).
SELECT c.title, ROUND(AVG(e.grade), 2) AS average_grade
FROM courses c
INNER JOIN enrollments e ON e.course_id = c.id
WHERE e.grade IS NOT NULL
GROUP BY c.id, c.title
HAVING AVG(e.grade) > 70;

-- 6. Барлық қойылған бағалардың орташа мәнінен жоғары баға алған студенттер (ішкі сұраным).
SELECT DISTINCT s.id, s.full_name
FROM students s
JOIN enrollments e ON e.student_id = s.id
WHERE e.grade > (SELECT AVG(grade) FROM enrollments WHERE grade IS NOT NULL);

-- 7. Шартпен UPDATE: 1-курстың сағат санын өзгерту.
UPDATE courses SET hours = 42 WHERE id = 1;

-- 8. Шартпен DELETE: белгілі бір жазылуды жою (мысал).
-- Тексергеннен кейін ғана орындаңыз: DELETE FROM enrollments WHERE student_id = 5 AND course_id = 3;

-- 9. Транзакция: студентті курсқа тіркеу және баға қою.
BEGIN;
INSERT INTO enrollments (student_id, course_id, enrolled_at, grade)
VALUES (5, 4, CURRENT_DATE, NULL)
ON CONFLICT (student_id, course_id) DO NOTHING;
UPDATE enrollments SET grade = 90
WHERE student_id = 5 AND course_id = 4;
COMMIT;

-- Бонус: индексті құру және жоспарды салыстыру.
EXPLAIN ANALYZE
SELECT * FROM enrollments WHERE student_id = 1;

CREATE INDEX IF NOT EXISTS idx_enrollments_student_id
ON enrollments(student_id);

EXPLAIN ANALYZE
SELECT * FROM enrollments WHERE student_id = 1;
